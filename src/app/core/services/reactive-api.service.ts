import { Injectable, NgZone, inject } from '@angular/core';
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
  private zone = inject(NgZone);

  private createStream<T>(url: string, isFinite = false): Observable<T> {
    return new Observable<T>(observer => {
      if (typeof EventSource === 'undefined') {
        observer.complete();
        return;
      }

      const eventSource = new EventSource(url);
      let hasReceivedData = false;

      eventSource.onmessage = (event: MessageEvent) => {
        if (!event.data) return;
        try {
          const parsedData = JSON.parse(event.data);
          hasReceivedData = true;
          this.zone.run(() => observer.next(parsedData));
        } catch (error) {
          console.error('Error parseando SSE:', error);
        }
      };

      eventSource.onerror = (error) => {
        if (isFinite) {
          // En streams SSE finitos, cuando el backend (Spring WebFlux) emite el último elemento
          // y completa el Flux, cierra la conexión HTTP. La especificación SSE de los navegadores
          // interpreta cualquier desconexión como un error con readyState = CONNECTING (0) para
          // intentar reconectar. Por eso cerramos la conexión inmediatamente y, si ya se recibieron
          // datos, lo tratamos como una finalización exitosa (complete).
          eventSource.close();
          this.zone.run(() => {
            if (hasReceivedData) {
              observer.complete();
            } else {
              // Si falló antes de recibir ningún mensaje, es un error real (ej. backend caído o 500)
              observer.error(error);
            }
          });
        } else {
          // Para streams infinitos (como métricas), si el socket se cerró definitivamente reportamos error
          if (eventSource.readyState === EventSource.CLOSED) {
            this.zone.run(() => observer.error(error));
          }
        }
      };

      return () => {
        if (eventSource.readyState !== EventSource.CLOSED) {
          eventSource.close();
        }
      };
    });
  }

  getTechnologiesStream(): Observable<ApiDescription> {
    return this.createStream<ApiDescription>(`${this.baseUrl}/technologies`, true);
  }

  getAdvantagesStream(): Observable<ApiDescription> {
    return this.createStream<ApiDescription>(`${this.baseUrl}/advantages`, true);
  }

  getMetricsStream(): Observable<ApiMetrics> {
    return this.createStream<ApiMetrics>(`${this.baseUrl}/metrics`, false);
  }
}