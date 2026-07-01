import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AnalyticsEvent } from '../models/analytics.model';
import { interval, Subscription, BehaviorSubject, of, catchError } from 'rxjs';
import { isLocalEnvironment } from '../utils/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://portfolio-pulse-service.onrender.com';
  //private readonly baseUrl = 'http://localhost:8080';
  private apiUrl = this.baseUrl + '/api/v1/events';
  private statsUrl = this.baseUrl + '/api/v1/events/stats';
  public readonly sessionId = this.generateSessionId();
  public sessionEventCount = signal(0);
  
  // Flag de control: Determina si el log es visible (solo para entorno local/dev)
  public localMode = isLocalEnvironment(); 
  public showDashboard = signal(false);

  public toggleDashboard() {
    this.showDashboard.update(v => !v);
  }

  public openDashboard() {
    this.showDashboard.set(true);
  }

  // Configuración de la ráfaga
  private eventBuffer: AnalyticsEvent[] = [];
  
  // Stream para el dashboard live
  private liveEventsSubject = new BehaviorSubject<AnalyticsEvent[]>([]);
  public liveEvents$ = this.liveEventsSubject.asObservable();
  private liveLog: AnalyticsEvent[] = [];

  getStats(sessionId?: string, page?: string) {
    let url = this.statsUrl;
    const params: string[] = [];
    if (sessionId) params.push(`sessionId=${sessionId}`);
    if (page) params.push(`page=${page}`);
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    return this.http.get<any>(url);
  }

  getSessions() {
    return this.http.get<any[]>(`${this.apiUrl}/sessions`);
  }
  private readonly STORAGE_KEY = 'pending_analytics_events';
  private readonly BATCH_LIMIT = 5; // Enviar cada 5 eventos
  private readonly FLUSH_INTERVAL = 15000; // O cada 15 segundos
  private timerSubscription?: Subscription;

  constructor() {
    this.loadFromStorage();
    this.setupTimer();
    this.trackPageView('INITIAL_LOAD');
    
    // Intentar enviar eventos pendientes al cerrar la ventana
    window.addEventListener('beforeunload', () => this.flush());
  }

  private setupTimer() {
    this.timerSubscription = interval(this.FLUSH_INTERVAL).subscribe(() => {
      if (this.eventBuffer.length > 0) {
        this.flush();
      }
    });
  }

  private loadFromStorage() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.eventBuffer = JSON.parse(saved);
        if (this.localMode) {
          console.log(`📦 Eventos recuperados del baúl: ${this.eventBuffer.length}`);
        }
        this.addToLiveLog(...this.eventBuffer);
      } catch (e) {
        this.eventBuffer = [];
      }
    }
  }

  private addToLiveLog(...events: AnalyticsEvent[]) {
    this.liveLog = [...events, ...this.liveLog].slice(0, 50); // Guardamos los últimos 50
    this.liveEventsSubject.next(this.liveLog);
  }

  private saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.eventBuffer));
  }

  private generateSessionId(): string {
    return 'session-' + Math.random().toString(36).substring(2, 11);
  }

  trackEvent(eventType: string, componentId: string, metadata: Record<string, any> = {}): void {
    const event: AnalyticsEvent = {
      eventType: eventType.toUpperCase(),
      componentId: componentId.toUpperCase(),
      metadata: {
        ...metadata,
        page: window.location.pathname,
        browser: this.getBrowserInfo()
      },
      timestamp: Date.now(), // Unix timestamp en ms
      sessionId: this.sessionId
    };

    this.eventBuffer.push(event);
    this.sessionEventCount.update(c => c + 1);
    this.addToLiveLog(event);
    this.saveToStorage();

    if (this.localMode) {
      console.log(`📥 Evento encolado [${this.eventBuffer.length}/${this.BATCH_LIMIT}]:`, eventType);
    }

    if (this.eventBuffer.length >= this.BATCH_LIMIT) {
      this.flush();
    }
  }

  private getBrowserInfo(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    return 'Unknown';
  }

  trackPageView(pageId: string): void {
    this.trackEvent('PAGE_VIEW', pageId);
  }

  private flush(): void {
    if (this.eventBuffer.length === 0) return;

    // Clonamos y limpiamos para evitar duplicados si hay peticiones lentas
    const eventsToSend = [...this.eventBuffer];
    this.eventBuffer = [];
    this.saveToStorage();
    if (this.localMode) {
        console.log(`🚀 ¡DESPEGUE! Enviando ráfaga de ${eventsToSend.length} eventos a la terminal de Kafka...`);
    }
    // Enviamos los eventos en paralelo, especificando que la respuesta es texto plano
    eventsToSend.forEach(event => {
      this.http.post(this.apiUrl, event, { responseType: 'text' }).subscribe({
        next: (response) => {
          if (this.localMode) {
            console.log(`✅ Kafka dice: ${response}`);
          }
        },
        error: (err) => {
          console.error('❌ Kafka se ha puesto caprichoso:', err);
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
