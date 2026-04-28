import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bus, 
  Map as MapIcon, 
  Settings, 
  LogOut, 
  Bell, 
  Navigation, 
  CreditCard,
  MessageCircle,
  Menu,
  ChevronRight,
  Shield,
  Zap
} from 'lucide-react';
import Map from '../components/Map';
import { useSmartBus } from '../context/SmartContext';

const StudentDashboard = ({ buses, student, updateStudent, userLocation, onLogout }) => {
  const { addTransaction, updateStudent: updateStoredStudent } = useSmartBus();
  const [activeTab, setActiveTab] = useState('tracking');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  
  // Restriction: Only show the student's assigned bus
  const myBusId = student?.assignedBus?.id; 
  const myBusRoute = student?.assignedRoute;
  const myBuses = buses.filter(b => b.id === myBusId || b.route === myBusRoute);
  
  // Profile Editing State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: student?.name || '',
    emergencyContact: '+1 (555) 987-6543' // Default mock for now
  });

  const handleUpdateProfile = async () => {
    try {
      await updateStoredStudent(student.universityId, { name: profileForm.name });
      setIsEditingProfile(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  const handlePay = async () => {
    setPaymentProcessing(true);
    try {
      await updateStudent(student.universityId, { status: 'Active', feesPaid: (student.feesPaid || 0) + 1500, dues: 0 });
      await addTransaction({
        studentName: student.name,
        universityId: student.universityId,
        amount: 1500,
        status: 'Success'
      });
      setPaymentProcessing(false);
      alert("Payment Successful! Your bus pass has been updated.");
    } catch (err) {
      console.error(err);
      setPaymentProcessing(false);
    }
  };

  return (
    <div className="dashboard-container" style={{ display: 'flex', height: '100vh', width: '100vw', background: '#0A0C10', color: '#F0F6FC', overflow: 'hidden' }}>
      <aside style={{ width: '280px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '24px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div style={{ background: '#4F46E5', padding: '8px', borderRadius: '12px' }}><Bus size={24} color="white" /></div>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'Outfit' }}>Campus<span style={{ color: '#4F46E5' }}>Bus</span></span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <SidebarItem active={activeTab === 'tracking'} onClick={() => setActiveTab('tracking')} icon={<MapIcon size={20} />} label="Live Tracking" />
          <SidebarItem active={activeTab === 'seats'} onClick={() => setActiveTab('seats')} icon={<UsersIcon size={20} />} label="Seats & AI" />
          <SidebarItem active={activeTab === 'fees'} onClick={() => setActiveTab('fees')} icon={<CreditCard size={20} />} label="Fee & Wallet" />
          <SidebarItem active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<Shield size={20} />} label="Safety & Guard" />
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
          <SidebarItem onClick={onLogout} icon={<LogOut size={20} />} label="Logout Portal" style={{ color: '#EF4444' }} />
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <header style={{ padding: '24px 40px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(10, 12, 16, 0.8)', backdropFilter: 'blur(8px)', zIndex: 10 }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Student Hub</h1>
            <p style={{ fontSize: '0.85rem', color: '#8B949E' }}>Good morning, {student?.name}</p>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div 
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => alert("You have 2 new notifications: Bus delayed by 5 mins, and Fee payment due.")}
            >
              <Bell size={20} />
              <div style={{ position: 'absolute', top: -4, right: -4, width: '10px', height: '10px', background: '#EF4444', borderRadius: '50%', border: '2px solid #0A0C10' }} />
            </div>
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
              onClick={() => setActiveTab('profile')}
            >
              <div style={{ color: '#8B949E', fontSize: '0.85rem' }}>{student?.universityId}</div>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #4F46E5, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{student?.name ? student.name[0] : 'S'}</div>
            </div>
          </div>
        </header>

        <section style={{ flex: 1, padding: '32px' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'tracking' && (
              <motion.div key="tracking" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} style={{ height: '100%', display: 'flex', gap: '24px' }}>
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                   <div style={{ height: '70%', borderRadius: '24px', overflow: 'hidden' }} className="glass-card">
                    <Map buses={myBuses} center={myBuses[0]?.coordinates ? [myBuses[0].coordinates.lat, myBuses[0].coordinates.lng] : (userLocation || [12.9716, 77.5946])} />
                  </div>
                  <div className="status-grid" style={{ display: 'flex', gap: '16px' }}>
                    <StatCard icon={<Navigation color="#4F46E5" />} value={myBuses[0]?.status || 'N/A'} label="Live Status" />
                    <StatCard icon={<Bus color="#10B981" />} value={myBuses[0]?.route.split(' ')[0] || student?.assignedRoute || 'N/A'} label="Your Assigned Route" />
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="glass-card" style={{ padding: '24px' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <Zap size={18} color="#F59E0B" />
                      <h3 style={{ fontSize: '1rem' }}>AI Delay Analysis</h3>
                    </div>
                    {myBuses.length > 0 ? myBuses.map(bus => (
                      <div key={bus.id} style={{ marginBottom: '16px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
                          <span style={{ color: '#F0F6FC', fontWeight: 'bold' }}>{bus.route}</span>
                          <span style={{ color: bus.status === 'Delay Expected' ? '#EF4444' : bus.status === 'Arriving Early' ? '#10B981' : '#F59E0B', fontWeight: 'bold' }}>
                            {bus.status === 'Delay Expected' ? 'Heavy Traffic' : bus.status === 'Arriving Early' ? 'High Efficiency' : 'Normal Flow'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontSize: '0.85rem', color: '#8B949E' }}>Live Check: {bus.status}</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: '800', fontFamily: 'monospace' }}>{Math.round(bus.speed)} km/h</div>
                        </div>
                      </div>
                    )) : (
                       <p style={{ fontSize: '0.85rem', color: '#8B949E' }}>No active bus tracking for your route.</p>
                    )}
                  </div>

                  <div className="glass-card" style={{ padding: '24px', flex: 1 }}>
                    <h3 style={{ marginBottom: '16px', fontSize: '1rem' }}>Smart Notifications</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {(student?.notifications || []).map(n => (
                        <div key={n.id} style={{ borderLeft: `3px solid ${n.type === 'info' ? '#4F46E5' : '#F59E0B'}`, paddingLeft: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '0 8px 8px 0' }}>
                          <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{n.message}</div>
                          <div style={{ fontSize: '0.7rem', color: '#8B949E', marginTop: '6px' }}>{n.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
               <motion.div key="profile" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: '800px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.75rem', fontFamily: 'Outfit' }}>Profile & Safety Guard</h2>
                  <button 
                    onClick={() => isEditingProfile ? handleUpdateProfile() : setIsEditingProfile(true)}
                    style={{ padding: '8px 20px', borderRadius: '10px', background: isEditingProfile ? '#10B981' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700' }}
                  >
                    {isEditingProfile ? 'Save Profile' : 'Edit Profile'}
                  </button>
                </div>

                <div className="glass-card" style={{ padding: '40px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '16px' }}>
                      <Shield size={32} color="#EF4444" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Campus SOS Direct Line</h3>
                      <p style={{ color: '#8B949E', marginBottom: '24px', lineHeight: '1.5' }}>
                        If you are facing an emergency during your commute or while waiting at a high-risk bus stop, trigger the SOS. This will instantly share your live location with Campus Security and alert the nearest driver.
                      </p>
                      <button 
                        className="btn-primary" 
                        style={{ background: '#EF4444', padding: '16px 32px', fontSize: '1.1rem', fontWeight: 'bold' }}
                        onClick={() => {
                          alert(`SOS SIGNAL SENT!\nLocation: Live tracking enabled.\nCampus Security Dispatched to ${student.name}'s position.`);
                        }}
                      >
                        🚨 ACTIVATE EMERGENCY SOS
                      </button>
                    </div>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '32px', marginTop: '32px' }}>
                  <h3 style={{ marginBottom: '24px', fontSize: '1.25rem' }}>Personal Credentials</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#8B949E', display: 'block', marginBottom: '8px' }}>Full Name</span>
                      {isEditingProfile ? (
                        <input 
                          style={{ width: '100%', background: '#161B22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px', color: 'white', outline: 'none' }}
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        />
                      ) : (
                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{student?.name}</span>
                      )}
                    </div>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#8B949E', display: 'block', marginBottom: '8px' }}>University ID</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#8B949E' }}>{student?.universityId}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#8B949E', display: 'block', marginBottom: '8px' }}>Registered Route</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{student?.assignedRoute}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#8B949E', display: 'block', marginBottom: '8px' }}>Emergency Contact</span>
                      {isEditingProfile ? (
                        <input 
                          style={{ width: '100%', background: '#161B22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px', color: 'white', outline: 'none' }}
                          value={profileForm.emergencyContact}
                          onChange={(e) => setProfileForm({...profileForm, emergencyContact: e.target.value})}
                        />
                      ) : (
                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{profileForm.emergencyContact}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'seats' && (
              <motion.div key="seats" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h2 style={{ fontSize: '1.75rem', fontFamily: 'Outfit' }}>AI-Powered Seat Availability</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                  {myBuses.length > 0 ? myBuses.map(bus => (
                    <div key={bus.id} className="glass-card" style={{ padding: '32px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ fontSize: '1.1rem' }}>{bus.route}</h4>
                          <span style={{ color: '#8B949E', fontSize: '0.8rem' }}>Live Capacity Tracking</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: bus.occupancy > 35 ? '#EF4444' : '#10B981' }}>{bus.occupancy}/40</div>
                        </div>
                      </div>
                      <div style={{ height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden', marginBottom: '20px' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(bus.occupancy/40)*100}%` }} style={{ height: '100%', background: '#4F46E5', boxShadow: `0 0 10px #4F46E5` }} />
                      </div>
                      <div className="glass-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', fontSize: '0.85rem', color: '#8B949E' }}>
                        {bus.occupancy > 30 ? "⚡ Predicted Heavy: Boarding likely slow." : "🟢 Fluid Motion: Preferred for next 10 mins."}
                      </div>
                    </div>
                  )) : (
                    <p style={{ color: '#8B949E' }}>No seat data available for your assigned bus.</p>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'fees' && (
              <motion.div key="fees" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ maxWidth: '800px' }}>
                <h2 style={{ marginBottom: '32px', fontFamily: 'Outfit' }}>Financial Dashboard</h2>
                <div className="glass-card" style={{ padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <div>
                    <h3 style={{ color: '#8B949E', fontSize: '1rem', marginBottom: '8px' }}>Active Transport Pass</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>{student?.status === 'Active' ? 'Valid: Apr 2026' : 'Action Required'}</div>
                    <p style={{ color: '#8B949E', marginTop: '4px' }}>Student ID: {student?.universityId}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div className={student?.status === 'Active' ? 'badge badge-paid' : 'badge badge-unpaid'} style={{ 
                        padding: '12px 24px', 
                        fontSize: '1rem', 
                        marginBottom: '16px',
                        background: student?.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: student?.status === 'Active' ? '#10B981' : '#EF4444',
                        borderRadius: '12px',
                        fontWeight: 'bold'
                    }}>{student?.status}</div>
                    {student?.status !== 'Active' && (
                      <button 
                        className="btn-primary" 
                        onClick={handlePay} 
                        disabled={paymentProcessing}
                        style={{ background: '#4F46E5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer' }}
                      >
                        {paymentProcessing ? 'Processing...' : 'Pay Maintenance Fee'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '32px' }}>
                  <h3 style={{ marginBottom: '24px' }}>Digital Wallet</h3>
                  <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '32px' }}>₹{(student?.feesPaid || 0).toLocaleString()} <span style={{ fontSize: '0.9rem', color: '#8B949E', fontWeight: '400' }}>Paid</span></div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <StatCard icon={<Shield size={18} />} value="Auto" label="Renewal" />
                    <StatCard icon={<Zap size={18} />} value="Digital" label="Pass Type" />
                    <StatCard icon={<CreditCard size={18} />} value={`₹${student?.dues}`} label="Dues" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick, style }) => (
  <div 
    onClick={onClick}
    style={{ 
      display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
      background: active ? 'rgba(79, 70, 229, 0.15)' : 'transparent',
      color: active ? '#4F46E5' : '#8B949E', border: active ? '1px solid rgba(79, 70, 229, 0.2)' : '1px solid transparent',
      ...style
    }}
  >
    {icon}
    <span style={{ fontWeight: active ? '700' : '500', fontSize: '0.95rem' }}>{label}</span>
  </div>
);

const StatCard = ({ icon, value, label }) => (
  <div className="glass-card" style={{ flex: 1, padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '10px' }}>{icon}</div>
    <div>
      <div style={{ fontSize: '1.25rem', fontWeight: '800', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.75rem', color: '#8B949E', marginTop: '4px' }}>{label}</div>
    </div>
  </div>
);

const UsersIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default StudentDashboard;
