export interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  venue: Venue;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  media: string[];
  meta: {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  };
  location: {
    address?: string;
    city?: string;
    country?: string;
  };
}