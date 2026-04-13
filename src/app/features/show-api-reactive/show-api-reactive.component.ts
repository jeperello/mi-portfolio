import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, Subscription, forkJoin, from, map, of, catchError, finalize, range, Subject, mergeMap, takeUntil } from 'rxjs'; // Added Observable to imports
import { ReactiveApiService, ApiMetrics, ApiDescription } from '../../core/services/reactive-api.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ModalService } from '../../shared/modal'; // Import ModalService
import { LoadTestResult } from '../../shared/load-test-results-modal/load-test-results-modal'; // Removed .ts extension

@Component({
  selector: 'app-show-api-reactive',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add FormsModule here
  templateUrl: './show-api-reactive.component.html',
  styleUrls: ['./show-api-reactive.component.css']
})
export class ShowApiReactiveComponent implements OnInit, OnDestroy {

  metrics: ApiMetrics[] = [];
  technologies: ApiDescription[] = [];
  advantages: ApiDescription[] = [];

  numberOfConcurrentRequests: number = 10; // New property for load test

  // Load Test Indicator properties
  isLoading: boolean = false;
  loadTestStatus: string = '';
  requestsCompleted: number = 0;
  loadTestElapsedTime: number = 0;
  private loadTestStartTime: number = 0;

  private subscriptions = new Subscription();
  private destroy$ = new Subject<void>(); // Used for managing subscriptions on destroy

  constructor(
    private reactiveApiService: ReactiveApiService,
    private cdr: ChangeDetectorRef,
    private modalService: ModalService // Inject ModalService
  ) { }

  ngOnInit(): void {
    // Suscripción al stream de métricas (infinito)
    this.subscriptions.add(
      this.reactiveApiService.getMetricsStream().subscribe(metric => {
        this.metrics = [metric, ...this.metrics];
        // Limitamos el array para que no crezca indefinidamente en la UI
        if (this.metrics.length > 5) {
          this.metrics.pop();
        }
        this.cdr.detectChanges(); // Re-introduce change detection
      })
    );

    // Suscripción al stream de tecnologías (finito)
    this.subscriptions.add(
      this.reactiveApiService.getTechnologiesStream().subscribe({
        next: tech => {
          this.technologies = [...this.technologies, tech]; // Actualización inmutable
          this.cdr.detectChanges(); // Re-introduce change detection
        },
        error: err => {
          console.log('End connection technologies stream:', err);
          // Potentially set a flag for UI to show a message
        },
        complete: () => {
          console.log('Technologies stream completed.');
        }
      })
    );

    // Suscripción al stream de ventajas (finito)
    this.subscriptions.add(
      this.reactiveApiService.getAdvantagesStream().subscribe({
        next: advantage => {
          this.advantages = [...this.advantages, advantage]; // Actualización inmutable
          this.cdr.detectChanges(); // Re-introduce change detection
        },
        error: err => {
          console.log('End connection advantages stream:', err);
          // Potentially set a flag for UI to show a message
        },
        complete: () => {
          console.log('Advantages stream completed.');
        }
      })
    );
  }

  simulateTechnologiesLoad(): void {
    this.runLoadTest('Tecnologías', () => this.reactiveApiService.getTechnologiesStream());
  }

  simulateAdvantagesLoad(): void {
    this.runLoadTest('Ventajas', () => this.reactiveApiService.getAdvantagesStream());
  }

  private runLoadTest(testType: string, apiCallFactory: () => Observable<ApiDescription>): void {
    this.resetLoadTestState();
    this.isLoading = true;
    this.loadTestStatus = `Iniciando simulación de carga para ${testType}...`;
    this.loadTestStartTime = performance.now();

    const resultsSubject = new Subject<LoadTestResult>(); // Subject to emit live results to modal

    this.modalService.open(testType, this.numberOfConcurrentRequests, resultsSubject.asObservable());

    let completedRequestsCount = 0;

    const requestObservables = range(0, this.numberOfConcurrentRequests).pipe(
      mergeMap(index => {
        const startTime = performance.now();
        return apiCallFactory().pipe(
          map((response: ApiDescription) => { // Cast response to ApiDescription
            const timeElapsed = performance.now() - startTime;
            return {
              status: 'success',
              description: response.description,
              timeElapsed: timeElapsed,
              requestIndex: index // Add the requestIndex
            } as LoadTestResult;
          }),
          catchError(err => {
            const timeElapsed = performance.now() - startTime;
            console.error(`Error en solicitud ${index + 1} de ${testType}:`, err);
            return of({
              status: 'error',
              description: `Error: ${err?.message || 'Desconocido'}`,
              timeElapsed: timeElapsed,
              requestIndex: index // Add the requestIndex
            } as LoadTestResult);
          }),
          takeUntil(this.destroy$) // Ensure inner observable unsubscribes on destroy
        );
      })
    );

    this.subscriptions.add(
      requestObservables.subscribe({
        next: result => {
          //console.log('Emitting result to modal:', result); // Added log
          resultsSubject.next(result); // Emit result live to modal
          completedRequestsCount++;
          this.requestsCompleted = completedRequestsCount;
          this.loadTestStatus = `Progreso: ${completedRequestsCount} / ${this.numberOfConcurrentRequests} solicitudes completadas.`;
        },
        error: err => {
          this.loadTestStatus = `Error general durante la simulación para ${testType}.`;
          console.error(`Error general en simulación de carga para ${testType}:`, err);
          this.isLoading = false; // Stop loading on general error
          resultsSubject.error(err); // Propagate error to modal
        },
        complete: () => {
          this.loadTestStatus = `Simulación de carga para ${testType} completada.`;
          this.isLoading = false;
          this.loadTestElapsedTime = performance.now() - this.loadTestStartTime;
          resultsSubject.complete(); // Complete the subject when all requests are done
        }
      })
    );
  }

  private resetLoadTestState(): void {
    this.isLoading = false;
    this.loadTestStatus = '';
    this.requestsCompleted = 0;
    this.loadTestElapsedTime = 0;
    this.loadTestStartTime = 0;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}