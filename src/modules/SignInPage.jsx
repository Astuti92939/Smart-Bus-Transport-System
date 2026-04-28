import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bus, Shield, Lock, Search, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { useSmartBus } from '../context/SmartContext';

const SignInPage = ({ initialRole = 'student', onNavigateToRegister, onNavigateToLanding }) => {
  const { login } = useSmartBus();
  const [role, setRole] = useState(initialRole); // student, driver, admin
  const [universityId, setUniversityId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!universityId || !password) {
      setError('Please enter both University ID and Password');
      return;
    }
    setError('');
    setLoading(true);

    const result = await login(role, universityId, password);
    if (!result.success) {
      setError(result.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  const roleConfigs = {
    student: {
      title: 'Student Portal',
      description: 'Access your bus schedules, live tracking, and digital wallet.',
      icon: <User size={24} />,
      color: '#4F46E5',
      idLabel: 'Student University ID',
      idPlaceholder: 'e.g. STU-2025-X'
    },
    driver: {
      title: 'Driver HUD',
      description: 'Manage your route, monitor occupancy, and trigger SOS alerts.',
      icon: <Bus size={24} />,
      color: '#10B981',
      idLabel: 'Driver ID',
      idPlaceholder: 'e.g. DRV-01'
    },
    admin: {
      title: 'Admin Core',
      description: 'Global fleet monitoring, student database, and financial management.',
      icon: <Shield size={24} />,
      color: '#7C3AED',
      idLabel: 'Administrator ID',
      idPlaceholder: 'e.g. ADM-01'
    }
  };

  const activeConfig = roleConfigs[role];

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0A0C10', color: '#F0F6FC', display: 'flex', overflow: 'hidden', fontFamily: 'Outfit, sans-serif' }}>

      {/* Left side - Branding & Info */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', background: 'radial-gradient(circle at 10% 10%, rgba(79, 70, 229, 0.1), transparent)' }}>
        <div style={{ position: 'absolute', top: '60px', left: '60px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          {onNavigateToLanding && (
            <motion.button
              whileHover={{ scale: 1.1, x: -3 }} whileTap={{ scale: 0.95 }}
              onClick={onNavigateToLanding}
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#8B949E', padding: '10px', borderRadius: '12px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
              }}
              title="Back to Home"
            >
              <ArrowLeft size={18} />
            </motion.button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#4F46E5', padding: '8px', borderRadius: '12px' }}>
              <Bus size={24} color="white" />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.02em' }}>Smart<span style={{ color: '#4F46E5' }}>Bus</span></span>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', lineHeight: '1.1', marginBottom: '24px' }}>
            Next-Gen <br />
            <span style={{ color: activeConfig.color }}>Campus Transit</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#8B949E', maxWidth: '500px', lineHeight: '1.6', marginBottom: '40px' }}>
            A fully integrated AI-powered transportation ecosystem for modern universities.
            Real-time tracking, automated fee management, and safety protocols in one unified dashboard.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <FeatureItem icon={<Search size={18} />} label="Live GPS Tracking" />
            <FeatureItem icon={<Shield size={18} />} label="SOS Safety Network" />
            <FeatureItem icon={<User size={18} />} label="Digital ID Wallet" />
            <FeatureItem icon={<Bus size={18} />} label="Fleet Optimization" />
          </div>
        </motion.div>

        {/* Decorative background element */}
        <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(79, 70, 229, 0.05), transparent)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
      </div>

      {/* Right side - Login Form */}
      <div style={{ width: '580px', background: 'rgba(255, 255, 255, 0.02)', borderLeft: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative' }}>

        <motion.div
          key={role}
          initial={{ opacity: 0, transform: 'translateY(20px)' }}
          animate={{ opacity: 1, transform: 'translateY(0)' }}
          style={{ width: '100%', maxWidth: '400px' }}
        >
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: `${activeConfig.color}20`, color: activeConfig.color, padding: '10px', borderRadius: '12px' }}>
                {activeConfig.icon}
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{activeConfig.title}</h2>
            </div>
            <p style={{ color: '#8B949E', fontSize: '0.95rem' }}>{activeConfig.description}</p>
          </div>

          {/* Role Toggler */}
          <div style={{ display: 'flex', background: '#161B22', borderRadius: '16px', padding: '6px', marginBottom: '32px' }}>
            {['student', 'driver', 'admin'].map(r => (
              <button
                key={r}
                onClick={() => { setRole(r); setError(''); }}
                style={{
                  flex: 1, padding: '10px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                  fontSize: '0.85rem', fontWeight: '700', textTransform: 'capitalize',
                  background: role === r ? '#4F46E5' : 'transparent',
                  color: role === r ? 'white' : '#8B949E',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#8B949E', marginBottom: '8px', fontWeight: '600' }}>{activeConfig.idLabel}</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#4F46E5' }} />
                <input
                  type="text"
                  value={universityId}
                  onChange={(e) => setUniversityId(e.target.value)}
                  placeholder={activeConfig.idPlaceholder}
                  style={{
                    width: '100%', padding: '14px 14px 14px 48px', background: '#161B22',
                    border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px',
                    color: 'white', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.85rem', color: '#8B949E', fontWeight: '600' }}>Password</label>
                <span style={{ fontSize: '0.85rem', color: '#4F46E5', fontWeight: '600', cursor: 'pointer' }}>Forgot?</span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#4F46E5' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '14px 14px 14px 48px', background: '#161B22',
                    border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px',
                    color: 'white', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none'
                  }}
                />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', fontSize: '0.85rem', marginBottom: '24px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '16px', borderRadius: '14px',
                background: loading ? '#374151' : activeConfig.color, border: 'none',
                color: 'white', fontSize: '1rem', fontWeight: '800',
                cursor: loading ? 'not-allowed' : 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {loading ? 'Authenticating...' : `Sign in as ${role}`}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Quick Demo Credentials Help */}
          <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(79, 70, 229, 0.05)', borderRadius: '16px', border: '1px dashed rgba(79, 70, 229, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Info size={16} color="#4F46E5" />
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#4F46E5', textTransform: 'uppercase' }}>Demo Credentials</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#8B949E', marginBottom: '0' }}>
              ID: <span style={{ color: '#F0F6FC' }}>{role === 'admin' ? 'ADM-01' : role === 'student' ? 'STU-2020-X' : 'DRV-01'}</span> <br />
              Pass: <span style={{ color: '#F0F6FC' }}>password123</span>
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <p style={{ fontSize: '0.9rem', color: '#8B949E' }}>
              Don't have a campus account? <br />
              <motion.button 
                whileHover={{ scale: 1.05, color: '#F0F6FC' }}
                whileTap={{ scale: 0.95 }}
                onClick={onNavigateToRegister}
                style={{ background: 'transparent', border: 'none', color: activeConfig.color, fontWeight: '800', cursor: 'pointer', marginTop: '12px', fontSize: '1.05rem', textDecoration: 'underline', textUnderlineOffset: '4px' }}
              >
                Sign up for Portal
              </motion.button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#8B949E' }}>
    <div style={{ color: '#4F46E5' }}>{icon}</div>
    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{label}</span>
  </div>
);

export default SignInPage;
