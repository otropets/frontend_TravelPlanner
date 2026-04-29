import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage.jsx';
import TripsPage from './pages/TripsPage';
import TripDetailPage from './pages/TripDetailPage';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/trips" element={
          <ProtectedRoute><TripsPage /></ProtectedRoute>
        } />
        <Route path="/trips/:id" element={
          <ProtectedRoute><TripDetailPage /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
