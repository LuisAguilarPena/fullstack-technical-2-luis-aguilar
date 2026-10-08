import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { PaymentMethod } from '../../types/payment';
import { PaymentMethodFields } from './PaymentMethodFields';

const paymentMethods: { name: string; method: PaymentMethod; expectedValues: string[] }[] = [
	{
		name: 'ACH',
		method: { kind: 'ach', accountLast4: '1234', routingNumber: '021000021', secCode: 'CCD' },
		expectedValues: ['1234', '021000021', 'CCD'],
	},
	{
		name: 'wire',
		method: { kind: 'wire', swiftBic: 'BOFAUS3N', correspondentBank: null, intermediaryFeeMinor: 250 },
		expectedValues: ['BOFAUS3N', 'Not provided', '$2.50'],
	},
	{
		name: 'SEPA',
		method: { kind: 'sepa', iban: 'GB82WEST12345698765432', creditorId: null, mandateSignedAt: '2026-01-15T00:00:00Z' },
		expectedValues: ['GB82WEST12345698765432', 'Not provided', '2026-01-15T00:00:00Z'],
	},
	{
		name: 'stablecoin',
		method: { kind: 'stablecoin', network: 'ethereum', asset: 'USDC', txHash: null, confirmations: 12 },
		expectedValues: ['ethereum', 'USDC', 'Not available', '12'],
	},
];

describe('PaymentMethodFields', () => {
	it.each(paymentMethods)('renders the $name rail fields', ({ method, expectedValues }) => {
		render(
			<dl>
				<PaymentMethodFields method={method} currency="USD" />
			</dl>,
		);

		expectedValues.forEach((value) => expect(screen.getByText(value)).toBeInTheDocument());
	});
});