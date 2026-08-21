import { NavLink } from 'react-router-dom';
import { Home, Calendar, ShieldCheck, Users, BarChart3, MessageSquare, Settings } from 'lucide-react';
import { useUserContext } from '../../context/UserContext';

const navItems = [
  { to: '/', label: 'Home', Icon: Home },
  { to: '/events', label: 'Events', Icon: Calendar },
  { to: '/dos-donts', label: "Do's", Icon: ShieldCheck },
  { to: '/authorities', label: 'Authority', Icon: Users },
  { to: '/past-disasters', label: 'Past', Icon: BarChart3 },
  { to: '/ask-ai', label: 'Ask AI', Icon: MessageSquare },
];

export default function BottomNav() {
  const { user } = useUserContext();

  return (
    <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
      <div className="glass-strong rounded-full px-2 py-2 flex items-center justify-around shadow-lg shadow-black/5 border border-white/50">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`
            }
          >
            <item.Icon size={18} strokeWidth={2} />
            <span>{item.label}</span>
          </NavLink>
        ))}
        {user?.role === 'official' && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`
            }
          >
            <Settings size={18} strokeWidth={2} />
            <span>Admin</span>
          </NavLink>
        )}
      </div>
    </nav>
  );
}
