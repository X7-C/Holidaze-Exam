import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useBookings } from '../../hooks/useBookings';
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';

const BookingPage: React.FC = () => {
  const { user, isAuthLoading } = useAuth();
  const { bookings, loading, error } = useBookings(user?.name || '');

  if (isAuthLoading) return <Spinner animation="border" className="d-block mx-auto" />;
  if (!user) return <Alert variant="warning">You must be logged in to view bookings.</Alert>;
  if (loading) return <Spinner animation="border" className="d-block mx-auto" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (bookings.length === 0) return <Alert variant="info">You don't have any bookings yet.</Alert>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Bookings</h2>
      <Row>
        {bookings.map((booking) => (
          <Col md={6} lg={4} key={booking.id} className="mb-4">
            <Card>
              <Card.Img
                variant="top"
                src={booking.venue.media[0] || 'https://placehold.co/600x400?text=No+Image'}
                alt={booking.venue.name}
              />
              <Card.Body>
                <Card.Title>{booking.venue.name}</Card.Title>
                <Card.Text>
                  <strong>Guests:</strong> {booking.guests}
                  <br />
                  <strong>From:</strong> {new Date(booking.dateFrom).toLocaleDateString()}
                  <br />
                  <strong>To:</strong> {new Date(booking.dateTo).toLocaleDateString()}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BookingPage;