import React from 'react';
import ReservationView from '../reservation-modules/reservation-view/reservation-view';

interface EventReservationProps {
  event: any;
  userType: any;
}

const EventReservation = ({ event, userType }: EventReservationProps) => {
  console.log('userType', userType);

  return (
    <>
      <ReservationView event={event} userType={userType} />
    </>
  );
};

export default EventReservation;
