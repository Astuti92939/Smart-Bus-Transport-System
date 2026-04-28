/**
 * Smart AI Engine for College Bus Management
 * Handles Real-time logic, delay prediction, and route optimization.
 */

// Simple constant for campus stops
export const CAMPUS_STOPS = [
  { name: 'University Main Gate', position: [12.9716, 77.5946] },
  { name: 'Science Block', position: [12.9750, 77.5980] },
  { name: 'Central Library', position: [12.9800, 77.6000] },
  { name: 'Hostel Complex', position: [12.9850, 77.6050] },
  { name: 'Sports Arena', position: [12.9900, 77.6100] }
];

// Calculate Haversine distance between two points (in km)
export const calculateDistance = (pos1, pos2) => {
  const [lat1, lon1] = pos1;
  const [lat2, lon2] = pos2;
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// AI Predictor for ETA
export const predictETA = (busPos, stopPos, currentSpeed) => {
  const distance = calculateDistance(busPos, stopPos);
  if (currentSpeed <= 0) return Infinity; // Stopped
  
  // Basic ETA = distance / speed
  let eta = (distance / currentSpeed) * 60; // in minutes
  
  // AI Adjustment for "Traffic" (based on time of day simulation)
  const hour = new Date().getHours();
  let trafficMultiplier = 1.0;
  if (hour >= 8 && hour <= 10) trafficMultiplier = 1.8; // Morning peak
  if (hour >= 16 && hour <= 19) trafficMultiplier = 2.4; // Evening peak
  
  return Math.round(eta * trafficMultiplier);
};

// Route Optimizer logic
export const optimizeRoutes = (buses, routes) => {
  return routes.map(route => {
    const routeBuses = buses.filter(b => b.routeId === route.id);
    const avgOccupancy = routeBuses.reduce((acc, b) => acc + b.occupancy, 0) / (routeBuses.length || 1);
    
    // Efficiency score based on occupancy (ideally 60-80%) and frequency
    const score = Math.max(0, 100 - Math.abs(avgOccupancy - 70));
    
    return {
      ...route,
      syncScore: Math.round(score),
      recommendation: score < 50 ? 'Add more buses' : score > 90 ? 'Perfectly optimized' : 'Moderate performance'
    };
  });
};
