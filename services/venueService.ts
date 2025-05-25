import { apiRequest } from './api';

export const getManagerVenues = async (username: string) => {
  return apiRequest(`/holidaze/profiles/${username}/venues`, { method: 'GET' }, true);
};

export const getAllVenues = async () => {
  return apiRequest('/holidaze/venues', { method: 'GET' });
};

export const getVenueById = async (id: string, params?: Record<string, any>) => {
  const query = params && typeof params === 'object'
    ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
    : '';
  return apiRequest(`/holidaze/venues/${id}${query}`, { method: 'GET' }, true);
};


export const createVenue = async (data: any) => {
  return apiRequest(
    '/holidaze/venues',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    true
  );
};

export const updateVenue = async (id: string, venueData: any) => {
  return apiRequest(
    `/holidaze/venues/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(venueData),
    },
    true
  );
};

export const deleteVenue = async (id: string) => {
  return apiRequest(
    `/holidaze/venues/${id}`,
    {
      method: 'DELETE',
    },
    true
  );
};
