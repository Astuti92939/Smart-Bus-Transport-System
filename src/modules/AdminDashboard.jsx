import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Bus, 
  Map as MapIcon, 
  Settings, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  LayoutDashboard,
  LogOut,
  CreditCard,
  Shield,
  TrendingUp,
  Zap,
  ArrowRight,
  UserPlus,
  Search,
  Bell,
  MoreVertical,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Utilities
import { optimizeRoutes } from '../utils/SmartEngine';
import Map from '../components/Map';
import { useSmartBus } from '../context/SmartContext';
import AddBusForm from './AddBusForm';
import AddStudentForm from './AddStudentForm';
import AddStaffForm from './AddStaffForm';
import StudentDetail from './StudentDetail';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboard = ({ buses, userLocation, onLogout }) => {
  const { systemState, addStudent, deleteStudent, deleteBus, assignBus, assignBusToDriver, refreshData } = useSmartBus();
  const admin = systemState.admin || { name: 'Demo Admin', universityId: 'ADM-DEMO' };
  const students = systemState.students || [];
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddBus, setShowAddBus] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [financeSearch, setFinanceSearch] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [optimizations, setOptimizations] = useState([
    { id: 101, name: "Route 101", status: "Efficient", score: 98, color: '#10B981' },
    { id: 202, name: "Route 202", status: "Congested", score: 45, color: '#EF4444' },
    { id: 303, name: "Route 303", status: "Moderate", score: 72, color: '#F59E0B' }
  ]);

  if (showAddBus) return <AddBusForm onBack={() => setShowAddBus(false)} />;
  if (editingBus) return <AddBusForm initialData={editingBus} onBack={() => setEditingBus(null)} />;
  if (showAddStudent) return <AddStudentForm onBack={() => setShowAddStudent(false)} />;
  if (editingStudent) return <AddStudentForm initialData={editingStudent} onBack={() => setEditingStudent(null)} />;
  if (showAddStaff) return <AddStaffForm onBack={() => setShowAddStaff(false)} />;
  if (selectedStudent) return <StudentDetail student={selectedStudent} onBack={() => setSelectedStudent(null)} />;


  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const results = optimizeRoutes(buses, [
        { id: 101, name: "Route 101" },
        { id: 202, name: "Route 202" },
        { id: 303, name: "Route 303" }
      ]);
      setOptimizations(results.map(r => ({
        id: r.id,
        name: r.name,
        status: r.syncScore > 90 ? 'Efficient' : r.syncScore > 60 ? 'Moderate' : 'Inefficient',
        score: r.syncScore,
        color: r.syncScore > 90 ? '#10B981' : r.syncScore > 60 ? '#F59E0B' : '#EF4444'
      })));
      setAnalyzing(false);
    }, 1500);
  };

  const lineData = {
    labels: ['6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM'],
    datasets: [
      {
        label: 'System Load',
        data: [20, 85, 45, 30, 60, 95, 40],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#161B22',
        titleColor: '#F0F6FC',
        bodyColor: '#8B949E',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1
      }
    },
    scales: {
      y: { display: false },
      x: { grid: { display: false }, ticks: { color: '#8B949E' } }
    }
  };

  return (
    <div className="admin-container" style={{ display: 'flex', height: '100vh', width: '100vw', background: '#0A0C10', color: '#F0F6FC', overflow: 'hidden' }}>
      <aside style={{ width: '280px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '24px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div style={{ background: '#10B981', padding: '8px', borderRadius: '12px' }}><Bus size={24} color="white" /></div>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'Outfit' }}>Admin<span style={{ color: '#10B981' }}>Core</span></span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <SidebarItem active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<TrendingUp size={20} />} label="Overview" color="#10B981" />
          <SidebarItem active={activeTab === 'routes'} onClick={() => setActiveTab('routes')} icon={<MapIcon size={20} />} label="Routes & Maps" color="#10B981" />
          <SidebarItem active={activeTab === 'students'} onClick={() => setActiveTab('students')} icon={<Users size={20} />} label="Student Database" color="#10B981" />
          <SidebarItem active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} icon={<CreditCard size={20} />} label="Fee Manager" color="#10B981" />
          <SidebarItem active={activeTab === 'staff'} onClick={() => setActiveTab('staff')} icon={<Shield size={20} />} label="Staff & Drivers" color="#10B981" />
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
          <SidebarItem onClick={onLogout} icon={<LogOut size={20} />} label="Log Out" />
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto' }}>
        <header style={{ padding: '24px 40px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(10, 12, 16, 0.8)', backdropFilter: 'blur(8px)', zIndex: 10 }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8B949E' }} />
            <input 
              type="text" 
              placeholder="Search Student ID, Route..." 
              onKeyDown={(e) => { if(e.key === 'Enter') alert('Search query submitted: ' + e.target.value) }}
              style={{ width: '100%', background: '#161B22', border: '1px solid var(--border)', borderRadius: '12px', padding: '10px 10px 10px 40px', color: 'white', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Bell size={20} cursor="pointer" onClick={() => alert("System Status: All active routes are operating normally.")} />
            <div 
               style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #10B981, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer' }}
               onClick={() => alert(`Admin Profile Details:\n\nName: ${admin.name}\nUniversity ID: ${admin.universityId}\nEmail: ${admin.email || 'N/A'}\nRole: Administrator`)}
               title={`Logged in as ${admin.name}`}
            >
              {admin.name ? admin.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'AD'}
            </div>
          </div>
        </header>

        <section style={{ padding: '40px' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                  <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Fleet Command</h1>
                    <p style={{ color: '#8B949E' }}>Real-time monitoring of all campus transportation nodes.</p>
                  </div>
                  <button className="btn-primary" style={{ background: '#10B981' }} onClick={() => setShowAddBus(true)}>
                    <Plus size={18} /> Add New Bus
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                  <AdminStatCard icon={<Bus color="#10B981" />} label="Active Fleet" value={buses.length.toString()} trend="+2" />
                  <AdminStatCard icon={<Users color="#4F46E5" />} label="Daily Commuters" value="1,240" trend="+5.4%" />
                  <AdminStatCard icon={<ArrowUpRight color="#F59E0B" />} label="Peak Demand" value="8:15 AM" />
                  <AdminStatCard icon={<AlertTriangle color="#EF4444" />} label="Service Alerts" value="2" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px' }}>
                  <div className="glass-card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                      <h3 style={{ fontSize: '1.1rem' }}>Historical Load Factor</h3>
                    </div>
                    <div style={{ height: '300px' }}>
                      <Line data={lineData} options={chartOptions} />
                    </div>
                  </div>

                  <div className="glass-card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                      <Zap size={20} color="#F59E0B" />
                      <h3 style={{ fontSize: '1.1rem' }}>AI Optimization</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {optimizations.map(opt => (
                        <OptimizationItem key={opt.id} route={opt.name} status={opt.status} score={opt.score} color={opt.color} />
                      ))}
                    </div>
                    <button 
                      className="btn-primary" 
                      style={{ width: '100%', marginTop: '32px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.3)', boxShadow: 'none' }}
                      onClick={runAnalysis}
                      disabled={analyzing}
                    >
                      {analyzing ? 'Processing Fleet Data...' : 'Recalculate Efficiency'}
                    </button>
                  </div>
                </div>

                <div className="glass-card" style={{ marginTop: '24px', padding: '24px' }}>
                  <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Active Vehicle Stream</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', color: '#8B949E', fontSize: '0.85rem' }}>
                          <th style={{ padding: '16px' }}>Vehicle ID</th>
                          <th>Route Path</th>
                          <th>Occupancy</th>
                          <th>Current Velocity</th>
                          <th>AI Prediction</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {buses.map(bus => (
                          <VehicleRow 
                            key={bus.id} 
                            id={`BUS-${bus.id}`} 
                            route={bus.route} 
                            occupancy={`${bus.occupancy}/40`} 
                            speed={`${Math.round(bus.speed)} km/h`} 
                            prediction={bus.status} 
                            onEdit={() => setEditingBus(bus)}
                            onRemove={() => deleteBus(bus.id)}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'routes' && (
              <motion.div key="routes" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Global Route Maps</h2>
                <p style={{ color: '#8B949E', marginBottom: '32px' }}>Live visualization of the campus fleet network.</p>
                <div style={{ height: '600px', borderRadius: '24px', overflow: 'hidden' }} className="glass-card">
                  <Map buses={buses} center={userLocation || [12.9716, 77.5946]} zoom={14} />
                </div>
              </motion.div>
            )}

            {activeTab === 'students' && (
              <motion.div key="students" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <div>
                    <h2 style={{ fontSize: '2rem' }}>Core Student Database</h2>
                    <p style={{ color: '#8B949E', fontSize: '0.9rem', marginTop: '4px' }}>
                      Assign students to buses — driver manifests update automatically.
                    </p>
                  </div>
                  <button className="btn-primary" style={{ background: '#4F46E5' }} onClick={() => setShowAddStudent(true)}>
                    <UserPlus size={18} /> Add Student
                  </button>
                </div>
                <div className="glass-card" style={{ padding: '24px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', color: '#8B949E' }}>
                        <th style={{ padding: '16px' }}>Student Name</th>
                        <th>University ID</th>
                        <th>Route</th>
                        <th>Assign to Bus ▾</th>
                        <th>Wallet</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(students || []).map((student) => (
                        <tr key={student.universityId} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                          <td style={{ padding: '16px', fontWeight: 'bold' }}>{student.name}</td>
                          <td style={{ color: '#8B949E', fontFamily: 'monospace', fontSize: '0.88rem' }}>{student.universityId}</td>
                          <td style={{ color: '#8B949E', fontSize: '0.9rem' }}>{student.assignedRoute || '—'}</td>
                          <td>
                            <select
                              value={student.assignedBus?._id || student.assignedBus || ''}
                              onChange={async (e) => {
                                if (e.target.value) await assignBus(student.universityId, e.target.value);
                              }}
                              style={{
                                background: '#161B22', border: `1px solid ${student.assignedBus ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`,
                                borderRadius: '8px', padding: '6px 10px',
                                color: student.assignedBus ? '#10B981' : '#8B949E',
                                fontSize: '0.82rem', outline: 'none', cursor: 'pointer', width: '190px'
                              }}
                            >
                              <option value="">— Not Assigned —</option>
                              {(systemState.buses || []).map(bus => (
                                <option key={bus._id} value={bus._id}>
                                  Bus #{bus.id} — {bus.route}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>₹{student.walletBalance || 0}</td>
                          <td>
                            <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(16,185,129,0.1)', color: '#10B981', fontSize: '0.8rem' }}>{student.status}</span>
                          </td>
                          <td style={{ display: 'flex', gap: '8px', paddingTop: '12px' }}>
                            <button
                              className="btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                              onClick={() => {
                                const live = students.find(s => s.universityId === student.universityId) || student;
                                setSelectedStudent(live);
                              }}
                            >View</button>
                            <button
                              className="btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}
                              onClick={() => deleteStudent(student.universityId)}
                            >Revoke</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {(students || []).length === 0 && (
                    <div style={{ textAlign: 'center', padding: '48px', color: '#8B949E' }}>
                      <Users size={40} style={{ marginBottom: '16px', opacity: 0.3 }} />
                      <p>No students registered yet. Click "Add Student" to get started.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'finance' && (
              <motion.div key="finance" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '2rem' }}>University Fee Manager</h2>
                  <div style={{ position: 'relative', width: '320px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8B949E' }} />
                    <input 
                      type="text" 
                      placeholder="Search Registration No. / ID..." 
                      value={financeSearch}
                      onChange={(e) => setFinanceSearch(e.target.value)}
                      style={{ width: '100%', background: '#161B22', border: '1px solid var(--border)', borderRadius: '12px', padding: '10px 10px 10px 40px', color: 'white', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '40px' }}>
                  <AdminStatCard 
                    icon={<CreditCard color="#10B981" />} 
                    label="Collected Fees" 
                    value={`₹${(students || []).reduce((acc, s) => acc + (s.feesPaid || 0), 0) / 1000}K`} 
                    trend="+12%"
                  />
                  <AdminStatCard 
                    icon={<AlertTriangle color="#EF4444" />} 
                    label="Pending Dues" 
                    value={`₹${(students || []).reduce((acc, s) => acc + (s.dues || 0), 0) / 1000}K`} 
                    trend="-2%"
                  />
                  <AdminStatCard 
                    icon={<TrendingUp color="#3B82F6" />} 
                    label="Active Pass Holders" 
                    value={(students || []).filter(s => s.status === 'Active').length.toString()} 
                  />
                </div>

                {/* ---- Student Search Result Panel ---- */}
                {financeSearch && students.some(s => s.universityId.toLowerCase() === financeSearch.toLowerCase() || s.name.toLowerCase().includes(financeSearch.toLowerCase())) && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '24px', marginBottom: '32px', borderLeft: '4px solid #4F46E5', background: 'rgba(79, 70, 229, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {(() => {
                        const matchedStudent = students.find(s => s.universityId.toLowerCase() === financeSearch.toLowerCase()) || 
                                              students.find(s => s.name.toLowerCase().includes(financeSearch.toLowerCase()));
                        return matchedStudent ? (
                          <>
                            <div>
                              <div style={{ fontSize: '0.8rem', color: '#8B949E', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Found Student Financial Profile</div>
                              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '4px' }}>{matchedStudent.name} <span style={{ color: '#8B949E', fontSize: '0.9rem', fontWeight: '400' }}>({matchedStudent.universityId})</span></h3>
                              <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', background: matchedStudent.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: matchedStudent.status === 'Active' ? '#10B981' : '#EF4444' }}>{matchedStudent.status}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '48px' }}>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.75rem', color: '#8B949E', marginBottom: '4px' }}>Wallet Balance</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#10B981' }}>₹{matchedStudent.walletBalance || 0}</div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.75rem', color: '#8B949E', marginBottom: '4px' }}>Fees Paid</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#F0F6FC' }}>₹{matchedStudent.feesPaid || 0}</div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.75rem', color: '#8B949E', marginBottom: '4px' }}>Current Dues</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#EF4444' }}>₹{matchedStudent.dues || 0}</div>
                              </div>
                            </div>
                          </>
                        ) : null;
                      })()}
                    </div>
                  </motion.div>
                )}

                {/* ---- All Students Fee Records Table ---- */}
                <div className="glass-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>Student Fee Records</h3>
                    <div style={{ fontSize: '0.85rem', color: '#8B949E' }}>
                      Showing {students.filter(s => 
                        !financeSearch || 
                        s.universityId.toLowerCase().includes(financeSearch.toLowerCase()) || 
                        s.name.toLowerCase().includes(financeSearch.toLowerCase())
                      ).length} students
                    </div>
                  </div>
                  
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', color: '#8B949E', fontSize: '0.85rem' }}>
                          <th style={{ padding: '16px' }}>Student Name</th>
                          <th>University ID</th>
                          <th>Fees Paid</th>
                          <th>Outstanding Dues</th>
                          <th>Wallet Balance</th>
                          <th>Payment Status</th>
                          <th style={{ textAlign: 'right' }}>Quick Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students
                          .filter(s => 
                            !financeSearch || 
                            s.universityId.toLowerCase().includes(financeSearch.toLowerCase()) || 
                            s.name.toLowerCase().includes(financeSearch.toLowerCase())
                          )
                          .map((student) => (
                            <tr key={student.universityId} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                              <td style={{ padding: '16px', fontWeight: 'bold' }}>{student.name}</td>
                              <td style={{ color: '#8B949E' }}>{student.universityId}</td>
                              <td style={{ color: '#10B981', fontWeight: '600' }}>₹{student.feesPaid || 0}</td>
                              <td style={{ color: (student.dues || 0) > 0 ? '#EF4444' : '#8B949E', fontWeight: '600' }}>₹{student.dues || 0}</td>
                              <td>₹{student.walletBalance || 0}</td>
                              <td>
                                <span style={{ 
                                  padding: '4px 8px', 
                                  borderRadius: '6px', 
                                  fontSize: '0.75rem', 
                                  fontWeight: '700',
                                  background: (student.dues || 0) === 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', 
                                  color: (student.dues || 0) === 0 ? '#10B981' : '#EF4444' 
                                }}>
                                  {(student.dues || 0) === 0 ? 'CLEAR' : 'OVERDUE'}
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <button 
                                  className="btn-secondary" 
                                  style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                                  onClick={() => setSelectedStudent(student)}
                                >
                                  Manage
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {students.filter(s => 
                    !financeSearch || 
                    s.universityId.toLowerCase().includes(financeSearch.toLowerCase()) || 
                    s.name.toLowerCase().includes(financeSearch.toLowerCase())
                  ).length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#8B949E' }}>
                      <AlertTriangle size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                      <p>No student records found matching "{financeSearch}"</p>
                    </div>
                  )}
                </div>


              </motion.div>
            )}
            {activeTab === 'staff' && (
              <motion.div key="staff" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '4px' }}>Staff & Driver Directory</h2>
                    <div style={{ color: '#8B949E', fontSize: '0.9rem' }}>Official Campus Operators</div>
                  </div>
                  <button 
                    className="btn-primary" 
                    style={{ background: '#7C3AED' }}
                    onClick={() => setShowAddStaff(true)}
                  >
                    <Shield size={18} /> Enroll New Staff
                  </button>
                </div>
                
                <div className="glass-card" style={{ padding: '24px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', color: '#8B949E', fontSize: '0.85rem' }}>
                        <th style={{ padding: '16px' }}>Operator Name</th>
                        <th>Driver ID</th>
                        <th>Phone / Contact</th>
                        <th>Operating Region</th>
                        <th>Assigned Vehicle</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Management</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(systemState.drivers || []).map((driver) => (
                        <tr key={driver.universityId} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                          <td style={{ padding: '16px', fontWeight: 'bold' }}>{driver.name}</td>
                          <td style={{ color: '#8B949E' }}>{driver.universityId}</td>
                          <td style={{ fontSize: '0.9rem' }}>{driver.phone || 'N/A'}</td>
                          <td style={{ fontSize: '0.9rem', color: '#8B949E' }}>{driver.region || 'Main Campus'}</td>
                          <td>
                            <select 
                              value={driver.assignedBus?._id || ''} 
                              onChange={(e) => assignBusToDriver(driver.universityId, e.target.value)}
                              style={{ 
                                background: '#161B22', border: '1px solid rgba(255,255,255,0.08)', 
                                borderRadius: '8px', padding: '6px 10px', color: '#F0F6FC', 
                                fontSize: '0.85rem', outline: 'none', cursor: 'pointer', width: '160px'
                              }}
                            >
                              <option value="">-- Unassigned --</option>
                              {systemState.buses.map(bus => (
                                <option key={bus._id} value={bus._id}>
                                  Bus #{bus.id} - {bus.route}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(16,185,129,0.1)', color: '#10B981', fontSize: '0.8rem' }}>
                              {driver.status || 'Active'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button 
                              className="btn-secondary" 
                              style={{ padding: '6px 12px', fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}
                              onClick={() => {
                                if(window.confirm(`Are you sure you want to remove ${driver.name} from the system?`)) {
                                  // Call context deleteDriver
                                  fetchWithAuth(`${API_URL}/drivers/${driver.universityId}`, { method: 'DELETE' })
                                    .then(() => refreshData());
                                }
                              }}
                            >
                              Relieve Duty
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {(systemState.drivers || []).length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#8B949E' }}>No staff records found.</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick, color = '#4F46E5' }) => (
  <div 
    onClick={onClick}
    style={{ 
      display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
      background: active ? `${color}20` : 'transparent',
      color: active ? color : '#8B949E'
    }}
  >
    {icon}
    <span style={{ fontWeight: active ? '700' : '500', fontSize: '0.95rem' }}>{label}</span>
  </div>
);

const AdminStatCard = ({ icon, label, value, trend }) => (
  <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid rgba(255,255,255,0.05)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
      <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>{icon}</div>
      {trend && <span style={{ color: trend.startsWith('+') ? '#10B981' : '#EF4444', fontSize: '0.75rem', fontWeight: '800' }}>{trend}</span>}
    </div>
    <div style={{ fontSize: '1.75rem', fontWeight: '800', lineHeight: 1, marginBottom: '4px' }}>{value}</div>
    <div style={{ fontSize: '0.8rem', color: '#8B949E' }}>{label}</div>
  </div>
);

const OptimizationItem = ({ route, status, score, color }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ width: '4px', height: '32px', background: color, borderRadius: '4px' }} />
      <div>
        <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{route}</div>
        <div style={{ fontSize: '0.75rem', color: '#8B949E' }}>Current: {status}</div>
      </div>
    </div>
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: color }}>{score}%</div>
      <div style={{ fontSize: '0.7rem', color: '#8B949E' }}>Efficiency</div>
    </div>
  </div>
);

const VehicleRow = ({ id, route, occupancy, speed, prediction, onEdit, onRemove }) => (
  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }}>
    <td style={{ padding: '20px 16px', fontWeight: 'bold', color: '#4F46E5' }}>{id}</td>
    <td style={{ fontSize: '0.9rem' }}>{route}</td>
    <td style={{ fontSize: '0.9rem' }}>{occupancy}</td>
    <td style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}>{speed}</td>
    <td>
      <span style={{ 
        padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold',
        background: 'rgba(255,255,255,0.03)', color: '#F0F6FC', border: '1px solid rgba(255,255,255,0.05)'
      }}>
        {prediction}
      </span>
    </td>
    <td>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          onClick={onEdit}
          style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', background: 'rgba(79, 70, 229, 0.1)', color: '#4F46E5', border: '1px solid rgba(79, 70, 229, 0.2)', cursor: 'pointer' }}
        >
          Edit
        </button>
        <button 
          onClick={onRemove}
          style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer' }}
        >
          Remove
        </button>
      </div>
    </td>
  </tr>
);


export default AdminDashboard;
