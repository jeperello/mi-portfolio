import { Component, ChangeDetectionStrategy, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FleetPartner, PaymentMethod, TransportPlatform, IncomeEntry } from '../../models/fleet.model';

@Component({
  selector: 'app-income-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="showcase-card">
      <div class="form-header" (click)="toggleForm()">
        <div class="header-left">
          <span class="icon">➕</span>
          <h3>Registrar Nuevo Ingreso a la Flota</h3>
        </div>
        <button class="toggle-btn">
          {{ isExpanded() ? '▲ Plegar Formulario' : '▼ Desplegar Formulario' }}
        </button>
      </div>

      @if (isExpanded()) {
        <form class="income-form" (submit)="onSubmit($event)">
          <div class="form-grid">
            <!-- Plataforma -->
            <div class="form-group">
              <label for="platform">Plataforma:</label>
              <select id="platform" [value]="platform()" (change)="onPlatformChange($event)">
                <option value="DiDi">DiDi</option>
                <option value="Uber">Uber</option>
                <option value="Cabify">Cabify</option>
                <option value="InDrive">InDrive</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <!-- Socio Receptor -->
            <div class="form-group">
              <label for="partner">Socio Receptor:</label>
              <select id="partner" [value]="partner()" (change)="onPartnerChange($event)">
                <option value="CONDUCTOR">Conductor (Operador)</option>
                <option value="PROPIETARIO">Propietario (Dueño)</option>
              </select>
            </div>

            <!-- Método de Pago -->
            <div class="form-group">
              <label for="paymentMethod">Método de Pago:</label>
              <select id="paymentMethod" [value]="paymentMethod()" (change)="onPaymentChange($event)">
                <option value="EFECTIVO">Efectivo</option>
                <option value="MERCADOPAGO">MercadoPago</option>
                <option value="TRANSFERENCIA">Transferencia / Bancaria</option>
              </select>
            </div>

            <!-- Monto -->
            <div class="form-group">
              <label for="amount">Monto ($ ARS):</label>
              <input 
                type="number" 
                id="amount" 
                [value]="amount()" 
                (input)="onAmountInput($event)"
                placeholder="Ej: 15000"
                min="1"
                required
              />
            </div>
          </div>

          <!-- Descripción -->
          <div class="form-group full-width">
            <label for="description">Descripción / Nota:</label>
            <input 
              type="text" 
              id="description" 
              [value]="description()" 
              (input)="onDescriptionInput($event)"
              placeholder="Ej: Cobro en efectivo viernes a la noche"
            />
          </div>

          <div class="form-actions">
            <button type="submit" class="button primary btn-add">
              ✨ Agregar Ingreso y Recalcular Finiquito
            </button>
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .showcase-card {
      background-color: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      border: 1px dashed var(--accent-color, #38bdf8);
      border-radius: 16px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 2rem;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      user-select: none;

      h3 {
        margin: 0;
        font-size: 1.15rem;
        color: #38bdf8;
      }
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .toggle-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;

      &:hover {
        color: #38bdf8;
      }
    }

    .income-form {
      margin-top: 1.25rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--border-color, #334155);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;

      label {
        font-size: 0.8rem;
        font-weight: 600;
        color: #cbd5e1;
      }

      input, select {
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid var(--border-color, #334155);
        color: #f1f5f9;
        padding: 0.6rem 0.8rem;
        border-radius: 8px;
        font-size: 0.9rem;
        outline: none;
        transition: border-color 0.2s;

        &:focus {
          border-color: #38bdf8;
        }
      }
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 1.25rem;
    }

    .btn-add {
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      color: #0f172a;
      font-weight: 800;

      &:hover {
        box-shadow: 0 0 20px rgba(56, 189, 248, 0.4);
      }
    }
  `]
})
export class IncomeFormComponent {
  isExpanded = signal<boolean>(false);

  platform = signal<TransportPlatform>('DiDi');
  partner = signal<FleetPartner>('CONDUCTOR');
  paymentMethod = signal<PaymentMethod>('EFECTIVO');
  amount = signal<number | null>(null);
  description = signal<string>('');

  onAddEntry = output<Omit<IncomeEntry, 'id'>>();

  toggleForm(): void {
    this.isExpanded.update(v => !v);
  }

  onPlatformChange(event: Event): void {
    this.platform.set((event.target as HTMLSelectElement).value as TransportPlatform);
  }

  onPartnerChange(event: Event): void {
    this.partner.set((event.target as HTMLSelectElement).value as FleetPartner);
  }

  onPaymentChange(event: Event): void {
    this.paymentMethod.set((event.target as HTMLSelectElement).value as PaymentMethod);
  }

  onAmountInput(event: Event): void {
    const val = parseFloat((event.target as HTMLInputElement).value);
    this.amount.set(isNaN(val) ? null : val);
  }

  onDescriptionInput(event: Event): void {
    this.description.set((event.target as HTMLInputElement).value);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    const currentAmount = this.amount();

    if (!currentAmount || currentAmount <= 0) {
      alert('Por favor, ingresa un monto válido mayor a 0.');
      return;
    }

    this.onAddEntry.emit({
      platform: this.platform(),
      partner: this.partner(),
      paymentMethod: this.paymentMethod(),
      amount: currentAmount,
      description: this.description() || `${this.partner()} (${this.platform()})`,
      date: new Date().toISOString().split('T')[0]
    });

    // Reset form
    this.amount.set(null);
    this.description.set('');
    this.isExpanded.set(false);
  }
}
