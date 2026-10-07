export interface TableProps {
	TableHeaders: string[];
}

export const Table = ({
	TableHeaders,
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
