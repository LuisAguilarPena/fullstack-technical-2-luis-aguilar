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

  it('cycles counterparty sorting from A-Z to Z-A to unsorted', async () => {
    render(<PaymentsListPage />);

    await screen.findByText('Page 1 of 3');
    fireEvent.click(screen.getByRole('button', { name: 'Sort counterparty A to Z' }));
    await waitFor(() => {
      expect(listPaymentsMock).toHaveBeenLastCalledWith({
        q: '',
        page: 0,
        pageSize: 10,
        sort: 'counterpartyName',
        direction: 'asc',
      });
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sort counterparty Z to A' }));
    await waitFor(() => {
      expect(listPaymentsMock).toHaveBeenLastCalledWith({
        q: '',
        page: 0,
        pageSize: 10,
        sort: 'counterpartyName',
        direction: 'desc',
      });
    });

    fireEvent.click(screen.getByRole('button', { name: 'Clear counterparty sorting' }));
    await waitFor(() => {
      expect(listPaymentsMock).toHaveBeenLastCalledWith({ q: '', page: 0, pageSize: 10 });
    });
    expect(screen.getByRole('columnheader', { name: /Counterparty/ }))
      .not.toHaveAttribute('aria-sort');
  });

});