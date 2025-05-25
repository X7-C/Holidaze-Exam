import React, { useState, useEffect } from 'react';
import { Card, Image, Button, Form, Col, Row, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import { updateAvatar, updateProfile } from '../../services/profileService';
import { getUserBookings } from '../../services/bookingService';

const ProfilePage: React.FC = () => {
  const { user, login } = useAuth();

  const avatarUrl = (user?.avatar as { url?: string })?.url ||
    (typeof user?.avatar === 'string' ? user.avatar : '');

  const [avatar, setAvatar] = useState(avatarUrl);
  const [message, setMessage] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      try {
        const result = await getUserBookings(user.name);
        const bookingsData = result?.data?.data || result?.data || [];
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      } catch (err: any) {
        setMessage(err.message || 'Failed to load bookings');
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (!user) return <p>You are not logged in.</p>;

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !user) throw new Error('Not logged in');

      const updateData = {
        avatar: {
          url: avatar,
          alt: `${user.name}'s avatar`,
        },
        venueManager: user.venueManager,
      };

      const updatedProfile = await updateProfile(user.name, updateData);

      const updatedUser = {
        ...user,
        avatar: updatedProfile?.avatar?.url || avatar,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      login(updatedUser, token);
      setMessage('Profile updated successfully!');
    } catch (err: any) {
      console.error('Update error:', err);
      setMessage(err.message || 'Update failed');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        const file = e.target.files[0];

        if (!file.type.startsWith('image/')) {
          throw new Error('Only image files are allowed');
        }

        if (file.size > 2 * 1024 * 1024) {
          throw new Error('File size must be less than 2MB');
        }

        const response = await updateAvatar(user.name, file);
        const newAvatarUrl = (response?.avatar as { url?: string })?.url || '';

        const updatedUser = {
          ...user,
          avatar: newAvatarUrl,
        };

        localStorage.setItem('user', JSON.stringify(updatedUser));
        login(updatedUser, localStorage.getItem('token')!);

        setAvatar(newAvatarUrl);
        setMessage('Avatar uploaded successfully!');
      } catch (err: any) {
        console.error('Upload error:', err);
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
            <div className="mb-3">
              <strong>Name:</strong>
              <div className="profile-name-display">
                {user.name}
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Avatar</Form.Label>
              <Form.Control
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="Image URL"
              />
              <Form.Text className="text-muted">Or upload an image:</Form.Text>
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
