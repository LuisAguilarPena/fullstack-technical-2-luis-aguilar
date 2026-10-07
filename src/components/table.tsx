import { PaymentsPage } from "../pages/PaymentsListPage";

export interface TableProps {
	TableHeaders: string[];
	paymentData: PaymentsPage;
}

export const Table = ({
	TableHeaders,
	paymentData,
}: TableProps) => {

  return (
		<table>
			<thead>
				<tr>
					{TableHeaders.map((header) => (
						// using the TableHeaders prop to dynamically generate table headers
						// passing header string as a key to uidquely identify each table header element
						// this ensures that each header element is uniquely identifiable by React
						// this is important for performance and avoiding potential issues with React's reconciliation process, we can use a different unique identifier if needed
						<th scope="col" key={header}>
							{header}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{paymentData.rows.map((payment) => (
					// using the payment reference as a key to uniquely identify each table row
					// with the unique key react can efficiently update and re-render the table rows when the data changes
					<tr key={payment.reference}>
						<td className="reference">{payment.reference}</td>
						<td className="counterparty">{payment.counterpartyName}</td>
						<td className="amount_value">{payment.amountMinor}</td>
						<td className="status">{payment.status}</td>
						<td className="created">{payment.createdAt}</td>
					</tr>
				))}
			</tbody>
		</table>
	)
};
