import type { Payment } from "../../types/payment";
import { generatePath, Link } from "react-router-dom";
import { formatPaymentAmount } from "../../utils/formatPaymentAmount";

export interface RowProps {
	payment: Payment;
}

export const Row = ({ payment }: RowProps) => {
	const formattedAmount = formatPaymentAmount(payment.amountMinor, payment.currency);

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
					{payment.createdAt.slice(0, -5)}
				</Link>
			</td>
		</tr>
	);
};
