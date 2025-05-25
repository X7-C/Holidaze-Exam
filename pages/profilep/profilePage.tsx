import React, { useState, useEffect } from 'react';
import { Card, Image, Button, Form, Col, Row, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import { updateAvatar, updateProfile } from '../../services/profileService';
import { getUserBookings } from '../../services/bookingService';

const ProfilePage: React.FC = () => {
  const { user, login } = useAuth();
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [name, setName] = useState(user?.name || '');
  const [message, setMessage] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      const result = await getUserBookings(user.name);


      if (result?.error) {
        setMessage(result.error);
      } else {
        setBookings(result.data?.data || []);
      }
      setLoadingBookings(false);
    };
    fetchBookings();
  }, [user]);

  if (!user) return <p>You are not logged in.</p>;

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !user) throw new Error('Not logged in');

      await updateProfile(user.name, {
        email: user.email,
        venueManager: user.venueManager,
      });

      login({ ...user, avatar, name }, token);
      setMessage('Profile updated successfully!');
    } catch (err: any) {
      setMessage(err.message || 'Update failed');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        const file = e.target.files[0];
        const response = await updateAvatar(user.name, file);
        setAvatar(response.avatar);
        setMessage('Avatar uploaded successfully!');
      } catch (err: any) {
        setMessage(err.message || 'Avatar upload failed');
      }
    }
  };

  return (
    <Row className="mx-auto" style={{ maxWidth: 1000 }}>
      <Col md={6}>
        <Card>
          <Card.Body className="text-center">
            <Image
              src={avatar || 'https://placehold.co/100x100?text=Avatar'}
              roundedCircle
              width={100}
              height={100}
              alt="User avatar"
              className="mb-3"
            />
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Avatar URL</Form.Label>
              <Form.Control
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
              />
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="mt-2"
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="primary" onClick={handleUpdate}>
                Update Profile
              </Button>
            </div>
            {message && <Alert variant="info" className="mt-3">{message}</Alert>}
          </Card.Body>
        </Card>
      </Col>

      <Col md={6}>
        <h5 className="mb-3">My Bookings</h5>
        {loadingBookings ? (
          <div className="text-center mt-3">
            <Spinner animation="border" />
          </div>
        ) : bookings.length === 0 ? (
          <Alert variant="info">No bookings found.</Alert>
        ) : (
          bookings.map((booking) => (
            <Card key={booking.id} className="mb-3">
              <Card.Body>
                <Card.Title>{booking.venue?.name || 'Unknown Venue'}</Card.Title>
                <div>
                  <strong>From:</strong> {new Date(booking.dateFrom).toLocaleDateString()} <br />
                  <strong>To:</strong> {new Date(booking.dateTo).toLocaleDateString()} <br />
                  <strong>Guests:</strong> {booking.guests}
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </Col>
    </Row>
  );
};

export default ProfilePage;
