import { PAYMENT_STATUSES } from '../types/payment';
import { useEffect } from 'react';

export interface TableProps {
	reference?: string,
	counterparty?: string,
	amount?: number,
	status?: (typeof PAYMENT_STATUSES)[number],
	created?: string,
}

export const Table = ({
	reference = '', 
	counterparty = '', 
	amount = 0, 
	status = 'PENDING', 
	created = '',
}: TableProps) => {
	useEffect(() => {
		console.log('Table component mounted or updated', { reference, counterparty, amount, status, created });
	}, [reference, counterparty, amount, status, created]);
  return (
		<table>
			<thead>
				<tr>
					<th scope="col">Reference</th>
					<th scope="col">Counterparty</th>
					<th scope="col">Amount</th>
					<th scope="col">Status</th>
					<th scope="col">Created</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th scope="row">INV-2026-0454</th>
					<td>Sunbelt Fabrication</td>
					<td>22</td>
					<td>PENDING</td>
					<td>1753484365435</td>
				</tr>
			</tbody>
		</table>
	)
};
