import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';
import ScrollReveal from '../components/ScrollReveal';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { adminTriggerAlert, adminPublishEvent, adminGetPendingApprovals } from '../services/adminService';
import { DISTRICTS, EVENT_TYPES } from '../utils/constants';

export default function AdminPanelPage() {
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('warning');
  const [alertDistrict, setAlertDistrict] = useState('Pune');

  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState('Mock Drill');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDistrict, setEventDistrict] = useState('Pune');

  const [pending, setPending] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    adminGetPendingApprovals().then(setPending);
  }, []);

  const handleTriggerAlert = async (e) => {
    e.preventDefault();
    if (!alertTitle || !alertMessage) return;
    await adminTriggerAlert({
      title: alertTitle,
      message: alertMessage,
      severity: alertSeverity,
      district: alertDistrict,
    });
    setAlertTitle('');
    setAlertMessage('');
    setToast({ message: 'Alert triggered successfully!', type: 'success' });
  };

  const handlePublishEvent = async (e) => {
    e.preventDefault();
    if (!eventTitle || !eventDate) return;
    await adminPublishEvent({
      title: eventTitle,
      description: eventDescription,
      type: eventType,
      date: eventDate,
      time: '10:00 AM',
      location: eventLocation,
      district: eventDistrict,
      lat: 18.5204,
      lng: 73.8567,
      maxCapacity: 200,
      tags: [eventType],
    });
    setEventTitle('');
    setEventDescription('');
    setEventDate('');
    setEventLocation('');
    setToast({ message: 'Event published successfully!', type: 'success' });
  };

  return (
    <PageWrapper>
      <ScrollReveal>
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Admin Panel</h1>
          <p className="text-sm text-slate-500">Manage alerts, events, and approvals</p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Trigger Alert Card */}
        <ScrollReveal direction="left">
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.18 }}
            className="bg-brandDark rounded-3xl p-6 h-full"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-safetyLime/20 text-safetyLime text-xs font-semibold">
                Alert
              </span>
              <h2 className="text-lg font-bold text-white">Trigger Emergency Alert</h2>
            </div>

            <form onSubmit={handleTriggerAlert} className="space-y-3">
              <input
                type="text"
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
                placeholder="Alert title"
                required
                className="w-full px-4 py-2.5 rounded-full bg-white/10 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-safetyLime/50 transition-all"
              />
              <textarea
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                placeholder="Alert message"
                required
                rows={3}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-safetyLime/50 resize-none transition-all"
              />
              <div className="flex gap-2">
                <select
                  value={alertSeverity}
                  onChange={(e) => setAlertSeverity(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-full bg-white/10 border border-white/10 text-white text-sm focus:outline-none appearance-none cursor-pointer transition-all"
                >
                  <option value="critical" className="bg-brandDark">Critical</option>
                  <option value="warning" className="bg-brandDark">Warning</option>
                  <option value="info" className="bg-brandDark">Info</option>
                </select>
                <select
                  value={alertDistrict}
                  onChange={(e) => setAlertDistrict(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-full bg-white/10 border border-white/10 text-white text-sm focus:outline-none appearance-none cursor-pointer transition-all"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d} className="bg-brandDark">{d}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" variant="primary" className="w-full">
                Trigger Alert
              </Button>
            </form>
          </motion.div>
        </ScrollReveal>

        {/* Publish Event Card */}
        <ScrollReveal direction="right" delay={0.1}>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.18 }}
            className="glass rounded-3xl p-6 border border-white/50 h-full"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                Event
              </span>
              <h2 className="text-lg font-bold text-slate-900">Publish New Event</h2>
            </div>

            <form onSubmit={handlePublishEvent} className="space-y-3">
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Event title"
                required
                className="w-full px-4 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-safetyLime/50 transition-all"
              />
              <textarea
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Description"
                rows={3}
                className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-safetyLime/50 resize-none transition-all"
              />
              <div className="flex gap-2">
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 text-sm focus:outline-none appearance-none cursor-pointer transition-all"
                >
                  {EVENT_TYPES.filter((t) => t !== 'All').map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                  className="flex-1 px-4 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-safetyLime/50 transition-all"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="Location"
                  className="flex-1 px-4 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-safetyLime/50 transition-all"
                />
                <select
                  value={eventDistrict}
                  onChange={(e) => setEventDistrict(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 text-sm focus:outline-none appearance-none cursor-pointer transition-all"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" variant="primary" className="w-full">
                Publish Event
              </Button>
            </form>
          </motion.div>
        </ScrollReveal>
      </div>

      {/* Pending Approvals */}
      <ScrollReveal delay={0.2}>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Pending Approvals</h2>
        {pending.length === 0 ? (
          <p className="text-sm text-slate-400">No pending approvals.</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="glass rounded-2xl border border-white/50 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Type</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Title</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Submitted By</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Date</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((item, i) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-slate-50 last:border-0"
                    >
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">{item.type}</span>
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-900">{item.title}</td>
                      <td className="px-5 py-3 text-slate-600">{item.submittedBy}</td>
                      <td className="px-5 py-3 text-slate-500">{item.submittedAt}</td>
                      <td className="px-5 py-3 text-right">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setToast({ message: 'Approved!', type: 'success' })}
                        >
                          Approve
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </ScrollReveal>

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </PageWrapper>
  );
}
