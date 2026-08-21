import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';
import ScrollReveal from '../components/ScrollReveal';
import DisasterTable from '../components/DisasterTable';
import { getDisasters, getDisasterTypes, getDisasterYears } from '../services/disastersService';

export default function PastDisastersPage() {
  const [disasters, setDisasters] = useState([]);
  const [types, setTypes] = useState([]);
  const [years, setYears] = useState([]);
  const [activeType, setActiveType] = useState('All');
  const [activeYear, setActiveYear] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDisasterTypes(), getDisasterYears()]).then(([t, y]) => {
      setTypes(t);
      setYears(y);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    getDisasters({ type: activeType, year: activeYear }).then((data) => {
      setDisasters(data);
      setLoading(false);
    });
  }, [activeType, activeYear]);

  return (
    <PageWrapper>
      <ScrollReveal>
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Past Disasters</h1>
          <p className="text-sm text-slate-500">Historical disaster data and impact analysis</p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Type</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {['All', ...types].map((type) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveType(type)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  activeType === type
                    ? 'bg-brandDark text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:shadow-sm'
                }`}
              >
                {type}
              </motion.button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Year</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {['All', ...years].map((year) => (
              <motion.button
                key={year}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveYear(year)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  activeYear === year
                    ? 'bg-brandDark text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:shadow-sm'
                }`}
              >
                {year}
              </motion.button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Loading records...</div>
        ) : (
          <motion.div
            key={`${activeType}-${activeYear}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DisasterTable disasters={disasters} />
          </motion.div>
        )}
      </ScrollReveal>
    </PageWrapper>
  );
}
