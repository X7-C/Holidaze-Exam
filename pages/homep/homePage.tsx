import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spinner, Form, Alert, Container, Button } from 'react-bootstrap';
import { apiRequest } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';
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
}

const categories = [
  { label: 'Cabins', tag: 'cabins', image: 'https://placehold.co/100x100?text=Cabins' },
  { label: 'Luxury', tag: 'luxury', image: 'https://placehold.co/100x100?text=Luxury' },
  { label: 'Camping', tag: 'camping', image: 'https://placehold.co/100x100?text=Camping' },
  { label: 'Beach', tag: 'beach', image: 'https://placehold.co/100x100?text=Beach' },
];

const HomePage: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [guests, setGuests] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const response = await apiRequest('/holidaze/venues');
        setVenues(response?.data?.data || []);
      } catch (err) {
        setError('Failed to load venues');
        setVenues([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const filteredVenues = venues.filter((venue: Venue) =>
    venue.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const incrementGuests = () => setGuests((g) => g + 1);
  const decrementGuests = () => setGuests((g) => Math.max(1, g - 1));

  return (
    <Container className="my-5 pb-5">
      <section className="text-center mb-5 hero-section">
        <h1 className="display-4 mb-4">Welcome to Holidaze</h1>
        <p className="lead">Your perfect getaway awaits</p>
      </section>

      <Card className="p-4 mb-5 shadow-sm">
        <h2 className="mb-4">Find your perfect stay</h2>
        <Row>
          <Col md={4}>
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
          <Col md={3}>
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
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Guests</Form.Label>
              <div className="d-flex align-items-center gap-2">
                <Button variant="outline-secondary" onClick={decrementGuests}>-</Button>
                <span>{guests}</span>
                <Button variant="outline-secondary" onClick={incrementGuests}>+</Button>
              </div>
            </Form.Group>
          </Col>
          <Col md={2} className="d-flex align-items-end">
            <Button variant="primary" className="w-100">
              Search
            </Button>
          </Col>
        </Row>
      </Card>

      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Popular destinations</h2>
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
        ) : filteredVenues.length === 0 ? (
          <Alert variant="info">No venues found matching your criteria</Alert>
        ) : (
          <Row>
            {filteredVenues.slice(0, 4).map((venue) => (
              <Col key={venue.id} md={3} className="mb-4">
                <Card className="h-100 venue-card">
                  <Card.Img
                    variant="top"
                    src={venue.media?.[0]?.url || 'https://placehold.co/600x400?text=No+Image'}
                    alt={venue.media?.[0]?.alt || venue.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <Card.Title>{venue.name}</Card.Title>
                      <div>
                        <span className="text-warning">★</span> {venue.rating || '4.5'}
                      </div>
                    </div>
                    <Card.Text>{venue.location?.city || 'Unknown location'}</Card.Text>
                    <Card.Text className="text-muted">
                      ${venue.price} per night
                    </Card.Text>
                    <Link to={`/individVenue/${venue.id}`} className="btn btn-outline-primary w-100">
                      View details
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </section>

      <section className="mb-5 pb-5">
        <h2 className="mb-4">Categories</h2>
        <Row className="g-3">
          {categories.map((cat) => (
            <Col xs={6} md={3} key={cat.tag} className="text-center">
              <div
                onClick={() => navigate(`/venues?tag=${cat.tag}`)}
                style={{
                  cursor: 'pointer',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  width: 100,
                  height: 100,
                  margin: '0 auto',
                  border: '2px solid #ccc',
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="img-fluid"
                  style={{ objectFit: 'cover', height: '100%' }}
                />
              </div>
              <div className="mt-2">{cat.label}</div>
            </Col>
          ))}
        </Row>
      </section>
    </Container>
  );
};

export default HomePage;