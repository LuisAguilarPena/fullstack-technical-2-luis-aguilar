import { Table } from '../components/Table/Table'
import { useEffect, useState } from 'react';
import { listPayments } from '../api/paymentsApi';

// constant for the Table headers, with a large amout of constants it is worth moving them to their own folder
export const TABLE_HEADERS = ['Reference', 'Counterparty', 'Amount', 'Status', 'Created']; 

// Type for the payments page data returned by the API
export type PaymentsPage = Awaited<ReturnType<typeof listPayments>>;

// handler to fetch the payments data from the API
async function listPaymentsHandler(page: number): Promise<PaymentsPage> {
  // hardcoding the page size to 10 for simplicity, but similarly to page this can be made configurable
  return await listPayments({ page, pageSize: 10 });
}

export const PaymentsListPage = () => {
  // Established state variables to hold the payments and page data fetched from the API
  // this way we can keep track of the payments data and re-render the components when it changes
  const [payments, setPayments] = useState<PaymentsPage | null>(null);
  // inferred type will be number, no need to explicitly declare it
  const [page, setPage] = useState(0);

  // Effect to fetch payments data whenever the page changes
  // In production, this can be replaced with a more sophisticated data fetching strategy, such as React Query
  useEffect(() => {
    let isCurrentRequest = true;

    const fetchPayments = async () => {
      // setPayments with the fetched payments data
      const result = await listPaymentsHandler(page);
      if (isCurrentRequest) setPayments(result);
    };
    fetchPayments();
    return () => { // clean up the current request flag to prevent setting state on an unmounted component
      isCurrentRequest = false;
    };
  }, [page]); // whenever page changes we re-fetch the payments data with the new page number

  return (
    <section>
      <h2>Payment queue</h2>
      {payments ? (
        <Table
          TableHeaders={TABLE_HEADERS}
          paymentData={payments}
          currentPage={page}
          onPageChange={setPage}
        />
      ) : (
        <p>Loading payments...</p>
      )}
    </section>
  );
};
