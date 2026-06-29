import { Component, inject, signal, computed, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../core/services/analytics.service';
import { AnalyticsDirective } from '../analytics.directive';
import { isLocalEnvironment } from '../../core/utils/environment';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule, AnalyticsDirective],
    templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css']
})
export class AnalyticsDashboardComponent {
  public analytics = inject(AnalyticsService);
  // Flag de control: Determina si el log es visible (solo para entorno local/dev)
  public localMode = isLocalEnvironment(); 

  // Por defecto empezamos en 'live' para dar esa sensación de "siempre activo"
  activeTab = signal<'sessions' | 'stats' | 'live'>('live');
  stats = signal<any>(null);
  sessions = signal<any[] | null>(null);
  selectedSessionId = signal<string | null>(null);
  selectedPage = signal<string | null>(null);

  constructor() {
    // Usamos untracked para que el efecto solo dependa de showDashboard
    // y no se reinicie cada vez que cambiamos de pestaña internamente.
    effect(() => {
      if (this.analytics.showDashboard()) {
        untracked(() => this.onOpen());
      }
    });
  }

  private onOpen() {
    this.activeTab.set('live'); 
    if (!this.selectedSessionId()) {
      this.selectedSessionId.set(this.analytics.sessionId);
    }
    this.refreshCurrentTab();
  }

  toggleDashboard() {
    this.analytics.toggleDashboard();
  }

  setTab(tab: 'sessions' | 'stats' | 'live') {
    // Si el usuario va a métricas y no tiene nada seleccionado, le mostramos lo suyo por defecto
    if (tab === 'stats' && !this.selectedSessionId()) {
      this.selectedSessionId.set(this.analytics.sessionId);
    }
    this.activeTab.set(tab);
    this.refreshCurrentTab();
  }

  refreshCurrentTab() {
    if (this.activeTab() === 'sessions') this.loadSessions();
    if (this.activeTab() === 'stats') this.loadStats();
  }

  loadSessions() {
    if (!this.analytics.localMode) {
      this.sessions.set([]);
      return;
    }
    this.sessions.set(null);
    this.analytics.getSessions().subscribe({
      next: (data) => this.sessions.set(data),
      error: (err) => {
        console.error('Error fetching sessions:', err);
        this.sessions.set([]);
      }
    });
  }

  selectSession(id: string) {
    this.selectedSessionId.set(id);
    this.selectedPage.set(null); // Reset page filter when switching session
    this.activeTab.set('stats');
    this.loadStats();
  }

  selectPage(page: string) {
    this.selectedPage.set(page);
    this.loadStats();
  }

  clearFilters() {
    this.selectedSessionId.set(null);
    this.selectedPage.set(null);
    this.loadStats();
  }

  loadStats() {
    if (this.localMode) {
      console.log('🔄 Solicitando actualización de métricas...');
    }
    this.stats.set(null); // Feedback visual de carga
    this.analytics.getStats(this.selectedSessionId() || undefined, this.selectedPage() || undefined).subscribe({
      next: (data) => {
        if (this.localMode) {
          console.log('✅ Métricas actualizadas:', data);
        }
        this.stats.set(data);
      },
      error: (err) => {
        console.error('❌ Error al actualizar métricas:', err);
        this.stats.set(null);
      }
    });
  }
}
