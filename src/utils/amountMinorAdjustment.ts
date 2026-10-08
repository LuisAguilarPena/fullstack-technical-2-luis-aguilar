import type { CurrencyCode } from '../types/payment';

//? this function can throw if the currency code is invalid or not supported by Intl.NumberFormat constructor, instead of silently applying potentially incorrect scaling. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
export const amountMinorAdjustment = (amountMinor: number, currency: CurrencyCode): number => {
	const { minimumFractionDigits, maximumFractionDigits } = new Intl.NumberFormat(undefined, {
		style: 'currency',
		currency,
	}).resolvedOptions();
	if (
		minimumFractionDigits === undefined ||
		maximumFractionDigits === undefined ||
		minimumFractionDigits !== maximumFractionDigits
	) {
		throw new Error(`Expected matching fraction digits for currency ${currency}`);
	}

	return amountMinor / 10 ** minimumFractionDigits;
};