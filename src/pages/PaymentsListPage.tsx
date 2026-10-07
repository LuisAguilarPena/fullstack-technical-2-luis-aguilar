import { Table } from '../components/Table/Table'
import { useEffect, useState } from 'react';
import { listPayments } from '../api/paymentsApi';

// constant for the Table headers, with a large amout of constants it is worth moving them to their own folder
export const TABLE_HEADERS = ['Reference', 'Counterparty', 'Amount', 'Status', 'Created']; 

// Type for the payments page data returned by the API
export type PaymentsPage = Awaited<ReturnType<typeof listPayments>>;

// handler to fetch the payments data from the API
async function listPaymentsHandler(): Promise<PaymentsPage> {
  return await listPayments({page: 0, pageSize: 10});
}

export const PaymentsListPage = () => {
  // Established a state variable to hold the payments data fetched from the API
  // this way we can keep track of the payments data and re-render the components when it changes
  const [payments, setPayments] = useState<PaymentsPage | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      // setPayments with the fetched payments data
      setPayments(await listPaymentsHandler());
    };
    fetchPayments();
  }, [])

  useEffect(() => {
    console.log('Payments state updated:', payments);
  }, [payments]);

  return (
    <section>
      <h2>Payment queue</h2>
      {payments ? (
        <Table TableHeaders={TABLE_HEADERS} paymentData={payments} />
      ) : (
        <p>Loading payments...</p>
      )}
    </section>
  );
};
