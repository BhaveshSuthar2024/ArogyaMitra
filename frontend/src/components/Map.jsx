import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css'; // Make sure this file is in same directory

// Fixing default Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const allLocations = [
  {
    id: 1,
    name: 'Primary Health Center',
    lat: 28.6139,
    lng: 77.2090,
    type: 'Clinic',
  },
  {
    id: 2,
    name: 'Dr. Ayesha (Healthcare Worker)',
    lat: 28.6155,
    lng: 77.2123,
    type: 'Worker',
  },
  {
    id: 3,
    name: 'Mobile Medical Van',
    lat: 28.6121,
    lng: 77.2070,
    type: 'Mobile',
  },
];

export default function MedicalMapPage() {
  const [search, setSearch] = useState('');
  const filteredLocations = allLocations.filter((loc) =>
    loc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="map-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Nearby Services</h2>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul className="location-list">
          {filteredLocations.map((loc) => (
            <li className="location-item" key={loc.id}>
              <h3>{loc.name}</h3>
              <p>Type: {loc.type}</p>
            </li>
          ))}
        </ul>
      </aside>

      {/* Map Area */}
      <main className="map-container">
        <MapContainer center={[28.6139, 77.2090]} zoom={13} className="leaflet-container">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />
          {filteredLocations.map((loc) => (
            <Marker key={loc.id} position={[loc.lat, loc.lng]}>
              <Popup>
                <strong>{loc.name}</strong>
                <br />
                Type: {loc.type}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </main>
    </div>
  );
}
