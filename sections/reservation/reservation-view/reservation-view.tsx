'use client';

import { Button } from '@/components/ui/button';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetReservationsQuery } from '@/store/Reducer/reservations-api';
import { formatDate } from '@/utils/format-time';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import ReservationBody from './reservation-body';
import ReservationHeader from './reservation-header';
import ReservationModal from './reservation-modal';

const ReservationView = () => {
  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [range, setRange] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [openModal, setOpenModal] = useState(false);

  const { companyId, organizationId } = useCompanySelectionState();

  const { data: apiData, isLoading } = useGetReservationsQuery({
    page: page - 1,
    limit,
    range,
    date: date ? formatDate(date) : undefined,
    companyOrganizer: companyId || undefined,
  });

  // console.log('Reservation Data', apiData);

  const handleCreateNew = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
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
      <ReservationBody isLoading={isLoading} />

      {openModal && <ReservationModal open={openModal} onClose={handleClose} isEdit={false} selectedData={null} organizationId={organizationId} />}
    </>
  );
};

export default ReservationView;
