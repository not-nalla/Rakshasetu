import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { completeProfile } from '../services/authService';
import { useUserContext } from '../context/UserContext';
import { DISTRICTS, ROLES, LANGUAGES } from '../utils/constants';

export default function CompleteProfilePage() {
  const [role, setRole] = useState('citizen');
  const [district, setDistrict] = useState('Pune');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useUserContext();
  const navigate = useNavigate();

  const backendRoles = { Citizen: 'citizen', Student: 'student', Official: 'official' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await completeProfile(role, district, language);
      login(user);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brandDark flex items-center justify-center p-4 bg-grid-pattern">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brandDark border-2 border-safetyLime/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-safetyLime font-extrabold text-3xl">K</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Complete Your Profile</h1>
          <p className="text-slate-400 text-sm">Tell us a bit about yourself to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              I am a
            </label>
            <div className="flex gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(backendRoles[r] || r.toLowerCase())}
                  className={`flex-1 py-3 rounded-full text-sm font-medium transition-all duration-150 ${
                    role === (backendRoles[r] || r.toLowerCase())
                      ? 'bg-safetyLime text-brandDark'
                      : 'bg-white/10 text-slate-400 hover:bg-white/15'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              District
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-5 py-3.5 rounded-full bg-white/10 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-safetyLime/50 appearance-none cursor-pointer"
            >
              {DISTRICTS.map((d) => (
                <option key={d} value={d} className="bg-brandDark text-white">
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Preferred Language
            </label>
            <div className="flex gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`flex-1 py-3 rounded-full text-sm font-medium transition-all duration-150 ${
                    language === lang.code
                      ? 'bg-safetyLime text-brandDark'
                      : 'bg-white/10 text-slate-400 hover:bg-white/15'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-safetyLime text-brandDark font-bold text-sm hover:bg-[#b3ff33] transition-colors duration-150 mt-6 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Get Started'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
