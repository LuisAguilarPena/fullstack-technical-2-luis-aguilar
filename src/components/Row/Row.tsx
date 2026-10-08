import type { Payment } from "../../types/payment";
import { generatePath, Link } from "react-router-dom";
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
			<td className="reference">
				<Link className="cellLink" to={generatePath('/payments/:paymentId', { paymentId: payment.id })}>
					{payment.reference}
				</Link>
			</td>
			<td className="counterparty">
				<Link className="cellLink" to={generatePath('/payments/:paymentId', { paymentId: payment.id })}>
					{payment.counterpartyName}
				</Link>
			</td>
			<td className="amount_value">
				<Link className="cellLink" to={generatePath('/payments/:paymentId', { paymentId: payment.id })}>
					{formattedAmount}
				</Link>
			</td>
			<td className="status">
				<Link className="cellLink" to={generatePath('/payments/:paymentId', { paymentId: payment.id })}>
					{payment.status}
				</Link>
			</td>
			<td className="created">
				<Link className="cellLink" to={generatePath('/payments/:paymentId', { paymentId: payment.id })}>
					{payment.createdAt}
				</Link>
			</td>
		</tr>
	);
};
