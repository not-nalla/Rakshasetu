import { motion } from 'framer-motion';
import { formatDate } from '../utils/dateFormat';

export default function DisasterTable({ disasters, className = '' }) {
  if (!disasters.length) {
    return (
      <div className={`glass rounded-2xl p-8 text-center text-slate-400 ${className}`}>
        No disaster records found.
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <div className="glass rounded-2xl border border-white/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Name
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Type
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Date
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                District
              </th>
              <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Casualties
              </th>
              <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Displaced
              </th>
              <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Damage
              </th>
            </tr>
          </thead>
          <tbody>
            {disasters.map((d, i) => (
              <motion.tr
                key={d.id}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-5 py-3">
                  <div>
                    <p className="font-semibold text-slate-900">{d.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{d.summary}</p>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                    {d.type}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-600">{formatDate(d.date)}</td>
                <td className="px-5 py-3 text-slate-600">{d.district}</td>
                <td className="px-5 py-3 text-right">
                  <span className={`font-semibold ${d.casualties > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                    {d.casualties}
                  </span>
                </td>
                <td className="px-5 py-3 text-right text-slate-600">{d.displaced.toLocaleString()}</td>
                <td className="px-5 py-3 text-right text-slate-600">{d.damageEstimate}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
