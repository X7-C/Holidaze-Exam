import { apiRequest } from './api';

export const getManagerVenues = async (username: string, page = 1, limit = 9) => {
  return apiRequest(
    `/holidaze/profiles/${username}/venues?page=${page}&limit=${limit}`,
    { method: 'GET' },
    true
  );
};

export const getAllVenues = async (page = 1, limit = 9, tag?: string) => {
  const tagQuery = tag ? `&tag=${tag}` : '';
  return apiRequest(
    `/holidaze/venues?page=${page}&limit=${limit}${tagQuery}`,
    { method: 'GET' }
  );
};

export const getVenueById = async (id: string, params?: Record<string, any>) => {
  const query = params && typeof params === 'object'
    ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
    : '';
  return apiRequest(`/holidaze/venues/${id}${query}`, { method: 'GET' }, true);
};


export const createVenue = async (data: any) => {
  const response = await apiRequest('/holidaze/venues', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  }, true);

  if (response.error) {
    throw new Error(response.error);
  }

  return response.data;
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
