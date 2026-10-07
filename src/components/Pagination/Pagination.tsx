export interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => (
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
);