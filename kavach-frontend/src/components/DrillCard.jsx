import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Button from './Button';
import { useRegistrationsContext } from '../context/RegistrationsContext';

export default function DrillCard({ event, className = '' }) {
  const { isRegistered, register } = useRegistrationsContext();
  const registered = isRegistered(event.id);

  const handleRegister = () => {
    register(event.id);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`bg-brandDark rounded-3xl p-6 text-white shadow-lg ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="px-3 py-1 rounded-full bg-safetyLime/20 text-safetyLime text-xs font-semibold">
          {event.type}
        </span>
        <span className="text-xs text-slate-400">{event.date}</span>
      </div>
      <h3 className="text-lg font-bold mb-2">{event.title}</h3>
      <p className="text-sm text-slate-400 mb-4 line-clamp-2">{event.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {event.enrolledCount}/{event.maxCapacity} enrolled
        </span>
        {registered ? (
          <span className="flex items-center gap-1 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Check size={14} />
            Registered
          </span>
        ) : (
          <Button variant="primary" size="sm" onClick={handleRegister}>
            Register
          </Button>
        )}
      </div>
    </motion.div>
  );
}
