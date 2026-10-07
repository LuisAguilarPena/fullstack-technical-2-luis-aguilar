import type { PaymentsPage } from "../../pages/PaymentsListPage";
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
			<div className="pagination" aria-label="Payment pagination">
				<button
					type="button"
					aria-label="Previous page"
					disabled={currentPage === 0}
					onClick={() => onPageChange(currentPage - 1)}
				>
					←
				</button>
				<span>Page {totalPages === 0 ? 0 : currentPage + 1} of {totalPages}</span>
				<button
					type="button"
					aria-label="Next page"
					disabled={currentPage + 1 >= totalPages}
					onClick={() => onPageChange(currentPage + 1)}
				>
					→
				</button>
			</div>
		</>
	)
};
