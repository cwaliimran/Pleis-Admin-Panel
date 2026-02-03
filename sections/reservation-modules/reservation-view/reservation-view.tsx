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
import { ReservationsApiResponse } from './reservation-types';

type ReservationViewProps = {
  event?: any;
};

const ReservationView = ({ event }: ReservationViewProps) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const organizationIdFromEvent = event?.basicInfo?.organization?._id || undefined;

  const [range, setRange] = useState('today');
  const [status, setStatus] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const { companyId, organizationId } = useCompanySelectionState();

  const companyOrganizer = companyId || undefined;

  const {
    data: apiData,
    isLoading,
    isFetching,
  } = useGetReservationsQuery({
    page: page - 1,
    limit,
    range: date ? undefined : range,
    date: date ? formatDate(date) : undefined,
    organizationsId: organizationIdFromEvent || organizationId || undefined,
    status: status === 'all' ? undefined : status,
    // organizationsId: organizationId || undefined,
    // companyOrganizer,
  });

  const reservationsData: ReservationsApiResponse['data'] | undefined = apiData?.data;
  const meta: ReservationsApiResponse['meta'] | undefined = apiData?.meta;

  const handleCreateNew = () => {
    setSelectedData(null);
    setIsEdit(false);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setIsEdit(false);
    setSelectedData(null);
  };

  const handleEdit = (reservation: any) => {
    setSelectedData(reservation);
    setIsEdit(true);
    setOpenModal(true);
  };

  const handlePageChange = (newPage: number) => setPage(newPage);

  // Fix: When range changes, clear date
  const handleRangeChange = (newRange: string) => {
    setRange(newRange);
    if (newRange) {
      setDate(undefined);
    }
    setPage(1);
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      setRange('');
    }
    setPage(1);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
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

      <ReservationHeader
        date={date}
        onDateChange={handleDateChange}
        range={range}
        onRangeChange={handleRangeChange}
        status={status}
        onStatusChange={handleStatusChange}
      />

      <ReservationBody
        isLoading={isLoading || isFetching}
        data={reservationsData}
        // organizationId={organizationId}
        organizationId={organizationIdFromEvent || organizationId}
        meta={meta}
        onPageChange={handlePageChange}
        limit={limit}
        companyOrganizer={companyOrganizer}
        onLimitChange={(l) => setLimit(l)}
        onEdit={handleEdit}
      />

      {openModal && (
        <ReservationModal
          open={openModal}
          onClose={handleClose}
          isEdit={isEdit}
          selectedData={selectedData}
          organizationId={organizationIdFromEvent || organizationId}
          event={event}
        />
      )}
    </>
  );
};

export default ReservationView;
