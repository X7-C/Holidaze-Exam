import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Container,
  Card,
  Spinner,
  Alert,
  Badge,
  Button,
  Modal,
  Form,
} from 'react-bootstrap';
import { getVenueById, deleteVenue } from '../../services/venueService';
import { createBooking } from '../../services/bookingService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { eachDayOfInterval, isBefore, isSameDay } from 'date-fns';

const IndividVenue: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [venue, setVenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState<number>(1);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookedDates, setBookedDates] = useState<Date[]>([]);

  useEffect(() => {
    const fetchVenue = async () => {
      if (!id) return;
      try {
        const { data, error } = await getVenueById(id, { _owner: true, _bookings: true });
        if (error) {
          setError(error);
        } else {
          const venueData = data?.data || null;
          setVenue(venueData);

          if (venueData?.bookings) {
            const dates = venueData.bookings.flatMap((b: any) =>
              eachDayOfInterval({
                start: new Date(b.dateFrom),
                end: new Date(b.dateTo),
              })
            );
            setBookedDates(dates);
          }
        }
      } catch {
        setError('Failed to load venue.');
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this venue?')) return;
    try {
      await deleteVenue(id);
      navigate('/my-venues');
    } catch {
      alert('Failed to delete venue.');
    }
  };

  const handleBooking = () => {
    setBookingError('');
    setBookingSuccess('');
    setShowModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!startDate || !endDate || !id || isBefore(endDate, startDate)) {
      setBookingError('Please select a valid date range.');
      return;
    }
    try {
      await createBooking(id, {
        dateFrom: startDate.toISOString(),
        dateTo: endDate.toISOString(),
        guests,
      });
      setBookingSuccess('Booking successful!');
      setTimeout(() => {
        setShowModal(false);
        navigate('/profile');
      }, 1500);
    } catch (err: any) {
      setBookingError(err.message || 'Booking failed.');
    }
  };

  const calculateNights = () => {
    if (!startDate || !endDate || isBefore(endDate, startDate)) return 0;
    const diff = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const totalPrice = nights * (venue?.price || 0);

  const isVenueManager =
    Boolean(user?.venueManager) &&
    (user?.name === venue?.owner?.name || user?.name === venue?.manager?.name);

  const isDateBooked = (date: Date) =>
    bookedDates.some((booked) => isSameDay(booked, date));

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error || !venue) {
    return (
      <Container className="mt-4">
        <Alert variant="danger" className="text-center">
          {error || 'Venue not found.'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5" style={{ maxWidth: 700 }}>
      <Card className="shadow-sm p-3 bg-dark text-white">
        <Card.Img
          src={venue.media?.[0]?.url || 'https://placehold.co/600x400?text=No+Image'}
          alt={venue.media?.[0]?.alt || venue.name}
          style={{ objectFit: 'cover', width: '100%', maxHeight: '400px' }}
          className="rounded"
        />

        <Card.Body>
          <h2 className="fw-bold">{venue.name}</h2>
          <p className="fst-italic">{venue.description || 'No description available'}</p>
          <h4 className="text-success">${venue.price} <small className="text-white">/ night</small></h4>

          {venue.rating && (
            <p>
              <Badge bg="warning">★ {venue.rating.toFixed(1)}</Badge>
            </p>
          )}

          <p>
            <i className="bi bi-geo-alt-fill me-1"></i>
            {venue.location?.address}, {venue.location?.city}, {venue.location?.country}
          </p>

          <div className="mb-3">
            {venue.meta?.wifi && <Badge bg="light" text="dark" className="me-2 mb-2">WiFi</Badge>}
            {venue.meta?.parking && <Badge bg="light" text="dark" className="me-2 mb-2">Parking</Badge>}
            {venue.meta?.breakfast && <Badge bg="light" text="dark" className="me-2 mb-2">Breakfast</Badge>}
            {venue.meta?.pets && <Badge bg="light" text="dark" className="me-2 mb-2">Pets</Badge>}
          </div>

          <div className="d-flex flex-column gap-2 mt-3">
            <Button variant="primary" className="w-100" onClick={handleBooking}>
              Book this venue
            </Button>

            {isVenueManager && (
              <div className="d-flex justify-content-between gap-2">
                <Button
                  variant="warning"
                  className="flex-grow-1"
                  onClick={() => navigate(`/manage/edit/${venue.id}`)}
                >
                  ⚙️ Edit
                </Button>
                <Button
                  variant="danger"
                  className="flex-grow-1"
                  onClick={handleDelete}
                >
                  🗑️ Delete
                </Button>
              </div>
            )}
          </div>
        </Card.Body>

        {isVenueManager && venue.bookings?.length > 0 && (
          <Card.Footer className="mt-4 bg-secondary text-white rounded">
            <h5 className="mb-3">Upcoming Bookings</h5>
            {venue.bookings.map((b: any) => (
              <div key={b.id} className="border-bottom py-2">
                <strong>Guest:</strong> {b.customer?.name || 'Unknown'}<br />
                <strong>Guests:</strong> {b.guests}<br />
                <strong>From:</strong> {new Date(b.dateFrom).toLocaleDateString()} <br />
                <strong>To:</strong> {new Date(b.dateTo).toLocaleDateString()}
              </div>
            ))}
          </Card.Footer>
        )}
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Booking Dates</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bookingError && <Alert variant="danger">{bookingError}</Alert>}
          {bookingSuccess && <Alert variant="success">{bookingSuccess}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Start Date:</Form.Label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              selectsStart
              startDate={startDate || undefined}
              endDate={endDate || undefined}
              className="form-control"
              minDate={new Date()}
              excludeDates={bookedDates}
              filterDate={(date) => !isDateBooked(date)}
              placeholderText="Select start date"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>End Date:</Form.Label>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              selectsEnd
              startDate={startDate || undefined}
              endDate={endDate || undefined}
              minDate={startDate || new Date()}
              className="form-control"
              excludeDates={bookedDates}
              filterDate={(date) => !isDateBooked(date)}
              placeholderText="Select end date"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Guests:</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            />
          </Form.Group>
          {nights > 0 && (
            <p>Total price for {nights} night(s): <strong>${totalPrice}</strong></p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleConfirmBooking} disabled={!startDate || !endDate}>
            Confirm Booking
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default IndividVenue;
