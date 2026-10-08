import type { CurrencyCode } from '../types/payment';
import { amountMinorAdjustment } from './amountMinorAdjustment';

// leverage Intl.NumberFormat constructor to add the currency formatting for display purposes
//? https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
export const formatPaymentAmount = (amountMinor: number, currency: CurrencyCode) =>
	new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(
		amountMinorAdjustment(amountMinor, currency),
);