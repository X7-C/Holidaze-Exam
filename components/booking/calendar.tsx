import React from 'react';
import DatePicker from 'react-datepicker';
import { eachDayOfInterval, isSameDay } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

interface BookingCalendarProps {
  bookings: Array<{
    dateFrom: string;
    dateTo: string;
  }>;
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  bookings,
  selectedDate,
  onChange,
}) => {
  const bookedDates = bookings.flatMap((booking) =>
    eachDayOfInterval({
      start: new Date(booking.dateFrom),
      end: new Date(booking.dateTo),
    })
  );

  return (
    <DatePicker
      selected={selectedDate}
      onChange={onChange}
      inline
      excludeDates={bookedDates}
      highlightDates={[{ "booked-date": bookedDates }]}
      dayClassName={(date) =>
        bookedDates.some((d) => isSameDay(d, date)) ? 'booked-date' : ''
      }
    />
  );
};

export default BookingCalendar;
