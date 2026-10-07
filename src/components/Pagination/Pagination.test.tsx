import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('navigates between pages and disables arrows at the boundaries', () => {
    const onPageChange = vi.fn();
    const { rerender } = render(
      <Pagination currentPage={0} totalPages={3} onPageChange={onPageChange} />,
    );

    const previousButton = screen.getByRole('button', { name: 'Previous page' });
    const nextButton = screen.getByRole('button', { name: 'Next page' });
    expect(previousButton).toBeDisabled();
    expect(nextButton).toBeEnabled();
    fireEvent.click(nextButton);
    expect(onPageChange).toHaveBeenCalledWith(1);

    rerender(
      <Pagination currentPage={2} totalPages={3} onPageChange={onPageChange} />,
    );
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });
});