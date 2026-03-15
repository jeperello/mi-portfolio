import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

// Interfaces para tipar los datos que recibimos de la API
export interface ApiDescription {
  description: string;
}

export interface ApiMetrics {
  usedMemoryMB: number;
  freeMemoryMB: number;
  totalMemoryMB: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReactiveApiService {
  private baseUrl = 'https://reactive-api-27c7.onrender.com/api';

  constructor(private zone: NgZone) { }

  private createStream<T>(url: string): Observable<T> {
    return new Observable<T>(observer => {
      const eventSource = new EventSource(url);

      eventSource.onmessage = event => {
        const eventData = event.data;

        // Un evento puede llegar sin datos (p.ej. un 'keep-alive' del servidor).
        // Si no hay datos, no intentamos parsear para evitar errores.
        if (!eventData) {
          return;
        }

        try {
          const parsedData = JSON.parse(eventData);
          // Usamos NgZone para asegurarnos de que la detección de cambios de Angular se active
          this.zone.run(() => observer.next(parsedData));
        } catch (error) {
          // Si el parseo falla a pesar de tener datos, es un error que queremos ver.
          console.error('Error al parsear JSON del evento SSE:', { data: eventData, error: error });
        }
      };

      eventSource.onerror = error => {
        // Si el estado es CONNECTING (0) o CLOSED (2), asumimos que el servidor terminó de enviar datos.
        // Para streams finitos como este, cerramos para evitar bucles de reconexión y completamos.
        if (eventSource.readyState === 0 || eventSource.readyState === 2) {
          eventSource.close();
          this.zone.run(() => observer.complete());
        } else {
          // Error real
          this.zone.run(() => observer.error(error));
        }
      };

      // Al desuscribirse, cerramos la conexión
      return () => {
        eventSource.close();
      };
    });
  }

  getTechnologiesStream(): Observable<ApiDescription> {
    return this.createStream<ApiDescription>(`${this.baseUrl}/technologies`);
  }

  getAdvantagesStream(): Observable<ApiDescription> {
    return this.createStream<ApiDescription>(`${this.baseUrl}/advantages`);
  }

  getMetricsStream(): Observable<ApiMetrics> {
    return this.createStream<ApiMetrics>(`${this.baseUrl}/metrics`);
  }
}