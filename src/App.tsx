import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import UserDashboard from './pages/Dashboard/UserDashboard';
import ClinicDashboard from './pages/Dashboard/ClinicDashboard';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Search from './pages/Search';
import Reviews from './pages/Reviews';
import ClinicProfile from './pages/ClinicProfile';
import ClinicApplication from './pages/ClinicApplication';
import TestSupabase from './pages/TestSupabase';
import TestAuth from './pages/TestAuth';
// Admin imports
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import ClinicManagement from './pages/Admin/ClinicManagement';
import RequestManagement from './pages/Admin/RequestManagement';
import MessageManagement from './pages/Admin/MessageManagement';
import Reports from './pages/Admin/Reports';
import Settings from './pages/Admin/Settings';
import ChangeControl from './pages/Admin/ChangeControl';
// Legal pages
import AboutUs from './pages/Legal/AboutUs';
import Contact from './pages/Legal/Contact';
import CookiePolicy from './pages/Legal/CookiePolicy';
import FAQ from './pages/Legal/FAQ';
import HelpCenter from './pages/Legal/HelpCenter';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import SafetyGuidelines from './pages/Legal/SafetyGuidelines';
import TermsOfUse from './pages/Legal/TermsOfUse';
import ScrollToTop from './components/Layout/ScrollToTop';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Header />}
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/test-supabase" element={<TestSupabase />} />
          <Route path="/test-auth" element={<TestAuth />} />
          
          {/* User Routes */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/clinic-dashboard" element={<ClinicDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/search" element={<Search />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/clinic-profile" element={<ClinicProfile />} />
          <Route path="/clinic-application" element={<ClinicApplication />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/clinics" element={<ClinicManagement />} />
          <Route path="/admin/requests" element={<RequestManagement />} />
          <Route path="/admin/messages" element={<MessageManagement />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/change-control" element={<ChangeControl />} />
          
          {/* Legal Routes */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/safety-guidelines" element={<SafetyGuidelines />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
        </Routes>
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
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;