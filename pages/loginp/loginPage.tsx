import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { loginUser } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) navigate('/profile');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.endsWith('@stud.noroff.no')) {
      setError('Must use a stud.noroff.no email.');
      return;
    }

    try {
      const response = await loginUser({ email, password });

      const {
        accessToken,
        name,
        email: userEmail,
        avatar = '',
        venueManager,
      } = response.data;

      const cleanUser = { name, email: userEmail, avatar, venueManager };
      login(cleanUser, accessToken);
      setError('');
      navigate('/profile');
    } catch (err: any) {
      console.error('Login failed:', err.message || err);
      setError('Invalid email or password');
    }
  };

  return (
    <Card className="mx-auto" style={{ maxWidth: 400 }}>
      <Card.Body>
        <Card.Title>Login</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter stud.noroff.no email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>

        <p className="mt-3 text-center">
          Don’t have an account yet? <Link to="/register">Register here</Link>
        </p>
      </Card.Body>
    </Card>
  );
};

export default LoginPage;
