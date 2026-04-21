import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartBatchService } from '../../core/services/smart-batch.service';
import { timer, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-show-smart-batch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-smart-batch.component.html',
  styleUrls: ['./show-smart-batch.component.css']
})
export class ShowSmartBatchComponent implements OnInit, OnDestroy {
  isLoading = false;
  isStatusLoading = false;
  isReloadLoading = false;
  response: string | null = null;
  statusResponse: any = null;
  error: string | null = null;
  showInstructions = false;
  
  // Lógica de Logs
  logs: { message: string, type: 'info' | 'error' | 'success' | 'debug' }[] = [];
  private logInterval: any;

  private statusSubscription?: Subscription;

  constructor(
    private smartBatchService: SmartBatchService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.addLog('System initialized. Ready for operations.', 'success');
    // ... resto del init ...
    // Iniciamos el polling automático al entrar al componente
    //timer(0, 5000) dispara inmediatamente (0) y luego cada 5000ms
    this.statusSubscription = timer(0, 5000)
      .pipe(
        switchMap(() => {
          this.isStatusLoading = true;
          this.cdr.detectChanges();
          return this.smartBatchService.getBatchStatus();
        })
      )
      .subscribe({
        next: (res) => {
          this.statusResponse = res;
          this.isStatusLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching status automatically:', err);
          this.isStatusLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }

  addLog(message: string, type: 'info' | 'error' | 'success' | 'debug' = 'info'): void {
    const timestamp = new Date().toLocaleTimeString();
    this.logs.push({ message: `[${timestamp}] ${message}`, type });
    // Limitar logs para no saturar memoria
    if (this.logs.length > 50) this.logs.shift();
    this.cdr.detectChanges();
    
    // Auto-scroll a la última línea (necesitaremos ViewChild o un pequeño hack de DOM)
    setTimeout(() => {
      const console = document.querySelector('.terminal-body');
      if (console) console.scrollTop = console.scrollHeight;
    }, 50);
  }

  runBatch(): void {
    this.isLoading = true;
    this.response = null;
    this.error = null;
    this.addLog('Initiating Smart Batch process...', 'info');
    this.addLog('Fetching pending records from database...', 'debug');
    this.cdr.detectChanges();

    this.smartBatchService.runBatch()
      .subscribe({
        next: (res) => {
          this.response = res;
          this.isLoading = false;
          this.addLog('Batch Job launched successfully.', 'success');
          this.simulateBatchLogs();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'Error executing batch.';
          this.isLoading = false;
          this.addLog('CRITICAL: Batch Job failed to launch.', 'error');
          this.cdr.detectChanges();
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
    this.isStatusLoading = true;
    this.addLog('Manual status check requested.', 'debug');
    this.cdr.detectChanges();

    this.smartBatchService.getBatchStatus()
      .subscribe({
        next: (res) => {
          this.statusResponse = res;
          this.isStatusLoading = false;
          this.addLog('Live statistics synchronized.', 'info');
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'Error fetching status.';
          this.isStatusLoading = false;
          this.addLog('WARNING: Connectivity issue while fetching status.', 'error');
          this.cdr.detectChanges();
        }
      });
  }

  reload(): void {
    this.isReloadLoading = true;
    this.response = null;
    this.error = null;
    this.addLog('Requesting data reload...', 'info');
    this.cdr.detectChanges();

    this.smartBatchService.reloadData()
      .subscribe({
        next: (res) => {
          this.response = res;
          this.isReloadLoading = false;
          this.addLog('Database re-populated with 100 PENDING records.', 'success');
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'Error reloading data.';
          this.isReloadLoading = false;
          this.addLog('ERROR: Could not reload database state.', 'error');
          this.cdr.detectChanges();
        }
      });
  }
}
