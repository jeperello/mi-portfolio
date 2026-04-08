import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReactiveApiService, ApiMetrics, ApiDescription } from '../../core/services/reactive-api.service';

@Component({
  selector: 'app-show-api-reactive',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-api-reactive.component.html',
  styleUrls: ['./show-api-reactive.component.css']
})
export class ShowApiReactiveComponent implements OnInit, OnDestroy {

  metrics: ApiMetrics[] = [];
  technologies: ApiDescription[] = [];
  advantages: ApiDescription[] = [];

  private subscriptions = new Subscription();

  constructor(private reactiveApiService: ReactiveApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Suscripción al stream de métricas (infinito)
    this.subscriptions.add(
      this.reactiveApiService.getMetricsStream().subscribe(metric => {
        this.metrics = [metric, ...this.metrics];
        // Limitamos el array para que no crezca indefinidamente en la UI
        if (this.metrics.length > 10) {
          this.metrics.pop();
        }
        this.cdr.detectChanges(); // Forzamos a Angular a revisar la vista
      })
    );

    // Suscripción al stream de tecnologías (finito)
    this.subscriptions.add(
      this.reactiveApiService.getTechnologiesStream().subscribe({
        next: tech => {
          this.technologies = [...this.technologies, tech]; // Actualización inmutable
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}