import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { LoginLayout } from './layouts/LoginLayout';
import { AdminLayout } from './layouts/AdminLayout';

import LandingPage from './features/landing/LandingPage';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Dashboard from './features/dashboard/Dashboard';
import Home from './features/dashboard/Home';
import CreateGroup from './features/createGroup/CreateGroup';
import FindGroup from './features/findGroup/FindGroup';
import RequestsList from './features/requests/RequestsList';
import AvailabilityManager from './features/availability/AvailabilityManager';
import ChatContainer from './features/chat/ChatContainer';
import Profile from './features/profile/Profile';
import SessionManager from './features/sessions/SessionManager';
import AdminDashboard from './features/admin/AdminDashboard';
import UserManagement from './features/admin/UserManagement';
import MentorList from './features/mentors/MentorList';
import MentorProfile from './features/mentors/MentorProfile';
import PublicProfile from './features/profile/PublicProfile';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent flex rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  // Admins should always be on the admin panel
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  return children;
};

// Guard for admin-only routes
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent flex rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: { background: '#1e293b', color: '#fff', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' },
          success: { iconTheme: { primary: '#14b8a6', secondary: '#fff' } }
        }}
      />
      <Routes>
        {/* Public Landing Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route element={<LoginLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Dashboard Routes (Student & Senior) */}
        <Route element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/setup" element={<Profile />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/find-group" element={<FindGroup />} />
          <Route path="/requests" element={<RequestsList />} />
          <Route path="/inbox" element={<RequestsList />} />
          <Route path="/availability" element={<AvailabilityManager />} />
          <Route path="/chat" element={<ChatContainer />} />
          <Route path="/sessions" element={<SessionManager />} />
          <Route path="/mentors" element={<MentorList />} />
          <Route path="/mentors/:mentorId" element={<MentorProfile />} />
          <Route path="/student/:id" element={<PublicProfile />} />
        </Route>

        {/* Admin Routes — use AdminLayout (no Navbar) */}
        <Route element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
        </Route>

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />

        {/* Home — has its own Navbar & Footer, so placed outside MainLayout */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
