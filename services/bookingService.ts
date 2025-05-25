import { apiRequest } from './api';

export const createBooking = async (
  venueId: string,
  bookingData: {
    dateFrom: string;
    dateTo: string;
    guests: number;
  }
) => {
  const response = await apiRequest(
    '/holidaze/bookings',
    {
      method: 'POST',
      body: JSON.stringify({
        ...bookingData,
        venueId,
        guests: Number(bookingData.guests),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
    true 
  );

  if (response.error) {
    throw new Error(response.error || 'Booking failed.');
  }

  return response.data;
};

export const getUserBookings = async (username: string) => {
  return apiRequest(`/holidaze/profiles/${username}/bookings?_venue=true`, {
    method: 'GET',
  }, true);
};

export const getManagerBookings = async (username: string) => {
  return apiRequest(`/holidaze/profiles/${username}/bookings?_venue=true`, { method: 'GET' }, true);
};
