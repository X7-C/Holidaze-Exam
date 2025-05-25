import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, InputGroup } from 'react-bootstrap';
import { createVenue } from '../../services/venueService';

const CreateVenuePage: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    maxGuests: 1,
    media: '',
    location: { address: '', city: '', country: '' },
    meta: { wifi: false, parking: false, breakfast: false, pets: false },
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      meta: { ...prev.meta, [name]: checked },
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
  };

  const handleGuestChange = (delta: number) => {
    setForm((prev) => ({
      ...prev,
      maxGuests: Math.max(1, prev.maxGuests + delta),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const mediaArray = form.media
        .split('\n')
        .map((url) => ({ url: url.trim(), alt: form.name }))
        .filter((m) => m.url);

      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        maxGuests: form.maxGuests,
        media: mediaArray,
        location: form.location,
        meta: form.meta,
      };

      const { data, error } = await createVenue(payload);

      if (data?.id) {
        setMessage('Venue created successfully!');
        setForm({
          name: '',
          description: '',
          price: '',
          maxGuests: 1,
          media: '',
          location: { address: '', city: '', country: '' },
          meta: { wifi: false, parking: false, breakfast: false, pets: false },
        });
      } else {
        throw new Error(error || 'Venue creation failed. Please try again.');
      }
    } catch (err: any) {
      setMessage(err.message || 'Something went wrong');
    }
  };

  return (
    <Form className="p-4" onSubmit={handleSubmit}>
      {message && <Alert variant="info">{message}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Venue Name *</Form.Label>
        <Form.Control
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description *</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Price per night ($) *</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min={1}
            />
          </Form.Group>
        </Col>

        <Col>
          <Form.Label>Max Guests *</Form.Label>
          <InputGroup className="mb-3">
            <Button variant="outline-secondary" onClick={() => handleGuestChange(-1)}>
              -
            </Button>
            <Form.Control
              type="number"
              value={form.maxGuests}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, maxGuests: Number(e.target.value) }))
              }
              min={1}
            />
            <Button variant="outline-secondary" onClick={() => handleGuestChange(1)}>
              +
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Image URLs (one per line)</Form.Label>
        <Form.Control
          as="textarea"
          name="media"
          value={form.media}
          onChange={handleChange}
        />
      </Form.Group>

      <h5>Location</h5>
      <Row className="mb-3">
        <Col>
          <Form.Control
            name="address"
            placeholder="Address"
            value={form.location.address}
            onChange={handleLocationChange}
          />
        </Col>
        <Col>
          <Form.Control
            name="city"
            placeholder="City"
            value={form.location.city}
            onChange={handleLocationChange}
          />
        </Col>
        <Col>
          <Form.Control
            name="country"
            placeholder="Country"
            value={form.location.country}
            onChange={handleLocationChange}
          />
        </Col>
      </Row>

      <h5>Amenities</h5>
      <Row className="mb-4">
        {['wifi', 'parking', 'breakfast', 'pets'].map((amenity) => (
          <Col xs={6} md={3} key={amenity}>
            <Form.Check
              type="checkbox"
              name={amenity}
              label={amenity.charAt(0).toUpperCase() + amenity.slice(1)}
              checked={form.meta[amenity as keyof typeof form.meta]}
              onChange={handleMetaChange}
            />
          </Col>
        ))}
      </Row>

      <Button type="submit" variant="primary" className="w-100">
        Create Venue
      </Button>
    </Form>
  );
};

export default CreateVenuePage;