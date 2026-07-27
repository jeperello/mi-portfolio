export type FleetPartner = 'PROPIETARIO' | 'CONDUCTOR';
export type TransportPlatform = 'DiDi' | 'Uber' | 'Cabify' | 'InDrive' | 'Otro';
export type PaymentMethod = 'EFECTIVO' | 'TRANSFERENCIA' | 'MERCADOPAGO';

export interface IncomeEntry {
  id: string;
  platform: TransportPlatform;
  partner: FleetPartner;
  paymentMethod: PaymentMethod;
  amount: number;
  description: string;
  date?: string;
}

export interface PlatformSubtotal {
  platform: TransportPlatform;
  total: number;
  percentageOfFleet: number;
  entryCount: number;
  byPartner: Record<FleetPartner, number>;
}

export interface PartnerTotal {
  partner: FleetPartner;
  totalCollected: number;
  targetShare: number;
  difference: number; // positive = over-collected (debtor), negative = under-collected (creditor)
  roleDescription: string;
}

export interface SettlementResult {
  grandTotal: number;
  splitPercentage: number;
  fairSharePerPartner: number;
  debtor: FleetPartner;
  creditor: FleetPartner;
  amountToTransfer: number;
  summaryText: string;
  isBalanced: boolean;
}
