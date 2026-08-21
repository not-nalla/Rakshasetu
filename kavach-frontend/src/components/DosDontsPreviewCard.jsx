import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

export default function DosDontsPreviewCard({ item, className = '' }) {
  const firstDos = item.dos?.[0] || '';
  const firstDont = item.donts?.[0] || '';
  const Icon = item.Icon;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`glass rounded-3xl p-6 border border-white/50 shadow-sm ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <Icon size={20} />
          </div>
        )}
        <h3 className="text-lg font-bold text-slate-900">{item.disasterType}</h3>
      </div>
      <div className="space-y-2">
        {firstDos && (
          <div className="flex items-start gap-2">
            <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />
            <p className="text-sm text-slate-600">{firstDos}</p>
          </div>
        )}
        {firstDont && (
          <div className="flex items-start gap-2">
            <X size={14} className="text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-slate-600">{firstDont}</p>
          </div>
        )}
      </div>
      <p className="text-xs text-slate-400 mt-3">Tap to see all do's and don'ts</p>
    </motion.div>
  );
}
