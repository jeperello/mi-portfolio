import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThreadsApiService, ThreadStats, IngestPayload } from '../../core/services/threads-api.service';
import { Subscription, timer, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ApiWarmingComponent } from '../../shared/api-warming/api-warming';
import { AnalyticsDirective } from '../../shared/analytics.directive';
import { ExpandableDescriptionComponent } from '../../shared/expandable-description/expandable-description.component';

@Component({
  selector: 'show-threads-api',
  standalone: true,
  imports: [CommonModule, ApiWarmingComponent, RouterLink, AnalyticsDirective, ExpandableDescriptionComponent],
  templateUrl: './show-threads-api.component.html',
  styleUrls: ['./show-threads-api.component.css']
})
export class ShowThreadsApiComponent implements OnInit, OnDestroy {

  metrics: ThreadStats[] = [];
  public errorMessage: string | null = null;
  public successMessage: string | null = null;
  public isWarming: boolean = false;
  public isComparisonActive: boolean = false;
  public comparisonState: 'idle' | 'platform' | 'virtual' | 'finished' = 'idle';
  public comparisonMessage: string = '';
  public comparisonSummary: {
    platform: number | null;
    virtual: number | null;
    winner: 'platform' | 'virtual' | null;
  } | null = null;

  private metricsSubscription?: Subscription;
  private destroy$ = new Subject<void>();
  private comparisonPollHandle: ReturnType<typeof setInterval> | null = null;
  private activeComparisonEngine: 'platform' | 'virtual' | null = null;
  private comparisonTargetCount: number | null = null;
  private comparisonStablePolls = 0;
  private readonly comparisonStablePollsRequired = 2;
  private comparisonRuns: Array<{
    engine: 'platform' | 'virtual';
    startedAt: number;
    finishedAt: number | null;
    elapsedMs: number | null;
    count: number;
  }> = [];

  constructor(private threadsService: ThreadsApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // Si en 1.5 segundos no hay métricas, mostramos el café
    setTimeout(() => {
      if (this.metrics.length === 0) {
        this.isWarming = true;
        this.cdr.detectChanges();
      }
    }, 1500);

    // Hacemos un sondeo (polling) a la API cada 1 segundos para refrescar las métricas.
    this.metricsSubscription = timer(0, 2000) 
      .pipe(
        switchMap(() => this.threadsService.getStats()),
        takeUntil(this.destroy$)
      ).subscribe({
        next: (stats) => {
          this.isWarming = false; // API despertada
          this.metrics = [stats, ...this.metrics];
          if (this.metrics.length > 10) {
            this.metrics = this.metrics.slice(0, 10);
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error obteniendo métricas:', err);
          // No ponemos error visible aquí para no ensuciar si es solo un cold start
        }
      });
  }

  ngOnDestroy(): void {
    // Es crucial desuscribirse para evitar fugas de memoria.
    this.metricsSubscription?.unsubscribe();
    this.clearComparisonPoll();
    this.destroy$.next();
    this.destroy$.complete();
  }

  resetMetrics(): void {
    this.metrics = [];
    this.clearComparisonPoll();
    this.isComparisonActive = false;
    this.comparisonState = 'idle';
    this.comparisonMessage = '';
    this.comparisonSummary = null;
    this.activeComparisonEngine = null;
    this.comparisonTargetCount = null;
    this.comparisonStablePolls = 0;
    this.comparisonRuns = [];
  }

  compareLogs(countValue: string): void {
    const count = Number(countValue);
    this.errorMessage = null;
    this.successMessage = null;

    if (isNaN(count) || count <= 0 || count > 5000) {
      this.errorMessage = 'La cantidad de logs debe ser un número positivo y no exceder los 5000.';
      this.successMessage = null;
      console.error(this.errorMessage);
      return;
    }

    this.clearComparisonPoll();
    this.isComparisonActive = true;
    this.activeComparisonEngine = 'platform';
    this.comparisonTargetCount = count;
    this.comparisonStablePolls = 0;
    this.comparisonState = 'platform';
    this.comparisonSummary = null;
    this.comparisonRuns = [];
    this.comparisonMessage = `Comparación iniciada: lanzando Platform Threads con ${count} logs.`;

    this.runComparisonStep(count, 'platform');
  }

  private clearComparisonPoll(): void {
    if (this.comparisonPollHandle) {
      clearInterval(this.comparisonPollHandle);
      this.comparisonPollHandle = null;
    }
  }

  private runComparisonStep(count: number, engineType: 'platform' | 'virtual'): void {
    this.comparisonStablePolls = 0;
    const startedAt = Date.now();

    this.comparisonRuns = this.comparisonRuns.filter((run) => run.engine !== engineType);
    this.comparisonRuns.push({
      engine: engineType,
      startedAt,
      finishedAt: null,
      elapsedMs: null,
      count
    });

    this.threadsService.ingestLogs({ count, engineType }).subscribe({
      next: () => {
        this.successMessage = `Carga de ${count} logs con ${engineType} iniciada con éxito.`;
        this.comparisonState = engineType;
        this.comparisonMessage = engineType === 'platform'
          ? `Platform Threads ejecutándose con ${count} logs. Esperando a que termine para disparar Virtual Threads...`
          : `Virtual Threads ejecutándose con ${count} logs. Esperando a que termine para cerrar la comparación...`;
        this.startComparisonPolling();
      },
      error: (error) => {
        this.isComparisonActive = false;
        this.comparisonState = 'idle';
        this.comparisonMessage = 'La comparación se interrumpió por un error del backend.';
        this.errorMessage = `Error al iniciar la carga de logs: ${error.error.error}`;
        this.clearComparisonPoll();
        this.activeComparisonEngine = null;
        this.comparisonTargetCount = null;
        this.comparisonStablePolls = 0;
        console.error('Error al iniciar la carga de logs:', error);
      }
    });
  }

  private startComparisonPolling(): void {
    this.clearComparisonPoll();

    this.comparisonPollHandle = setInterval(() => {
      if (!this.activeComparisonEngine || this.comparisonTargetCount === null) {
        this.clearComparisonPoll();
        return;
      }

      this.threadsService.getStats().subscribe({
        next: (stats) => {
          const hasPendingLogs = stats.pendingLogs > 0;

          if (hasPendingLogs) {
            this.comparisonStablePolls = 0;
            return;
          }

          this.comparisonStablePolls += 1;

          if (this.comparisonStablePolls < this.comparisonStablePollsRequired) {
            return;
          }

          if (this.activeComparisonEngine === 'platform') {
            const nextCount = this.comparisonTargetCount;
            const platformRun = this.comparisonRuns.find((run) => run.engine === 'platform');

            if (platformRun) {
              platformRun.finishedAt = Date.now();
              platformRun.elapsedMs = platformRun.finishedAt - platformRun.startedAt;
            }

            if (nextCount === null) {
              this.clearComparisonPoll();
              this.isComparisonActive = false;
              this.comparisonState = 'idle';
              this.comparisonMessage = 'La comparación quedó inconclusa por un problema de estado.';
              return;
            }

            this.activeComparisonEngine = 'virtual';
            this.comparisonState = 'virtual';
            this.comparisonMessage = `Platform Threads finalizado. Lanzando Virtual Threads con ${nextCount} logs...`;
            this.runComparisonStep(nextCount, 'virtual');
            return;
          }

          const finishedCount = this.comparisonTargetCount ?? 0;
          const virtualRun = this.comparisonRuns.find((run) => run.engine === 'virtual');

          if (virtualRun) {
            virtualRun.finishedAt = Date.now();
            virtualRun.elapsedMs = virtualRun.finishedAt - virtualRun.startedAt;
          }

          this.comparisonSummary = this.buildComparisonSummary();
          this.clearComparisonPoll();
          this.isComparisonActive = false;
          this.comparisonState = 'finished';
          this.activeComparisonEngine = null;
          this.comparisonTargetCount = null;
          this.comparisonStablePolls = 0;
          this.comparisonMessage = `Comparación finalizada. Platform Threads y Virtual Threads procesaron ${finishedCount} logs cada uno.`;
          this.successMessage = `Comparación completada: ${finishedCount} logs procesados en cada motor.`;
        },
        error: (err) => {
          this.clearComparisonPoll();
          this.isComparisonActive = false;
          this.comparisonState = 'idle';
          this.comparisonMessage = 'Error al consultar métricas durante la comparación.';
          this.errorMessage = `Error al consultar métricas: ${err.message ?? 'desconocido'}`;
          this.activeComparisonEngine = null;
          this.comparisonTargetCount = null;
          this.comparisonStablePolls = 0;
          console.error('Error al consultar métricas durante la comparación:', err);
        }
      });
    }, 2000);
  }

  formatMs(value: number | null): string {
    if (value === null || value === undefined) {
      return '—';
    }

    return value < 1000 ? `${value} ms` : `${(value / 1000).toFixed(2)} s`;
  }

  private buildComparisonSummary(): {
    platform: number | null;
    virtual: number | null;
    winner: 'platform' | 'virtual' | null;
  } {
    const platform = this.comparisonRuns.find((run) => run.engine === 'platform')?.elapsedMs ?? null;
    const virtual = this.comparisonRuns.find((run) => run.engine === 'virtual')?.elapsedMs ?? null;

    if (platform === null || virtual === null) {
      return {
        platform,
        virtual,
        winner: null
      };
    }

    return {
      platform,
      virtual,
      winner: platform <= virtual ? 'platform' : 'virtual'
    };
  }

  ingestLogs(countValue: string, engineType: 'virtual' | 'platform'): void {
    const count = Number(countValue);
    this.errorMessage = null;   // Limpiamos errores previos
    this.successMessage = null; // Limpiamos mensajes de éxito previos

    if (isNaN(count) || count <= 0 || count > 5000) {
      this.errorMessage = 'La cantidad de logs debe ser un número positivo y no exceder los 5000.';
      this.successMessage = null; // Aseguramos que no haya mensaje de éxito si hay error de validación
      console.error(this.errorMessage);
      return;
    }

    const payload: IngestPayload = {
      count,
      engineType
    };

    this.threadsService.ingestLogs(payload).subscribe({
      next: (response) => {
        this.successMessage = `Carga de ${count} logs con ${engineType} iniciada con éxito.`;
        console.log(this.successMessage, response);
      },
      error: (error) => {
        this.errorMessage = `Error al iniciar la carga de logs: ${error.error.error}`;
        console.error('Error al iniciar la carga de logs:', error);
      }
    });
  }
}