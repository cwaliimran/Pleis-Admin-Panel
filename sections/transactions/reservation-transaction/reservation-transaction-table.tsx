'use client';

import Time24hInput from '@/components/common/time-24h-input';
import { TableFilters } from '@/components/table-filters';
import PaginationControls from '@/components/table/pagination-controls';
import TableHeadCustom from '@/components/table/table-head-custom';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table } from '@/components/ui/table';
import TableBodyWrapper from '@/components/ui/table-body-wrapper';
import { useTableSort } from '@/hooks/useTableSort';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings2 } from 'lucide-react';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import ReservationTransactionTableRow from './reservation-transaction-table-row';
import { SamplePageProps } from './types';

const HEAD_LABEL = [
  { id: 'user', label: 'User', align: 'left', sortable: true, sortKey: 'user.firstName' },
  { id: 'organization', label: 'Organization', align: 'left' },
  { id: 'transactionId', label: 'Transaction ID', align: 'left' },
  { id: 'orderNo', label: 'Order No', align: 'left' },
  { id: 'transactionType', label: 'Type', align: 'left' },
  { id: 'transactionAmount', label: 'Amount', align: 'left' },
  { id: 'paymentMethod', label: 'Payment Method', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'timestamp', label: 'Timestamp', align: 'left', sortable: true, sortKey: 'createdAt' },
];

const ReservationTransactionTable: FC<SamplePageProps> = ({
  data = [],
  meta,
  loading,
  handleDelete,
  handleEdit,
  onPageChange,
  limit = 10,
  // filters states bellow
  search = '',
  onSearch = () => { },
  paymentStatus = '',
  onPaymentStatusChange = () => { },
  paymentMethod = '',
  onPaymentMethodChange = () => { },
  minimalSpendRes = '',
  onMinimalSpendResChange = () => { },
  transactionStartDate,
  transactionEndDate,
  onTransactionDateRangeChange = () => { },
  reservationStartDate,
  reservationEndDate,
  onReservationDateRangeChange = () => { },
  reservationDate,
  onReservationDateChange = () => { },
  timeStart = '',
  onTimeStartChange = () => { },
  timeEnd = '',
  onTimeEndChange = () => { },
  reservationTimeline = '',
  onReservationTimelineChange = () => { },
  prepayOnly = false,
  onPrepayOnlyChange = () => { },
  ticketRequiredOnly = false,
  onTicketRequiredOnlyChange = () => { },
  cancelledOnly = false,
  onCancelledOnlyChange = () => { },
  noShowOnly = false,
  onNoShowOnlyChange = () => { },
  date,
  onDateChange = () => { },
  onResetFilters = () => { },
}) => {
  // Pagination logic
  const totalPages = meta?.totalPages || 1;
  const currentPage = meta?.currentPage || 1;
  const totalRecords = meta?.totalRecords || 0;
  const [sheetLocation] = useState<string[]>([]);

  const { sortedData, sortConfig, handleSort } = useTableSort({
    data: data || [],
  });

  const methods = useForm({
    defaultValues: {
      location: sheetLocation,
    },
  });

  return (
    <div>
      <div className="grid grid-cols-12">
        <Card className="dark:bg-secondary col-span-12 mt-5 mb-5 px-2 shadow-md md:px-8 lg:col-span-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h3 className="ml-2 text-xl font-semibold md:ml-0">Reservation Transaction List</h3>

            {/* FILTER SHEET */}
            <Sheet>
              <SheetTrigger asChild>
                <Badge className="text-md flex cursor-pointer items-center gap-2 rounded-3xl border border-gray-300 bg-white px-4 py-2 text-black">
                  <Settings2 className="h-5 w-5" />
                  <span className="whitespace-nowrap">Filter</span>
                </Badge>
              </SheetTrigger>
              <SheetContent aria-describedby={undefined} side="right" className="dark:bg-secondary h-full overflow-y-auto p-0">
                <SheetHeader className="mb-2 border-b pb-2">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <FormProvider {...methods}>
                  <form className="flex flex-col gap-6 px-4 py-2 pb-8">
                    {/* Transaction Date Range */}
                    <div className="flex w-full flex-col gap-3">
                      <label className="px-1 text-sm font-medium">Transaction Date Range</label>
                      <div className="w-full">
                        <TableFilters
                          className="w-full [&_.w-44]:w-full [&_.w-\[180px\]]:w-full"
                          dateRangeFilter={{
                            startDate: {
                              id: 'transaction-start-date',
                              placeholder: 'Select start date',
                              value: transactionStartDate,
                              onChange: (newStartDate) => onTransactionDateRangeChange(newStartDate, transactionEndDate),
                            },
                            endDate: {
                              id: 'transaction-end-date',
                              placeholder: 'Select end date',
                              value: transactionEndDate,
                              onChange: (newEndDate) => onTransactionDateRangeChange(transactionStartDate, newEndDate),
                            },
                          }}
                          searchFilter={{
                            placeholder: 'Organizer / Linked Events...',
                            value: search,
                            onChange: onSearch,
                          }}
                          selectFilters={[
                            {
                              id: 'sheet-payment-status',
                              label: 'Payment Status',
                              placeholder: 'Payment Status',
                              value: paymentStatus,
                              onChange: onPaymentStatusChange,
                              options: [
                                { value: 'all', label: 'All' },
                                { value: 'pending', label: 'Pending' },
                                { value: 'paid', label: 'Paid' },
                                { value: 'failed', label: 'Failed' },
                                { value: 'refunded', label: 'Refunded' },
                              ],
                            },
                            {
                              id: 'sheet-reservation-timeline',
                              label: 'Reservation Timeline',
                              placeholder: 'Reservation Timeline',
                              value: reservationTimeline,
                              onChange: onReservationTimelineChange,
                              options: [
                                { value: 'all', label: 'All' },
                                { value: 'future', label: 'Future Reservations' },
                                { value: 'past', label: 'Past Reservations' },
                              ],
                            },
                          ]}
                          filtersAlignment="left"
                        />
                      </div>
                    </div>

                    {/* Reservation Date Range */}
                    <div className="-mt-4 flex w-full flex-col gap-3">
                      <label className="px-1 text-sm font-medium">Reservation Date Range</label>
                      <TableFilters
                        className="w-full [&_.w-44]:w-full [&_.w-\[180px\]]:w-full"
                        dateRangeFilter={{
                          startDate: {
                            id: 'reservation-start-date',
                            placeholder: 'Select start date',
                            value: reservationStartDate,
                            onChange: (newStartDate) => onReservationDateRangeChange(newStartDate, reservationEndDate),
                          },
                          endDate: {
                            id: 'reservation-end-date',
                            placeholder: 'Select end date',
                            value: reservationEndDate,
                            onChange: (newEndDate) => onReservationDateRangeChange(reservationStartDate, newEndDate),
                          },
                        }}
                        filtersAlignment="left"
                      />
                    </div>



                    {/* Time Filters */}
                    <div className="-mt-4 flex w-full flex-col gap-3">
                      <Label className="text-sm font-medium">Time Filters</Label>
                      <TableFilters
                        className="w-full [&_.w-44]:w-full [&_.w-\[180px\]]:w-full"
                        dateFilter={{
                          id: 'reservation-date',
                          placeholder: 'Reservation Date',
                          value: reservationDate,
                          onChange: onReservationDateChange,
                        }}
                        filtersAlignment="left"
                      />

                      <div className="flex items-center gap-2">
                        <Time24hInput
                          value={timeStart}
                          onChange={onTimeStartChange}
                          placeholder="18:00"
                          disabled={!reservationDate}
                          className="h-10 w-full"
                        />
                        <span className="text-muted-foreground text-sm">to</span>
                        <Time24hInput
                          value={timeEnd}
                          onChange={onTimeEndChange}
                          placeholder="22:00"
                          disabled={!reservationDate}
                          className="h-10 w-full"
                        />
                      </div>

                      {!reservationDate && <p className="text-muted-foreground mb-1 text-xs">Select Reservation Date to enable time range.</p>}



                      <div className="mt-1 flex w-full flex-col gap-2">
                        <Label className="text-sm font-medium">Minimal Spend Only</Label>
                        <div className="relative">
                          <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm">€</span>
                          <Input
                            type="number"
                            placeholder="120"
                            min={0}
                            value={minimalSpendRes}
                            onChange={(e) => onMinimalSpendResChange(e.target.value)}
                            className="h-10 w-full pl-12"
                          />
                        </div>
                      </div>
                    </div>





                    {/* Business Filters */}
                    <div className="-mt-2 flex w-full flex-col gap-3">
                      <Label className="text-sm font-medium">Business Filters</Label>
                      <label className="flex cursor-pointer items-center gap-3 text-sm">
                        <Checkbox checked={prepayOnly} onCheckedChange={(checked) => onPrepayOnlyChange(Boolean(checked))} />
                        <span>Prepay Only</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-3 text-sm">
                        <Checkbox checked={ticketRequiredOnly} onCheckedChange={(checked) => onTicketRequiredOnlyChange(Boolean(checked))} />
                        <span>Ticket-required Only</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-3 text-sm">
                        <Checkbox checked={cancelledOnly} onCheckedChange={(checked) => onCancelledOnlyChange(Boolean(checked))} />
                        <span>Cancelled</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-3 text-sm">
                        <Checkbox checked={noShowOnly} onCheckedChange={(checked) => onNoShowOnlyChange(Boolean(checked))} />
                        <span>No-show</span>
                      </label>
                    </div>

                    {(search || paymentStatus || paymentMethod || minimalSpendRes || date || transactionStartDate || transactionEndDate || reservationStartDate || reservationEndDate || reservationDate || timeStart || timeEnd || reservationTimeline || prepayOnly || ticketRequiredOnly || cancelledOnly || noShowOnly) && (
                      <button
                        className="bg-muted text-foreground border-border hover:bg-muted/80 w-full cursor-pointer rounded-md border py-2 font-semibold transition"
                        type="button"
                        onClick={onResetFilters}
                      >
                        Reset
                      </button>
                    )}
                  </form>
                </FormProvider>
              </SheetContent>
            </Sheet>
          </div>

          <div className="min-h-[45vh] rounded-lg border">
            <Table className="w-full rounded-md border">
              <TableHeadCustom headLabel={HEAD_LABEL} onSort={handleSort} sortConfig={sortConfig} />

              <TableBodyWrapper loading={loading} colSpan={HEAD_LABEL.length} dataLength={sortedData?.length || 0}>
                {sortedData?.map((item, idx) => (
                  <ReservationTransactionTableRow key={item?._id || idx} item={item} handleDelete={handleDelete} handleEdit={handleEdit} />
                ))}
              </TableBodyWrapper>
            </Table>
          </div>

          <PaginationControls
            limit={limit}
            totalPages={totalPages}
            currentPage={currentPage}
            totalRecords={totalRecords}
            onPageChange={(p) => onPageChange?.(p)}
          />
        </Card>
      </div>
    </div>
  );
};

export default ReservationTransactionTable;
