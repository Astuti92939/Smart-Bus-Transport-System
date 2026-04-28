import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowLeft, CheckCircle } from 'lucide-react';
import { useSmartBus } from '../context/SmartContext';

const AddStudentForm = ({ initialData, onBack }) => {
  const { systemState, addStudent, updateStudent } = useSmartBus();
  const buses = systemState.buses || [];
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: initialData?.name || '',
    universityId: initialData?.universityId || '',
    password: '',
    assignedRoute: initialData?.assignedRoute || '',
    assignedBus: initialData?.assignedBus?._id || initialData?.assignedBus || '',
    status: initialData?.status || 'Active',
    feesPaid: initialData?.feesPaid || '',
    dues: initialData?.dues || '',
    walletBalance: initialData?.walletBalance || '5000',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'assignedBus' && value) {
      const selectedBus = buses.find(b => b._id === value);
      if (selectedBus) {
        setForm(prev => ({ 
          ...prev, 
          assignedBus: value,
          assignedRoute: selectedBus.route 
        }));
        return;
      }
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.universityId || !form.assignedRoute) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        universityId: form.universityId,
        assignedRoute: form.assignedRoute,
        assignedBus: form.assignedBus || null,
        status: form.status,
        feesPaid: Number(form.feesPaid) || 0,
        dues: Number(form.dues) || 0,
        walletBalance: Number(form.walletBalance) || 5000,
      };

      if (form.password) {
        payload.password = form.password;
      } else if (!initialData) {
        // Default password for new students added by admin
        payload.password = 'password123';
      }

      if (initialData) {
        await updateStudent(initialData.universityId, payload);
      } else {
        await addStudent(payload);
      }
      
      setSubmitted(true);
      setTimeout(() => onBack(), 1800);
    } catch (err) {
      setError(initialData ? 'Failed to update student.' : 'Failed to register student. The University ID may already exist.');
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
          <div style={{ background: '#10B981', padding: '8px', borderRadius: '12px' }}><Users size={20} color="white" /></div>
          <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>Admin<span style={{ color: '#10B981' }}>Core</span> — {initialData ? 'Edit Student' : 'Register Student'}</span>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
            <CheckCircle size={64} color="#10B981" style={{ marginBottom: '24px' }} />
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '8px' }}>{initialData ? 'Profile Updated!' : 'Student Registered!'}</h2>
            <p style={{ color: '#8B949E' }}>Redirecting back to Student Database...</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '660px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '48px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '8px' }}>{initialData ? 'Edit Student Profile' : 'Register New Student'}</h1>
            <p style={{ color: '#8B949E', marginBottom: '40px' }}>{initialData ? `Updating information for ${initialData.name}` : 'Fill in the student details to add them to the campus bus database.'}</p>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Rahul Sharma" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>University ID *</label>
                  <input name="universityId" value={form.universityId} onChange={handleChange} placeholder="e.g. STU-2025-X" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{initialData ? 'Change Password' : 'Set Initial Password'} *</label>
                  <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Assigned Route *</label>
                  <input name="assignedRoute" value={form.assignedRoute} onChange={handleChange} placeholder="e.g. R-101" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Bus Assignment (Optional)</label>
                  <select name="assignedBus" value={form.assignedBus} onChange={handleChange} style={inputStyle}>
                    <option value="">— Unassigned —</option>
                    {buses.map(bus => (
                      <option key={bus._id} value={bus._id}>
                        Bus #{bus.id} - {bus.route} ({bus.status})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Current Outstanding Dues (₹)</label>
                  <input name="dues" type="number" value={form.dues} onChange={handleChange} placeholder="e.g. 1000" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Wallet Balance (₹)</label>
                  <input name="walletBalance" type="number" value={form.walletBalance} onChange={handleChange} placeholder="5000" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Total Fees Paid (₹)</label>
                  <input name="feesPaid" type="number" value={form.feesPaid} onChange={handleChange} placeholder="0" style={inputStyle} />
                </div>
              </div>

              {error && (
                <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', fontSize: '0.85rem', marginBottom: '24px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', borderRadius: '14px', background: loading ? '#374151' : 'linear-gradient(135deg, #10B981, #059669)', border: 'none', color: 'white', fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.2s' }}>
                <Users size={18} />
                {loading ? 'Registering...' : 'Register Student'}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AddStudentForm;
