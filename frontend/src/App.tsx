import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';

// Layout
import AppLayout from './components/layout/AppLayout';
import ToastContainer from './components/feedback/ToastContainer';

// Auth Pages
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';

// Borrower Pages
import DashboardPage from './features/borrower/DashboardPage';
import LoanApplicationWizard from './features/borrower/LoanApplicationWizard';
import LoansListPage from './features/borrower/LoansListPage';
import WalletPage from './features/borrower/WalletPage';

// Lender Pages
import MarketplacePage from './features/lender/MarketplacePage';
import PortfolioPage from './features/lender/PortfolioPage';
import AutoInvestPage from './features/lender/AutoInvestPage';

// Admin & Compliance Pages
import UnderwritingPage from './features/admin/UnderwritingPage';
import KYCReviewPage from './features/admin/KYCReviewPage';
import AuditTrailPage from './features/admin/AuditTrailPage';
import PlatformAnalyticsPage from './features/admin/PlatformAnalyticsPage';

// Embedded BNPL Demo
import BNPLCheckoutDemoPage from './features/bnpl/BNPLCheckoutDemoPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Authenticated Application Layout */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Borrower Routes */}
              <Route path="/loans" element={<LoansListPage />} />
              <Route path="/loans/apply" element={<LoanApplicationWizard />} />
              <Route path="/wallet" element={<WalletPage />} />

              {/* Lender Routes */}
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/auto-invest" element={<AutoInvestPage />} />

              {/* Admin & Compliance Routes */}
              <Route path="/admin/underwriting" element={<UnderwritingPage />} />
              <Route path="/admin/kyc" element={<KYCReviewPage />} />
              <Route path="/admin/audit" element={<AuditTrailPage />} />
              <Route path="/admin/analytics" element={<PlatformAnalyticsPage />} />

              {/* Embedded Finance BNPL SDK Showcase */}
              <Route path="/bnpl-demo" element={<BNPLCheckoutDemoPage />} />

              {/* Default Fallback */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>

            {/* Wildcard Catch-All */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          {/* Real-Time Floating Alerts */}
          <ToastContainer />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
