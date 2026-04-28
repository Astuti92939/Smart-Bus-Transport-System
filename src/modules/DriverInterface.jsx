import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Navigation, 
  Settings, 
  Users, 
  Bus, 
  QrCode, 
  Map as MapIcon, 
  AlertTriangle, 
  Clock, 
  LogOut, 
  CheckCircle2,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import Map from '../components/Map';
import { useSmartBus } from '../context/SmartContext';

const DriverInterface = ({ bus, onLogout }) => {
  const { systemState } = useSmartBus();

  if (!bus) {
    return (
      <div style={{ height: '100vh', background: '#0A0C10', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#F0F6FC' }}>
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }} 
          transition={{ duration: 2, repeat: Infinity }}
          style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '40px', borderRadius: '50%', marginBottom: '32px' }}
        >
          <Bus size={64} color="#4F46E5" />
        </motion.div>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>Vehicle Not Allotted</h2>
        <p style={{ color: '#8B949E', fontSize: '1.1rem', marginBottom: '40px' }}>Your account is in standby. Awaiting control center assignment...</p>
        <button className="btn-secondary" onClick={onLogout} style={{ padding: '12px 24px' }}><LogOut size={18} /> Sign Out</button>
      </div>
    );
  }

  // Students assigned to this bus via populate
  const assignedStudents = (systemState.students || []).filter(s => {
    if (!s.assignedBus) return false;
    const busIdVal = s.assignedBus._id ? s.assignedBus._id.toString() : s.assignedBus.toString();
    const currentBusId = bus._id?.toString() || bus.toString();
    return busIdVal === currentBusId;
  });
  const [isDriving, setIsDriving] = useState(false);
  const [occupancy, setOccupancy] = useState(bus.occupancy);
  const [status, setStatus] = useState(bus.status);
  const [busPosition, setBusPosition] = useState(bus.coordinates ? [bus.coordinates.lat, bus.coordinates.lng] : bus.position || [12.9716, 77.5946]);
  const [scannedLogs, setScannedLogs] = useState([
    { id: 1, name: "Student 102", time: "18:24", status: "Entry" }
  ]);

  useEffect(() => {
    if (!isDriving) {
      const pos = bus.coordinates ? [bus.coordinates.lat, bus.coordinates.lng] : bus.position;
      if (pos) setBusPosition(pos);
      setStatus(bus.status);
    }
  }, [bus.coordinates, bus.position, isDriving, bus.status]);

  const toggleDriving = () => {
    setIsDriving(!isDriving);
    setStatus(!isDriving ? 'On Route' : 'Standby');
  };

  const handleQRSim = (type) => {
    const newOccupancy = type === 'entry' ? occupancy + 1 : occupancy - 1;
    if (newOccupancy >= 0 && newOccupancy <= 40) {
      setOccupancy(newOccupancy);
      setScannedLogs([
        { id: Date.now(), name: `Student ${Math.floor(Math.random() * 900) + 100}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: type === 'entry' ? 'Entry' : 'Exit' },
        ...scannedLogs.slice(0, 4)
      ]);
    }
  };

  return (
    <div className="driver-hud" style={{ height: '100vh', background: '#0A0C10', display: 'flex', flexDirection: 'column', color: '#F0F6FC' }}>
      {/* Top HUD */}
      <div style={{ padding: '20px 40px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#4F46E5', padding: '8px', borderRadius: '12px' }}><Bus size={24} color="white" /></div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>{bus.route}</div>
              <div style={{ fontSize: '0.75rem', color: '#8B949E' }}>Official Vehicle: BUS #{bus.id}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#8B949E', textTransform: 'uppercase' }}>Current Speed</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: isDriving ? '#10B981' : '#F0F6FC' }}>{isDriving ? '34' : '0'} <span style={{ fontSize: '0.8rem', fontWeight: '400' }}>km/h</span></div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#8B949E', textTransform: 'uppercase' }}>Status</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: isDriving ? '#10B981' : '#F59E0B' }}>{status}</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn-secondary" onClick={onLogout}><LogOut size={18} /> Exit HUD</button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '2px', overflow: 'hidden' }}>
        {/* Left Control Panel */}
        <div style={{ width: '380px', padding: '32px', background: 'rgba(255,255,255,0.01)', overflowY: 'auto' }}>
          
          {/* Driver Identity Card */}
          <div className="glass-card" style={{ padding: '24px', marginBottom: '32px', borderLeft: '4px solid #F59E0B' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
               <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: '2px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.25rem' }}>
                  {systemState.driver?.name?.split(' ').map(n => n[0]).join('') || 'DR'}
               </div>
               <div>
                  <div style={{ fontSize: '0.75rem', color: '#8B949E', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>OPERATOR ON DUTY</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#F0F6FC' }}>{systemState.driver?.name || 'Loading Operator...'}</div>
                  <div style={{ fontSize: '0.85rem', color: '#8B949E' }}>{systemState.driver?.universityId} — {systemState.driver?.region || 'Home Hub'}</div>
               </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '32px', textAlign: 'center', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1rem', color: '#8B949E', marginBottom: '16px' }}>ENGINE CTRL</h3>
            <motion.button 
              className="btn-primary" 
              style={{ padding: '24px', width: '100%', justifyContent: 'center', background: isDriving ? '#EF4444' : '#4F46E5', borderRadius: '20px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleDriving}
            >
              {isDriving ? 'STOP TRANSMISSION' : 'START TRANSMISSION'}
            </motion.button>
          </div>

          <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1rem' }}>Seat Availability</h3>
              <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{occupancy}/40</div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
               <button className="btn-secondary" style={{ flex: 1, color: '#10B981' }} onClick={() => handleQRSim('entry')}><ChevronUp /> Entry</button>
               <button className="btn-secondary" style={{ flex: 1, color: '#EF4444' }} onClick={() => handleQRSim('exit')}><ChevronDown /> Exit</button>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <h4 style={{ fontSize: '0.8rem', color: '#8B949E', marginBottom: '16px' }}>RECENT QR SCANS</h4>
              {scannedLogs.map(log => (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: '600' }}>{log.name}</span>
                  <span style={{ color: '#8B949E' }}>{log.time}</span>
                  <span style={{ color: log.status === 'Entry' ? '#10B981' : '#EF4444' }}>{log.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Student Manifest — populated from DB */}
          <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem' }}>Student Manifest</h3>
              <span style={{ fontSize: '0.8rem', background: 'rgba(79,70,229,0.15)', color: '#4F46E5', padding: '4px 10px', borderRadius: '8px', fontWeight: '700' }}>
                {assignedStudents.length} Aboard
              </span>
            </div>
            {assignedStudents.length === 0 ? (
              <p style={{ color: '#8B949E', fontSize: '0.85rem' }}>No students have signed up for this vehicle yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {assignedStudents.map(s => (
                  <div key={s.universityId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.75rem' }}>
                        {s.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', color: '#F0F6FC' }}>{s.name}</div>
                        <div style={{ color: '#8B949E', fontSize: '0.7rem' }}>ID: {s.universityId}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ display: 'block', color: s.status === 'Active' ? '#10B981' : '#EF4444', fontSize: '0.75rem', fontWeight: '800', marginBottom: '4px' }}>{s.status}</span>
                      <div style={{ color: '#8B949E', fontSize: '0.7rem' }}>{s.assignedRoute || 'Bus Route'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', color: '#EF4444', marginBottom: '16px' }}>EMERGENCY</h3>
            <button 
              className="btn-secondary" 
              style={{ width: '100%', borderColor: '#EF4444', color: '#EF4444' }}
              onClick={() => alert(`BREAKDOWN ALERT BROADCASTED!\nStatus sent to Admin Core and Students waiting on ${bus.route}.`)}
            >
              <AlertTriangle size={18} /> TRIGGER BREAKDOWN ALERT
            </button>
          </div>
        </div>

        {/* Navigation View */}
        <div style={{ flex: 1, position: 'relative' }}>
          <Map buses={[{ id: 'driver', route: bus.route, position: busPosition, occupancy, status: isDriving ? 'Driving' : 'Standby', color: '#4F46E5' }]} center={busPosition} zoom={16} />
          
          <div style={{ position: 'absolute', bottom: '40px', right: '40px', width: '300px', zIndex: 1000 }}>
            <div className="glass-card" style={{ padding: '20px' }}>
              <h4 style={{ marginBottom: '12px', fontSize: '0.9rem' }}>NEXT STOP</h4>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '4px' }}>Main Library</div>
              <div style={{ fontSize: '0.85rem', color: '#8B949E' }}>ETA: 8 mins | Distance: 1.2km</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverInterface;
