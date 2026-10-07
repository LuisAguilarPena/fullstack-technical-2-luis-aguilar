import { useParams } from 'react-router-dom';

export const PaymentDetailPage = () => {
  const { paymentId } = useParams<{ paymentId: string }>();

  return (
    <section>
      <h2>Payment detail</h2>
      <p className="placeholder">Nothing here yet — this is yours to build. Route param: {paymentId}</p>
    </section>
  );
};
