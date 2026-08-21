import { NavLink, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import { logoutUser } from '../../services/authService';
import { motion } from 'framer-motion';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events' },
  { to: '/dos-donts', label: "Do's & Don'ts" },
  { to: '/authorities', label: 'Authorities' },
  { to: '/past-disasters', label: 'Past Disasters' },
  { to: '/ask-ai', label: 'Ask AI' },
];

export default function PillHeader() {
  const { user, logout } = useUserContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl">
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-strong rounded-full px-4 py-2.5 flex items-center justify-between shadow-lg shadow-black/5 border border-white/50"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brandDark flex items-center justify-center">
            <span className="text-safetyLime font-bold text-lg">K</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {user?.role === 'official' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              Admin
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user?.picture_url && (
            <img
              src={user.picture_url}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          {user?.district && (
            <span className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
              {user.district}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full bg-brandDark text-white text-sm font-medium hover:bg-slate-800 transition-colors duration-150"
          >
            Sign Out
          </button>
        </div>
      </motion.nav>
    </header>
  );
}
