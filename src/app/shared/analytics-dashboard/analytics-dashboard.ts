import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule],
    templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css']
})
export class AnalyticsDashboardComponent {
  public analytics = inject(AnalyticsService);
  
  isOpen = signal(false);
  activeTab = signal<'sessions' | 'stats' | 'live'>('sessions');
  stats = signal<any>(null);
  sessions = signal<any[] | null>(null);
  selectedSessionId = signal<string | null>(null);

  toggleDashboard() {
    this.isOpen.update(v => !v);
    if (this.isOpen()) this.refreshCurrentTab();
  }

  setTab(tab: 'sessions' | 'stats' | 'live') {
    this.activeTab.set(tab);
    this.refreshCurrentTab();
  }

  refreshCurrentTab() {
    if (this.activeTab() === 'sessions') this.loadSessions();
    if (this.activeTab() === 'stats') this.loadStats();
  }

  loadSessions() {
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
    this.activeTab.set('stats');
    this.loadStats();
  }

  clearSession() {
    this.selectedSessionId.set(null);
    this.loadStats();
  }

  loadStats() {
    console.log('🔄 Solicitando actualización de métricas...');
    this.stats.set(null); // Feedback visual de carga
    this.analytics.getStats(this.selectedSessionId() || undefined).subscribe({
      next: (data) => {
        console.log('✅ Métricas actualizadas:', data);
        this.stats.set(data);
      },
      error: (err) => {
        console.error('❌ Error al actualizar métricas:', err);
        this.stats.set(null);
      }
    });
  }
}
