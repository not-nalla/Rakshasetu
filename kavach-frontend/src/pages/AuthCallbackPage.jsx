import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleAuthCallback } from '../services/authService';
import { useUserContext } from '../context/UserContext';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useUserContext();

  useEffect(() => {
    const token = searchParams.get('token');
    const profileComplete = searchParams.get('profile_complete');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    handleAuthCallback(token, profileComplete === 'true')
      .then(({ user, profileComplete: complete }) => {
        if (!complete) {
          navigate('/complete-profile', { replace: true });
        } else {
          login(user);
          navigate('/', { replace: true });
        }
      })
      .catch(() => {
        navigate('/login', { replace: true });
      });
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen bg-brandDark flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-safetyLime border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Signing you in...</p>
      </div>
    </div>
  );
}
