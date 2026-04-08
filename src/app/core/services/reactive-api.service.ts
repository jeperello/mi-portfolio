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

    eventSource.onmessage = (event: MessageEvent) => {
      if (!event.data) return;
      try {
        const parsedData = JSON.parse(event.data);
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
    return this.createStream<ApiDescription>(`${this.baseUrl}/technologies`);
  }

  getAdvantagesStream(): Observable<ApiDescription> {
    return this.createStream<ApiDescription>(`${this.baseUrl}/advantages`);
  }

  getMetricsStream(): Observable<ApiMetrics> {
    return this.createStream<ApiMetrics>(`${this.baseUrl}/metrics`);
  }
}