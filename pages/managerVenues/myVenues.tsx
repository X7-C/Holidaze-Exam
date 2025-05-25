import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { getManagerVenues } from '../../services/venueService';

const MyVenues: React.FC = () => {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userRaw = localStorage.getItem('user');
  const user = userRaw ? JSON.parse(userRaw) : null;

  useEffect(() => {
    const fetchVenues = async () => {
      if (!user?.name) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await getManagerVenues(user.name);
        if (error) {
          setError(error);
        } else {
          setVenues(data?.data || []);
        }
      } catch (err) {
        setError('Failed to fetch venues. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [user?.name]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">My Venues</h2>
      {venues.length === 0 ? (
        <Alert variant="info">You have not created any venues yet.</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {venues.map((venue) => (
            <Col key={venue.id}>
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={venue.media?.[0]?.url || 'https://placehold.co/600x400?text=No+Image'}
                  alt={venue.media?.[0]?.alt || venue.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{venue.name}</Card.Title>
                  <Card.Text>{venue.description?.slice(0, 100) || 'No description available'}</Card.Text>
                  <div className="mb-2">
                    <strong>${venue.price}</strong> <small className="text-muted">/ night</small>
                  </div>
                  <div className="mb-3">
                    {venue.meta?.wifi && <Badge bg="light" text="dark" className="me-1">WiFi</Badge>}
                    {venue.meta?.parking && <Badge bg="light" text="dark" className="me-1">Parking</Badge>}
                    {venue.meta?.breakfast && <Badge bg="light" text="dark" className="me-1">Breakfast</Badge>}
                    {venue.meta?.pets && <Badge bg="light" text="dark" className="me-1">Pets</Badge>}
                  </div>
                  <Button
                    as="a"
                    href={`/individVenue/${venue.id}`}
                    variant="primary"
                    className="mt-auto"
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyVenues;
