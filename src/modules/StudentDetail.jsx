import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, CreditCard, Bus, Shield, TrendingUp, AlertTriangle, CheckCircle, ChevronDown } from 'lucide-react';
import { useSmartBus } from '../context/SmartContext';

const StudentDetail = ({ student: initialStudent, onBack }) => {
  const { systemState, assignBus } = useSmartBus();
  const buses = systemState.buses || [];

  // Keep local copy so UI updates after assignment without page reload
  const [student, setStudent] = useState(initialStudent);
  const [selectedBusId, setSelectedBusId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [assignMsg, setAssignMsg] = useState('');

  if (!student) return null;

  const isPaid = student.dues === 0;
  const totalFees = (student.feesPaid || 0) + (student.dues || 0);
  const occupancyPct = totalFees > 0 ? Math.min(100, Math.round(((student.feesPaid || 0) / totalFees) * 100)) : 100;

  // The populated bus object (if assigned)
  const assignedBus = student.assignedBus;

  const handleAssignBus = async () => {
    if (!selectedBusId) return;
    setAssigning(true);
    setAssignMsg('');
    try {
      const updated = await assignBus(student.universityId, selectedBusId);
      if (updated) {
        setStudent(updated);
        setAssignMsg('✅ Bus assigned successfully!');
        setSelectedBusId('');
      }
    } catch (err) {
      setAssignMsg('❌ Failed to assign bus. Please try again.');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#0A0C10', color: '#F0F6FC', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.01)' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px 16px', color: '#8B949E', cursor: 'pointer', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Database
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '8px' }}>
          <div style={{ background: '#4F46E5', padding: '8px', borderRadius: '12px' }}><User size={20} color="white" /></div>
          <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>Student <span style={{ color: '#4F46E5' }}>Profile</span></span>
        </div>
      </header>

      <div style={{ flex: 1, padding: '40px', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* Identity Card */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', fontWeight: '800', flexShrink: 0 }}>
                {student.name[0].toUpperCase()}
              </div>
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '6px' }}>{student.name}</h1>
                <p style={{ color: '#8B949E', fontSize: '0.95rem', marginBottom: '8px' }}>
                  University ID: <span style={{ color: '#F0F6FC', fontFamily: 'monospace' }}>{student.universityId}</span>
                </p>
                <span style={{ padding: '4px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', background: student.status === 'Active' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: student.status === 'Active' ? '#10B981' : '#EF4444' }}>
                  {student.status}
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: '#8B949E', marginBottom: '4px' }}>Registered</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>
                {student.createdAt ? new Date(student.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
              </div>
            </div>
          </div>

          {/* Stat Boxes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
            <StatBox icon={<Bus size={20} color="#4F46E5" />} label="Assigned Route" value={student.assignedRoute || '—'} bg="rgba(79,70,229,0.1)" />
            <StatBox icon={<CreditCard size={20} color="#10B981" />} label="Wallet Balance" value={`₹${(student.walletBalance || 0).toLocaleString()}`} bg="rgba(16,185,129,0.1)" />
            <StatBox icon={isPaid ? <CheckCircle size={20} color="#10B981" /> : <AlertTriangle size={20} color="#EF4444" />} label="Fee Status" value={isPaid ? 'All Clear' : `₹${student.dues} Due`} bg={isPaid ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'} />
          </div>

          {/* Bottom Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            {/* Financial */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <TrendingUp size={18} color="#F59E0B" />
                <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Financial Summary</h3>
              </div>
              <FinRow label="Fees Paid" value={`₹${(student.feesPaid || 0).toLocaleString()}`} color="#10B981" />
              <FinRow label="Outstanding Dues" value={`₹${(student.dues || 0).toLocaleString()}`} color={student.dues > 0 ? '#EF4444' : '#10B981'} />
              <FinRow label="Wallet Balance" value={`₹${(student.walletBalance || 0).toLocaleString()}`} color="#4F46E5" />
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', color: '#8B949E' }}>
                  <span>Payment Completion</span><span>{occupancyPct}%</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${occupancyPct}%` }} transition={{ duration: 0.8 }} style={{ height: '100%', background: 'linear-gradient(90deg, #10B981, #059669)', borderRadius: '4px' }} />
                </div>
              </div>
            </div>

            {/* Transport */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <Bus size={18} color="#4F46E5" />
                <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Transport Details</h3>
              </div>
              <FinRow label="Assigned Route" value={student.assignedRoute || '—'} color="#4F46E5" />
              <FinRow label="Assigned Bus" value={assignedBus ? `Bus #${assignedBus.id} — ${assignedBus.route}` : 'Not Assigned'} color={assignedBus ? '#10B981' : '#8B949E'} />
              <FinRow label="Pass Type" value="Semester Pass" color="#F0F6FC" />
              <FinRow label="Emergency Contact" value="+91 98765 43210" color="#F0F6FC" />
              <div style={{ marginTop: '20px', padding: '14px 16px', background: student.status === 'Active' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', borderRadius: '12px', border: `1px solid ${student.status === 'Active' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={16} color={student.status === 'Active' ? '#10B981' : '#EF4444'} />
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: student.status === 'Active' ? '#10B981' : '#EF4444' }}>
                    {student.status === 'Active' ? 'Access Granted — Valid Bus Pass' : 'Access Restricted — Contact Admin'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ---- Assign Bus Panel ---- */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(79,70,229,0.3)', borderRadius: '20px', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Bus size={18} color="#4F46E5" />
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Assign / Reassign Bus</h3>
            </div>
            <p style={{ color: '#8B949E', fontSize: '0.85rem', marginBottom: '24px' }}>
              Select a bus from the fleet to assign to this student. The student's route and bus reference will be updated in the database.
            </p>

            {assignedBus && (
              <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem', color: '#10B981' }}>
                🚌 Currently assigned: <strong>Bus #{assignedBus.id} — {assignedBus.route}</strong> (Status: {assignedBus.status})
              </div>
            )}

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <select
                  value={selectedBusId}
                  onChange={e => setSelectedBusId(e.target.value)}
                  style={{ width: '100%', background: '#161B22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 44px 14px 16px', color: selectedBusId ? '#F0F6FC' : '#8B949E', fontSize: '0.95rem', outline: 'none', appearance: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
                >
                  <option value="">— Select a Bus from Fleet —</option>
                  {buses.map(bus => (
                    <option key={bus._id} value={bus._id}>
                      Bus #{bus.id} — {bus.route} ({bus.status}, {bus.occupancy}/40 seats)
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} color="#8B949E" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>

              <button
                onClick={handleAssignBus}
                disabled={!selectedBusId || assigning}
                style={{ padding: '14px 28px', borderRadius: '12px', background: !selectedBusId || assigning ? '#374151' : 'linear-gradient(135deg, #4F46E5, #7C3AED)', border: 'none', color: 'white', fontSize: '0.95rem', fontWeight: '700', cursor: !selectedBusId || assigning ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
              >
                {assigning ? 'Assigning...' : 'Assign Bus'}
              </button>
            </div>

            {assignMsg && (
              <p style={{ marginTop: '16px', fontSize: '0.9rem', color: assignMsg.startsWith('✅') ? '#10B981' : '#EF4444' }}>{assignMsg}</p>
            )}
          </div>

        </motion.div>
      </div>
    </div>
  );
};

const StatBox = ({ icon, label, value, bg }) => (
  <div style={{ background: bg, borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>{icon}</div>
    <div>
      <div style={{ fontSize: '0.75rem', color: '#8B949E', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '1.1rem', fontWeight: '800' }}>{value}</div>
    </div>
  </div>
);

const FinRow = ({ label, value, color }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
    <span style={{ fontSize: '0.88rem', color: '#8B949E' }}>{label}</span>
    <span style={{ fontSize: '0.95rem', fontWeight: '700', color: color || '#F0F6FC' }}>{value}</span>
  </div>
);

export default StudentDetail;
