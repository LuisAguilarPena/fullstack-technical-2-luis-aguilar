import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Payment } from '../../types/payment';
import { Row } from './Row';

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

describe('Row', () => {
  it('renders the five payment cells in order', () => {
    render(
      <table>
        <tbody>
          <Row payment={payment} />
        </tbody>
      </table>,
    );

    const cells = within(screen.getByRole('row')).getAllByRole('cell');

    expect(cells).toHaveLength(5);
    expect(cells[0]).toHaveTextContent(/^INV-2026-0454$/);
    expect(cells[1]).toHaveTextContent(/^Sunbelt Fabrication$/);
    expect(cells[2]).toHaveTextContent(/^125000$/);
    expect(cells[3]).toHaveTextContent(/^PENDING$/);
    expect(cells[4]).toHaveTextContent(/^2026-10-07T12:00:00Z$/);
  });
});