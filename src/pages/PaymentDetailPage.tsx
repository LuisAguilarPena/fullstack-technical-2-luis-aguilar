import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PaymentDetails } from '../components/PaymentDetails/PaymentDetails';
import { getPayment } from '../api/paymentsApi';
import type { Payment } from '../types/payment';

export const PaymentDetailPage = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentId) return;

    let isCurrentRequest = true;
    const fetchPayment = async () => {
      try {
        const result = await getPayment(paymentId);
        if (isCurrentRequest) {
          setPayment(result);
        }
      } catch (error) {
        if (isCurrentRequest) {
          setError(error instanceof Error ? error.message : 'Failed to fetch payment.');
          console.error('Failed to fetch payment:', error);
        }
      }
    };

    void fetchPayment();
    return () => {
      isCurrentRequest = false;
    };
  }, [paymentId]);

  return (
    <section>
      <h2>Payment detail</h2>
      {error ? ( // using ternary operator to conditionally render error, payment details, or loading state
        <p className="state error" role="alert">{error}</p>
      ) : payment ? (
        <PaymentDetails payment={payment} />
      ) : (
        <p className="state">Loading payment...</p>
      )}
      {/* We can embellish this Link and make it a button or add an icon for better UX */}
      <Link className="backLink" to="/payments">← Back to payments</Link>
    </section>
  );
};
