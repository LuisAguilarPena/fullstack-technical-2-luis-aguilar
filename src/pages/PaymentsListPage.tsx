import { Table } from '../components/table'
import { useEffect } from 'react';
import { listPayments } from '../api/paymentsApi';

async function listPaymentsHandler() {
  console.log('-->', await listPayments()) 
}

export const PaymentsListPage = () => {
  useEffect(() => {
    listPaymentsHandler();
  }, [])

  return (
    <section>
      <h2>Payment queue</h2>
      <Table/>
    </section>
  );
};
