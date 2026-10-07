export interface SearchProps {
	value: string;
	onSearchChange: (value: string) => void;
}

//? Like most forms on React this is a controlled form component, meaning the input value is driven by React state
export const Search = ({ value, onSearchChange }: SearchProps) => (
	<div className="toolbar">
		<label htmlFor="payment-search">Search payments</label>
		<input
			id="payment-search" //? under the assumption that only one search input exists on the page
			type="search"
			value={value}
			onChange={(event) => onSearchChange(event.target.value)}
		/>
	</div>
);