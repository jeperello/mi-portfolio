import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-fleet-kpi',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="kpi-grid">
      <!-- Total General Card -->
      <div class="kpi-card highlight-glow">
        <div class="kpi-header">
          <span class="kpi-icon">💰</span>
          <span class="kpi-label">Ingresos Totales Flota</span>
        </div>
        <div class="kpi-value live-number">
          {{ grandTotal() | currency:'USD':'symbol':'1.2-2' }}
        </div>
        <div class="kpi-footer">
          Sumatoria de Uber + DiDi (5 registros)
        </div>
      </div>

      <!-- Fair Share Card (50/50 Target) -->
      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-icon">⚖️</span>
          <span class="kpi-label">Cuota Justa (50 / 50)</span>
        </div>
        <div class="kpi-value accent-text">
          {{ fairShare() | currency:'USD':'symbol':'1.2-2' }}
        </div>
        <div class="kpi-footer">
          Meta asignada por cada socio (50%)
        </div>
      </div>

      <!-- Recaudado por Propietario -->
      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-icon">👔</span>
          <span class="kpi-label">Propietario Recaudó</span>
        </div>
        <div class="kpi-value owner-text">
          {{ propietarioTotal() | currency:'USD':'symbol':'1.2-2' }}
        </div>
        <div class="kpi-footer">
          Cuenta bancaria / Transferencias
        </div>
      </div>

      <!-- Recaudado por Conductor -->
      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-icon">🚗</span>
          <span class="kpi-label">Conductor Recaudó</span>
        </div>
        <div class="kpi-value driver-text">
          {{ conductorTotal() | currency:'USD':'symbol':'1.2-2' }}
        </div>
        <div class="kpi-footer">
          Efectivo + MercadoPago
        </div>
      </div>
    </div>
  `,
  styles: [`
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .kpi-card {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border-color, #334155);
      border-radius: 16px;
      padding: 1.25rem 1.5rem;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .kpi-card:hover {
      transform: translateY(-4px);
      border-color: #38bdf8;
      box-shadow: 0 10px 25px -5px rgba(56, 189, 248, 0.15);
    }

    .highlight-glow {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9));
      border: 1px solid rgba(56, 189, 248, 0.4);
      box-shadow: 0 0 20px rgba(56, 189, 248, 0.1);
    }

    .kpi-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .kpi-icon {
      font-size: 1.25rem;
    }

    .kpi-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .kpi-value {
      font-size: 1.8rem;
      font-weight: 800;
      color: #f1f5f9;
      margin: 0.3rem 0;
      letter-spacing: -0.02em;
    }

    .accent-text {
      color: #38bdf8;
    }

    .owner-text {
      color: #818cf8;
    }

    .driver-text {
      color: #34d399;
    }

    .kpi-footer {
      font-size: 0.75rem;
      color: #64748b;
    }
  `]
})
export class FleetKpiComponent {
  grandTotal = input.required<number>();
  fairShare = input.required<number>();
  propietarioTotal = input.required<number>();
  conductorTotal = input.required<number>();
}
