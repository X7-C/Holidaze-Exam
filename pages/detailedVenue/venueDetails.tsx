import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Button, Badge, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { getVenueById } from '../../services/venueService';

interface Venue {
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
    city?: string;
    country?: string;
  };
}

const VenueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        const response = await getVenueById(id!);
        setVenue(response.data);
      } catch (err) {
        setError('Failed to load venue details');
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id]);

  if (loading) return <Spinner animation="border" className="d-block mx-auto my-5" />;
  if (error) return <Alert variant="danger" className="m-4">{error}</Alert>;
  if (!venue) return <Alert variant="warning" className="m-4">Venue not found</Alert>;

  return (
    <Container className="my-5">
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            {venue.media[0] && (
              <Card.Img 
                variant="top" 
                src={venue.media[0]} 
                alt={venue.name}
                style={{ height: '400px', objectFit: 'cover' }}
              />
            )}
            <Card.Body>
              <Card.Title>{venue.name}</Card.Title>
              <Card.Text>{venue.description}</Card.Text>
              
              <div className="mb-3">
                <h5>Details</h5>
                <p><strong>Price:</strong> ${venue.price} per night</p>
                <p><strong>Max guests:</strong> {venue.maxGuests}</p>
                {venue.location.city && (
                  <p><strong>Location:</strong> {venue.location.city}, {venue.location.country}</p>
                )}
              </div>

              <div className="mb-3">
                <h5>Amenities</h5>
                <div className="d-flex flex-wrap gap-2">
                  {venue.meta.wifi && <Badge bg="primary">WiFi</Badge>}
                  {venue.meta.parking && <Badge bg="primary">Parking</Badge>}
                  {venue.meta.breakfast && <Badge bg="primary">Breakfast</Badge>}
                  {venue.meta.pets && <Badge bg="primary">Pets Allowed</Badge>}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h5>Book this venue</h5>
              <Button variant="primary" className="w-100 mt-3">
                Book Now
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VenueDetailPage;