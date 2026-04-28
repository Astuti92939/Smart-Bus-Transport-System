import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bus, Shield, Lock, Search, ArrowRight, Info, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';
import { useSmartBus } from '../context/SmartContext';

const RegisterPage = ({ onNavigateToLogin }) => {
  const { register } = useSmartBus();
  const [role, setRole] = useState('student'); // student, driver, admin
  const [form, setForm] = useState({
    name: '',
    universityId: '',
    password: '',
    email: '',
    phone: '',
    region: 'Main Campus',
    assignedRoute: 'Main Campus',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.universityId || !form.password) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setLoading(true);

    const result = await register(role, form);
    if (!result.success) {
      setError(result.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const roleConfigs = {
    student: {
      title: 'Student Registration',
      description: 'Join the campus bus network and manage your daily commute.',
      icon: <User size={24} />,
      color: '#4F46E5',
      idLabel: 'University Registration ID',
    },
    driver: {
      title: 'Driver Enrollment',
      description: 'Register as an official campus operator to manage transit nodes.',
      icon: <Bus size={24} />,
      color: '#10B981',
      idLabel: 'Official Driver ID',
    },
    admin: {
      title: 'Admin Registration',
      description: 'Create a root administrator account for fleet management.',
      icon: <Shield size={24} />,
      color: '#7C3AED',
      idLabel: 'Authorized Admin ID',
    }
  };

  const activeConfig = roleConfigs[role];

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0A0C10', color: '#F0F6FC', display: 'flex', overflow: 'hidden', fontFamily: 'Outfit, sans-serif' }}>
      
      {/* Left side - Information */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', background: 'radial-gradient(circle at 10% 10%, rgba(79, 70, 229, 0.1), transparent)' }}>
        <div 
          onClick={onNavigateToLogin} 
          style={{ position: 'absolute', top: '60px', left: '60px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <div style={{ background: '#4F46E5', padding: '8px', borderRadius: '12px' }}>
            <Bus size={24} color="white" />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: '900' }}>Smart<span style={{ color: '#4F46E5' }}>Bus</span></span>
        </div>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', lineHeight: '1.1', marginBottom: '24px' }}>
            Create Your <br /> 
            <span style={{ color: activeConfig.color }}>Campus Profile</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#8B949E', maxWidth: '500px', lineHeight: '1.6', marginBottom: '40px' }}>
            Join the smart infrastructure of your university. Accessible, secure, and data-driven transit for everyone on campus.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <RegisterFeature icon={<CheckCircle size={20} />} label="Instant transit pass generation upon approval." />
            <RegisterFeature icon={<CheckCircle size={20} />} label="Secure data encryption for personal details." />
            <RegisterFeature icon={<CheckCircle size={20} />} label="Integrated wallet system for automated payments." />
          </div>
        </motion.div>
      </div>

      {/* Right side - Registration Form */}
      <div style={{ width: '640px', background: 'rgba(255, 255, 255, 0.02)', borderLeft: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative', overflowY: 'auto' }}>
        
        <motion.div 
          key={role}
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }}
          style={{ width: '100%', maxWidth: '440px', padding: '40px 0' }}
        >
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '8px' }}>{activeConfig.title}</h2>
            <p style={{ color: '#8B949E', fontSize: '0.9rem' }}>{activeConfig.description}</p>
          </div>

          <div style={{ display: 'flex', background: '#161B22', borderRadius: '16px', padding: '6px', marginBottom: '32px' }}>
            {['student', 'driver', 'admin'].map(r => (
              <button
                key={r}
                onClick={() => { setRole(r); setError(''); }}
                style={{ 
                  flex: 1, padding: '10px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                  fontSize: '0.85rem', fontWeight: '700', textTransform: 'capitalize',
                  background: role === r ? activeConfig.color : 'transparent',
                  color: role === r ? 'white' : '#8B949E',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
               <div style={{ gridColumn: '1/-1', marginBottom: '16px' }}>
                  <label style={labelStyle}>Full Name *</label>
                  <input name="name" style={inputStyle} value={form.name} onChange={handleChange} placeholder="e.g. Rahul Sharma" />
               </div>
               
               <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>{activeConfig.idLabel} *</label>
                  <input name="universityId" style={inputStyle} value={form.universityId} onChange={handleChange} placeholder="e.g. STU-2025-X" />
               </div>

               <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Security Password *</label>
                  <input name="password" type="password" style={inputStyle} value={form.password} onChange={handleChange} placeholder="••••••••" />
               </div>

               {role === 'admin' && (
                 <div style={{ gridColumn: '1/-1', marginBottom: '16px' }}>
                    <label style={labelStyle}>University Email Address</label>
                    <input name="email" type="email" style={inputStyle} value={form.email} onChange={handleChange} placeholder="admin@university.edu" />
                 </div>
               )}

               {role === 'driver' && (
                 <div style={{ gridColumn: '1/-1', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>Mobile Phone Number</label>
                      <input name="phone" style={inputStyle} value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                    </div>
                    <div>
                      <label style={labelStyle}>Regional Office / Area</label>
                      <input name="region" style={inputStyle} value={form.region} onChange={handleChange} placeholder="e.g. North Campus / West Gate" />
                    </div>
                 </div>
               )}

               {role === 'student' && (
                 <div style={{ gridColumn: '1/-1', marginBottom: '16px' }}>
                    <label style={labelStyle}>Default Route Selection</label>
                    <input name="assignedRoute" style={inputStyle} value={form.assignedRoute} onChange={handleChange} placeholder="e.g. Main Campus / Engineering Block" />
                 </div>
               )}
            </div>

            {error && (
              <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', fontSize: '0.85rem', marginBottom: '24px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                {error}
              </div>
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
                marginTop: '16px'
              }}
            >
              {loading ? 'Creating Profile...' : `Register as ${role}`}
              <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <p style={{ fontSize: '0.9rem', color: '#8B949E' }}>
              Already have a campus account? <br />
              <button 
                onClick={onNavigateToLogin}
                style={{ background: 'transparent', border: 'none', color: activeConfig.color, fontWeight: '700', cursor: 'pointer', marginTop: '8px', fontSize: '1rem' }}
              >
                Sign in to Portal
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const RegisterFeature = ({ icon, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#8B949E' }}>
    <div style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '6px', borderRadius: '8px' }}>{icon}</div>
    <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{label}</span>
  </div>
);

const labelStyle = {
  display: 'block', fontSize: '0.8rem', color: '#8B949E', marginBottom: '8px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em'
};

const inputStyle = {
  width: '100%', padding: '14px 16px', background: '#161B22', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', color: 'white', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none'
};

export default RegisterPage;
