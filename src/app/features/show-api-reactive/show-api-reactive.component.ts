import { Component, OnDestroy, OnInit, ChangeDetectorRef, ViewChild, ElementRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, Subscription, forkJoin, from, map, of, catchError, finalize, range, Subject, mergeMap, takeUntil } from 'rxjs'; // Added Observable to imports
import { ReactiveApiService, ApiMetrics, ApiDescription } from '../../core/services/reactive-api.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ModalService } from '../../shared/modal'; // Import ModalService
import { LoadTestResult } from '../../shared/load-test-results-modal/load-test-results-modal'; // Removed .ts extension
import { ApiWarmingComponent } from '../../shared/api-warming/api-warming';
import { AnalyticsDirective } from '../../shared/analytics.directive';
import { ExpandableDescriptionComponent } from '../../shared/expandable-description/expandable-description.component';

@Component({
  selector: 'app-show-api-reactive',
  standalone: true,
  imports: [CommonModule, FormsModule, ApiWarmingComponent, RouterLink, AnalyticsDirective, ExpandableDescriptionComponent],
  templateUrl: './show-api-reactive.component.html',
  styleUrls: ['./show-api-reactive.component.css']
})
export class ShowApiReactiveComponent implements OnInit, OnDestroy {

  @ViewChild('technologiesPanel') technologiesPanel?: ElementRef<HTMLElement>;
  @ViewChild('advantagesPanel') advantagesPanel?: ElementRef<HTMLElement>;

  metrics: ApiMetrics[] = [];
  technologies: ApiDescription[] = [];
  advantages: ApiDescription[] = [];
  technologyLoadResults: LoadTestResult[] = [];
  advantageLoadResults: LoadTestResult[] = [];

  numberOfConcurrentRequests: number = 10; // New property for load test

  // Load Test Indicator properties
  isLoading: boolean = false;
  readonly isWarming = signal(false); // Flag for cold start animation
  loadTestStatus: string = '';
  requestsCompleted: number = 0;
  loadTestElapsedTime: number = 0;
  private loadTestStartTime: number = 0;

  private technologyLoadState = {
    isLoading: false,
    loadTestStatus: '',
    requestsCompleted: 0,
    loadTestElapsedTime: 0,
    loadTestStartTime: 0
  };

  private advantageLoadState = {
    isLoading: false,
    loadTestStatus: '',
    requestsCompleted: 0,
    loadTestElapsedTime: 0,
    loadTestStartTime: 0
  };

  private subscriptions = new Subscription();
  private destroy$ = new Subject<void>(); // Used for managing subscriptions on destroy
  private warmingTimeout?: ReturnType<typeof setTimeout>;

  constructor(
    private reactiveApiService: ReactiveApiService,
    private cdr: ChangeDetectorRef,
    private modalService: ModalService // Inject ModalService
  ) { }

  ngOnInit(): void {
    const stopWarming = () => {
      if (this.warmingTimeout) {
        clearTimeout(this.warmingTimeout);
      }
      this.isWarming.set(false);
    };

    // Si en 1 segundo no hay datos, mostramos la animación de "Warming"
    this.warmingTimeout = setTimeout(() => {
      if (this.technologies.length === 0 && this.advantages.length === 0 && this.metrics.length === 0) {
        this.isWarming.set(true);
        this.cdr.detectChanges();
      }
    }, 1000);

    // Suscripción al stream de métricas (infinito)
    this.subscriptions.add(
      this.reactiveApiService.getMetricsStream().subscribe(metric => {
        stopWarming();
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
          stopWarming();
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
          stopWarming();
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
    this.runLoadTest('Tecnologías', () => this.reactiveApiService.getTechnologiesStream(), 'technologies');
    this.scrollToPanel('technologies');
  }

  simulateAdvantagesLoad(): void {
    this.runLoadTest('Ventajas', () => this.reactiveApiService.getAdvantagesStream(), 'advantages');
    this.scrollToPanel('advantages');
  }

  private scrollToPanel(target: 'technologies' | 'advantages'): void {
    const panel = target === 'technologies' ? this.technologiesPanel : this.advantagesPanel;

    if (!panel) {
      return;
    }

    const element = panel.nativeElement as HTMLElement & {
      scrollIntoView?: (options?: ScrollIntoViewOptions) => void;
    };

    if (typeof element.scrollIntoView === 'function') {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      return;
    }

    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      const rect = element.getBoundingClientRect();
      window.scrollTo({
        top: window.scrollY + rect.top - 24,
        behavior: 'smooth'
      });
    }
  }

  private runLoadTest(
    testType: string,
    apiCallFactory: () => Observable<ApiDescription>,
    target: 'technologies' | 'advantages' = 'advantages'
  ): void {
    const loadState = target === 'technologies' ? this.technologyLoadState : this.advantageLoadState;

    this.resetLoadTestState(target);
    loadState.isLoading = true;
    loadState.loadTestStatus = `Iniciando simulación de carga para ${testType}...`;
    loadState.loadTestStartTime = performance.now();

    if (target === 'technologies') {
      this.technologyLoadResults = Array.from({ length: this.numberOfConcurrentRequests }, (_, index) => ({
        status: 'pending',
        description: 'Cargando...',
        timeElapsed: 0,
        requestIndex: index
      }));
    }

    if (target === 'advantages') {
      this.advantageLoadResults = Array.from({ length: this.numberOfConcurrentRequests }, (_, index) => ({
        status: 'pending',
        description: 'Cargando...',
        timeElapsed: 0,
        requestIndex: index
      }));
    }

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
          if (target === 'technologies') {
            if (result.requestIndex !== undefined && this.technologyLoadResults[result.requestIndex]) {
              this.technologyLoadResults[result.requestIndex] = result;
            }
          }

          if (target === 'advantages') {
            if (result.requestIndex !== undefined && this.advantageLoadResults[result.requestIndex]) {
              this.advantageLoadResults[result.requestIndex] = result;
            }
          }

          this.cdr.detectChanges();

          completedRequestsCount++;
          loadState.requestsCompleted = completedRequestsCount;
          loadState.loadTestStatus = `Progreso: ${completedRequestsCount} / ${this.numberOfConcurrentRequests} solicitudes completadas.`;
        },
        error: err => {
          loadState.loadTestStatus = `Error general durante la simulación para ${testType}.`;
          console.error(`Error general en simulación de carga para ${testType}:`, err);
          loadState.isLoading = false;
        },
        complete: () => {
          loadState.loadTestStatus = `Simulación de carga para ${testType} completada.`;
          loadState.isLoading = false;
          loadState.loadTestElapsedTime = performance.now() - loadState.loadTestStartTime;
        }
      })
    );
  }

  private resetLoadTestState(target: 'technologies' | 'advantages'): void {
    const loadState = target === 'technologies' ? this.technologyLoadState : this.advantageLoadState;

    this.isLoading = false;
    this.loadTestStatus = '';
    this.requestsCompleted = 0;
    this.loadTestElapsedTime = 0;
    this.loadTestStartTime = 0;

    loadState.isLoading = false;
    loadState.loadTestStatus = '';
    loadState.requestsCompleted = 0;
    loadState.loadTestElapsedTime = 0;
    loadState.loadTestStartTime = 0;

    if (target === 'technologies') {
      this.technologyLoadResults = [];
    } else {
      this.advantageLoadResults = [];
    }
  }

  trackLoadResult(index: number, result: LoadTestResult): number {
    return result.requestIndex ?? index;
  }

  ngOnDestroy(): void {
    if (this.warmingTimeout) {
      clearTimeout(this.warmingTimeout);
    }
    this.subscriptions.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}