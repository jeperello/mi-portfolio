import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThreadsApiService, ThreadStats, IngestPayload } from '../../core/services/threads-api.service';
import { Subscription, timer, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ApiWarmingComponent } from '../../shared/api-warming/api-warming';

@Component({
  selector: 'show-threads-api',
  standalone: true,
  imports: [CommonModule, ApiWarmingComponent],
  templateUrl: './show-threads-api.component.html',
  styleUrls: ['./show-threads-api.component.css']
})
export class ShowThreadsApiComponent implements OnInit, OnDestroy {

  metrics: ThreadStats[] = [];
  public errorMessage: string | null = null;
  public successMessage: string | null = null;
  public isWarming: boolean = false;
  
  private metricsSubscription?: Subscription;
  private destroy$ = new Subject<void>();

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
    this.destroy$.next();
    this.destroy$.complete();
  }

  resetMetrics(): void {
    this.metrics = [];
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