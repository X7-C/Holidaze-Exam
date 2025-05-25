import { useState, useEffect } from 'react';
import {
  getManagerVenues,
  getAllVenues,
  createVenue,
  updateVenue,
  deleteVenue,
} from '../services/venueService';

export const useVenues = (username?: string, tag?: string) => {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = username
        ? await getManagerVenues(username)
        : await getAllVenues();

      const venuesData = response.data?.data || response.data || [];

      const filtered = tag
        ? venuesData.filter((v: any) =>
            v.tags?.map((t: string) => t.toLowerCase()).includes(tag.toLowerCase())
          )
        : venuesData;

      setVenues(Array.isArray(filtered) ? filtered : []);
    } catch (err: any) {
      console.error('Error fetching venues:', err);
      setError(err.message || 'Failed to fetch venues');
      setVenues([]);
    } finally {
      setLoading(false);
    }
  };

  const addVenue = async (venueData: any) => {
    try {
      await createVenue(venueData);
      await fetchVenues();
    } catch (err: any) {
      setError(err.message || 'Failed to create venue');
    }
  };

  const editVenue = async (id: string, venueData: any) => {
    try {
      await updateVenue(id, venueData);
      await fetchVenues();
    } catch (err: any) {
      setError(err.message || 'Failed to update venue');
    }
  };

  const removeVenue = async (id: string) => {
    try {
      await deleteVenue(id);
      setVenues((prev) => prev.filter((venue) => venue.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete venue');
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [username, tag]);

  return {
    venues,
    loading,
    error,
    addVenue,
    editVenue,
    removeVenue,
    refreshVenues: fetchVenues,
  };
};
