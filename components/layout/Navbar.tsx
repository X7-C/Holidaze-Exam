import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';

const NavbarComponent: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
      <Container>
        <Navbar.Brand as={Link} to="/">Holidaze</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/venues">Venues</Nav.Link>

            {user ? (
              <>
                {user.venueManager ? (
              <>
             <Nav.Link as={Link} to="/manage/create-venue">
                <span>Create Venue</span>
                  <Badge bg="success" className="ms-1">New</Badge>
                     </Nav.Link>
                     <Nav.Link as={Link} to="/my-venues">My Venues</Nav.Link>
                  </>
                ) : (
                    <Nav.Link as={Link} to="/bookings">My Bookings</Nav.Link>
                  )}

                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
          {user && (
            <div className="d-flex align-items-center gap-3">
              <span className="text-light">
                {user.venueManager && <i className="bi bi-shop me-1"></i>}
                {user.name}
                {user.venueManager && <Badge bg="warning" className="ms-2">Manager</Badge>}
              </span>
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;