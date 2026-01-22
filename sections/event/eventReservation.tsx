import React from 'react';
import ReservationView from '../reservation-modules/reservation-view/reservation-view';

const EventReservation = ({ event }: { event: any }) => {
  return (
    <>
      <ReservationView event={event} />
    </>
  );
};

export default EventReservation;
