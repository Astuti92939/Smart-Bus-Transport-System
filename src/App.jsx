import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bus } from 'lucide-react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';

// Modules
import LandingPage from './modules/LandingPage';
import SignInPage from './modules/SignInPage';
import RegisterPage from './modules/RegisterPage';
import StudentDashboard from './modules/StudentDashboard';
import AdminDashboard from './modules/AdminDashboard';
import DriverInterface from './modules/DriverInterface';

// Context
import { useSmartBus } from './context/SmartContext';

function App() {
  const { systemState, userRole, isLoading, logout, updateStudent, setIsLoading, userLocation } = useSmartBus();
  const navigate = useNavigate();
  const location = useLocation();
  const [preferredRole, setPreferredRole] = useState('student');
  
  const handleGetStarted = (role = 'student') => {
    setPreferredRole(role);
    if (!userRole) {
      navigate('/login');
    } else {
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    // Basic initial load simulation
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0A0C10', color: '#F0F6FC' }}>
        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
          <Bus size={64} color="#4F46E5" />
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '24px', fontFamily: 'Outfit', color: '#8B949E' }}>
          Initializing Smart Infrastructure...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="app-main">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage onGetStarted={handleGetStarted} />} />
          <Route path="/login" element={
            !userRole ? <SignInPage initialRole={preferredRole} onNavigateToRegister={() => navigate('/register')} onNavigateToLanding={() => navigate('/')} /> : <Navigate to="/dashboard" replace />
          } />
          <Route path="/register" element={
            !userRole ? <RegisterPage onNavigateToLogin={() => navigate('/login')} /> : <Navigate to="/dashboard" replace />
          } />
          <Route path="/dashboard" element={
            !userRole ? <Navigate to="/login" replace /> : (
              userRole === 'student' ? <StudentDashboard buses={systemState.buses} student={systemState.student} updateStudent={updateStudent} userLocation={userLocation} onLogout={() => { logout(); navigate('/'); }} /> :
              userRole === 'admin' ? <AdminDashboard buses={systemState.buses} userLocation={userLocation} onLogout={() => { logout(); navigate('/'); }} /> :
              userRole === 'driver' ? <DriverInterface bus={systemState.driver?.assignedBus} userLocation={userLocation} onLogout={() => { logout(); navigate('/'); }} /> : <Navigate to="/login" replace />
            )
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
