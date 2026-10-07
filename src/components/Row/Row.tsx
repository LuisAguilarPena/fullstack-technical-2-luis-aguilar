import type { Payment } from "../../types/payment";

export interface RowProps {
	payment: Payment;
}

export const Row = ({ payment }: RowProps) => {
	return (
		<tr>
			<td className="reference">{payment.reference}</td>
			<td className="counterparty">{payment.counterpartyName}</td>
			<td className="amount_value">{payment.amountMinor}</td>
			<td className="status">{payment.status}</td>
			<td className="created">{payment.createdAt}</td>
		</tr>
	);
};
