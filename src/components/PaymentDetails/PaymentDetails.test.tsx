import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Payment } from '../../types/payment';
import { PaymentDetails } from './PaymentDetails';

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

describe('PaymentDetails', () => {
	it('renders all common payment fields, including null values', () => {
		render(<PaymentDetails payment={payment} />);

		[
			'payment-1',
			'INV-2026-0454',
			'Sunbelt Fabrication',
			'US',
			'$1,250.00',
			'USD',
			'PENDING',
			'2026-10-07T12:00:00Z',
			'Not settled',
			'None',
		].forEach((value) => expect(screen.getByText(value)).toBeInTheDocument());
	});
});