import { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';

export const usePublicVenues = () => {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/holidaze/venues');
      console.log('Public venues response:', response);
      setVenues(response.data?.data || []);
    } catch (err: any) {
      console.error('Error fetching public venues:', err);
      setError(err.message || 'Failed to fetch venues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  return { venues, loading, error, refreshVenues: fetchVenues };
};