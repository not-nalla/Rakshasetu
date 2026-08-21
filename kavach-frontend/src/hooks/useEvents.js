import { useState, useEffect, useCallback } from 'react';
import { getEvents, getEventById, registerForEvent } from '../services/eventsService';

export function useEvents(filters = {}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEvents(filters);
      setEvents(data);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, refresh: fetchEvents };
}

export function useEvent(id) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getEventById(id)
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  const register = useCallback(async () => {
    if (!id) return;
    const updated = await registerForEvent(id);
    setEvent(updated);
    return updated;
  }, [id]);

  return { event, loading, register };
}
