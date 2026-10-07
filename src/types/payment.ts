/** Currencies present in the dataset. They do not all have two decimal places. */
export const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'BHD'] as const;
export type CurrencyCode = (typeof CURRENCIES)[number];

export const PAYMENT_STATUSES = [
  'PENDING',
  'SCREENING',
  'FUNDED',
  'SENT',
  'SETTLED',
  'FAILED',
  'RETURNED',
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

/**
 * How the money moves. Each rail carries its own identifiers — there is no field
 * every rail has beyond `kind`.
 */
export type PaymentMethod =
  | {
      kind: 'ach';
      accountLast4: string;
      routingNumber: string;
      secCode: 'CCD' | 'PPD' | 'WEB';
    }
  | {
      kind: 'wire';
      swiftBic: string;
      correspondentBank: string | null;
      intermediaryFeeMinor: number;
    }
  | {
      kind: 'sepa';
      iban: string;
      creditorId: string | null;
      mandateSignedAt: string;
    }
  | {
      kind: 'stablecoin';
      network: 'ethereum' | 'solana' | 'polygon';
      asset: 'USDC' | 'USDT';
      txHash: string | null;
      confirmations: number;
    };

export interface Payment {
  id: string;
  /** Customer-facing reference, e.g. INV-2026-0042. Not unique. */
  reference: string;
  counterpartyName: string;
  /** ISO 3166-1 alpha-2. */
  counterpartyCountry: string;
  /** Amount in the currency's **minor units** (e.g. 125000 USD = $1,250.00). */
  amountMinor: number;
  currency: CurrencyCode;
  status: PaymentStatus;
  /** ISO 8601, UTC. */
  createdAt: string;
  /** ISO 8601, UTC. Null until the payment settles. */
  settledAt: string | null;
  method: PaymentMethod;
  /** Present only on FAILED and RETURNED payments. */
  failureReason: string | null;
}
