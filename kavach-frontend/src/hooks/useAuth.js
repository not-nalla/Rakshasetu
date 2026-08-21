import { useUserContext } from '../context/UserContext';

export function useAuth() {
  const { user, loading, login, logout } = useUserContext();
  return { user, loading, login, logout };
}
