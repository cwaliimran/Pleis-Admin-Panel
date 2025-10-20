'use client';

import TableHeadCustom from '@/components/table/table-head-custom';
import { Table } from '@/components/ui/table';
import React from 'react';
import StaffLogTableRow from './StaffConfirmationTableRow';

const headLabel = [
  { id: 'staff', label: 'Staff Member', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
  { id: 'reservationId', label: 'Reservation ID', align: 'left' },
  { id: 'date', label: 'Date', align: 'left' },
  { id: 'notes', label: 'Notes', align: 'left' },
];

const staffLogs = [
  {
    staff: 'Ali Khan',
    action: 'Confirmed',
    reservationId: 'RSV-1001',
    date: '2025-10-16 08:45 PM',
    notes: 'Checked and confirmed payment.',
  },
  {
    staff: 'Sara Ahmed',
    action: 'Rejected',
    reservationId: 'RSV-1002',
    date: '2025-10-16 09:10 PM',
    notes: 'Invalid payment method.',
  },
];

const StaffConfirmationsLog = () => {
  return (
    <div className="rounded-lg border md:m-4">
      <Table className="w-full">
        <TableHeadCustom headLabel={headLabel} />
        <tbody>
          {staffLogs.map((item, index) => (
            <StaffLogTableRow key={index} item={item} />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default StaffConfirmationsLog;
