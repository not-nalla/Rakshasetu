import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Users } from 'lucide-react';

export default function EventCard({ event, className = '' }) {
  const typeColors = {
    'Mock Drill': 'bg-blue-100 text-blue-700',
    SSP: 'bg-amber-100 text-amber-700',
    CAP: 'bg-purple-100 text-purple-700',
  };

  return (
    <Link to={`/events/${event.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className={`glass rounded-2xl p-5 border border-white/50 shadow-sm hover:shadow-md cursor-pointer ${className}`}
      >
        <div className="flex items-start justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeColors[event.type] || 'bg-slate-100 text-slate-700'}`}>
            {event.type}
          </span>
          <span className="text-xs text-slate-400">{event.date}</span>
        </div>
        <h3 className="font-bold text-slate-900 mb-1">{event.title}</h3>
        <p className="text-sm text-slate-500 mb-3 line-clamp-2">{event.description}</p>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} />
            {event.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users size={12} />
            {event.enrolledCount}/{event.maxCapacity}
          </span>
        </div>
        <div className="flex gap-2 mt-3">
          {event.tags?.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-medium">
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </Link>
  );
}
