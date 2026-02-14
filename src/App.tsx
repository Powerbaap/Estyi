import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ScrollToTop from './components/Layout/ScrollToTop';
import ErrorBoundary from './components/Layout/ErrorBoundary';
import AdminRoute from './components/AdminRoute';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Signup = lazy(() => import('./pages/Auth/Signup'));
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

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

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
            
            {/* User Routes */}
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/clinic-dashboard" element={<ClinicDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/search" element={<Search />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/clinic-profile" element={<ClinicProfile />} />
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