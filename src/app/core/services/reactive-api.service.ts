import { Injectable, NgZone } from '@angular/core';
import { Observable, take } from 'rxjs';

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

    eventSource.onmessage = (event: MessageEvent) => {
      console.log(`Received message for ${url}:`, event.data); // Log received data
      if (!event.data) return;
      try {
        const parsedData = JSON.parse(event.data);
        console.log(`Emitting data for ${url}:`, parsedData); // Log data before emitting
        this.zone.run(() => observer.next(parsedData));
      } catch (error) {
        console.error('Error parseando SSE:', error);
      }
    };

    eventSource.onerror = (error) => {
      // ESTA ES LA CLAVE: 
      // Si el readyState es 2 (CLOSED) o incluso si el servidor cerró la conexión
      // sin un error explícito, forzamos el cierre definitivo para que no reintente.
      if (eventSource.readyState === EventSource.CLOSED) {
        observer.complete();
      } else {
        // Si quieres que los finitos NO reintenten NUNCA, 
        // puedes llamar a observer.complete() aquí también.
        observer.error(error);
        eventSource.close(); 
      }
    };

    return () => eventSource.close();
  });
}


  getTechnologiesStream(): Observable<ApiDescription> {
    return this.createStream<ApiDescription>(`${this.baseUrl}/technologies`); // Ensure it completes after 1 emission
  }

  getAdvantagesStream(): Observable<ApiDescription> {
    return this.createStream<ApiDescription>(`${this.baseUrl}/advantages`); // Ensure it completes after 1 emission
  }

  getMetricsStream(): Observable<ApiMetrics> {
    return this.createStream<ApiMetrics>(`${this.baseUrl}/metrics`);
  }
}