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
  private statusSubscription?: Subscription;

  constructor(
    private smartBatchService: SmartBatchService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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

  runBatch(): void {
    this.isLoading = true;
    this.response = null;
    this.error = null;
    this.cdr.detectChanges();

    this.smartBatchService.runBatch()
      .subscribe({
        next: (res) => {
          this.response = res;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'Error executing batch.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  checkStatus(): void {
    this.isStatusLoading = true;
    this.cdr.detectChanges();

    this.smartBatchService.getBatchStatus()
      .subscribe({
        next: (res) => {
          this.statusResponse = res;
          this.isStatusLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'Error fetching status.';
          this.isStatusLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  reload(): void {
    this.isReloadLoading = true;
    this.response = null;
    this.error = null;
    this.cdr.detectChanges();

    this.smartBatchService.reloadData()
      .subscribe({
        next: (res) => {
          this.response = res;
          this.isReloadLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'Error reloading data.';
          this.isReloadLoading = false;
          this.cdr.detectChanges();
        }
      });
  }
}
