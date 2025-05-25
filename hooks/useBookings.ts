import { useEffect, useState } from 'react';
import { getUserBookings } from '../services/bookingService';
import { Booking } from '../types/booking';
import { useAuth } from './useAuth';

export const useBookings = (username: string) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!username || !user) return;

      try {
        const response = await getUserBookings(username);
        setBookings(response.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [username, user]);

  return { bookings, loading, error };
};