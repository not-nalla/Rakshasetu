import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

export default function MapCard({
  center = [18.5204, 73.8567],
  zoom = 13,
  markers = [],
  shelter,
  className = '',
}) {
  return (
    <div className={`relative rounded-3xl overflow-hidden bg-mapSurface ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full min-h-[350px]"
        style={{ background: '#E6ECE8' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m, i) => (
          <Marker key={i} position={[m.lat, m.lng]}>
            {m.popup && <Popup>{m.popup}</Popup>}
          </Marker>
        ))}
      </MapContainer>

      {shelter && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 glass rounded-2xl p-4 shadow-lg max-w-[220px] border border-white/50"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin size={12} className="text-safetyLime" />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Nearest Shelter
            </p>
          </div>
          <p className="text-sm font-bold text-slate-900 mb-1">{shelter.name}</p>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>{shelter.distance}</span>
            <span>·</span>
            <span className={shelter.occupancy > 80 ? 'text-red-500' : 'text-emerald-600'}>
              {shelter.occupancy}% full
            </span>
          </div>
          <span
            className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              shelter.status === 'Available'
                ? 'bg-emerald-100 text-emerald-700'
                : shelter.status === 'Filling'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {shelter.status}
          </span>
        </motion.div>
      )}
    </div>
  );
}
