import type { CurrencyCode, PaymentMethod } from '../../types/payment';
import { DetailField } from '../DetailField/DetailField';
import { formatPaymentAmount } from '../../utils/formatPaymentAmount';

export interface PaymentMethodFieldsProps {
	method: PaymentMethod;
	currency: CurrencyCode;
}


export const PaymentMethodFields = ({ method, currency }: PaymentMethodFieldsProps) => {
	switch (method.kind) {
		case 'ach':
			return (
				<>
					<DetailField label="Account last 4" value={method.accountLast4} />
					<DetailField label="Routing number" value={method.routingNumber} />
					<DetailField label="SEC code" value={method.secCode} />
				</>
			);
		case 'wire':
			return (
				<>
					<DetailField label="SWIFT/BIC" value={method.swiftBic} />
					<DetailField label="Correspondent bank" value={method.correspondentBank ?? 'Not provided'} />
					<DetailField label="Intermediary fee" value={formatPaymentAmount(method.intermediaryFeeMinor, currency)} />
				</>
			);
		case 'sepa':
			return (
				<>
					<DetailField label="IBAN" value={method.iban} />
					<DetailField label="Creditor ID" value={method.creditorId ?? 'Not provided'} />
					<DetailField label="Mandate signed at" value={method.mandateSignedAt} />
				</>
			);
		case 'stablecoin':
			return (
				<>
					<DetailField label="Network" value={method.network} />
					<DetailField label="Asset" value={method.asset} />
					<DetailField label="Transaction hash" value={method.txHash ?? 'Not available'} />
					<DetailField label="Confirmations" value={method.confirmations} />
				</>
			);
		default: {
			const exhaustiveMethod: never = method;
			return exhaustiveMethod;
		}
	}
};