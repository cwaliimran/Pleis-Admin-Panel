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
import MarketingRequestTableRow from './marketing-request-table-row';
import { SamplePageProps } from './types';

export const marketingRequestDummyData = [
  {
    _id: '1',
    title: 'Social Media Campaign',
    description: 'Need a full social media marketing campaign for product launch.',
    email: 'client1@example.com',
    phone: '+1 555-123-4567',
    budget: '2,000',
    status: 'pending',
    createdAt: '2025-01-15T10:30:00Z',
    user: {
      id: 'u_101',
      name: 'Ayesha Khan',
      image: 'https://randomuser.me/api/portraits/women/45.jpg',
    },
  },
  {
    _id: '2',
    title: 'SEO Optimization',
    description: 'Improve ranking for 10 targeted keywords and optimize blog content.',
    email: 'client2@example.com',
    phone: '+1 555-987-6543',
    budget: '1,200',
    status: 'reject',
    createdAt: '2025-01-16T14:10:00Z',
    user: {
      id: 'u_102',
      name: 'Bilal Ahmed',
      image: 'https://randomuser.me/api/portraits/men/12.jpg',
    },
  },
  {
    _id: '3',
    title: 'Google Ads Setup',
    description: 'Setup and manage Google Ads for 1 month with conversion tracking.',
    email: 'client3@example.com',
    phone: '+1 555-555-1122',
    budget: '1,500',
    status: 'done',
    createdAt: '2025-01-17T09:00:00Z',
    user: {
      id: 'u_103',
      name: 'Zainab Fatima',
      image: 'https://randomuser.me/api/portraits/women/33.jpg',
    },
  },
  {
    _id: '4',
    title: 'Brand Awareness Strategy',
    description: 'Create brand strategy, visuals, and a 30-day marketing plan.',
    email: 'client4@example.com',
    phone: '+1 555-221-3344',
    budget: '3,000',
    status: 'accept',
    createdAt: '2025-01-18T11:45:00Z',
    user: {
      id: 'u_104',
      name: 'Hamza Ali',
      image: 'https://randomuser.me/api/portraits/men/67.jpg',
    },
  },
  {
    _id: '5',
    title: 'Email Marketing Funnel',
    description: 'Set up a 5-step funnel with automation and A/B testing.',
    email: 'client5@example.com',
    phone: '+1 555-443-6677',
    budget: '900',
    status: 'done',
    createdAt: '2025-01-19T08:20:00Z',
    user: {
      id: 'u_105',
      name: 'Maria Shah',
      image: 'https://randomuser.me/api/portraits/women/88.jpg',
    },
  },
  {
    _id: '6',
    title: 'Video Ad Creation',
    description: 'Need a 30-second video ad for Facebook + Instagram.',
    email: 'client6@example.com',
    phone: '+1 555-774-8899',
    budget: '800',
    status: 'reject',
    createdAt: '2025-01-20T16:55:00Z',
    user: {
      id: 'u_106',
      name: 'Usman Tariq',
      image: 'https://randomuser.me/api/portraits/men/91.jpg',
    },
  },
];

const MarketingRequestTable: FC<SamplePageProps> = ({
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
    {
      id: 'user',
      label: 'User',
      align: 'left',
      sortable: true,
      sortKey: 'user',
    },
    {
      id: 'title',
      label: 'Title',
      align: 'left',
      sortable: true,
      sortKey: 'title',
    },
    { id: 'description', label: 'Description', align: 'left' },
    { id: 'email', label: 'Email', align: 'left' },
    { id: 'phone', label: 'Phone', align: 'left' },
    { id: 'budget', label: 'Budget', align: 'left' },
    { id: 'createdAt', label: 'Created At', align: 'left' },
    { id: 'status', label: 'Status', align: 'left' },
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
            <h3 className="ml-2 text-xl font-semibold md:ml-0">Marketing Request List</h3>

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
                              placeholder: 'Search Marketing Requests...',
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

              <TableBodyWrapper loading={loading} colSpan={HEAD_LABEL.length} dataLength={marketingRequestDummyData?.length || 0}>
                {marketingRequestDummyData?.map((item, idx) => (
                  <MarketingRequestTableRow key={item?._id || idx} item={item} handleDelete={handleDelete} user={user} handleEdit={handleEdit} />
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

export default MarketingRequestTable;
