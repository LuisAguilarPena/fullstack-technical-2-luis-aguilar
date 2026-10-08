import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPayment } from '../api/paymentsApi';

export const PaymentDetailPage = () => {
  const { paymentId } = useParams<{ paymentId: string }>();

  useEffect(() => {
    if (!paymentId) return;

    let isCurrentRequest = true;
    const fetchPayment = async () => {
      try {
        const payment = await getPayment(paymentId);
        if (isCurrentRequest) console.log('Fetched payment:', payment);
      } catch (error) {
        if (isCurrentRequest) console.error('Failed to fetch payment:', error);
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
      <p className="placeholder">
        Nothing here yet — this is yours to build. Route param: {paymentId}
      </p>
      <Link className="backLink" to="/payments">← Back to payments</Link>
    </section>
  );
};
