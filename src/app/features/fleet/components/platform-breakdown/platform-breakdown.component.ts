import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { PlatformSubtotal } from '../../models/fleet.model';

@Component({
  selector: 'app-platform-breakdown',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="showcase-card">
      <div class="card-header-bar">
        <h3>🚗 Subtotales por Plataforma</h3>
        <span class="sub-badge">{{ subtotals().length }} Plataformas Registradas</span>
      </div>

      <div class="platform-list">
        @for (item of subtotals(); track item.platform) {
          <div class="platform-item">
            <div class="platform-main-info">
              <div class="platform-identity">
                <span class="platform-logo" [class.didi]="item.platform === 'DiDi'" [class.uber]="item.platform === 'Uber'">
                  {{ item.platform === 'DiDi' ? '🧡 DiDi' : (item.platform === 'Uber' ? '🖤 Uber' : '🚖 ' + item.platform) }}
                </span>
                <span class="entry-count">{{ item.entryCount }} transacción(es)</span>
              </div>

              <div class="platform-subtotal">
                <span class="amount">{{ item.total | currency:'USD':'symbol':'1.2-2' }}</span>
                <span class="share-pill">{{ item.percentageOfFleet | number:'1.1-1' }}% del total</span>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="progress-bar-bg">
              <div 
                class="progress-bar-fill"
                [class.fill-didi]="item.platform === 'DiDi'"
                [class.fill-uber]="item.platform === 'Uber'"
                [style.width.%]="item.percentageOfFleet">
              </div>
            </div>

            <!-- Partner breakdown inside platform -->
            <div class="partner-chips">
              <span class="chip owner">
                👔 Propietario: {{ item.byPartner.PROPIETARIO | currency:'USD':'symbol':'1.2-2' }}
              </span>
              <span class="chip driver">
                🚗 Conductor: {{ item.byPartner.CONDUCTOR | currency:'USD':'symbol':'1.2-2' }}
              </span>
            </div>
          </div>
        } @empty {
          <div class="empty-state">
            No hay registros de plataformas ingresados.
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

    .platform-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .platform-item {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(51, 65, 85, 0.6);
      border-radius: 14px;
      padding: 1.2rem;
      transition: all 0.2s ease;

      &:hover {
        border-color: #38bdf8;
      }
    }

    .platform-main-info {
      display: flex;
      justify-content: space-between;
      align-items: flex-center;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .platform-identity {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .platform-logo {
      font-size: 1.1rem;
      font-weight: 800;
      padding: 0.3rem 0.8rem;
      border-radius: 8px;

      &.didi {
        background: rgba(249, 115, 22, 0.15);
        color: #fb923c;
        border: 1px solid rgba(249, 115, 22, 0.3);
      }

      &.uber {
        background: rgba(148, 163, 184, 0.15);
        color: #f1f5f9;
        border: 1px solid rgba(148, 163, 184, 0.3);
      }
    }

    .entry-count {
      font-size: 0.8rem;
      color: #64748b;
    }

    .platform-subtotal {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .amount {
      font-size: 1.3rem;
      font-weight: 800;
      color: #f1f5f9;
    }

    .share-pill {
      font-size: 0.75rem;
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      font-weight: 700;
    }

    .progress-bar-bg {
      height: 8px;
      background: rgba(51, 65, 85, 0.5);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 0.8rem;
    }

    .progress-bar-fill {
      height: 100%;
      background: #38bdf8;
      border-radius: 4px;
      transition: width 0.6s ease-out;

      &.fill-didi {
        background: linear-gradient(90deg, #f97316, #fb923c);
      }

      &.fill-uber {
        background: linear-gradient(90deg, #38bdf8, #818cf8);
      }
    }

    .partner-chips {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;

      .chip {
        font-size: 0.75rem;
        padding: 0.25rem 0.6rem;
        border-radius: 6px;
        font-weight: 600;

        &.owner {
          background: rgba(129, 140, 248, 0.15);
          color: #a5b4fc;
        }

        &.driver {
          background: rgba(52, 211, 153, 0.15);
          color: #6ee7b7;
        }
      }
    }

    .empty-state {
      padding: 2rem;
      text-align: center;
      color: #64748b;
    }
  `]
})
export class PlatformBreakdownComponent {
  subtotals = input.required<PlatformSubtotal[]>();
}
