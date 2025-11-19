'use client';

import React, { useState } from 'react';
import ReservationHeader from './reservation-header';
import ReservationBody from './reservation-body';
import ReservationModal from './reservation-modal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const ReservationView = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedTimeslot, setSelectedTimeslot] = useState<any>(null);

  const handleCreateNew = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedTimeslot(null);
  };

  return (
    <>
      <div className="flex w-full items-center justify-end md:mb-5">
        <Button className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white" onClick={handleCreateNew}>
          <Plus />
          Create Reservation
        </Button>
      </div>

      <ReservationHeader />
      <ReservationBody />

      {/* Reservation Modal */}
      <ReservationModal open={openModal} onClose={handleClose} timeslot={selectedTimeslot} isEdit={false} selectedData={null} />
    </>
  );
};

export default ReservationView;
