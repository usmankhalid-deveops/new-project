import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

import Home from './pages/Home';
import PatientDashboard from './pages/Dashboard/PatientDashboard';
import DoctorDashboard from './pages/Dashboard/DoctorDashboard';
import DoctorList from './pages/Doctors/DoctorList';
import Appointments from './pages/Appointments/Appointments';
import MedicalRecords from './pages/Records/MedicalRecords';
import BookAppointment from './pages/Appointments/BookAppointment';
import { useAuth } from './context/AuthContext';

const DashboardRedirect = () => {
  const { profile } = useAuth();
  if (profile?.role === 'doctor') return <DoctorDashboard />;
  return <PatientDashboard />;
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<Home />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout><DashboardRedirect /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/doctors" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Layout><DoctorList /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/appointments" element={
            <ProtectedRoute>
              <Layout><Appointments /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/appointments/book/:doctorId" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Layout><BookAppointment /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/records" element={
            <ProtectedRoute>
              <Layout><MedicalRecords /></Layout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
