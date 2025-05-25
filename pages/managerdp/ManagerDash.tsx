import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useVenues } from '../../hooks/useVenues';
import { Button, Modal, Form, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';

const ManagerDash: React.FC = () => {
  const { user } = useAuth();
  const { venues, loading, error, addVenue, editVenue, removeVenue } = useVenues(user?.name || '');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    maxGuests: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addVenue(formData);
    setShowModal(false);
  };

  if (!user || !user.venueManager) {
    return <Alert variant="warning">You must be a venue manager to access this page.</Alert>;
  }

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>Manage Your Venues</h2>
        <Button onClick={() => setShowModal(true)}>Add New Venue</Button>
      </div>

      <Row>
        {venues.map(venue => (
          <Col md={6} lg={4} key={venue.id} className="mb-4">
            <Card>
              <Card.Img variant="top" src={venue.media[0] || 'https://placehold.co/600x400'} />
              <Card.Body>
                <Card.Title>{venue.name}</Card.Title>
                <Card.Text>
                  ${venue.price} per night<br />
                  Max guests: {venue.maxGuests}
                </Card.Text>
                <Button variant="primary" className="me-2">Edit</Button>
                <Button variant="danger" onClick={() => removeVenue(venue.id)}>Delete</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Venue</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Venue Name</Form.Label>
              <Form.Control 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Venue</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ManagerDash;