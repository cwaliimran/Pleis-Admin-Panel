'use client';

import { TableFilters } from '@/components/table-filters';
import PaginationControls from '@/components/table/pagination-controls';
import TableHeadCustom from '@/components/table/table-head-custom';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table } from '@/components/ui/table';
import TableBodyWrapper from '@/components/ui/table-body-wrapper';
import { useTableSort } from '@/hooks/useTableSort';
import { Settings2 } from 'lucide-react';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import EventFeedbackTableRow from './event-feedback-table-row';
import { SamplePageProps } from './types';

export const eventFeedbackDummyData = [
  {
    _id: 'fb_001',
    title: 'Ayesha Khan',
    username: 'ayesha_k',
    comment: 'The event was amazing! Well organized and very interactive.',
    rating: 5,
    createdAt: '2025-02-01T10:15:00Z',
  },
  {
    _id: 'fb_002',
    title: 'Bilal Ahmed',
    username: 'bilal_ali92',
    comment: 'Good event but the sound system could be improved.',
    rating: 4,
    createdAt: '2025-02-02T12:40:00Z',
  },
  {
    _id: 'fb_003',
    title: 'Zainab Fatima',
    username: 'zainab.f',
    comment: 'Loved the workshops, especially the marketing session.',
    rating: 5,
    createdAt: '2025-02-01T14:20:00Z',
  },
  {
    _id: 'fb_004',
    title: 'Hamza Ali',
    username: 'hamza_ali',
    comment: 'The event started late and was a bit crowded.',
    rating: 3,
    createdAt: '2025-02-03T09:10:00Z',
  },
  {
    _id: 'fb_005',
    title: 'Maria Shah',
    username: 'maria.shah',
    comment: 'Great networking opportunities. Learned a lot!',
    rating: 5,
    createdAt: '2025-02-04T11:55:00Z',
  },
  {
    _id: 'fb_006',
    title: 'Usman Tariq',
    username: 'usman_t',
    comment: 'Overall good, but food arrangements could be better.',
    rating: 4,
    createdAt: '2025-02-05T15:00:00Z',
  },
];

const HEAD_LABEL = [
  {
    id: 'title',
    label: 'User',
    align: 'left',
    sortable: true,
    sortKey: 'name',
  },
  { id: 'username', label: 'Username', align: 'left' },
  { id: 'comment', label: 'Comment', align: 'left' },
  { id: 'rating', label: 'Rating', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
];

const EventFeedbackTable: FC<SamplePageProps> = ({
  data = [],
  meta,
  loading,
  handleDelete,
  handleEdit,
  onPageChange,
  limit = 10,
  // filters states bellow
  search = '',
  onSearch = () => {},
  // status = '',
  // onStatusChange = () => {},
  // date,
  // onDateChange = () => {},
  onResetFilters = () => {},
}) => {
  // Pagination logic
  const totalPages = meta?.totalPages || 1;
  const currentPage = meta?.currentPage || 1;
  const totalRecords = meta?.totalRecords || 0;
  const [sheetLocation] = useState<string[]>([]);

  const { sortedData, sortConfig, handleSort } = useTableSort({
    data: data || [],
  });

  console.log('sortedData', sortedData);

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
            <h3 className="ml-2 text-xl font-semibold md:ml-0">Event Feedback</h3>

            {/* FILTER SHEET */}
            <Sheet>
              <SheetTrigger asChild>
                <Badge className="text-md flex cursor-pointer items-center gap-2 rounded-3xl border border-gray-300 bg-white px-4 py-2 text-black">
                  <Settings2 className="h-5 w-5" />
                  <span className="whitespace-nowrap">Filter</span>
                </Badge>
              </SheetTrigger>
              <SheetContent aria-describedby={undefined} side="right" className="dark:bg-secondary p-0">
                <SheetHeader className="mb-2 border-b pb-2">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <FormProvider {...methods}>
                  <form className="flex flex-col gap-6 px-4 py-2">
                    {/* Date Range Filters full width */}
                    <div className="flex w-full flex-col gap-3">
                      <div className="flex w-full flex-col gap-3">
                        <label htmlFor="sheet-event-start-date" className="px-1 text-sm font-medium">
                          Select Date
                        </label>
                        <div className="w-full">
                          <TableFilters
                            className="w-full [&_.w-44]:w-full [&_.w-\[180px\]]:w-full"
                            // dateFilter={{
                            //   id: 'organization-date',
                            //   placeholder: 'Select date',
                            //   value: date,
                            //   onChange: onDateChange,
                            // }}
                            searchFilter={{
                              placeholder: 'Search Usernames...',
                              value: search,
                              onChange: onSearch,
                            }}
                            // selectFilters={[
                            //   {
                            //     id: 'sheet-revenue',
                            //     label: 'Status',
                            //     placeholder: 'Select by Status',
                            //     value: status,
                            //     onChange: onStatusChange,
                            //     options: [
                            //       { value: 'all', label: 'All' },
                            //       { value: 'active', label: 'Active' },
                            //       { value: 'inactive', label: 'Inactive' },
                            //     ],
                            //   },
                            // ]}
                            resetFilter={{
                              onReset: onResetFilters,
                              showResetButton: true,
                            }}
                            filtersAlignment="left"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </FormProvider>
              </SheetContent>
            </Sheet>
          </div>

          <div className="min-h-[45vh] rounded-lg border">
            <Table className="w-full rounded-md border">
              <TableHeadCustom headLabel={HEAD_LABEL} onSort={handleSort} sortConfig={sortConfig} />

              <TableBodyWrapper loading={loading} colSpan={HEAD_LABEL.length} dataLength={eventFeedbackDummyData?.length || 0}>
                {eventFeedbackDummyData?.map((item, idx) => (
                  <EventFeedbackTableRow key={item?._id || idx} item={item} handleDelete={handleDelete} handleEdit={handleEdit} />
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

export default EventFeedbackTable;
