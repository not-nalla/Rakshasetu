import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './hooks/useAuth';
import PillHeader from './components/layout/PillHeader';
import EmergencyBanner from './components/layout/EmergencyBanner';
import BottomNav from './components/layout/BottomNav';
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import HomePage from './pages/HomePage';
import EventsFeedPage from './pages/EventsFeedPage';
import EventDetailPage from './pages/EventDetailPage';
import DosDontsPage from './pages/DosDontsPage';
import AuthoritiesPage from './pages/AuthoritiesPage';
import PastDisastersPage from './pages/PastDisastersPage';
import AdminPanelPage from './pages/AdminPanelPage';
import AskAIPage from './pages/AskAIPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background bg-grid-pattern flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-safetyLime border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading Kavach...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-grid-pattern font-jakarta relative">
      <ScrollToTop />
      {user && <EmergencyBanner />}
      {user && <PillHeader />}
      <main className={user ? 'pt-24 pb-20 md:pb-4' : ''}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/auth/callback" element={<PageTransition><AuthCallbackPage /></PageTransition>} />
            <Route path="/complete-profile" element={<PageTransition><CompleteProfilePage /></PageTransition>} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <PageTransition><HomePage /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <PageTransition><EventsFeedPage /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id"
              element={
                <ProtectedRoute>
                  <PageTransition><EventDetailPage /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dos-donts"
              element={
                <ProtectedRoute>
                  <PageTransition><DosDontsPage /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/authorities"
              element={
                <ProtectedRoute>
                  <PageTransition><AuthoritiesPage /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/past-disasters"
              element={
                <ProtectedRoute>
                  <PageTransition><PastDisastersPage /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ask-ai"
              element={
                <ProtectedRoute>
                  <PageTransition><AskAIPage /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <PageTransition><AdminPanelPage /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      {user && <BottomNav />}
    </div>
  );
}
