import { X } from 'lucide-react';
import { useAlertContext } from '../../context/AlertContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmergencyBanner() {
  const { alert, dismissAlert } = useAlertContext();

  if (!alert) return null;

  const severityBg = {
    critical: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.25 }}
        className={`${severityBg[alert.severity] || 'bg-red-500'} text-white px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-3 relative z-[60]`}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
        <span className="flex-1 text-center">
          <strong>{alert.title}:</strong> {alert.message}
        </span>
        <button
          onClick={dismissAlert}
          className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
