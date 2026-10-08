//? The logic in this page component revolves around fetching and manipulating data and managing the state for the nested components. This pattern leaves the responsibility of only rendering the UI to the nested components. This can help keep the components modular and easier to maintain, but at the cost of a more complex page component.

import { Table } from '../components/Table/Table'
import { Search } from '../components/Search/Search';
import { Filter } from '../components/Filter/Filter';
import { useEffect, useRef, useState } from 'react';
import { listPayments, type SortDirection } from '../api/paymentsApi';
import type { PaymentStatus } from '../types/payment';

//TODO constant for the Table headers, with a large amout of constants it is worth moving them to their own folder
export const TABLE_HEADERS = ['Reference', 'Counterparty', 'Amount', 'Status', 'Created']; 

// Type for the payments page data returned by the API
export type PaymentsPage = Awaited<ReturnType<typeof listPayments>>;

// handler to fetch the payments data from the API
async function listPaymentsHandler(
  page: number,
  query: string,
  status: PaymentStatus | '',
  // Sort direction for the counterparty column, can be 'asc', 'desc', or null for no sorting
  counterpartySort: SortDirection | null,
): Promise<PaymentsPage> {
  //TODO hardcoding the page size to 10 for simplicity, but similarly to page this can be made configurable
  const params = {
    q: query,
    page,
    pageSize: 10,
    //? The spread is a concise way to omit the status property entirely when “All statuses” is selected.
    ...(status ? { status } : {}),
  };
  if (counterpartySort) {
    return listPayments({
      ...params,
      sort: 'counterpartyName',
      direction: counterpartySort,
    });
  }
  return listPayments(params);
}

export const PaymentsListPage = () => {
  //? Established state variables to hold the payments and page data fetched from the API this way we can keep track of the payments data and re-render the components when it changes
  const [payments, setPayments] = useState<PaymentsPage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [counterpartySort, setCounterpartySort] = useState<SortDirection | null>(null);
  const [status, setStatus] = useState<PaymentStatus | ''>('');
  // inferred types below, no need to explicitly declare them
  const [page, setPage] = useState(0);
  //TODO other improvements to the search experience can be: adding a clear button, sanitizing input, highlighting matches, etc.
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => () => {
    if (searchDebounce.current !== null) clearTimeout(searchDebounce.current);
  }, []);

  // Effect to fetch payments data whenever the page changes
  //? In production, this can be replaced with a more sophisticated data fetching strategy, such as React Query
  useEffect(() => {
    let isCurrentRequest = true;

    const fetchPayments = async () => {
      try {
        const result = await listPaymentsHandler(page, searchQuery, status, counterpartySort);
        if (isCurrentRequest) {
          setPayments(result);
          setError(null);
        }
      } catch (error) {
        if (isCurrentRequest) {
          setError(error instanceof Error ? error.message : 'Failed to fetch payments.');
          console.error('Failed to fetch payments:', error);
        }
      }
    };
    void fetchPayments();
    return () => { // clean up the current request flag to prevent setting state on an unmounted component
      isCurrentRequest = false;
    };
  }, [page, searchQuery, status, counterpartySort]); // page, search, filter, or sort changes trigger a new request

  const handleSearchChange = (query: string) => {
    setSearchInput(query); //? Update the local search input state immediately for a responsive UI, while the actual search query is debounced to prevent excessive API calls.
    if (searchDebounce.current !== null) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      setSearchQuery(query);
      setPage(0);
    }, 200);
  };

  const handleCounterpartySort = () => {
    setCounterpartySort((currentSort) =>
      // order is A-Z -> Z-A -> unsorted
      currentSort === 'asc' ? 'desc' : currentSort === 'desc' ? null : 'asc',
    );
    setPage(0);
  };

  const handleStatusChange = (nextStatus: PaymentStatus | '') => {
    setStatus(nextStatus);
    setPage(0);
  };

  return (
    <section>
      <h2>Payment queue</h2>
      <Search value={searchInput} onSearchChange={handleSearchChange} />
      <Filter value={status} onStatusChange={handleStatusChange} />
      {error ? (
        <p className="state error" role="alert">{error}</p>
      ) : payments === null ? (
        <p>Loading payments...</p>
      ) : payments.totalCount === 0 ? (
        <p className="state">No payments found.</p>
      ) : (
        <Table
          TableHeaders={TABLE_HEADERS}
          paymentData={payments}
          currentPage={page}
          //TODO a debounce can be added to the onPageChange handler to prevent rapid consecutive requests, similar to the search debounce
          onPageChange={setPage}
          counterpartySort={counterpartySort}
          onCounterpartySort={handleCounterpartySort}
        />
      )}
    </section>
  );
};
