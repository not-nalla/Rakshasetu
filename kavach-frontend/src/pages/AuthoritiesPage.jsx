import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';
import ScrollReveal from '../components/ScrollReveal';
import SearchPillBar from '../components/SearchPillBar';
import AuthorityCard from '../components/AuthorityCard';
import { getAuthorities } from '../services/authoritiesService';

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function AuthoritiesPage() {
  const [authorities, setAuthorities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAuthorities = async (search = '') => {
    setLoading(true);
    const data = await getAuthorities({ search });
    setAuthorities(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAuthorities();
  }, []);

  return (
    <PageWrapper>
      <ScrollReveal>
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Emergency Authorities</h1>
          <p className="text-sm text-slate-500">Contact your local disaster management officials</p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <SearchPillBar
          placeholder="Search authorities, departments..."
          onSearch={fetchAuthorities}
          className="mb-6 max-w-xl"
        />
      </ScrollReveal>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading authorities...</div>
      ) : authorities.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">No authorities found.</div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          key={JSON.stringify(authorities)}
          className="space-y-3"
        >
          {authorities.map((auth) => (
            <motion.div key={auth.id} variants={staggerItem}>
              <AuthorityCard authority={auth} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </PageWrapper>
  );
}
