import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import type { Payment } from '../types/payment';

const { getPaymentMock } = vi.hoisted(() => ({ getPaymentMock: vi.fn() }));

vi.mock('../api/paymentsApi', () => ({ getPayment: getPaymentMock }));

import { PaymentDetailPage } from './PaymentDetailPage';

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

describe('PaymentDetailPage', () => {
  beforeEach(() => {
    getPaymentMock.mockReset();
    getPaymentMock.mockResolvedValue(payment);
  });

  it('fetches the payment from the route parameter and renders the response', async () => {
    render(
      <MemoryRouter initialEntries={['/payments/payment-1']}>
        <Routes>
          <Route path="/payments/:paymentId" element={<PaymentDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /back to payments/i }))
      .toHaveAttribute('href', '/payments');

    await waitFor(() => {
      expect(getPaymentMock).toHaveBeenCalledWith('payment-1');
    });
    expect(screen.getByText('Sunbelt Fabrication')).toBeInTheDocument();
    expect(screen.getByText('021000021')).toBeInTheDocument();
  });
});