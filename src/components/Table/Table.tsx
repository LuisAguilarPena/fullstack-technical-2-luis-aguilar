import type { PaymentsPage } from "../../pages/PaymentsListPage";
import { Pagination } from "../Pagination/Pagination";
import { Row } from "../Row/Row";

export interface TableProps {
	TableHeaders: string[];
	paymentData: PaymentsPage;
	currentPage: number;
	onPageChange: (page: number) => void;
}

export const Table = ({
	TableHeaders,
	paymentData,
	currentPage,
	onPageChange,
}: TableProps) => {
  const totalPages = Math.ceil(paymentData.totalCount / paymentData.pageSize);

  return (
		<>
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
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={onPageChange}
			/>
		</>
	)
};
