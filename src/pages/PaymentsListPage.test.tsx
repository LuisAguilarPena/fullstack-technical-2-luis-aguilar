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

  it('filters by status and resets pagination to the first page', async () => {
    render(<PaymentsListPage />);

    await screen.findByText('Page 1 of 3');
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    await waitFor(() => {
      expect(listPaymentsMock).toHaveBeenLastCalledWith({ q: '', page: 1, pageSize: 10 });
    });

    fireEvent.change(screen.getByRole('combobox', { name: 'Filter by status' }), {
      target: { value: 'FAILED' },
    });

    await waitFor(() => {
      expect(listPaymentsMock).toHaveBeenLastCalledWith({
        q: '',
        page: 0,
        pageSize: 10,
        status: 'FAILED',
      });
    });
  });

  it('shows an empty state when the fetch returns no payments', async () => {
    listPaymentsMock.mockResolvedValueOnce({
      rows: [],
      page: 0,
      pageSize: 10,
      totalCount: 0,
    });

    render(<PaymentsListPage />);

    expect(await screen.findByText('No payments found.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('shows an error state when fetching payments fails', async () => {
    const error = new Error('Unable to load payments');
    listPaymentsMock.mockRejectedValueOnce(error);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<PaymentsListPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load payments');
    expect(errorSpy).toHaveBeenCalledWith('Failed to fetch payments:', error);
    errorSpy.mockRestore();
  });

});