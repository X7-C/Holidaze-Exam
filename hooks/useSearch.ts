import { useState } from 'react';
import { apiRequest } from '../services/api';

export const useSearch = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchVenues = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await apiRequest(
        `/holidaze/venues/search?q=${encodeURIComponent(query)}`
      );
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { searchResults, loading, searchVenues };
};