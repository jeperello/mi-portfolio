import { Injectable } from '@angular/core';
import {
  IncomeEntry,
  PlatformSubtotal,
  PartnerTotal,
  SettlementResult,
  TransportPlatform,
  FleetPartner
} from '../models/fleet.model';

@Injectable({
  providedIn: 'root'
})
export class FleetCalculatorService {
  /**
   * Calculates the grand total of all income entries.
   */
  calculateGrandTotal(entries: IncomeEntry[]): number {
    return entries.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  }

  /**
   * Calculates subtotals aggregated per platform (e.g. DiDi, Uber).
   */
  calculatePlatformSubtotals(entries: IncomeEntry[]): PlatformSubtotal[] {
    const grandTotal = this.calculateGrandTotal(entries);
    const map = new Map<TransportPlatform, { total: number; count: number; byPartner: Record<FleetPartner, number> }>();

    for (const entry of entries) {
      if (!map.has(entry.platform)) {
        map.set(entry.platform, {
          total: 0,
          count: 0,
          byPartner: { PROPIETARIO: 0, CONDUCTOR: 0 }
        });
      }

      const item = map.get(entry.platform)!;
      item.total += entry.amount;
      item.count += 1;
      item.byPartner[entry.partner] = (item.byPartner[entry.partner] || 0) + entry.amount;
    }

    const result: PlatformSubtotal[] = [];
    map.forEach((value, platform) => {
      result.push({
        platform,
        total: value.total,
        percentageOfFleet: grandTotal > 0 ? (value.total / grandTotal) * 100 : 0,
        entryCount: value.count,
        byPartner: value.byPartner
      });
    });

    // Sort by subtotal descending
    return result.sort((a, b) => b.total - a.total);
  }

  /**
   * Calculates total collected income per partner and compares with fair share target.
   */
  calculatePartnerTotals(entries: IncomeEntry[], splitPercentage: number = 50): PartnerTotal[] {
    const grandTotal = this.calculateGrandTotal(entries);
    const targetPerPartner = (grandTotal * splitPercentage) / 100;

    let propietarioCollected = 0;
    let conductorCollected = 0;

    for (const entry of entries) {
      if (entry.partner === 'PROPIETARIO') {
        propietarioCollected += entry.amount;
      } else if (entry.partner === 'CONDUCTOR') {
        conductorCollected += entry.amount;
      }
    }

    return [
      {
        partner: 'PROPIETARIO',
        totalCollected: propietarioCollected,
        targetShare: targetPerPartner,
        difference: propietarioCollected - targetPerPartner,
        roleDescription: 'Socio Dueño de la Flota (Receptor de Transferencias Directas)'
      },
      {
        partner: 'CONDUCTOR',
        totalCollected: conductorCollected,
        targetShare: targetPerPartner,
        difference: conductorCollected - targetPerPartner,
        roleDescription: 'Socio Operador (Recaudador de Efectivo y Pasarelas de Pago)'
      }
    ];
  }

  /**
   * Calculates the 50/50 settlement result between partners.
   */
  calculateSettlement(entries: IncomeEntry[], splitPercentage: number = 50): SettlementResult {
    const grandTotal = this.calculateGrandTotal(entries);
    const fairShare = (grandTotal * splitPercentage) / 100;
    const partnerTotals = this.calculatePartnerTotals(entries, splitPercentage);

    const propietario = partnerTotals.find(p => p.partner === 'PROPIETARIO')!;
    const conductor = partnerTotals.find(p => p.partner === 'CONDUCTOR')!;

    // Difference = Total Collected - Fair Share Target
    // If Conductor collected > Fair Share, Conductor has surplus cash and owes Propietario.
    const conductorDiff = conductor.totalCollected - fairShare;

    if (Math.abs(conductorDiff) < 0.01) {
      return {
        grandTotal,
        splitPercentage,
        fairSharePerPartner: fairShare,
        debtor: 'CONDUCTOR',
        creditor: 'PROPIETARIO',
        amountToTransfer: 0,
        summaryText: 'Las cuentas están perfectamente equilibradas al 50%.',
        isBalanced: true
      };
    }

    if (conductorDiff > 0) {
      // Conductor collected more than their fair share -> Conductor pays Propietario
      return {
        grandTotal,
        splitPercentage,
        fairSharePerPartner: fairShare,
        debtor: 'CONDUCTOR',
        creditor: 'PROPIETARIO',
        amountToTransfer: conductorDiff,
        summaryText: `Conductor debe pagar $${conductorDiff.toLocaleString('es-AR', { minimumFractionDigits: 2 })} a Propietario`,
        isBalanced: false
      };
    } else {
      // Propietario collected more than their fair share -> Propietario pays Conductor
      const propTransfer = Math.abs(conductorDiff);
      return {
        grandTotal,
        splitPercentage,
        fairSharePerPartner: fairShare,
        debtor: 'PROPIETARIO',
        creditor: 'CONDUCTOR',
        amountToTransfer: propTransfer,
        summaryText: `Propietario debe pagar $${propTransfer.toLocaleString('es-AR', { minimumFractionDigits: 2 })} a Conductor`,
        isBalanced: false
      };
    }
  }
}
