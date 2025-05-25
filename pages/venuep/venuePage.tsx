import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { createBooking } from '../../services/bookingService';
import { getVenueById } from '../../services/venueService';
import { Alert, Button, Card, Col, Form, Row, Spinner, Badge } from 'react-bootstrap';
import BookingCalendar from '../../components/booking/calendar';



interface Venue {
  id: string;
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  media?: { url: string; alt?: string }[];
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
  bookings?: {
    dateFrom: string;
    dateTo: string;
  }[];
}

const VenuePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        const response = await getVenueById(id!);
        if (response.data) {
          setVenue(response.data.data || response.data);
        } else {
          setError('Venue not found');
        }
      } catch {
        setError('Failed to load venue details');
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id]);

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      setError('Please select check-in and check-out dates');
      return;
    }

    if (startDate >= endDate) {
      setError('Check-out date must be after check-in date');
      return;
    }

    try {
      setBookingLoading(true);
      setError('');
      await createBooking(id!, {
      dateFrom: startDate.toISOString(),
      dateTo: endDate.toISOString(),
      guests,
      });

      setSuccess('Booking successful!');

      const refreshed = await getVenueById(id!);
      setVenue(refreshed.data.data || refreshed.data);
    } catch (err: any) {
      setError(err.message || 'Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto my-5" />;
  if (error) return <Alert variant="danger" className="m-4">{error}</Alert>;
  if (!venue) return <Alert variant="warning" className="m-4">Venue not found</Alert>;

  const mainImage = venue.media?.[0]?.url || 'https://placehold.co/600x400';
  const bookedRanges = venue.bookings || [];

  return (
    <div className="container mt-4">
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Img
              variant="top"
              src={mainImage}
              alt={venue.name}
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
            <Card.Body>
              <Card.Title>{venue.name}</Card.Title>
              <Card.Text>{venue.description}</Card.Text>

              <div className="mb-3">
                <h5>Details</h5>
                <div><strong>Price:</strong> ${venue.price} per night</div>
                <div><strong>Max guests:</strong> {venue.maxGuests}</div>
                <div><strong>Location:</strong> {venue.location?.city || 'Not specified'}</div>
              </div>

              <div className="mb-3">
                <h5>Amenities</h5>
                <div className="d-flex flex-wrap gap-2">
                  {venue.meta.wifi && <Badge bg="secondary">WiFi</Badge>}
                  {venue.meta.parking && <Badge bg="secondary">Parking</Badge>}
                  {venue.meta.breakfast && <Badge bg="secondary">Breakfast</Badge>}
                  {venue.meta.pets && <Badge bg="secondary">Pets allowed</Badge>}
                </div>
              </div>

              {user?.venueManager && (
                <Link to={`/manage/edit/${venue.id}`} className="btn btn-warning">
                  Edit Venue
                </Link>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Book this venue</Card.Title>

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Guests (max {venue.maxGuests})</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max={venue.maxGuests}
                    value={guests}
                    onChange={(e) => {
                      const value = Math.min(Math.max(1, Number(e.target.value)), venue.maxGuests);
                      setGuests(value);
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Select Dates</Form.Label>
                  <BookingCalendar
                    bookings={bookedRanges}
                    selectedDate={startDate}
                    onChange={(date: Date | null) => {
                      if (!startDate || (startDate && endDate)) {
                        setStartDate(date);
                        setEndDate(null);
                      } else {
                        if (date && startDate && date > startDate) {
                          setEndDate(date);
                        }
                      }
                    }}
                  />
                  <div className="mt-2">
                    <div><strong>From:</strong> {startDate?.toLocaleDateString() || '—'}</div>
                    <div><strong>To:</strong> {endDate?.toLocaleDateString() || '—'}</div>
                  </div>
                </Form.Group>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Button
                  onClick={handleBooking}
                  disabled={bookingLoading || !user}
                  className="w-100 mb-3"
                >
                  {bookingLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Processing...
                    </>
                  ) : (
                    'Book Now'
                  )}
                </Button>

                {!user && (
                  <Alert variant="warning">
                    Please <Link to="/login">login</Link> to make a booking
                  </Alert>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VenuePage;