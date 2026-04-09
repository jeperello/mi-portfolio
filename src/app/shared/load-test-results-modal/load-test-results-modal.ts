import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgFor, NgIf, DecimalPipe } from '@angular/common';
import { Observable, Subscription } from 'rxjs'; // Import Observable and Subscription

export interface LoadTestResult {
  status: 'pending' | 'success' | 'error'; // Add 'pending' status
  description?: string;
  timeElapsed: number;
  requestIndex: number; // Add requestIndex
}

@Component({
  selector: 'app-load-test-results-modal',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, DecimalPipe],
  templateUrl: './load-test-results-modal.html',
  styleUrls: ['./load-test-results-modal.scss']
})
export class LoadTestResultsModalComponent implements OnInit, OnDestroy {
  @Input() testType: string = '';
  @Input() totalRequests: number = 0;
  
  // results is now internal and initialized based on totalRequests
  results: LoadTestResult[] = [];
  @Input() resultsStream!: Observable<LoadTestResult>; // Input to receive the stream

  @Output() close = new EventEmitter<void>();

  private resultsSubscription: Subscription | undefined; // To manage the subscription

  constructor(
    private cdr: ChangeDetectorRef) { }

ngOnInit(): void {
  // Initialize results array with pending placeholders
  for (let i = 0; i < this.totalRequests; i++) {
    this.results.push({
      status: 'pending',
      description: 'Cargando...',
      timeElapsed: 0,
      requestIndex: i
    });
  }

  if (this.resultsStream) {
    this.resultsSubscription = this.resultsStream.subscribe(result => {
      console.log('Modal received result:', result);
      // Update the specific item in the array
      if (result.requestIndex !== undefined && this.results[result.requestIndex]) {
        this.results[result.requestIndex] = result;
      }
      this.cdr.detectChanges(); // Re-introduce change detection
    });
  }
}

  ngOnDestroy(): void {
    if (this.resultsSubscription) {
      this.resultsSubscription.unsubscribe();
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  trackByFn(index: number, item: LoadTestResult): number {
    return item.requestIndex;
  }
}
