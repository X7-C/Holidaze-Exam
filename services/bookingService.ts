import { apiRequest } from './api';

export const createBooking = async (venueId: string, bookingData: {
  dateFrom: string;
  dateTo: string;
  guests: number;
}) => {
  const response = await apiRequest(`/holidaze/bookings`, {
    method: 'POST',
    body: JSON.stringify({ ...bookingData, venueId }),
    headers: {
      'Content-Type': 'application/json'
    }
  }, true);
  return response.data;
};

export const getManagerBookings = async () => {
  const response = await apiRequest('/holidaze/profiles/venue-manager-bookings', {}, true);
  return response.data;
};

export const getUserBookings = async (username: string) => {
  const response = await apiRequest(`/holidaze/profiles/${username}/bookings?_venue=true`, {}, true);
  return response.data;
};