import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { listPaymentsMock } = vi.hoisted(() => ({ listPaymentsMock: vi.fn() }));

vi.mock('../api/paymentsApi', () => ({ listPayments: listPaymentsMock }));

import { PaymentsListPage } from './PaymentsListPage';

describe('PaymentsListPage pagination', () => {
  beforeEach(() => {
    listPaymentsMock.mockReset();
    listPaymentsMock.mockResolvedValue({
      rows: [],
      page: 0,
      pageSize: 10,
      totalCount: 25,
    });
  });

  it('requests the selected page with ten payments per page', async () => {
    render(<PaymentsListPage />);

    await screen.findByText('Page 1 of 3');
    expect(listPaymentsMock).toHaveBeenNthCalledWith(1, { q: '', page: 0, pageSize: 10 });

    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));

    await waitFor(() => {
      expect(listPaymentsMock).toHaveBeenNthCalledWith(2, { q: '', page: 1, pageSize: 10 });
    });
  });

});