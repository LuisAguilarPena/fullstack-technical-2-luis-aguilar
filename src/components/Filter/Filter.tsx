import { PAYMENT_STATUSES, type PaymentStatus } from '../../types/payment';

export interface FilterProps {
	value: PaymentStatus | '';
	onStatusChange: (status: PaymentStatus | '') => void;
}

export const Filter = ({ value, onStatusChange }: FilterProps) => (
	<div className="toolbar">
		<label htmlFor="payment-status-filter">Filter by status</label>
		<select
			//? ID is hardcoded, rendering multiple Filter instances would create duplicate IDs. For that reusable case, use React’s useId() to generate a unique ID. 
			id="payment-status-filter"
			value={value}
			onChange={(event) => onStatusChange(event.target.value as PaymentStatus | '')}
		>
			<option value="">All statuses</option>
			{PAYMENT_STATUSES.map((status) => (
				<option key={status} value={status}>{status}</option>
			))}
		</select>
	</div>
);