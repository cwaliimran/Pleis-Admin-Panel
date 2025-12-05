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
import { SamplePageProps } from './types';
import ReviewsTableRow from './reviews-table-row';

export const reviewDummyData = [
  {
    _id: 'rev_001',
    image: 'https://randomuser.me/api/portraits/women/45.jpg',
    name: 'Ayesha Khan',
    organization: 'FoodDeck',
    serviceType: 'Ordering',
    review: 'The food ordering experience was smooth and fast. Loved the UI!',
    rating: 5,
    createdAt: '2025-01-22T10:15:00Z',
    status: 'approved',
  },
  {
    _id: 'rev_002',
    image: 'https://randomuser.me/api/portraits/men/12.jpg',
    name: 'Bilal Ahmed',
    organization: 'Eventify',
    serviceType: 'Ticketing',
    review: 'Ticket booking was easy but the confirmation email came late.',
    rating: 3,
    createdAt: '2025-01-23T14:40:00Z',
    status: 'pending',
  },
  {
    _id: 'rev_003',
    image: 'https://randomuser.me/api/portraits/women/33.jpg',
    name: 'Zainab Fatima',
    organization: 'DineMate',
    serviceType: 'Reservation',
    review: 'Restaurant reservation worked perfectly. No issues at all.',
    rating: 5,
    createdAt: '2025-01-20T08:10:00Z',
    status: 'approved',
  },
  {
    _id: 'rev_004',
    image: 'https://randomuser.me/api/portraits/men/67.jpg',
    name: 'Hamza Ali',
    organization: 'Eventify',
    serviceType: 'Ticketing',
    review: 'The ticket page kept loading slowly. Needs some improvements.',
    rating: 2,
    createdAt: '2025-01-18T12:55:00Z',
    status: 'rejected',
  },
  {
    _id: 'rev_005',
    image: 'https://randomuser.me/api/portraits/women/88.jpg',
    name: 'Maria Shah',
    organization: 'FoodDeck',
    serviceType: 'Ordering',
    review: 'Excellent service! Delivery was on time and everything was smooth.',
    rating: 5,
    createdAt: '2025-01-25T17:20:00Z',
    status: 'approved',
  },
  {
    _id: 'rev_006',
    image: 'https://randomuser.me/api/portraits/men/91.jpg',
    name: 'Usman Tariq',
    organization: 'DineMate',
    serviceType: 'Reservation',
    review: 'It took too long to confirm the reservation. Please improve speed.',
    rating: 3,
    createdAt: '2025-01-19T09:00:00Z',
    status: 'pending',
  },
];


const ReviewsTable: FC<SamplePageProps> = ({
  data = [],
  meta,
  loading,
  user,
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

  const HEAD_LABEL = [
    { id: 'image', label: 'Image', align: 'left' },
    {
      id: 'name',
      label: 'User',
      align: 'left',
      sortable: true,
      sortKey: 'name',
    },
    { id: 'organization', label: 'Organization', align: 'left' },
    { id: 'rating', label: 'Rating', align: 'left' },
    { id: 'review', label: 'Review', align: 'left' },
    { id: 'createdAt', label: 'Created At', align: 'left' },
    ...(user?.accountState?.userType === 'admin' ? [{ id: 'actions', label: 'Action', align: 'left' }] : []),
  ];

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
            <h3 className="ml-2 text-xl font-semibold md:ml-0">Reviews List</h3>

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
                              placeholder: 'Search Reviews...',
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

              <TableBodyWrapper loading={loading} colSpan={HEAD_LABEL.length} dataLength={reviewDummyData?.length || 0}>
                {reviewDummyData?.map((item, idx) => (
                  <ReviewsTableRow key={item?._id || idx} item={item} handleDelete={handleDelete} user={user} handleEdit={handleEdit} />
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

export default ReviewsTable;
