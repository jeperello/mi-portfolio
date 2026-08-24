import { Component, OnInit, OnDestroy, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { SmartBatchService } from '../../core/services/smart-batch.service';
import { timer, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiWarmingComponent } from '../../shared/api-warming/api-warming';
import { AnalyticsDirective } from '../../shared/analytics.directive';

export interface BatchLog {
  message: string;
  type: 'info' | 'error' | 'success' | 'debug';
}

@Component({
  selector: 'app-show-smart-batch',
  standalone: true,
  imports: [CommonModule, DatePipe, NgClass, ApiWarmingComponent, AnalyticsDirective],
  templateUrl: './show-smart-batch.component.html',
  styleUrls: ['./show-smart-batch.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowSmartBatchComponent implements OnInit, OnDestroy {
  private smartBatchService = inject(SmartBatchService);

  readonly isLoading = signal(false);
  readonly isStatusLoading = signal(false);
  readonly isReloadLoading = signal(false);
  readonly isWarming = signal(false); // Flag para el café
  readonly response = signal<string | null>(null);
  readonly statusResponse = signal<any>(null);
  readonly hasPendingRecords = computed(() => (this.statusResponse()?.pendingCount ?? 0) > 0);
  readonly error = signal<string | null>(null);
  readonly showInstructions = signal(false);
  
  // Lógica de Logs
  readonly logs = signal<BatchLog[]>([]);

  private statusSubscription?: Subscription;
  private warmingTimeout?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.addLog('System initialized. Ready for operations.', 'success');

    // Si en 1.5 segundos no hay respuesta del servidor, mostramos la animación de "Warming"
    this.warmingTimeout = setTimeout(() => {
      if (!this.statusResponse()) {
        this.isWarming.set(true);
        this.addLog('Server cold start detected. Activating warming sequence...', 'debug');
      }
    }, 1500);

    // Iniciamos el polling automático al entrar al componente
    this.statusSubscription = timer(0, 5000)
      .pipe(
        switchMap(() => {
          this.isStatusLoading.set(true);
          return this.smartBatchService.getBatchStatus();
        })
      )
      .subscribe({
        next: (res) => {
          this.statusResponse.set(res);
          this.isWarming.set(false); // Ocultamos el warming al recibir datos
          this.isStatusLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching status automatically:', err);
          this.isStatusLoading.set(false);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.warmingTimeout) {
      clearTimeout(this.warmingTimeout);
    }
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }

  toggleInstructions(): void {
    this.showInstructions.update(v => !v);
  }

  addLog(message: string, type: 'info' | 'error' | 'success' | 'debug' = 'info'): void {
    const timestamp = new Date().toLocaleTimeString();
    this.logs.update(current => {
      const next = [...current, { message: `[${timestamp}] ${message}`, type }];
      if (next.length > 50) next.shift();
      return next;
    });
    
    // Auto-scroll a la última línea
    setTimeout(() => {
      const terminal = document.querySelector('.terminal-body');
      if (terminal) terminal.scrollTop = terminal.scrollHeight;
    }, 50);
  }

  runBatch(): void {
    if (!this.hasPendingRecords()) {
      return;
    }

    this.isLoading.set(true);
    this.response.set(null);
    this.error.set(null);
    this.addLog('Initiating Smart Batch process...', 'info');
    this.addLog('Fetching pending records from database...', 'debug');

    this.smartBatchService.runBatch()
      .subscribe({
        next: (res) => {
          this.response.set(res);
          this.isLoading.set(false);
          this.addLog('Batch Job launched successfully.', 'success');
          this.simulateBatchLogs();
        },
        error: (err) => {
          this.error.set('Error executing batch.');
          this.isLoading.set(false);
          this.addLog('CRITICAL: Batch Job failed to launch.', 'error');
        }
      });
  }

  simulateBatchLogs(): void {
    const steps = [
      { msg: 'Job: [SmartReprocessingJob] launched with parameters: {}', type: 'info' as const, delay: 500 },
      { msg: 'Step: [reprocessStep] executed.', type: 'info' as const, delay: 1200 },
      { msg: 'Read 100 items from provider.', type: 'debug' as const, delay: 1800 },
      { msg: 'Processing chunk of 10 items...', type: 'info' as const, delay: 2500 },
      { msg: 'Applying Smart Retry Pattern on record #42', type: 'debug' as const, delay: 3500 },
      { msg: 'Chunk processed successfully.', type: 'success' as const, delay: 4200 },
      { msg: 'Updating job execution status to COMPLETED', type: 'info' as const, delay: 5500 }
    ];

    steps.forEach(step => {
      setTimeout(() => this.addLog(step.msg, step.type), step.delay);
    });
  }

  checkStatus(): void {
    this.isStatusLoading.set(true);
    this.addLog('Manual status check requested.', 'debug');

    this.smartBatchService.getBatchStatus()
      .subscribe({
        next: (res) => {
          this.statusResponse.set(res);
          this.isStatusLoading.set(false);
          this.addLog('Live statistics synchronized.', 'info');
        },
        error: (err) => {
          this.error.set('Error fetching status.');
          this.isStatusLoading.set(false);
          this.addLog('WARNING: Connectivity issue while fetching status.', 'error');
        }
      });
  }

  reload(): void {
    this.isReloadLoading.set(true);
    this.response.set(null);
    this.error.set(null);
    this.addLog('Requesting data reload...', 'info');

    this.smartBatchService.reloadData()
      .subscribe({
        next: () => {
          this.isReloadLoading.set(false);
          this.addLog('Database re-populated with 100 PENDING records.', 'success');
        },
        error: (err) => {
          this.error.set('Error reloading data.');
          this.isReloadLoading.set(false);
          this.addLog('ERROR: Could not reload database state.', 'error');
        }
      });
  }
}
