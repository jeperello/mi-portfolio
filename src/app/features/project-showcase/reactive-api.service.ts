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
        // El endpoint de métricas tiene un prefijo "data:", lo manejamos por si acaso.
        const eventData = event.data;
        try {
          const parsedData = JSON.parse(eventData);
          // Usamos NgZone para asegurarnos de que la detección de cambios de Angular se active
          this.zone.run(() => observer.next(parsedData));
        } catch (error) {
          // Ignoramos errores de parseo, a veces SSE envía comentarios o mensajes de keep-alive.
        }
      };

      eventSource.onerror = error => {
        this.zone.run(() => observer.error(error));
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