import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bus, ArrowLeft, CheckCircle } from 'lucide-react';
import { useSmartBus } from '../context/SmartContext';

const AddBusForm = ({ onBack, initialData = null }) => {
  const { addBus, updateBus, systemState } = useSmartBus();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    route: initialData?.route || '',
    occupancy: initialData?.occupancy || '',
    speed: initialData?.speed || '',
    status: initialData?.status || 'On Route',
    lat: initialData?.coordinates?.lat || '12.9716',
    lng: initialData?.coordinates?.lng || '77.5946',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.route || !form.occupancy || !form.speed) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      const busData = {
        route: form.route,
        occupancy: Number(form.occupancy),
        speed: Number(form.speed),
        status: form.status,
        coordinates: { lat: Number(form.lat), lng: Number(form.lng) },
      };

      if (initialData) {
        await updateBus(initialData.id, busData);
      } else {
        const maxId = systemState.buses.reduce((max, b) => Math.max(max, b.id || 0), 0);
        await addBus({ ...busData, id: maxId + 1 });
      }
      setSubmitted(true);
      setTimeout(() => onBack(), 1800);
    } catch (err) {
      setError(`Failed to ${initialData ? 'update' : 'add'} bus. Please try again.`);
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
      <header style={{ padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.01)', backdropFilter: 'blur(8px)' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px 16px', color: '#8B949E', cursor: 'pointer', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '8px' }}>
          <div style={{ background: '#10B981', padding: '8px', borderRadius: '12px' }}><Bus size={20} color="white" /></div>
          <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>Admin<span style={{ color: '#10B981' }}>Core</span> — {initialData ? `Edit Bus #${initialData.id}` : 'Register New Bus'}</span>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
            <CheckCircle size={64} color="#10B981" style={{ marginBottom: '24px' }} />
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '8px' }}>Bus {initialData ? 'Updated' : 'Added'} Successfully!</h2>
            <p style={{ color: '#8B949E' }}>Redirecting you back to Fleet Command...</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '640px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '48px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '8px' }}>{initialData ? 'Modify Vehicle Details' : 'Register New Bus'}</h1>
            <p style={{ color: '#8B949E', marginBottom: '40px' }}>Fill in the details below. The changes will be applied to the live fleet database.</p>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Route Name *</label>
                  <input name="route" value={form.route} onChange={handleChange} placeholder="e.g. Route 404 – Library Block" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Current Occupancy *</label>
                  <input name="occupancy" type="number" min="0" max="40" value={form.occupancy} onChange={handleChange} placeholder="0 – 40" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Current Speed (km/h) *</label>
                  <input name="speed" type="number" min="0" value={form.speed} onChange={handleChange} placeholder="e.g. 35" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
                    <option value="On Route">On Route</option>
                    <option value="Standby">Standby</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Arriving Early">Arriving Early</option>
                  </select>
                </div>
                <div><label style={labelStyle}>Latitude</label><input name="lat" type="number" step="any" value={form.lat} onChange={handleChange} style={inputStyle} /></div>
                <div><label style={labelStyle}>Longitude</label><input name="lng" type="number" step="any" value={form.lng} onChange={handleChange} style={inputStyle} /></div>
              </div>

              {error && <p style={{ color: '#EF4444', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</p>}

              <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', borderRadius: '14px', background: loading ? '#374151' : 'linear-gradient(135deg, #10B981, #059669)', border: 'none', color: 'white', fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <Bus size={18} />
                {loading ? (initialData ? 'Updating...' : 'Registering...') : (initialData ? 'Update Vehicle' : 'Add Bus to Fleet')}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AddBusForm;
