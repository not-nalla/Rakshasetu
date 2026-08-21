import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGoogleAuthUrl, signup, loginEmail } from '../services/authService';
import { useUserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { DISTRICTS, ROLES, LANGUAGES } from '../utils/constants';
import { Eye, EyeOff } from 'lucide-react';

function DecorativeLines() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="150" cy="200" r="150" stroke="white" strokeWidth="0.5" fill="none" />
      <circle cx="150" cy="200" r="120" stroke="white" strokeWidth="0.5" fill="none" />
      <circle cx="150" cy="200" r="90" stroke="white" strokeWidth="0.5" fill="none" />
      <circle cx="150" cy="200" r="60" stroke="white" strokeWidth="0.5" fill="none" />
      <circle cx="150" cy="200" r="30" stroke="white" strokeWidth="0.5" fill="none" />
    </svg>
  );
}

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('citizen');
  const [district, setDistrict] = useState('Pune');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useUserContext();
  const navigate = useNavigate();

  const backendRoles = { Citizen: 'citizen', Student: 'student', Official: 'official' };

  const handleGoogleLogin = () => {
    window.location.href = getGoogleAuthUrl();
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let user;
      if (mode === 'signup') {
        user = await signup(name, email, password, role, district, language);
      } else {
        user = await loginEmail(email, password);
      }
      login(user);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid-pattern flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[900px] bg-white rounded-3xl overflow-hidden shadow-2xl flex items-stretch"
      >
        {/* Left side — branding */}
        <div className="hidden md:flex md:w-[42%] relative overflow-hidden bg-[#1a2332] flex-col">
          <DecorativeLines />

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-10 flex flex-col justify-between p-10 w-full"
          >
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-safetyLime/20 border border-safetyLime/30 flex items-center justify-center">
                <span className="text-safetyLime font-bold text-lg">K</span>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col justify-center">
              <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight">
                Hello
              </h1>
              <h1 className="text-3xl xl:text-4xl font-extrabold text-white mb-5 leading-tight">
                Kavach! <span className="inline-block">&#x1F44B;</span>
              </h1>

              <p className="text-white/50 text-sm leading-relaxed max-w-[260px]">
                Skip the panic. Get real-time disaster alerts, emergency contacts, and safety guides. Be prepared and keep your community safe.
              </p>
            </div>

            {/* Footer */}
            <p className="text-white/25 text-xs">&copy; 2026 Kavach. All rights reserved.</p>
          </motion.div>
        </div>

        {/* Right side — form */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-10 lg:px-12 py-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="w-full max-w-sm mx-auto"
          >
            {/* App name */}
            <div className="mb-4">
              <span className="text-lg font-extrabold text-brandDark tracking-tight">Kavach</span>
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-extrabold text-brandDark mb-1">
              Welcome Back!
            </h2>

            <p className="text-slate-500 text-sm mb-5">
              {mode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => { setMode('signup'); setError(''); }}
                    className="text-brandDark font-semibold hover:underline"
                  >
                    Create a new account now.
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => { setMode('login'); setError(''); }}
                    className="text-brandDark font-semibold hover:underline"
                  >
                    Sign in to your account.
                  </button>
                </>
              )}
            </p>

            {/* Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <AnimatePresence mode="wait">
                {mode === 'signup' && (
                  <motion.div
                    key="signup-name"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mb-3">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full name"
                        required
                        className="w-full py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none border-b border-slate-300 focus:border-brandDark transition-colors"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none border-b border-slate-300 focus:border-brandDark transition-colors"
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  minLength={6}
                  className="w-full py-2.5 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none border-b border-slate-300 focus:border-brandDark transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {mode === 'signup' && (
                  <motion.div
                    key="signup-extras"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3 overflow-hidden"
                  >
                    <div>
                      <div className="flex gap-2 mt-1">
                        {ROLES.map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setRole(backendRoles[r] || r.toLowerCase())}
                            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                              role === (backendRoles[r] || r.toLowerCase())
                                ? 'bg-brandDark text-white'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full py-2.5 text-sm text-slate-800 focus:outline-none border-b border-slate-300 focus:border-brandDark transition-colors cursor-pointer appearance-none bg-transparent"
                      >
                        {DISTRICTS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-2">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => setLanguage(lang.code)}
                          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                            language === lang.code
                              ? 'bg-brandDark text-white'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <p className="text-red-500 text-sm text-center py-1">{error}</p>
              )}

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-brandDark text-white font-bold text-sm hover:bg-slate-800 transition-all duration-150 disabled:opacity-50"
              >
                {loading ? 'Please wait...' : mode === 'login' ? 'Login Now' : 'Create Account'}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-px bg-slate-200" />
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Google login */}
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              className="w-full py-3 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Login with Google
            </motion.button>

            {/* Forgot password */}
            <div className="text-center mt-4">
              <span className="text-slate-500 text-sm">Forgot password? </span>
              <button className="text-brandDark font-semibold text-sm hover:underline">
                Click here
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
