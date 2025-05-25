import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spinner, Form, Alert, Container, Button } from 'react-bootstrap';
import { apiRequest } from '../../services/api';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Venue {
  id: string;
  name: string;
  media?: { url: string; alt?: string }[];
  rating?: number;
  location?: {
    city?: string;
    country?: string;
  };
  price: number;
  maxGuests: number;
  created: string;
  bookings?: {
    dateFrom: string;
    dateTo: string;
  }[];
}

const HomePage: React.FC = () => {
  const [displayedVenues, setDisplayedVenues] = useState<Venue[]>([]);
  const [allVenues, setAllVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const response = await apiRequest('/holidaze/venues?_bookings=true&sort=created&sortOrder=desc');
        const venuesData = response?.data?.data || [];
        setAllVenues(venuesData);
        setDisplayedVenues(venuesData.slice(0, 4));
      } catch (err) {
        setError('Failed to load venues');
        setAllVenues([]);
        setDisplayedVenues([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  useEffect(() => {
    const filterVenues = () => {
      let filtered = [...allVenues];
      if (!searchQuery && !dateRange[0] && !dateRange[1] && guests === 1) {
        setDisplayedVenues(allVenues.slice(0, 4));
        return;
      }

      if (searchQuery) {
        filtered = filtered.filter((venue) => {
          const query = searchQuery.toLowerCase();
          return (
            venue.name.toLowerCase().includes(query) ||
            venue.location?.city?.toLowerCase().includes(query) ||
            venue.location?.country?.toLowerCase().includes(query)
          );
        });
      }

      filtered = filtered.filter((venue) => venue.maxGuests >= guests);

      if (dateRange[0] && dateRange[1]) {
        const [startDate, endDate] = dateRange;
        filtered = filtered.filter((venue) => {
          if (!venue.bookings || venue.bookings.length === 0) return true;
          return !venue.bookings.some((booking) => {
            const bookingStart = new Date(booking.dateFrom);
            const bookingEnd = new Date(booking.dateTo);
            return (
              (startDate >= bookingStart && startDate <= bookingEnd) ||
              (endDate >= bookingStart && endDate <= bookingEnd) ||
              (startDate <= bookingStart && endDate >= bookingEnd)
            );
          });
        });
      }

      setDisplayedVenues(filtered.slice(0, 4));
    };

    filterVenues();
  }, [searchQuery, dateRange, guests, allVenues]);

  const isDateDisabled = (date: Date) => {
    return allVenues.every((venue) => {
      if (!venue.bookings) return false;
      return venue.bookings.some((booking) => {
        const bookingStart = new Date(booking.dateFrom);
        const bookingEnd = new Date(booking.dateTo);
        return date >= bookingStart && date <= bookingEnd;
      });
    });
  };

  const getAvailableDates = (): Date[] => {
    const availableDates: Date[] = [];
    const today = new Date();
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 6);

    for (let d = new Date(today); d <= futureDate; d.setDate(d.getDate() + 1)) {
      const date = new Date(d);
      if (!isDateDisabled(date)) {
        availableDates.push(new Date(date));
      }
    }
  
  return availableDates;
};

  return (
    <Container className="my-5 pb-5">
      <section className="text-center mb-5 hero-section">
        <h1 className="display-4 mb-4">Welcome to Holidaze</h1>
        <p className="lead">Your perfect getaway awaits</p>
      </section>

      <Card className="p-4 mb-5 shadow-sm mx-auto" style={{ maxWidth: '800px' }}>
        <h2 className="mb-4 text-center">Find your perfect stay</h2>
        <Row className="justify-content-center">
          <Col md={8}>
            <Row>
              <Col md={12} lg={4} className="mb-3 mb-lg-0">
                <Form.Group>
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Where are you going?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={12} lg={4} className="mb-3 mb-lg-0">
                <Form.Group>
                  <Form.Label>Dates</Form.Label>
                  <DatePicker
                    selectsRange
                    startDate={dateRange[0]}
                    endDate={dateRange[1]}
                    onChange={(update) => setDateRange(update)}
                    placeholderText="Select date range"
                    className="form-control"
                    minDate={new Date()}
                    filterDate={(date) => !isDateDisabled(date)}
                    dateFormat="MMMM d, yyyy"
                    highlightDates={getAvailableDates()}
                    popperClassName="available-dates-popper"
                    includeDates={getAvailableDates()}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode='select'
                    withPortal
                    calendarClassName='custom-calendar'
                    shouldCloseOnSelect={false}
                    renderCustomHeader={({
                    monthDate,
                    decreaseMonth,
                    increaseMonth,
                    }) => (
                    <div className="react-datepicker__header">
                    <button
                     type="button"
                      className="react-datepicker__navigation react-datepicker__navigation--previous"
                     onClick={decreaseMonth}
                      />
                    <span className="react-datepicker__current-month">
                    {monthDate.toLocaleString('en-US', {
                    month: 'long',
                     year: 'numeric',
                    })}
                    </span>
                <button
                type="button"
                className="react-datepicker__navigation react-datepicker__navigation--next"
                onClick={increaseMonth}
                />
    </div>
  )}
/>
                </Form.Group>
              </Col>
              <Col md={12} lg={4}>
                <Form.Group>
                  <Form.Label>Guests</Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setGuests(g => Math.max(1, g - 1))}
                      size="sm"
                    >
                      -
                    </Button>
                    <span className="mx-2">{guests}</span>
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setGuests(g => g + 1)}
                      size="sm"
                    >
                      +
                    </Button>
                  </div>
                  <Form.Text className="text-muted">
                    Max: {allVenues.length > 0 ? Math.max(...allVenues.map(v => v.maxGuests)) : 0}
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>
            {searchQuery || dateRange[0] || guests > 1 
              ? "Matching venues" 
              : "Recent venues"}
          </h2>
          <Link to="/venues" className="btn btn-outline-primary">
            View all locations
          </Link>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : displayedVenues.length === 0 ? (
          <Alert variant="info">No venues found matching your criteria</Alert>
        ) : (
          <Row>
            {displayedVenues.map((venue) => (
              <Col key={venue.id} xs={12} sm={6} lg={3} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={venue.media?.[0]?.url || 'https://placehold.co/600x400?text=No+Image'}
                    alt={venue.media?.[0]?.alt || venue.name}
                    style={{ height: '180px', objectFit: 'cover' }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <Card.Title className="flex-grow-1 text-truncate" title={venue.name}>
                        {venue.name}
                      </Card.Title>
                      <small className="text-muted">
                        <span className="text-warning">★</span>{' '}
                        {venue.rating?.toFixed(1) || '4.5'}
                      </small>
                    </div>
                    <Card.Text className="text-truncate text-muted mb-1">
                      {venue.location?.city || 'Unknown location'}, {venue.location?.country || ''}
                    </Card.Text>
                    <Card.Text className="text-muted">
                      ${venue.price} per night · Max {venue.maxGuests} guests
                    </Card.Text>
                    <Link
                      to={`/venues/${venue.id}`}
                      className="btn btn-outline-primary mt-auto text-center"
                    >
                      View details
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </section>
    </Container>
  );
};

export default HomePage;