import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import HomePage from '../pages/homep/homePage';
import LoginPage from '../pages/loginp/loginPage';
import ProfilePage from '../pages/profilep/profilePage';
import RegisterPage from '../pages/registerp/registerPage';
import BookingPage from '../pages/bookingp/bookingPage';
import VenuePage from '../pages/venuep/venuePage';
import AllVenuesPage from '../pages/allVenues/allVenues';
import ErrorBoundary from '../components/common/ErrorBoundary';
import CreateVenue from '../pages/venueCreate/createVenue';
import BookingManager from '../pages/manageBookings/bookingManager';
import MyVenues from '../pages/managerVenues/myVenues';
import IndividVenue from '../pages/individ/individVenue';
import EditVenuePage from '../pages/editVenue/editVenue';

const App: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/bookings" element={<BookingPage />} />
            <Route path="/venues" element={<AllVenuesPage />} />
            <Route path="/venues/:id" element={<VenuePage />} />
            <Route path="/manage/create-venue" element={<CreateVenue />} />
            <Route path="/manage/bookings" element={<BookingManager />} />
            <Route path="/my-venues" element={<MyVenues />} />
            <Route path="/individVenue/:id" element={<IndividVenue />} />
            <Route path="/manage/edit/:id" element={<EditVenuePage />} />

          </Route>
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
