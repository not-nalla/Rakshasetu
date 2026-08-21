import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Siren, ClipboardList, UserCheck, Tent } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import ScrollReveal from '../components/ScrollReveal';
import StatCard from '../components/StatCard';
import SearchPillBar from '../components/SearchPillBar';
import MapCard from '../components/MapCard';
import DrillCard from '../components/DrillCard';
import DosDontsPreviewCard from '../components/DosDontsPreviewCard';
import { useAlertContext } from '../context/AlertContext';
import { useUserContext } from '../context/UserContext';
import { getUpcomingDrills, getEventStats } from '../services/eventsService';
import { getNearestShelter } from '../services/alertsService';
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
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function HomePage() {
  const { alert } = useAlertContext();
  const { user } = useUserContext();
  const [stats, setStats] = useState({ total: 0, upcoming: 0, totalEnrolled: 0 });
  const [drills, setDrills] = useState([]);
  const [shelter, setShelter] = useState(null);
  const [campCount] = useState(3);

  useEffect(() => {
    Promise.all([getEventStats(), getUpcomingDrills(), getNearestShelter()]).then(
      ([s, d, sh]) => {
        setStats(s);
        setDrills(d);
        setShelter(sh);
      }
    );
  }, []);

  const alertsCount = alert ? 1 : 0;

  return (
    <PageWrapper>
      <ScrollReveal>
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2"
          >
            Stay Safe, Stay Prepared
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-500 text-sm"
          >
            Your district-level disaster awareness hub
            {user?.district && ` — ${user.district}`}
          </motion.p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <SearchPillBar
          placeholder="Enter your district..."
          onSearch={(q) => console.log('Search:', q)}
          className="mb-8 max-w-xl"
        />
      </ScrollReveal>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <motion.div variants={staggerItem}>
          <StatCard label="Active Alerts" value={alertsCount} icon={<Siren size={20} />} />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard label="Upcoming Drills" value={stats.upcoming} icon={<ClipboardList size={20} />} />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard label="Registrations" value={stats.totalEnrolled} icon={<UserCheck size={20} />} />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatCard label="Relief Camps Nearby" value={campCount} icon={<Tent size={20} />} />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <ScrollReveal direction="left" delay={0.1} className="lg:col-span-7">
          <MapCard
            markers={[{ lat: 18.5204, lng: 73.8567, popup: 'Your District Center' }]}
            shelter={shelter}
            className="h-[420px]"
          />
        </ScrollReveal>

        <div className="lg:col-span-5 flex flex-col gap-4">
          <ScrollReveal direction="right" delay={0.15}>
            {drills.length > 0 && <DrillCard event={drills[0]} />}
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.25} className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-slate-900">Do's & Don'ts</h2>
              <Link to="/dos-donts" className="text-xs font-semibold text-safetyLime hover:underline">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {mockDosDonts.slice(0, 2).map((item, i) => (
                <ScrollReveal key={item.id} delay={0.3 + i * 0.1}>
                  <Link to="/dos-donts">
                    <DosDontsPreviewCard item={item} />
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </PageWrapper>
  );
}
