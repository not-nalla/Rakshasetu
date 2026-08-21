import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';

export default function AuthorityCard({ authority, className = '' }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`glass rounded-2xl p-5 border border-white/50 shadow-sm ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-600 shrink-0">
          {authority.name.split(' ').map((n) => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 text-sm">{authority.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{authority.role}</p>
          <p className="text-xs text-slate-400">{authority.department}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <a
              href={`tel:${authority.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100 transition-colors"
            >
              <Phone size={12} />
              {authority.phone}
            </a>
            <a
              href={`mailto:${authority.email}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition-colors"
            >
              <Mail size={12} />
              {authority.email}
            </a>
          </div>
        </div>
        <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-medium shrink-0">
          {authority.district}
        </span>
      </div>
    </motion.div>
  );
}
