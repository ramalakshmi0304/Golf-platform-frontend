import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import ScoreFormPage from './pages/ScoreFormPage';
import AdminDrawPage from './pages/AdminDrawPage';
import Signup from './pages/Signup';

// Global Components
import WinnerOverlay from './components/WinnerOverlay';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* The Overlay is placed here so it has access to the Router context,
            allowing it to show up on any page after the user logs in.
        */}
        <WinnerOverlay />

        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* --- Shared Protected Routes (Subscriber & Admin) --- */}
          <Route element={<ProtectedRoute allowedRoles={['subscriber', 'admin']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/submit" element={<ScoreFormPage />} />
          </Route>

          {/* --- Admin Exclusive Routes --- */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/draw" element={<AdminDrawPage />} />
            {/* You could add /admin/prizes or /admin/users here later */}
          </Route>

          {/* --- Fallback Redirect --- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;