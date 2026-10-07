import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import { PaymentDetailPage } from './pages/PaymentDetailPage';
import { PaymentsListPage } from './pages/PaymentsListPage';

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <HashRouter>
      <header className="appHeader">
        <h1>Payments</h1>
      </header>
      <main className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/payments" replace />} />
          <Route path="/payments" element={<PaymentsListPage />} />
          <Route path="/payments/:paymentId" element={<PaymentDetailPage />} />
        </Routes>
      </main>
    </HashRouter>
  </QueryClientProvider>
);
