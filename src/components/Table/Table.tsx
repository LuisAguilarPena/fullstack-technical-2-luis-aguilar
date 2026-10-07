import { PaymentsPage } from "../../pages/PaymentsListPage";
import { Row } from "../Row/Row";

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
						<th scope="col" key={header}>
							{header}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{paymentData.rows.map((payment) => (
					// Using the payment id as a key to uniquely identify each table row with the unique key react can efficiently update and re-render the table rows when the data changes. This is under the assumption that each payment has a unique id, otherwise we would need to use a different unique identifier or fallback for the key.
					<Row key={payment.id} payment={payment} />
				))}
			</tbody>
		</table>
	)
};
