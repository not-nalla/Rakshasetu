import { createContext, useContext, useState, useCallback } from 'react';

const RegistrationsContext = createContext(null);

export function RegistrationsProvider({ children }) {
  const [registeredEventIds, setRegisteredEventIds] = useState([]);

  const register = useCallback((eventId) => {
    setRegisteredEventIds((prev) => {
      if (prev.includes(eventId)) return prev;
      return [...prev, eventId];
    });
  }, []);

  const unregister = useCallback((eventId) => {
    setRegisteredEventIds((prev) => prev.filter((id) => id !== eventId));
  }, []);

  const isRegistered = useCallback(
    (eventId) => registeredEventIds.includes(eventId),
    [registeredEventIds]
  );

  return (
    <RegistrationsContext.Provider
      value={{ registeredEventIds, register, unregister, isRegistered }}
    >
      {children}
    </RegistrationsContext.Provider>
  );
}

export function useRegistrationsContext() {
  const ctx = useContext(RegistrationsContext);
  if (!ctx) throw new Error('useRegistrationsContext must be used within RegistrationsProvider');
  return ctx;
}
