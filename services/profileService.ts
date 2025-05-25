import { apiRequest } from './api';

export const updateAvatar = async (name: string, file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await apiRequest(`/profiles/${name}/media`, {
    method: 'PUT',
    body: formData
  }, true);

  return response.data;
};

export const updateProfile = async (
  name: string,
  profileData: {
    email?: string;
    venueManager?: boolean;
  }
) => {
  const response = await apiRequest(`/profiles/${name}`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
    headers: {
      'Content-Type': 'application/json'
    }
  }, true);
  return response.data;
};

export const getProfile = async () => {
  const response = await apiRequest('/profiles/me', {}, true);
  return response.data;
};

export const getProfileBookings = async (username: string) => {
  return apiRequest(`/holidaze/profiles/${username}/bookings`, {
    method: 'GET'
  }, true);
};

