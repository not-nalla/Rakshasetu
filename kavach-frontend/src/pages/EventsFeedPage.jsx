import { useState } from 'react';
import { motion } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';
import ScrollReveal from '../components/ScrollReveal';
import EventCard from '../components/EventCard';
import { useEvents } from '../hooks/useEvents';
import { EVENT_TYPES } from '../utils/constants';

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function EventsFeedPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const { events, loading } = useEvents({ type: activeFilter });

  return (
    <PageWrapper>
      <ScrollReveal>
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Events & Drills</h1>
          <p className="text-sm text-slate-500">Browse and register for upcoming disaster preparedness events</p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {EVENT_TYPES.map((type) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveFilter(type)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeFilter === type
                  ? 'bg-brandDark text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:shadow-sm'
              }`}
            >
              {type}
            </motion.button>
          ))}
        </div>
      </ScrollReveal>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">No events found for this category.</div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          key={activeFilter}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {events.map((event) => (
            <motion.div key={event.id} variants={staggerItem}>
              <EventCard event={event} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </PageWrapper>
  );
}
