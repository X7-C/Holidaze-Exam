import React, { useEffect, useState } from 'react';
import {
  Card,
  Col,
  Row,
  Spinner,
  Alert,
  Badge,
  Container,
  Button,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useVenues } from '../../hooks/useVenues';

interface Venue {
  id: string;
  name: string;
  description: string;
  price: number;
  media?: { url: string; alt?: string }[];
  meta: {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  };
  location?: {
    city?: string;
    country?: string;
  };
  rating?: number;
}

const AllVenuesPage: React.FC = () => {
  const { venues, loading, error, refreshVenues } = useVenues();
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    refreshVenues();
  }, []);

  const paginatedVenues = venues.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(venues.length / itemsPerPage);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Loading venues...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger" className="text-center">
          {error}
          <Button
            variant="outline-danger"
            className="ms-3"
            onClick={refreshVenues}
          >
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>All Venues</h1>
        <Button variant="outline-primary" onClick={refreshVenues}>
          Refresh
        </Button>
      </div>

      {venues.length === 0 ? (
        <Alert variant="info" className="text-center">
          No venues found. Please try again later.
        </Alert>
      ) : (
        <>
          <Row xs={1} md={2} lg={3} className="g-4">
            {paginatedVenues.map((venue: Venue) => (
              <Col key={venue.id}>
                <Card className="h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={
                      venue.media?.[0]?.url ||
                      'https://placehold.co/600x400?text=No+Image'
                    }
                    alt={venue.media?.[0]?.alt || venue.name}
                    style={{
                      height: '200px',
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title className="mb-0 text-truncate" title={venue.name}>
                        {venue.name}
                      </Card.Title>
                      {venue.rating && (
                        <Badge bg="warning" pill className="ms-2">
                          ★ {venue.rating.toFixed(1)}
                        </Badge>
                      )}
                    </div>

                    <Card.Text
                      style={{
                        wordBreak: 'break-word',
                        maxHeight: '3.6em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {venue.description || 'No description available'}
                    </Card.Text>

                    <div className="mb-2">
                      <strong>${venue.price}</strong>{' '}
                      <small className="text-muted">per night</small>
                    </div>

                    {venue.location?.city && (
                      <div className="mb-3">
                        <i className="bi bi-geo-alt me-1"></i>
                        {venue.location.city}
                        {venue.location.country && `, ${venue.location.country}`}
                      </div>
                    )}

                    <div className="mb-3">
                      {venue.meta.wifi && (
                        <Badge bg="light" text="dark" className="me-1">
                          WiFi
                        </Badge>
                      )}
                      {venue.meta.parking && (
                        <Badge bg="light" text="dark" className="me-1">
                          Parking
                        </Badge>
                      )}
                      {venue.meta.breakfast && (
                        <Badge bg="light" text="dark" className="me-1">
                          Breakfast
                        </Badge>
                      )}
                      {venue.meta.pets && (
                        <Badge bg="light" text="dark" className="me-1">
                          Pets
                        </Badge>
                      )}
                    </div>

                    <Link
                      to={`/individVenue/${venue.id}`}
                      className="btn btn-primary mt-auto"
                    >
                      View Details
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="d-flex justify-content-center mt-4 gap-2">
            <Button
              variant="secondary"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="align-self-center">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="secondary"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default AllVenuesPage;