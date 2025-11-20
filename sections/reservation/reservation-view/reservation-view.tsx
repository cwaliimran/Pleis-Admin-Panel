'use client';

import { Button } from '@/components/ui/button';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetReservationsQuery } from '@/store/Reducer/reservations-api';
import { ReservationsApiResponse } from './reservation-types';
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
  const [range, setRange] = useState('today');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [openModal, setOpenModal] = useState(false);

  const { companyId, organizationId } = useCompanySelectionState();

  const companyOrganizer = companyId || organizationId || undefined;

  const {
    data: apiData,
    isLoading,
    isFetching,
  } = useGetReservationsQuery({
    page: page - 1,
    limit,
    range,
    date: date ? formatDate(date) : undefined,
    companyOrganizer,
  });

  const reservationsData: ReservationsApiResponse['data'] | undefined = apiData?.data;
  const meta: ReservationsApiResponse['meta'] | undefined = apiData?.meta;

  const handleCreateNew = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRangeChange = (newRange: string) => {
    setRange(newRange);
    setPage(1);
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    setPage(1);
  };

  return (
    <>
      <div className="flex w-full items-center justify-end md:mb-5">
        <Button className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white" onClick={handleCreateNew}>
          <Plus />
          Create Reservation
        </Button>
      </div>

      <ReservationHeader date={date} onDateChange={handleDateChange} range={range} onRangeChange={handleRangeChange} />
      <ReservationBody
        isLoading={isLoading || isFetching}
        data={reservationsData}
        meta={meta}
        onPageChange={handlePageChange}
        limit={limit}
        companyOrganizer={companyOrganizer}
        onLimitChange={(l) => {
          setLimit(l);
        }}
      />

      {openModal && <ReservationModal open={openModal} onClose={handleClose} isEdit={false} selectedData={null} organizationId={organizationId} />}
    </>
  );
};

export default ReservationView;
