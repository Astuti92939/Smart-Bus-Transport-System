import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, CheckCircle, User, Phone, Mail } from 'lucide-react';
import { useSmartBus } from '../context/SmartContext';

const AddStaffForm = ({ onBack }) => {
  const { register } = useSmartBus();
  const [role, setRole] = useState('driver'); // driver or admin
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    universityId: '',
    password: '',
    email: '',
    phone: '',
    region: 'Main Campus',
    licenseNumber: '',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.universityId || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      const result = await register(role, form);
      if (result.success) {
        setSubmitted(true);
        setTimeout(() => onBack(), 1800);
      } else {
        setError(result.message || 'Registration failed.');
      }
    } catch (err) {
      setError('System error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: '#161B22',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
    padding: '14px 16px', color: '#F0F6FC', fontSize: '0.95rem',
    outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = {
    display: 'block', fontSize: '0.82rem', color: '#8B949E',
    marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em',
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0A0C10', display: 'flex', flexDirection: 'column', color: '#F0F6FC' }}>
      <header style={{ padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.01)' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px 16px', color: '#8B949E', cursor: 'pointer', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '8px' }}>
          <div style={{ background: '#7C3AED', padding: '8px', borderRadius: '12px' }}><Shield size={20} color="white" /></div>
          <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>Admin<span style={{ color: '#7C3AED' }}>Core</span> — Staff Enrollment</span>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
            <CheckCircle size={64} color="#10B981" style={{ marginBottom: '24px' }} />
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '8px' }}>Staff Enrolled!</h2>
            <p style={{ color: '#8B949E' }}>Updating institutional directory...</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '600px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '40px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '8px' }}>New Staff Member</h1>
            <p style={{ color: '#8B949E', marginBottom: '32px' }}>Register an official university operator or an additional administrator.</p>

            <div style={{ display: 'flex', background: '#161B22', borderRadius: '16px', padding: '6px', marginBottom: '32px' }}>
               {['driver', 'admin'].map(r => (
                 <button
                   key={r}
                   onClick={() => setRole(r)}
                   style={{ 
                     flex: 1, padding: '10px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                     fontSize: '0.85rem', fontWeight: '700', textTransform: 'capitalize',
                     background: role === r ? '#7C3AED' : 'transparent',
                     color: role === r ? 'white' : '#8B949E',
                     transition: 'all 0.2s'
                   }}
                 >
                   {r}
                 </button>
               ))}
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Full Legal Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Robert Miller" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{role === 'driver' ? 'Driver ID *' : 'Admin ID *'}</label>
                  <input name="universityId" value={form.universityId} onChange={handleChange} placeholder={role === 'driver' ? 'DRV-02' : 'ADM-02'} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Access Password *</label>
                  <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" style={inputStyle} />
                </div>

                {role === 'driver' && (
                  <>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>Contact Number</label>
                      <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 91234 56789" style={inputStyle} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>License Number</label>
                      <input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} placeholder="e.g. DL-202X-001" style={inputStyle} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>Regional Office / Hub</label>
                      <input name="region" value={form.region} onChange={handleChange} placeholder="e.g. North Hub / Campus A" style={inputStyle} />
                    </div>
                  </>
                )}

                {role === 'admin' && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>University Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="admin@univ.edu" style={inputStyle} />
                  </div>
                )}
              </div>

              {error && <p style={{ color: '#EF4444', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</p>}

              <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', borderRadius: '14px', background: loading ? '#374151' : 'linear-gradient(135deg, #7C3AED, #5B21B6)', border: 'none', color: 'white', fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <Shield size={18} />
                {loading ? 'Processing...' : `Confirm ${role} Registration`}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AddStaffForm;
