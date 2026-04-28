import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Bus, Navigation } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

// Fix Leaflet icon issue
import 'leaflet/dist/leaflet.css';

const createBusIcon = (color) => {
  const iconHtml = ReactDOMServer.renderToString(<Bus color={color} size={32} fill={color} fillOpacity={0.2} />);
  return L.divIcon({
    html: iconHtml,
    className: 'custom-bus-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const Map = ({ center = [12.9716, 77.5946], zoom = 13, buses = [] }) => {
  return (
    <div className="map-wrapper" style={{ height: '100%', width: '100%', borderRadius: '20px', overflow: 'hidden' }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} />
        {buses.map((bus) => {
          const position = bus.coordinates ? [bus.coordinates.lat, bus.coordinates.lng] : bus.position;
          if (!position) return null;
          
          return (
            <Marker 
              key={bus.id} 
              position={position} 
              icon={createBusIcon(bus.color || '#4F46E5')}
            >
              <Popup>
                <div style={{ color: '#0A0C10', fontWeight: 'bold' }}>
                  <Bus size={18} style={{ marginRight: '8px' }} />
                  Route: {bus.route} <br />
                  Occupancy: {bus.occupancy}/40 <br />
                  Status: {bus.status}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Map;
