import { describe, expect, it } from 'vitest';

import { getPayment, listPayments, PaymentNotFoundError } from './paymentsApi';

describe('listPayments', () => {
  it('returns every payment when called with no parameters', async () => {
    const { rows, totalCount } = await listPayments();

    expect(rows.length).toBeGreaterThan(800);
    expect(rows).toHaveLength(totalCount);
  });

  it('filters on reference and counterparty name together', async () => {
    const { rows } = await listPayments({ q: 'nordwind' });

    expect(rows.length).toBeGreaterThan(0);
    rows.forEach((payment) => {
      expect(payment.counterpartyName.toLowerCase()).toContain('nordwind');
    });
  });

  it('paginates, reporting the total across all pages', async () => {
    const firstPage = await listPayments({ sort: 'createdAt', pageSize: 25, page: 0 });
    const secondPage = await listPayments({ sort: 'createdAt', pageSize: 25, page: 1 });

    expect(firstPage.rows).toHaveLength(25);
    expect(firstPage.totalCount).toBe(secondPage.totalCount);
    expect(firstPage.rows[0]?.id).not.toBe(secondPage.rows[0]?.id);
  });

  it('sorts ascending by amount when asked to', async () => {
    const { rows } = await listPayments({ sort: 'amountMinor', direction: 'asc', pageSize: 10 });

    const amounts = rows.map((payment) => payment.amountMinor);
    expect(amounts).toEqual([...amounts].sort((a, b) => a - b));
  });
});

describe('getPayment', () => {
  it('resolves a payment by id', async () => {
    const { rows } = await listPayments({ pageSize: 1 });
    const expected = rows[0]!;

    await expect(getPayment(expected.id)).resolves.toEqual(expected);
  });

  it('rejects with PaymentNotFoundError for an unknown id', async () => {
    await expect(getPayment('pay_does_not_exist')).rejects.toBeInstanceOf(PaymentNotFoundError);
  });
});
