import type { ReactNode } from 'react';

export interface DetailFieldProps {
	label: string;
	value: ReactNode;
}

export const DetailField = ({ label, value }: DetailFieldProps) => (
	<div>
		<dt>{label}</dt>
		<dd>{value}</dd>
	</div>
);