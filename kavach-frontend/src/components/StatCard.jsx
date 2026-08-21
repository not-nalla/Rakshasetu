import { motion } from 'framer-motion';

export default function StatCard({ label, value, icon, className = '' }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`glass rounded-2xl p-5 border border-white/50 shadow-sm hover:shadow-md ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        {icon && <span className="text-slate-400">{icon}</span>}
      </div>
      <p className="text-3xl font-extrabold text-slate-900 tabular-nums">{value}</p>
    </motion.div>
  );
}
