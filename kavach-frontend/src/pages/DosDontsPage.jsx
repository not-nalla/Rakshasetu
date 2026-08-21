import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Plus } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import ScrollReveal from '../components/ScrollReveal';
import SpeakButton from '../components/SpeakButton';
import { mockDosDonts } from '../mockData/mockDosDonts';

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function DosDontsPage() {
  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <PageWrapper>
      <ScrollReveal>
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Do's & Don'ts</h1>
          <p className="text-sm text-slate-500">Essential safety guidelines for different disaster types</p>
        </div>
      </ScrollReveal>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        className="space-y-4"
      >
        {mockDosDonts.map((item) => {
          const Icon = item.Icon;
          return (
            <motion.div
              key={item.id}
              variants={staggerItem}
              layout
              className="glass rounded-3xl border border-white/50 overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(item.id)}
                className="w-full flex items-center justify-between p-6 text-left group"
              >
                <div className="flex items-center gap-3">
                  {Icon && (
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                      <Icon size={20} />
                    </div>
                  )}
                  <h2 className="text-lg font-bold text-slate-900">{item.disasterType}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <SpeakButton
                    text={`${item.disasterType} safety guidelines. Do's: ${item.dos.join('. ')}. Don'ts: ${item.donts.join('. ')}`}
                  />
                  <motion.div
                    animate={{ rotate: expanded === item.id ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-400"
                  >
                    <Plus size={20} />
                  </motion.div>
                </div>
              </button>

              <AnimatePresence>
                {expanded === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="px-6 pb-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-emerald-50 rounded-2xl p-4"
                      >
                        <h3 className="text-sm font-bold text-emerald-700 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                          <Check size={14} />
                          Do's
                        </h3>
                        <ul className="space-y-2">
                          {item.dos.map((d, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.15 + i * 0.04 }}
                              className="flex items-start gap-2 text-sm text-slate-700"
                            >
                              <Check size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                              {d}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-red-50 rounded-2xl p-4"
                      >
                        <h3 className="text-sm font-bold text-red-700 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                          <X size={14} />
                          Don'ts
                        </h3>
                        <ul className="space-y-2">
                          {item.donts.map((d, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: 8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + i * 0.04 }}
                              className="flex items-start gap-2 text-sm text-slate-700"
                            >
                              <X size={12} className="text-red-500 mt-0.5 shrink-0" />
                              {d}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </PageWrapper>
  );
}
