import type { Payment } from '../../types/payment';
import { DetailField } from '../DetailField/DetailField';
import { PaymentMethodFields } from '../PaymentMethodFields/PaymentMethodFields';
import { formatPaymentAmount } from '../../utils/formatPaymentAmount';

interface PaymentDetailsProps {
	payment: Payment;
}


export const PaymentDetails = ({ payment }: PaymentDetailsProps) => (
	<div>
		<section className="panel" aria-labelledby="payment-details-heading">
			<h3 id="payment-details-heading">Payment</h3>
			<dl className="fields">
				<DetailField label="Payment ID" value={payment.id} />
				<DetailField label="Reference" value={payment.reference} />
				<DetailField label="Counterparty" value={payment.counterpartyName} />
				<DetailField label="Counterparty country" value={payment.counterpartyCountry} />
				<DetailField label="Amount" value={formatPaymentAmount(payment.amountMinor, payment.currency)} />
				<DetailField label="Currency" value={payment.currency} />
				<DetailField label="Status" value={payment.status} />
				<DetailField
					label="Created at"
					value={<time dateTime={payment.createdAt}>{payment.createdAt.slice(0, -5)}</time>}
				/>
				<DetailField
					label="Settled at"
					value={payment.settledAt
						? <time dateTime={payment.settledAt}>{payment.settledAt.slice(0, -5)}</time>
						: 'Not settled'}
				/>
				<DetailField label="Failure reason" value={payment.failureReason ?? 'None'} />
			</dl>
		</section>
		<section className="panel" aria-labelledby="payment-method-heading">
			<h3 id="payment-method-heading">Payment method</h3>
			<dl className="fields">
				<DetailField label="Rail" value={payment.method.kind.toUpperCase()} />
				<PaymentMethodFields method={payment.method} currency={payment.currency} />
			</dl>
		</section>
	</div>
);