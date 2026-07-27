import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SettlementResult } from '../../models/fleet.model';

@Component({
  selector: 'app-settlement-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="settlement-card" [class.balanced]="settlement().isBalanced">
      <div class="card-header">
        <div class="badge-title">
          <span class="pulse-dot"></span>
          <span>RESULTADO DEL FINIQUITO SEMANAL</span>
        </div>
        <span class="status-tag" [class.balanced-tag]="settlement().isBalanced">
          {{ settlement().isBalanced ? 'Cuentas Saldadas' : 'Pendiente de Transferencia' }}
        </span>
      </div>

      <div class="hero-statement">
        <div class="statement-icon">💡</div>
        <div class="statement-content">
          <h2 class="headline">{{ settlement().summaryText }}</h2>
          <p class="subtitle">
            Para cumplir con la división pactada del {{ settlement().splitPercentage }}% / {{ 100 - settlement().splitPercentage }}% sobre el total recaudado de {{ settlement().grandTotal | currency:'USD':'symbol':'1.2-2' }}.
          </p>
        </div>
      </div>

      <!-- Financial Flow Visualization -->
      <div class="flow-diagram">
        <!-- Debtor (Conductor) -->
        <div class="flow-box debtor">
          <div class="box-role">DEUDOR (Exceso Recaudado)</div>
          <div class="partner-name">🚗 Conductor</div>
          <div class="collected-amount">Recaudó: {{ conductorCollected() | currency:'USD':'symbol':'1.2-2' }}</div>
          <div class="diff-tag surplus">+{{ settlement().amountToTransfer | currency:'USD':'symbol':'1.2-2' }} sobre su 50%</div>
        </div>

        <!-- Transfer Arrow -->
        <div class="flow-arrow">
          <div class="arrow-line">
            <span class="transfer-badge">
              💸 Transferir {{ settlement().amountToTransfer | currency:'USD':'symbol':'1.2-2' }}
            </span>
          </div>
          <div class="arrow-head">➡️</div>
        </div>

        <!-- Creditor (Propietario) -->
        <div class="flow-box creditor">
          <div class="box-role">ACREEDOR (Faltante para 50%)</div>
          <div class="partner-name">👔 Propietario</div>
          <div class="collected-amount">Recaudó: {{ propietarioCollected() | currency:'USD':'symbol':'1.2-2' }}</div>
          <div class="diff-tag deficit">-{{ settlement().amountToTransfer | currency:'USD':'symbol':'1.2-2' }} bajo su 50%</div>
        </div>
      </div>

      <!-- Formula Breakdown -->
      <div class="formula-footer">
        <span class="formula-label">📐 Fórmula Aplicada:</span>
        <code>Transferencia = Recaudado_Conductor ($103,000.00) - Cuota_Justa_50% ($70,500.00) = $32,500.00</code>
      </div>
    </div>
  `,
  styles: [`
    .settlement-card {
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95));
      border: 2px solid #38bdf8;
      border-radius: 20px;
      padding: 1.75rem;
      box-shadow: 0 12px 30px rgba(56, 189, 248, 0.15);
      margin-bottom: 2rem;
      transition: all 0.3s ease;
    }

    .settlement-card.balanced {
      border-color: #10b981;
      box-shadow: 0 12px 30px rgba(16, 185, 129, 0.15);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .badge-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #38bdf8;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      background-color: #38bdf8;
      border-radius: 50%;
      box-shadow: 0 0 10px #38bdf8;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.3); opacity: 1; }
      100% { transform: scale(0.95); opacity: 0.8; }
    }

    .status-tag {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.3);
      padding: 0.35rem 0.85rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .balanced-tag {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border-color: rgba(16, 185, 129, 0.3);
    }

    .hero-statement {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1.5rem;
      background: rgba(56, 189, 248, 0.05);
      padding: 1.25rem;
      border-radius: 14px;
      border-left: 4px solid #38bdf8;
    }

    .statement-icon {
      font-size: 2rem;
    }

    .headline {
      margin: 0 0 0.4rem 0;
      font-size: 1.6rem;
      font-weight: 800;
      color: #f1f5f9;
      line-height: 1.25;
    }

    .subtitle {
      margin: 0;
      font-size: 0.9rem;
      color: #94a3b8;
    }

    /* Diagram Styles */
    .flow-diagram {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 768px) {
      .flow-diagram {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .flow-arrow {
        transform: rotate(90deg);
        margin: 0.5rem 0;
      }
    }

    .flow-box {
      background: rgba(30, 41, 59, 0.8);
      border-radius: 14px;
      padding: 1.2rem;
      border: 1px solid var(--border-color, #334155);
      transition: all 0.2s ease;
    }

    .flow-box.debtor {
      border-color: rgba(52, 211, 153, 0.4);
    }

    .flow-box.creditor {
      border-color: rgba(129, 140, 248, 0.4);
    }

    .box-role {
      font-size: 0.7rem;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.05em;
      margin-bottom: 0.3rem;
    }

    .partner-name {
      font-size: 1.2rem;
      font-weight: 700;
      color: #f1f5f9;
      margin-bottom: 0.5rem;
    }

    .collected-amount {
      font-size: 0.95rem;
      color: #cbd5e1;
      margin-bottom: 0.4rem;
    }

    .diff-tag {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .surplus {
      background: rgba(52, 211, 153, 0.15);
      color: #34d399;
    }

    .deficit {
      background: rgba(129, 140, 248, 0.15);
      color: #818cf8;
    }

    .flow-arrow {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
    }

    .arrow-line {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .transfer-badge {
      background: #38bdf8;
      color: #0f172a;
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      font-weight: 800;
      font-size: 0.85rem;
      box-shadow: 0 4px 14px rgba(56, 189, 248, 0.4);
      white-space: nowrap;
    }

    .arrow-head {
      font-size: 1.5rem;
    }

    .formula-footer {
      background: rgba(15, 23, 42, 0.6);
      padding: 0.75rem 1rem;
      border-radius: 10px;
      font-size: 0.8rem;
      color: #94a3b8;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;

      code {
        color: #38bdf8;
        font-family: monospace;
      }
    }
  `]
})
export class SettlementCardComponent {
  settlement = input.required<SettlementResult>();
  propietarioCollected = input.required<number>();
  conductorCollected = input.required<number>();
}
