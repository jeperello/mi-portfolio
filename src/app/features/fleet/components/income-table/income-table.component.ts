import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { IncomeEntry } from '../../models/fleet.model';

@Component({
  selector: 'app-income-table',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="showcase-card">
      <div class="card-header-bar">
        <div>
          <h3>📋 Detalle de Ingresos Registrados</h3>
          <span class="sub-title">Transacciones individuales de la semana</span>
        </div>
        <div class="actions">
          <button class="button btn-preset" (click)="onReloadPreset.emit()">
            ✨ Generar datos de prueba
          </button>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Plataforma</th>
              <th>Receptor (Socio)</th>
              <th>Método de Pago</th>
              <th>Descripción</th>
              <th class="text-right">Monto Recaudado</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (entry of entries(); track entry.id) {
              <tr>
                <!-- Plataforma -->
                <td>
                  <span class="badge-platform" [class.didi]="entry.platform === 'DiDi'" [class.uber]="entry.platform === 'Uber'">
                    {{ entry.platform === 'DiDi' ? '🧡 DiDi' : (entry.platform === 'Uber' ? '🖤 Uber' : '🚖 ' + entry.platform) }}
                  </span>
                </td>

                <!-- Socio Receptor -->
                <td>
                  <span class="badge-partner" [class.owner]="entry.partner === 'PROPIETARIO'" [class.driver]="entry.partner === 'CONDUCTOR'">
                    {{ entry.partner === 'PROPIETARIO' ? '👔 Propietario' : '🚗 Conductor' }}
                  </span>
                </td>

                <!-- Método de Pago -->
                <td>
                  <span class="badge-payment" [class.cash]="entry.paymentMethod === 'EFECTIVO'" [class.bank]="entry.paymentMethod === 'TRANSFERENCIA'" [class.mp]="entry.paymentMethod === 'MERCADOPAGO'">
                    {{ entry.paymentMethod === 'EFECTIVO' ? '💵 Efectivo' : (entry.paymentMethod === 'MERCADOPAGO' ? '📱 MercadoPago' : '🏦 Transferencia') }}
                  </span>
                </td>

                <!-- Descripción -->
                <td class="desc-col">
                  {{ entry.description }}
                </td>

                <!-- Monto -->
                <td class="text-right amount-col">
                  {{ entry.amount | currency:'USD':'symbol':'1.2-2' }}
                </td>

                <!-- Eliminar -->
                <td class="text-center">
                  <button class="btn-delete" (click)="onRemoveEntry.emit(entry.id)" title="Eliminar registro">
                    🗑️
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="empty-cell">
                  No hay transacciones registradas. Haz clic en "Generar datos de prueba" o añade nuevos ingresos con el formulario.
                </td>
              </tr>
            }
          </tbody>
        </table>
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
      margin-bottom: 2rem;
    }

    .card-header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      border-bottom: 1px solid var(--border-color, #334155);
      padding-bottom: 0.75rem;
      flex-wrap: wrap;
      gap: 0.75rem;

      h3 {
        margin: 0;
        font-size: 1.3rem;
        color: #38bdf8;
      }
    }

    .sub-title {
      font-size: 0.8rem;
      color: #94a3b8;
    }

    .btn-preset {
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 0.4rem 0.8rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #38bdf8;
        color: #0f172a;
      }
    }

    .table-container {
      border-radius: 12px;
      border: 1px solid var(--border-color, #334155);
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      background: transparent;
    }

    th {
      background-color: rgba(15, 23, 42, 0.85);
      color: #38bdf8;
      font-weight: 700;
      font-size: 0.75rem;
      padding: 12px 16px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border-color, #334155);
      white-space: nowrap;
    }

    td {
      padding: 12px 16px;
      font-size: 0.85rem;
      color: #f1f5f9;
      border-bottom: 1px solid rgba(51, 65, 85, 0.5);
    }

    tbody tr:hover {
      background-color: rgba(51, 65, 85, 0.3);
    }

    .text-right {
      text-align: right;
    }

    .text-center {
      text-align: center;
    }

    .amount-col {
      font-weight: 800;
      font-size: 0.95rem;
      color: #38bdf8;
    }

    .desc-col {
      color: #cbd5e1;
    }

    /* Badges */
    .badge-platform {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      white-space: nowrap;

      &.didi {
        background: rgba(249, 115, 22, 0.15);
        color: #fb923c;
      }

      &.uber {
        background: rgba(148, 163, 184, 0.15);
        color: #f1f5f9;
      }
    }

    .badge-partner {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      white-space: nowrap;

      &.owner {
        background: rgba(129, 140, 248, 0.15);
        color: #a5b4fc;
      }

      &.driver {
        background: rgba(52, 211, 153, 0.15);
        color: #6ee7b7;
      }
    }

    .badge-payment {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      white-space: nowrap;

      &.cash {
        background: rgba(34, 197, 94, 0.15);
        color: #4ade80;
      }

      &.bank {
        background: rgba(99, 102, 241, 0.15);
        color: #818cf8;
      }

      &.mp {
        background: rgba(14, 165, 233, 0.15);
        color: #38bdf8;
      }
    }

    .btn-delete {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(239, 68, 68, 0.3);
        transform: scale(1.1);
      }
    }

    .empty-cell {
      text-align: center;
      padding: 2.5rem;
      color: #64748b;
    }
  `]
})
export class IncomeTableComponent {
  entries = input.required<IncomeEntry[]>();
  onRemoveEntry = output<string>();
  onReloadPreset = output<void>();
}
