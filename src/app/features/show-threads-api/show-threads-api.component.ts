import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreadsApiService, ThreadStats } from '../../core/services/threads-api.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'show-threads-api',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-threads-api.component.html',
  styleUrls: ['./show-threads-api.component.css']
})
export class ShowThreadsApiComponent implements OnInit, OnDestroy {

  metrics: ThreadStats[] = [];
  private metricsSubscription?: Subscription;

  constructor(private threadsService: ThreadsApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // Hacemos un sondeo (polling) a la API cada 1 segundos para refrescar las métricas.
    this.metricsSubscription = timer(0, 1000) // Emite inmediatamente (0ms) y luego cada 1000ms.
      .pipe(
        // switchMap cancela la petición anterior si una nueva es emitida, evitando condiciones de carrera.
        switchMap(() => this.threadsService.getStats())
      ).subscribe({
        next: (stats) => {
          // Añadimos la nueva métrica al principio del array para que aparezca arriba en la tabla.
          this.metrics = [stats, ...this.metrics];
          // Para evitar que la lista crezca indefinidamente, la limitamos a los últimos 20 registros.
          if (this.metrics.length > 20) {
            this.metrics = this.metrics.slice(0, 20);
          }
          this.cdr.detectChanges(); // Nos aseguramos de que la vista se actualice.
        },
        error: (err) => console.error('Error obteniendo métricas:', err)
      });
  }

  ngOnDestroy(): void {
    // Es crucial desuscribirse para evitar fugas de memoria.
    this.metricsSubscription?.unsubscribe();
  }

  resetMetrics(): void {
    this.metrics = [];
  }
}