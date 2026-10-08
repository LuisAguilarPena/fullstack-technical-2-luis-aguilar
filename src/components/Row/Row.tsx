import type { Payment } from "../../types/payment";
import { amountMinorAdjustment } from "../../utils/amountMinorAdjustment";

export interface RowProps {
	payment: Payment;
}

export const Row = ({ payment }: RowProps) => {
	const amount = amountMinorAdjustment(payment.amountMinor, payment.currency);
	// leverage Intl.NumberFormat constructor to add the currency formatting for display purposes
	//? https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
	const formattedAmount = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: payment.currency,
	}).format(amount);

	return (
		<tr>
			<td className="reference">{payment.reference}</td>
			<td className="counterparty">{payment.counterpartyName}</td>
			<td className="amount_value">{formattedAmount}</td>
			<td className="status">{payment.status}</td>
			<td className="created">{payment.createdAt}</td>
		</tr>
	);
};
