import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { Payment } from '../../types/payment';
import { TABLE_HEADERS } from '../../pages/PaymentsListPage';
import { Table } from './Table';

const payment: Payment = {
  id: 'payment-1',
  reference: 'INV-2026-0454',
  counterpartyName: 'Sunbelt Fabrication',
  counterpartyCountry: 'US',
  amountMinor: 125000,
  currency: 'USD',
  status: 'PENDING',
  createdAt: '2026-10-07T12:00:00Z',
  settledAt: null,
  method: {
    kind: 'ach',
    accountLast4: '1234',
    routingNumber: '021000021',
    secCode: 'CCD',
  },
  failureReason: null,
};

const payments: Payment[] = [
  payment,
  { ...payment, id: 'payment-2', counterpartyName: 'Nordwind' },
];

describe('Table', () => {
  it.each([0, 1, 2])('renders %i payment rows without counting the header', (count) => {
    const rows = payments.slice(0, count);
    render(
      <Table
        TableHeaders={TABLE_HEADERS}
        paymentData={{ rows, page: 0, pageSize: 10, totalCount: rows.length }}
        currentPage={0}
        onPageChange={vi.fn()}
      />,
    );

    const table = screen.getByRole('table');
    const [header, body] = within(table).getAllByRole('rowgroup');
    const renderedRows = within(body).queryAllByRole('row');

    expect(within(header).getAllByRole('row')).toHaveLength(1);
    expect(renderedRows).toHaveLength(rows.length);
    rows.forEach((expectedPayment, index) => {
      expect(within(renderedRows[index]).getAllByRole('cell')[1])
        .toHaveTextContent(expectedPayment.counterpartyName);
    });
  });

});