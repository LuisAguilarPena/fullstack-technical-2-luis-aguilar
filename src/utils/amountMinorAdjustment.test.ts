import { describe, expect, it } from 'vitest';

import { amountMinorAdjustment } from './amountMinorAdjustment';

describe('amountMinorAdjustment', () => {
	it.each([
		[125000, 'USD', 1250],
		[24331228, 'EUR', 243312.28],
		[17810010, 'GBP', 178100.1],
		[312006, 'JPY', 312006],
		[263844996, 'BHD', 263844.996],
	] as const)('converts %i minor units from %s to major units', (amountMinor, currency, expected) => {
		expect(amountMinorAdjustment(amountMinor, currency)).toBe(expected);
	});
});