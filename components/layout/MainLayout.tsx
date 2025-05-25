import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout: React.FC = () => {
  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <Outlet />
      </Container>
    </>
  );
};

export default MainLayout;
