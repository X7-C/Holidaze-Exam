import React, { useEffect, useState } from 'react';
import { Table, Alert, Spinner } from 'react-bootstrap';
import { getManagerBookings } from '../../services/bookingService';

interface Booking {
  id: string;
  venue: {
    name: string;
  };
  customer: {
    name: string;
  };
  dateFrom: string;
  dateTo: string;
  guests: number;
}

const BookingManager: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getManagerBookings();
        setBookings(response.data || []);
      } catch (err) {
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="p-4">
      <h2>Your Venue Bookings</h2>
      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Venue</th>
              <th>Customer</th>
              <th>Dates</th>
              <th>Guests</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.venue.name}</td>
                <td>{booking.customer.name}</td>
                <td>
                  {new Date(booking.dateFrom).toLocaleDateString()} - {' '}
                  {new Date(booking.dateTo).toLocaleDateString()}
                </td>
                <td>{booking.guests}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default BookingManager;