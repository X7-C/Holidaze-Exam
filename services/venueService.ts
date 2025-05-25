import { apiRequest } from './api';
import { getToken } from './authService';

export const getManagerVenues = async (username: string) => {
  return apiRequest(`/holidaze/profiles/${username}/venues`, { method: 'GET' }, true);
};


export const getAllVenues = async () => {
  return apiRequest('/holidaze/venues', { method: 'GET' });
};

export const getVenueById = async (id: string) => {
  return apiRequest(`/holidaze/venues/${id}`, { method: 'GET' });
};

export const createVenue = async (data: any) => {
  const response = await apiRequest('/holidaze/venues', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  }, true);

  return response.data;
};


export const updateVenue = async (id: string, venueData: any) => {
  return apiRequest(`/holidaze/venues/${id}`, {
    method: 'PUT',
    body: JSON.stringify(venueData),
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const deleteVenue = async (id: string) => {
  const token = getToken();
  return apiRequest(`/holidaze/venues/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};