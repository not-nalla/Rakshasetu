import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Users, Check } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import ScrollReveal from '../components/ScrollReveal';
import MapCard from '../components/MapCard';
import StatusPipeline from '../components/StatusPipeline';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { useEvent } from '../hooks/useEvents';
import { useRegistrationsContext } from '../context/RegistrationsContext';

export default function EventDetailPage() {
  const { id } = useParams();
  const { event, loading } = useEvent(id);
  const { isRegistered, register } = useRegistrationsContext();
  const [toast, setToast] = useState(null);
  const registered = isRegistered(id);

  const handleRegister = () => {
    register(id);
    setToast({ message: 'Successfully registered!', type: 'success' });
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="text-center py-12 text-slate-400 text-sm">Loading event...</div>
      </PageWrapper>
    );
  }

  if (!event) {
    return (
      <PageWrapper>
        <div className="text-center py-12">
          <p className="text-slate-400 text-sm mb-4">Event not found.</p>
          <Link to="/events" className="text-safetyLime font-semibold text-sm hover:underline">
            ← Back to Events
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const typeColors = {
    'Mock Drill': 'bg-blue-100 text-blue-700',
    SSP: 'bg-amber-100 text-amber-700',
    CAP: 'bg-purple-100 text-purple-700',
  };

  return (
    <PageWrapper>
      <ScrollReveal>
        <Link to="/events" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
          <ArrowLeft size={16} />
          Back to Events
        </Link>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <ScrollReveal direction="left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="glass rounded-3xl p-6 sm:p-8 border border-white/50"
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.2 }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${typeColors[event.type] || 'bg-slate-100 text-slate-700'}`}
                >
                  {event.type}
                </motion.span>
                <span className="text-xs text-slate-400">{event.date} · {event.time}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">{event.title}</h1>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">{event.description}</p>

              <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-6">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {event.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={14} />
                  {event.enrolledCount}/{event.maxCapacity} enrolled
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {event.district}
                </span>
              </div>

              <div className="flex gap-2 mb-6">
                {event.tags?.map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>

              <ScrollReveal delay={0.2}>
                <div className="border-t border-slate-100 pt-6 mb-6">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Registration Status</h3>
                  <StatusPipeline status={registered ? 'Confirmed' : 'Registered'} />
                </div>
              </ScrollReveal>

              {registered ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold"
                >
                  <Check size={16} />
                  You are registered for this event
                </motion.div>
              ) : (
                <ScrollReveal delay={0.3}>
                  <Button variant="primary" size="lg" className="w-full" onClick={handleRegister}>
                    Register Now
                  </Button>
                </ScrollReveal>
              )}
            </motion.div>
          </ScrollReveal>
        </div>

        <ScrollReveal direction="right" delay={0.15} className="lg:col-span-4">
          <MapCard
            center={[event.lat, event.lng]}
            markers={[{ lat: event.lat, lng: event.lng, popup: event.title }]}
            className="h-[300px]"
          />
        </ScrollReveal>
      </div>

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </PageWrapper>
  );
}
