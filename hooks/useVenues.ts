import { useState, useEffect } from 'react';
import {
  getManagerVenues,
  getAllVenues,
  createVenue,
  updateVenue,
  deleteVenue,
} from '../services/venueService';

export const useVenues = (username?: string, tag?: string, page = 1, limit = 9) => {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (username) {
        response = await getManagerVenues(username, page, limit);
      } else {
        response = await getAllVenues(page, limit, tag);
      }

      const venuesData = response.data?.data || [];
      const meta = response.data?.meta || {};
      
      setVenues(Array.isArray(venuesData) ? venuesData : []);
      setTotalCount(meta.totalCount || venuesData.length);
      setTotalPages(Math.ceil((meta.totalCount || venuesData.length) / limit));
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
  }, [username, tag, page, limit]);

  return {
    venues,
    loading,
    error,
    totalCount,
    totalPages,
    addVenue,
    editVenue,
    removeVenue,
    refreshVenues: fetchVenues,
  };
};