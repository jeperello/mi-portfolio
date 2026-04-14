import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartBatchService } from '../../core/services/smart-batch.service';

@Component({
  selector: 'app-show-smart-batch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-smart-batch.component.html',
  styleUrls: ['./show-smart-batch.component.css']
})
export class ShowSmartBatchComponent {
  isLoading = false;
  isStatusLoading = false;
  isReloadLoading = false;
  response: string | null = null;
  statusResponse: any = null;
  error: string | null = null;

  constructor(
    private smartBatchService: SmartBatchService,
    private cdr: ChangeDetectorRef
  ) {}

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
