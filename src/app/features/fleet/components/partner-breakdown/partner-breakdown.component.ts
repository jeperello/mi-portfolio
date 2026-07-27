import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PartnerTotal } from '../../models/fleet.model';

@Component({
  selector: 'app-partner-breakdown',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="showcase-card">
      <div class="card-header-bar">
        <h3>👥 Acumulado por Socio vs Meta (50%)</h3>
        <span class="sub-badge">Comparativa de Caja</span>
      </div>

      <div class="partner-cards-grid">
        @for (partner of partnerTotals(); track partner.partner) {
          <div class="partner-box" [class.is-owner]="partner.partner === 'PROPIETARIO'" [class.is-driver]="partner.partner === 'CONDUCTOR'">
            <div class="partner-top">
              <div class="avatar-title">
                <span class="avatar-icon">
                  {{ partner.partner === 'PROPIETARIO' ? '👔' : '🚗' }}
                </span>
                <div>
                  <h4 class="name">{{ partner.partner === 'PROPIETARIO' ? 'Propietario' : 'Conductor' }}</h4>
                  <span class="role-desc">{{ partner.roleDescription }}</span>
                </div>
              </div>
              <span class="tag-role">
                {{ partner.partner === 'PROPIETARIO' ? 'Cuentas Bancarias' : 'Efectivo / MP' }}
              </span>
            </div>

            <!-- Main Collected Number -->
            <div class="number-block">
              <span class="label-sm">Total Ingresado en Mano:</span>
              <div class="collected-value">
                {{ partner.totalCollected | currency:'USD':'symbol':'1.2-2' }}
              </div>
            </div>

            <!-- Progress to 50% target -->
            <div class="comparison-bar">
              <div class="target-marker">
                <span>Target 50%: {{ partner.targetShare | currency:'USD':'symbol':'1.0-0' }}</span>
              </div>
              
              <!-- Difference pill -->
              @if (partner.difference > 0) {
                <div class="diff-badge surplus">
                  📈 Exceso: +{{ partner.difference | currency:'USD':'symbol':'1.2-2' }} (Deudor)
                </div>
              } @else if (partner.difference < 0) {
                <div class="diff-badge deficit">
                  📉 Faltante: {{ partner.difference | currency:'USD':'symbol':'1.2-2' }} (Acreedor)
                </div>
              } @else {
                <div class="diff-badge exact">
                  ✅ Exacto 50%
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .showcase-card {
      background-color: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border-color, #334155);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .card-header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      border-bottom: 1px solid var(--border-color, #334155);
      padding-bottom: 0.75rem;

      h3 {
        margin: 0;
        font-size: 1.3rem;
        color: #38bdf8;
      }
    }

    .sub-badge {
      font-size: 0.75rem;
      background: rgba(56, 189, 248, 0.1);
      color: #38bdf8;
      padding: 0.25rem 0.6rem;
      border-radius: 12px;
      font-weight: 600;
    }

    .partner-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
    }

    .partner-box {
      background: rgba(15, 23, 42, 0.7);
      border-radius: 14px;
      padding: 1.25rem;
      border: 1px solid rgba(51, 65, 85, 0.8);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.2s ease;

      &.is-owner {
        border-left: 4px solid #818cf8;
      }

      &.is-driver {
        border-left: 4px solid #34d399;
      }
    }

    .partner-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      gap: 0.5rem;
    }

    .avatar-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .avatar-icon {
      font-size: 1.5rem;
      background: rgba(51, 65, 85, 0.5);
      padding: 0.4rem;
      border-radius: 10px;
    }

    .name {
      margin: 0 0 0.2rem 0;
      font-size: 1.15rem;
      font-weight: 800;
      color: #f1f5f9;
    }

    .role-desc {
      font-size: 0.7rem;
      color: #94a3b8;
      display: block;
      line-height: 1.2;
    }

    .tag-role {
      font-size: 0.68rem;
      background: rgba(51, 65, 85, 0.4);
      color: #cbd5e1;
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      white-space: nowrap;
    }

    .number-block {
      margin-bottom: 1rem;
    }

    .label-sm {
      font-size: 0.75rem;
      color: #64748b;
      display: block;
    }

    .collected-value {
      font-size: 1.6rem;
      font-weight: 800;
      color: #f1f5f9;
      margin-top: 0.2rem;
    }

    .comparison-bar {
      background: rgba(30, 41, 59, 0.6);
      padding: 0.75rem;
      border-radius: 10px;
      border: 1px solid rgba(51, 65, 85, 0.5);
    }

    .target-marker {
      font-size: 0.75rem;
      color: #94a3b8;
      margin-bottom: 0.4rem;
      font-weight: 600;
    }

    .diff-badge {
      font-size: 0.78rem;
      font-weight: 700;
      padding: 0.3rem 0.6rem;
      border-radius: 6px;

      &.surplus {
        background: rgba(52, 211, 153, 0.15);
        color: #34d399;
      }

      &.deficit {
        background: rgba(129, 140, 248, 0.15);
        color: #818cf8;
      }

      &.exact {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
      }
    }
  `]
})
export class PartnerBreakdownComponent {
  partnerTotals = input.required<PartnerTotal[]>();
}
