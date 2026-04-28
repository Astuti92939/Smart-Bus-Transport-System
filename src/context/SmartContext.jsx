import React, { createContext, useContext, useState, useEffect } from 'react';

const SmartContext = createContext();
const API_URL = '/api';

const MOCK_DATA = {
  buses: [
    { id: 1, route: "Route 101 - Campus North", occupancy: 24, speed: 45, status: "Normal", coordinates: { lat: 12.9716, lng: 77.5946 }, stops: ["Library", "Science Block", "Hostel A"] },
    { id: 2, route: "Route 202 - South Gate", occupancy: 32, speed: 12, status: "Delay Expected", coordinates: { lat: 12.9720, lng: 77.5950 }, stops: ["Main Gate", "Admin Block", "Cafeteria"] },
    { id: 3, route: "Route 303 - City Express", occupancy: 18, speed: 52, status: "Arriving Early", coordinates: { lat: 12.9710, lng: 77.5930 }, stops: ["City Center", "Railway Station", "Campus"] }
  ],
  students: [
    { name: 'Alex Johnson', universityId: 'STU-2020-X', assignedRoute: 'Route 101', status: 'Active', feesPaid: 1500, dues: 0, walletBalance: 5000, profilePic: 'AJ' },
    { name: 'Sarah Connor', universityId: 'STU-2021-X', assignedRoute: 'Route 202', status: 'Active', feesPaid: 2500, dues: 400, walletBalance: 1200, profilePic: 'SC' }
  ],
  admin: { name: 'System Admin', universityId: 'ADM-01', role: 'admin' },
  driver: { name: 'Robert Miller', universityId: 'DRV-01', assignedBus: { id: 1, route: 'Route 101 - Campus North', occupancy: 24, speed: 45, status: 'Normal', coordinates: { lat: 12.9716, lng: 77.5946 } }, phone: '+91 91234 56789' },
  transactions: [
    { id: 'TXN-998', type: 'Credit', amount: 500, date: new Date().toISOString(), status: 'Success', description: 'Monthly Pass' },
    { id: 'TXN-997', type: 'Debit', amount: 25, date: new Date().toISOString(), status: 'Success', description: 'Single Trip' }
  ]
};

export const SmartProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(localStorage.getItem('smartbus_role'));
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('smartbus_token'));
  const [systemState, setSystemState] = useState({
    buses: [],
    student: null,
    students: [],
    drivers: [],
    transactions: [],
    admin: null,
    driver: null
  });

  const fetchWithAuth = async (url, options = {}) => {
    const headers = { 
      'Content-Type': 'application/json',
      ...options.headers,
      'Authorization': `Bearer ${authToken}`
    };
    return fetch(url, { ...options, headers });
  };

  const fetchData = async () => {
    if (!authToken) {
        setIsLoading(false);
        return;
    }
    try {
      const authHeader = { 'Authorization': `Bearer ${authToken}` };

      // Try fetching from real server
      try {
        const userRes = await fetch(`${API_URL}/auth/me`, { headers: authHeader });
        if (userRes.status === 401) {
          logout();  // Clear stale token
          return;
        }
        const userData = userRes.ok ? await userRes.json() : null;

        const [busesRes, studentsRes, driversRes, txnsRes] = await Promise.all([
          fetch(`${API_URL}/buses`),
          fetchWithAuth(`${API_URL}/students`),
          fetchWithAuth(`${API_URL}/drivers`),
          fetchWithAuth(`${API_URL}/transactions`)
        ]);
        
        const buses = busesRes.ok ? await busesRes.json() : [];
        const students = studentsRes.ok ? await studentsRes.json() : [];
        const drivers = driversRes.ok ? await driversRes.json() : [];
        const transactions = txnsRes.ok ? await txnsRes.json() : [];
        
        setSystemState(prev => ({
          ...prev,
          buses: Array.isArray(buses) && buses.length ? buses : MOCK_DATA.buses,
          students: Array.isArray(students) && students.length ? students : MOCK_DATA.students,
          drivers: Array.isArray(drivers) && drivers.length ? drivers : [],
          transactions: Array.isArray(transactions) && transactions.length ? transactions : MOCK_DATA.transactions,
          admin: (userRole === 'admin' && userData) ? userData : (userRole === 'admin' ? MOCK_DATA.admin : null),
          student: (userRole === 'student' && userData) ? userData : (students.find(s => s.universityId === prev.student?.universityId) || (userRole === 'student' ? MOCK_DATA.students[0] : null)),
          driver: (userRole === 'driver' && userData) ? userData : (drivers.find(d => d.universityId === prev.driver?.universityId) || (userRole === 'driver' ? MOCK_DATA.driver : null))
        }));
      } catch (apiErr) {
        console.warn("Backend unreachable, switching to demo mode data.");
        setSystemState(prev => ({
          ...prev,
          buses: MOCK_DATA.buses,
          students: MOCK_DATA.students,
          transactions: MOCK_DATA.transactions,
          admin: userRole === 'admin' ? MOCK_DATA.admin : null,
          student: userRole === 'student' ? MOCK_DATA.students[0] : null,
          driver: userRole === 'driver' ? MOCK_DATA.driver : null
        }));
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Critical error in fetchData:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    if (!authToken) return;

    const simulation = setInterval(() => {
      setSystemState(prev => {
        if (!prev.buses.length) return prev;
        
        const nextBuses = prev.buses.map(bus => {
          const moveX = (Math.random() - 0.5) * 0.0005;
          const moveY = (Math.random() - 0.5) * 0.0005;
          const newSpeed = Math.max(0, Math.min(60, (bus.speed || 0) + (Math.random() - 0.5) * 5));
          
          let newStatus = 'On Route';
          if (newSpeed < 10) newStatus = 'Delay Expected';
          if (newSpeed > 35) newStatus = 'Arriving Early';
          
          const updatedBus = {
            ...bus,
            coordinates: {
              lat: (bus.coordinates?.lat || 12.9716) + moveX,
              lng: (bus.coordinates?.lng || 77.5946) + moveY
            },
            speed: newSpeed,
            status: newStatus
          };

          // Occasionally sync to backend
          if (Math.random() > 0.9 && userRole === 'admin') {
             fetchWithAuth(`${API_URL}/buses/${bus.id}`, {
               method: 'PUT',
               body: JSON.stringify(updatedBus)
             }).catch(() => {});
          }

          return updatedBus;
        });
        return { ...prev, buses: nextBuses };
      });
    }, 5000);

    return () => clearInterval(simulation);
  }, [authToken]);

  const login = async (role, universityId, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ universityId, password, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      setAuthToken(data.token);
      setUserRole(data.role);
      localStorage.setItem('smartbus_token', data.token);
      localStorage.setItem('smartbus_role', data.role);

      setSystemState(prev => ({
        ...prev,
        [data.role]: data.user
      }));

      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 900);
      return { success: true };
    } catch (err) {
      console.warn(`Login failed for ${role} (${universityId}):`, err.message);
      
      // Check for Demo credentials fallback
      if (password === 'password123') {
        let user;
        if (role === 'admin' && universityId === 'ADM-01') user = MOCK_DATA.admin;
        else if (role === 'student' && (universityId === 'STU-2020-X' || universityId.startsWith('STU'))) user = MOCK_DATA.students[0];
        else if (role === 'driver' && universityId === 'DRV-01') user = MOCK_DATA.driver;

        if (user) {
          const fakeToken = "demo-token-" + Date.now();
          setAuthToken(fakeToken);
          setUserRole(role);
          localStorage.setItem('smartbus_token', fakeToken);
          localStorage.setItem('smartbus_role', role);
          setSystemState(prev => ({
            ...prev,
            buses: MOCK_DATA.buses,
            students: MOCK_DATA.students,
            transactions: MOCK_DATA.transactions,
            [role]: user
          }));
          setIsLoading(true);
          setTimeout(() => setIsLoading(false), 900);
          return { success: true };
        }
      }
      return { success: false, message: "System is in Demo Mode. Connect your MongoDB or use 'ADM-01' / 'password123' to enter." };
    }
  };

  const register = async (role, userData) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      setAuthToken(data.token);
      setUserRole(data.role);
      localStorage.setItem('smartbus_token', data.token);
      localStorage.setItem('smartbus_role', data.role);

      setSystemState(prev => ({
        ...prev,
        [data.role]: data.user
      }));

      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 900);
      return { success: true };
    } catch (err) {
      console.warn("Registration API failed:", err.message);
      
      // Only fallback to guest if the error is a true network/fetch error
      // If it's a real timeout from the server, it probably means the server is struggling
      if (err instanceof TypeError || err.message.includes('fetch')) {
        const fakeToken = "guest-token-" + Date.now();
        const guestUser = { ...userData, universityId: userData.universityId || 'GUEST-' + Date.now(), role };
        setAuthToken(fakeToken);
        setUserRole(role);
        localStorage.setItem('smartbus_token', fakeToken);
        localStorage.setItem('smartbus_role', role);
        setSystemState(prev => ({ ...prev, [role]: guestUser }));
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 900);
        return { success: true };
      }
      
      return { success: false, message: "Database error: " + err.message };
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUserRole(null);
    localStorage.removeItem('smartbus_token');
    localStorage.removeItem('smartbus_role');
    setSystemState(prev => ({ ...prev, admin: null, student: null, driver: null }));
  };

  const updateStudent = async (universityId, updates) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/students/${universityId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      setSystemState(prev => ({
        ...prev,
        students: (prev.students || []).map(s => s.universityId === universityId ? data : s),
        student: (prev.student && prev.student.universityId === universityId) ? data : prev.student
      }));
      return data;
    } catch (err) {
      console.error("Error updating student:", err);
    }
  };

  const addStudent = async (studentData) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/students`, {
        method: 'POST',
        body: JSON.stringify(studentData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add student');
      
      setSystemState(prev => ({
        ...prev,
        students: [...prev.students, data]
      }));
      return data;
    } catch (err) {
      console.error("Error adding student:", err);
      throw err;
    }
  };

  const deleteStudent = async (universityId) => {
    try {
      await fetchWithAuth(`${API_URL}/students/${universityId}`, { method: 'DELETE' });
      setSystemState(prev => ({
        ...prev,
        students: (prev.students || []).filter(s => s.universityId !== universityId)
      }));
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  const addTransaction = async (txnData) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/transactions`, {
        method: 'POST',
        body: JSON.stringify({ ...txnData, txnId: `TXN-${Math.floor(Math.random() * 10000)}` })
      });
      const data = await res.json();
      setSystemState(prev => ({
        ...prev,
        transactions: [data, ...prev.transactions]
      }));
      return data;
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  const addBus = async (busData) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/buses`, {
        method: 'POST',
        body: JSON.stringify(busData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add bus');
      
      setSystemState(prev => ({
        ...prev,
        buses: [...prev.buses, data]
      }));
      return data;
    } catch (err) {
      console.error('Error adding bus:', err);
      throw err;
    }
  };

  const deleteBus = async (id) => {
    try {
      await fetchWithAuth(`${API_URL}/buses/${id}`, { method: 'DELETE' });
      await fetchData();
    } catch (err) {
      console.error('Delete bus error:', err);
    }
  };

  const assignBusToDriver = async (driverId, busId) => {
    try {
      await fetchWithAuth(`${API_URL}/drivers/${driverId}/assign-bus`, {
        method: 'PUT',
        body: JSON.stringify({ busId })
      });
      await fetchData();
    } catch (err) {
      console.error('Assign bus error:', err);
    }
  };

  const updateBus = async (busId, busData) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/buses/${busId}`, {
        method: 'PUT',
        body: JSON.stringify(busData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update bus');
      
      setSystemState(prev => ({
        ...prev,
        buses: (prev.buses || []).map(b => b.id === busId ? data : b)
      }));
      return data;
    } catch (err) {
      console.error("Error updating bus:", err);
      throw err;
    }
  };

  const assignBus = async (universityId, busObjectId) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/students/${universityId}/assign-bus`, {
        method: 'PUT',
        body: JSON.stringify({ busObjectId })
      });
      const data = await res.json();
      setSystemState(prev => ({
        ...prev,
        students: (prev.students || []).map(s => s.universityId === universityId ? data : s),
        student: (prev.student && prev.student.universityId === universityId) ? data : prev.student
      }));
      return data;
    } catch (err) {
      console.error('Error assigning bus:', err);
    }
  };

  return (
    <SmartContext.Provider value={{
      systemState,
      userRole,
      isLoading,
      userLocation,
      setIsLoading,
      login,
      register,
      logout,
      updateStudent,
      addStudent,
      deleteStudent,
      addTransaction,
      addBus,
      deleteBus,
      updateBus,
      assignBus,
      assignBusToDriver,
      refreshData: fetchData
    }}>
      {children}
    </SmartContext.Provider>
  );
};

export const useSmartBus = () => useContext(SmartContext);
