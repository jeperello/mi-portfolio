import { Injectable, inject, signal, computed } from '@angular/core';
import { IncomeEntry } from '../models/fleet.model';
import { FleetCalculatorService } from './fleet-calculator.service';

/**
 * Initial dataset based on the user's real handwritten note:
 * - DiDi:
 *   * Propietario received in Account: $2,000.00
 *   * Conductor received in Cash: $50,000.00
 *   * Conductor received in MercadoPago: $26,000.00
 * - Uber:
 *   * Conductor received: $27,000.00 Cash
 *   * Propietario received: $36,000.00 Bank Account
 */
export const HANDWRITTEN_NOTE_PRESET: IncomeEntry[] = [
  {
    id: 'entry-didi-prop-bank',
    platform: 'DiDi',
    partner: 'PROPIETARIO',
    paymentMethod: 'TRANSFERENCIA',
    amount: 2000,
    description: 'Propietario recibió en Cuenta bancaria',
    date: '2026-07-20'
  },
  {
    id: 'entry-didi-cond-cash',
    platform: 'DiDi',
    partner: 'CONDUCTOR',
    paymentMethod: 'EFECTIVO',
    amount: 50000,
    description: 'Conductor recibió en Efectivo',
    date: '2026-07-21'
  },
  {
    id: 'entry-didi-cond-mp',
    platform: 'DiDi',
    partner: 'CONDUCTOR',
    paymentMethod: 'MERCADOPAGO',
    amount: 26000,
    description: 'Conductor recibió en MercadoPago',
    date: '2026-07-22'
  },
  {
    id: 'entry-uber-cond-cash',
    platform: 'Uber',
    partner: 'CONDUCTOR',
    paymentMethod: 'EFECTIVO',
    amount: 27000,
    description: 'Conductor recibió en Efectivo',
    date: '2026-07-23'
  },
  {
    id: 'entry-uber-prop-bank',
    platform: 'Uber',
    partner: 'PROPIETARIO',
    paymentMethod: 'TRANSFERENCIA',
    amount: 36000,
    description: 'Propietario recibió en Cuenta bancaria',
    date: '2026-07-24'
  }
];

@Injectable({
  providedIn: 'root'
})
export class FleetStateService {
  private calculator = inject(FleetCalculatorService);

  // State Signal for raw entries (starts empty by default)
  private entriesSignal = signal<IncomeEntry[]>([]);

  // Split Ratio Signal (Default: 50%)
  public splitPercentage = signal<number>(50);

  // Public readonly accessors
  public readonly entries = this.entriesSignal.asReadonly();

  // Computed signals derived automatically via pure functions
  public readonly grandTotal = computed(() =>
    this.calculator.calculateGrandTotal(this.entriesSignal())
  );

  public readonly platformSubtotals = computed(() =>
    this.calculator.calculatePlatformSubtotals(this.entriesSignal())
  );

  public readonly partnerTotals = computed(() =>
    this.calculator.calculatePartnerTotals(this.entriesSignal(), this.splitPercentage())
  );

  public readonly settlement = computed(() =>
    this.calculator.calculateSettlement(this.entriesSignal(), this.splitPercentage())
  );

  // Quick stats computed signals
  public readonly entryCount = computed(() => this.entriesSignal().length);

  /**
   * Action: Add new income entry
   */
  addEntry(entryData: Omit<IncomeEntry, 'id'>): void {
    const newEntry: IncomeEntry = {
      ...entryData,
      id: 'entry-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4)
    };
    this.entriesSignal.update(current => [newEntry, ...current]);
  }

  /**
   * Action: Remove entry by ID
   */
  removeEntry(id: string): void {
    this.entriesSignal.update(current => current.filter(e => e.id !== id));
  }

  /**
   * Action: Populate test data based on handwritten note preset
   */
  loadHandwrittenPreset(): void {
    this.entriesSignal.set(HANDWRITTEN_NOTE_PRESET);
  }

  /**
   * Alias: Generar datos de prueba
   */
  generateTestData(): void {
    this.loadHandwrittenPreset();
  }

  /**
   * Action: Clear all entries
   */
  clearAllEntries(): void {
    this.entriesSignal.set([]);
  }

  /**
   * Action: Update split percentage (e.g. 50/50 or 60/40)
   */
  updateSplitPercentage(percentage: number): void {
    if (percentage > 0 && percentage <= 100) {
      this.splitPercentage.set(percentage);
    }
  }
}
