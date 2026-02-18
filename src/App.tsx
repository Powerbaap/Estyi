import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ScrollToTop from './components/Layout/ScrollToTop';
import ErrorBoundary from './components/Layout/ErrorBoundary';
import AdminRoute from './components/AdminRoute';
import { getCurrentUserAccess, type UserRole } from './utils/auth';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Signup = lazy(() => import('./pages/Auth/Signup'));
const AuthCallback = lazy(() => import('./pages/Auth/Callback'));
const UserDashboard = lazy(() => import('./pages/Dashboard/UserDashboard'));
const ClinicDashboard = lazy(() => import('./pages/Dashboard/ClinicDashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Messages = lazy(() => import('./pages/Messages'));
const Search = lazy(() => import('./pages/Search'));
const Reviews = lazy(() => import('./pages/Reviews'));
const ClinicProfile = lazy(() => import('./pages/ClinicProfile'));
const ClinicApplication = lazy(() => import('./pages/ClinicApplication'));
const NewRequest = lazy(() => import('./pages/Requests/NewRequest'));
const FixedPriceRequest = lazy(() => import('./pages/Requests/FixedPriceRequest'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const UserManagement = lazy(() => import('./pages/Admin/UserManagement'));
const ClinicManagement = lazy(() => import('./pages/Admin/ClinicManagement'));
const RequestManagement = lazy(() => import('./pages/Admin/RequestManagement'));
const MessageManagement = lazy(() => import('./pages/Admin/MessageManagement'));
const Reports = lazy(() => import('./pages/Admin/Reports'));
const Settings = lazy(() => import('./pages/Admin/Settings'));
const ChangeControl = lazy(() => import('./pages/Admin/ChangeControl'));

// Legal pages
const AboutUs = lazy(() => import('./pages/Legal/AboutUs'));
const Contact = lazy(() => import('./pages/Legal/Contact'));
const CookiePolicy = lazy(() => import('./pages/Legal/CookiePolicy'));
const FAQ = lazy(() => import('./pages/Legal/FAQ'));
const HelpCenter = lazy(() => import('./pages/Legal/HelpCenter'));
const PrivacyPolicy = lazy(() => import('./pages/Legal/PrivacyPolicy'));
const SafetyGuidelines = lazy(() => import('./pages/Legal/SafetyGuidelines'));
const TermsOfUse = lazy(() => import('./pages/Legal/TermsOfUse'));
const NoticeAtCollection = lazy(() => import('./pages/Legal/NoticeAtCollection'));
const Consent = lazy(() => import('./pages/Legal/Consent'));
const ClinicAgreement = lazy(() => import('./pages/Legal/ClinicAgreement'));
const DataSecurityAddendum = lazy(() => import('./pages/Legal/DataSecurityAddendum'));
const DMCA = lazy(() => import('./pages/Legal/DMCA'));
const MedicalDisclaimer = lazy(() => import('./pages/Legal/MedicalDisclaimer'));
const AllLegal = lazy(() => import('./pages/Legal/AllLegal'));

const ACCESS_CACHE_KEY = 'estyi_user_access_cache';

type CachedAccess = {
  userId: string;
  role: UserRole;
  isClinicApproved: boolean;
  expiresAt: number;
};

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

const RoleRoute: React.FC<{ allow: UserRole[]; children: React.ReactNode }> = ({ allow, children }) => {
  const { user, isLoading } = useAuth();
  const [role, setRole] = useState<UserRole>('user');
  const [clinicApproved, setClinicApproved] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const resolveRole = async () => {
      if (!user) {
        if (active) {
          setRole('user');
          setClinicApproved(true);
          setRoleLoading(false);
        }
        return;
      }
      setRoleLoading(true);

      let cached: CachedAccess | null = null;
      try {
        const raw = localStorage.getItem(ACCESS_CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as CachedAccess;
          if (parsed.userId === user.id && parsed.expiresAt > Date.now()) {
            cached = parsed;
          }
        }
      } catch {}

      if (cached && active) {
        setRole(cached.role);
        setClinicApproved(cached.isClinicApproved);
        setRoleLoading(false);
        return;
      }

      const access = await getCurrentUserAccess(user);

      if (active) {
        setRole(access.role);
        setClinicApproved(access.isClinicApproved);
        setRoleLoading(false);
        try {
          const value: CachedAccess = {
            userId: user.id,
            role: access.role,
            isClinicApproved: access.isClinicApproved,
            expiresAt: Date.now() + 60_000,
          };
          localStorage.setItem(ACCESS_CACHE_KEY, JSON.stringify(value));
        } catch {}
      }
    };
    resolveRole();
    return () => {
      active = false;
    };
  }, [user]);

  if (isLoading || roleLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'clinic' && !clinicApproved) {
    return <Navigate to="/login" replace />;
  }

  if (!allow.includes(role)) {
    const fallback = role === 'admin' ? '/admin/dashboard' : role === 'clinic' ? '/clinic-dashboard' : '/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Header />}
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* User Routes */}
            <Route path="/dashboard" element={<RoleRoute allow={['user']}><UserDashboard /></RoleRoute>} />
            <Route path="/clinic-dashboard" element={<RoleRoute allow={['clinic']}><ClinicDashboard /></RoleRoute>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/search" element={<Search />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/clinic/:clinicId/profile" element={<ClinicProfile />} />
            <Route path="/clinic-application" element={<ClinicApplication />} />
            <Route path="/request/new" element={<NewRequest />} />
            <Route path="/request" element={<FixedPriceRequest />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
            <Route path="/admin/clinics" element={<AdminRoute><ClinicManagement /></AdminRoute>} />
            <Route path="/admin/requests" element={<AdminRoute><RequestManagement /></AdminRoute>} />
            <Route path="/admin/messages" element={<AdminRoute><MessageManagement /></AdminRoute>} />
            <Route path="/admin/reports" element={<AdminRoute><Reports /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><Settings /></AdminRoute>} />
            <Route path="/admin/change-control" element={<AdminRoute><ChangeControl /></AdminRoute>} />
            
            {/* Legal Routes */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/notice-at-collection" element={<NoticeAtCollection />} />
            <Route path="/consent" element={<Consent />} />
            <Route path="/clinic-agreement" element={<ClinicAgreement />} />
            <Route path="/data-security-addendum" element={<DataSecurityAddendum />} />
            <Route path="/dmca" element={<DMCA />} />
            <Route path="/medical-disclaimer" element={<MedicalDisclaimer />} />
            <Route path="/legal" element={<AllLegal />} />
            <Route path="/safety-guidelines" element={<SafetyGuidelines />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}

export default App;
