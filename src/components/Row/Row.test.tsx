import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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
  createdAt: '2026-10-07T12:00:00.000Z',
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
    <MemoryRouter>
      <table>
        <tbody>
          <Row payment={payment} />
        </tbody>
      </table>
    </MemoryRouter>,
    );

    const cells = within(screen.getByRole('row')).getAllByRole('cell');

    expect(cells).toHaveLength(5);
    expect(cells[0]).toHaveTextContent(/^INV-2026-0454$/);
    expect(cells[1]).toHaveTextContent(/^Sunbelt Fabrication$/);
    expect(cells[2]).toHaveTextContent('$1,250.00');
    expect(cells[3]).toHaveTextContent(/^PENDING$/);
    expect(cells[4]).toHaveTextContent(/^2026-10-07T12:00:00$/);
    expect(within(screen.getByRole('row')).getAllByRole('link')).toHaveLength(5);
    within(screen.getByRole('row')).getAllByRole('link').forEach((link) => {
      expect(link).toHaveAttribute('href', '/payments/payment-1');
    });
  });

  it.each([
    ['EUR', 24331228, '€243,312.28'],
    ['GBP', 17810010, '£178,100.10'],
    ['JPY', 312006, '¥312,006'],
    ['BHD', 263844996, /BHD\s263,844\.996/],
  ] as const)('formats %s amounts in their currency', (currency, amountMinor, expected) => {
    render(
    <MemoryRouter>
      <table>
        <tbody>
          <Row payment={{ ...payment, currency, amountMinor }} />
        </tbody>
      </table>
    </MemoryRouter>,
    );

    expect(within(screen.getByRole('row')).getAllByRole('cell')[2])
      .toHaveTextContent(expected);
  });
});