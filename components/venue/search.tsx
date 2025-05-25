import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface VenueSearchProps {
  onSearch: (params: {
    searchTerm: string;
    dateFrom: Date | null;
    dateTo: Date | null;
    guests: number;
  }) => void;
}

const VenueSearch: React.FC<VenueSearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [guests, setGuests] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      searchTerm,
      dateFrom: dateRange[0],
      dateTo: dateRange[1],
      guests
    });
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4 p-3 bg-light rounded">
      <Row>
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search venues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <DatePicker
            selectsRange
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={(update) => setDateRange(update)}
            placeholderText="Select dates"
            className="form-control"
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
          />
        </Col>
        <Col md={2}>
          <Button variant="primary" type="submit" className="w-100">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default VenueSearch;