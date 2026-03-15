import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ReactiveApiService, ApiDescription, ApiMetrics } from '../project-showcase/reactive-api.service';

@Component({
  selector: 'show-api-reactive',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-api-reactive.component.html',
  styleUrls: ['./show-api-reactive.component.scss']
})
export class ShowApiReactiveComponent implements OnInit, OnDestroy {
  technologies: ApiDescription[] = [];
  advantages: ApiDescription[] = [];
  metrics: ApiMetrics[] = [];

  private subscriptions = new Subscription();

  constructor(private reactiveApiService: ReactiveApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.reactiveApiService.getTechnologiesStream().subscribe({
        next: (tech) => {
          this.technologies = [...this.technologies, tech]; // Asignación inmutable para disparar detección
          this.cdr.detectChanges(); // Forzamos la actualización de la vista inmediatamente
        },
        error: (err) => console.error('Error en el stream de tecnologías', err),
        complete: () => console.log('Stream de tecnologías completado.')
      })
    );
 
    this.subscriptions.add(
      this.reactiveApiService.getAdvantagesStream().subscribe({
        next: (advantage) => {
          this.advantages = [...this.advantages, advantage];
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error en el stream de ventajas', err),
        complete: () => console.log('Stream de ventajas completado.')
      })
    );

   this.subscriptions.add(
      this.reactiveApiService.getMetricsStream().subscribe({
        next: (metric) => {
            this.metrics = [metric, ...this.metrics]; // Inmutable: Añadimos al principio
            if (this.metrics.length > 20) { // Limitamos el array para no sobrecargar el navegador
                this.metrics = this.metrics.slice(0, 20);
            }
            this.cdr.detectChanges();
        },
        error: (err) => console.error('Error en el stream de métricas', err)
      })
    );

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}