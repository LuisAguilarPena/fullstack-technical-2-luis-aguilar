import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PAYMENT_STATUSES } from '../../types/payment';
import { Filter } from './Filter';

describe('Filter', () => {
	it('offers every payment status plus an unfiltered option', () => {
		const onStatusChange = vi.fn();
		render(<Filter value="" onStatusChange={onStatusChange} />);

		const options = screen.getAllByRole('option');
		expect(options).toHaveLength(PAYMENT_STATUSES.length + 1);
		expect(options[0]).toHaveTextContent('All statuses');
		PAYMENT_STATUSES.forEach((status) => {
			expect(screen.getByRole('option', { name: status })).toBeInTheDocument();
		});
	});

	it('reports the selected status', () => {
		const onStatusChange = vi.fn();
		render(<Filter value="" onStatusChange={onStatusChange} />);

		fireEvent.change(screen.getByRole('combobox', { name: 'Filter by status' }), {
			target: { value: 'FAILED' },
		});

		expect(onStatusChange).toHaveBeenCalledWith('FAILED');
	});
});