import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AppShell } from '@/components/layout/AppShell';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import Journal from '@/pages/Journal';
import Analytics from '@/pages/Analytics';
import Login from '@/pages/Login';
import Calendar from '@/pages/Calendar';
import LogTradePage from '@/pages/LogTradePage';
import Mistakes from '@/pages/Mistakes';
import Rules from '@/pages/Rules';
import Strategies from '@/pages/Strategies';
import Learn from '@/pages/Learn';
import Tools from '@/pages/Tools';
import Settings from '@/pages/Settings';
import SourceCode from '@/pages/SourceCode';
import Pricing from '@/pages/Pricing';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Partner from '@/pages/Partner';
import Mentorship from '@/pages/Mentorship';
import MentorGuidance from '@/pages/MentorGuidance';
import Community from '@/pages/Community';
import Webinar from '@/pages/Webinar';
import BrokerLink from '@/pages/BrokerLink';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Admin from '@/pages/Admin';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

import TermsAndConditions from '@/pages/TermsAndConditions';
import RefundPolicy from '@/pages/RefundPolicy';
import PaymentStatus from '@/pages/PaymentStatus';
import { PremiumGate } from '@/components/auth/PremiumGate';

const queryClient = new QueryClient();

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-body">
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-slate-100 animate-pulse">
              <Zap className="w-8 h-8 text-indigo-600 fill-indigo-600" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-bold text-slate-400  uppercase">Syncing your journal...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function AdminRoute() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Debug: If role is missing, we might need a manual refresh
  if (!profile || profile.role !== 'ADMIN') {
    console.warn('Admin Access Denied: User role is', profile?.role);
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/partner" element={<Partner />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/refund" element={<RefundPolicy />} />
              <Route path="/login" element={<Login />} />
              <Route path="/webinar" element={<Webinar />} />
              <Route path="/payment-status" element={<PaymentStatus />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<AppShell />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/journal" element={<Journal />} />
                  <Route path="/log-trade" element={<LogTradePage />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route
                    path="/analytics"
                    element={
                      <PremiumGate>
                        <Analytics />
                      </PremiumGate>
                    }
                  />
                  <Route path="/mistakes" element={<Mistakes />} />
                  <Route path="/rules" element={<Rules />} />
                  <Route path="/strategies" element={<Strategies />} />
                  <Route path="/learn" element={<Learn />} />
                  <Route path="/tools" element={<Tools />} />
                  <Route
                    path="/mentorship"
                    element={
                      <PremiumGate>
                        <Mentorship />
                      </PremiumGate>
                    }
                  />

                  <Route
                    path="/mentor-guidance"
                    element={
                      <PremiumGate>
                        <MentorGuidance />
                      </PremiumGate>
                    }
                  />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/source-code" element={<SourceCode />} />

                  <Route element={<AdminRoute />}>
                    <Route
                      path="/admin"
                      element={
                        <ErrorBoundary>
                          <Admin />
                        </ErrorBoundary>
                      }
                    />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
