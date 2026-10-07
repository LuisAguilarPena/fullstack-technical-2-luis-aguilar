import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { listPaymentsMock } = vi.hoisted(() => ({ listPaymentsMock: vi.fn() }));

vi.mock('../../api/paymentsApi', () => ({ listPayments: listPaymentsMock }));

import { PaymentsListPage } from '../../pages/PaymentsListPage';

describe('Search', () => {
  beforeEach(() => {
    listPaymentsMock.mockReset();
    listPaymentsMock.mockResolvedValue({
      rows: [],
      page: 0,
      pageSize: 10,
      totalCount: 25,
    });
  });

  it('searches with q and resets pagination to the first page', async () => {
    render(<PaymentsListPage />);

    await screen.findByText('Page 1 of 3');
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    await waitFor(() => {
      expect(listPaymentsMock).toHaveBeenLastCalledWith({ q: '', page: 1, pageSize: 10 });
    });

    const searchInput = screen.getByRole('searchbox', { name: 'Search payments' });
    fireEvent.change(searchInput, {
      target: { value: 'nor' },
    });
    fireEvent.change(searchInput, {
      target: { value: 'sunbelt' },
    });

    expect(searchInput).toHaveValue('sunbelt');
    expect(listPaymentsMock).toHaveBeenLastCalledWith({ q: '', page: 1, pageSize: 10 });

    await waitFor(() => {
      expect(listPaymentsMock).toHaveBeenLastCalledWith({
        q: 'sunbelt',
        page: 0,
        pageSize: 10,
      });
    });
  });
});