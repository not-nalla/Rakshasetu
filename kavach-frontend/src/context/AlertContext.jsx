import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getActiveAlert } from '../services/alertsService';
import { useUserContext } from './UserContext';

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const { user } = useUserContext();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAlert = useCallback(async () => {
    if (!user?.profile_completed) {
      setLoading(false);
      return;
    }
    try {
      const active = await getActiveAlert();
      setAlert(active);
    } catch {
      setAlert(null);
    } finally {
      setLoading(false);
    }
  }, [user?.profile_completed]);

  useEffect(() => {
    fetchAlert();
  }, [fetchAlert]);

  const dismissAlert = useCallback(() => {
    setAlert(null);
  }, []);

  return (
    <AlertContext.Provider value={{ alert, loading, dismissAlert, refreshAlert: fetchAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlertContext() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlertContext must be used within AlertProvider');
  return ctx;
}
