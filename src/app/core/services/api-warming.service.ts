import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { isLocalEnvironment } from '../utils/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiWarmingService {
  // Lista de URLs para despertar. Render necesita un GET para arrancar el contenedor.
  private warmingUrls = [
    'https://reactive-api-27c7.onrender.com/api/technologies',
    'https://smart-reprocessing-batch.onrender.com/api/v1/batch/status',
    'https://log-ingestion-engin.onrender.com/api/logs/stats',
    'https://comment-service-4192.onrender.com/api/v1/comments'
  ];

  constructor(private http: HttpClient) { }
  
  // Flag de control: Determina si el log es visible (solo para entorno local/dev)
  public localMode = isLocalEnvironment(); 

  /**
   * Envía una petición GET silenciosa a cada API para despertarlas (Cold Start).
   * No nos importa el resultado, solo queremos que el servidor reciba la señal.
   */
  warmUpAll(): void {
    if (this.localMode) {
      console.log('🚀 Iniciando Operación Despertador: Calentando APIs de Render...');
    }
    
    // Ejecutamos todas las peticiones en paralelo
    const requests = this.warmingUrls.map(url => 
      this.http.get(url).pipe(
        first(), // Solo nos interesa el primer contacto
        catchError(err => {
          // Ignoramos errores, el servidor se despertará aunque la respuesta no sea perfecta
          // (especialmente con SSE que puede dar problemas con un GET simple de HttpClient)
          return of(null);
        })
      )
    );

    // ForkJoin dispara todas y nos olvidamos. "Fire and forget".
    forkJoin(requests).subscribe({
      //Despertando motores...
      next: () => console.log('✅ Señal enviada a todas las APIs.'),
      error: () => console.log('⚠️ Operación Despertador finalizada con algunos errores (esperado).')
    });
  }
}
