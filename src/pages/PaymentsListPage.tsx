//? The logic in this page component revolves around fetching and manipulating data and managing the state for the nested components. This pattern leaves the responsibility of only rendering the UI to the nested components. This can help keep the components modular and easier to maintain, but at the cost of a more complex page component.

import { Table } from '../components/Table/Table'
import { Search } from '../components/Search/Search';
import { useEffect, useRef, useState } from 'react';
import { listPayments, type SortDirection } from '../api/paymentsApi';

//TODO constant for the Table headers, with a large amout of constants it is worth moving them to their own folder
export const TABLE_HEADERS = ['Reference', 'Counterparty', 'Amount', 'Status', 'Created']; 

// Type for the payments page data returned by the API
export type PaymentsPage = Awaited<ReturnType<typeof listPayments>>;

// handler to fetch the payments data from the API
async function listPaymentsHandler(
  page: number,
  query: string,
  // Sort direction for the counterparty column, can be 'asc', 'desc', or null for no sorting
  counterpartySort: SortDirection | null,
): Promise<PaymentsPage> {
  //TODO hardcoding the page size to 10 for simplicity, but similarly to page this can be made configurable
  const params = { q: query, page, pageSize: 10 };
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
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  // inferred types below, no need to explicitly declare them
  const [page, setPage] = useState(0);
  const [counterpartySort, setCounterpartySort] = useState<SortDirection | null>(null);
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
      // setPayments with the fetched payments data
      const result = await listPaymentsHandler(page, searchQuery, counterpartySort);
      if (isCurrentRequest) setPayments(result);
    };
    fetchPayments();
    return () => { // clean up the current request flag to prevent setting state on an unmounted component
      isCurrentRequest = false;
    };
  }, [page, searchQuery, counterpartySort]); // page, search, or sort changes trigger a new request

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

  return (
    <section>
      <h2>Payment queue</h2>
      <Search value={searchInput} onSearchChange={handleSearchChange} />
      {payments ? (
        <Table
          TableHeaders={TABLE_HEADERS}
          paymentData={payments}
          currentPage={page}
          //TODO a debounce can be added to the onPageChange handler to prevent rapid consecutive requests, similar to the search debounce
          onPageChange={setPage}
          counterpartySort={counterpartySort}
          onCounterpartySort={handleCounterpartySort}
        />
      ) : (
        <p>Loading payments...</p>
      )}
    </section>
  );
};
