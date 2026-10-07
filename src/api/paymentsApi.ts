import rawPayments from '../data/payments.json';
import type { Payment, PaymentStatus } from '../types/payment';

const PAYMENTS = rawPayments as Payment[];

/** Columns the API knows how to sort on. */
export const SORTABLE_FIELDS = ['createdAt', 'amountMinor', 'counterpartyName', 'status'] as const;
export type SortField = (typeof SORTABLE_FIELDS)[number];
export type SortDirection = 'asc' | 'desc';

export interface ListPaymentsParams {
  /** Free-text match on reference and counterparty name. */
  q?: string;
  status?: PaymentStatus;
  sort?: SortField;
  direction?: SortDirection;
  /** Zero-based. */
  page?: number;
  pageSize?: number;
}

export interface PaymentsPage {
  rows: Payment[];
  page: number;
  pageSize: number;
  /** Total matching the filter, across all pages. */
  totalCount: number;
}

/** Stands in for a real network. Latency varies, the way a real one does. */
const latency = () => new Promise((resolve) => setTimeout(resolve, 120 + Math.random() * 780));

export class PaymentNotFoundError extends Error {
  constructor(public readonly paymentId: string) {
    super(`No payment with id ${paymentId}`);
    this.name = 'PaymentNotFoundError';
  }
}

const matchesQuery = (payment: Payment, q: string) => {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return (
    payment.reference.toLowerCase().includes(needle) ||
    payment.counterpartyName.toLowerCase().includes(needle)
  );
};

const compare = (a: Payment, b: Payment, field: SortField) => {
  const left = a[field];
  const right = b[field];
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  return String(left).localeCompare(String(right));
};

/**
 * Lists payments. Filtering, sorting and pagination all happen here, but every
 * parameter is optional — called with no arguments it returns the whole set.
 */
export const listPayments = async (params: ListPaymentsParams = {}): Promise<PaymentsPage> => {
  await latency();

  const { q = '', status, sort, direction = 'desc', page = 0, pageSize = 1000 } = params;

  let rows = PAYMENTS.filter((payment) => matchesQuery(payment, q));
  if (status) rows = rows.filter((payment) => payment.status === status);

  if (sort) {
    const factor = direction === 'asc' ? 1 : -1;
    rows = [...rows].sort((a, b) => compare(a, b, sort) * factor);
  }

  const totalCount = rows.length;
  const start = page * pageSize;

  return { rows: rows.slice(start, start + pageSize), page, pageSize, totalCount };
};

export const getPayment = async (paymentId: string): Promise<Payment> => {
  await latency();

  const payment = PAYMENTS.find((candidate) => candidate.id === paymentId);
  if (!payment) throw new PaymentNotFoundError(paymentId);
  return payment;
};
