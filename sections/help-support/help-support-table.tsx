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
import HelpSupportTableRow from './help-support-table-row';

const supportTicketsDummyData = [
  {
    id: 'st_001',
    ticketNo: 'TCK-1001',
    photo: 'https://i.pravatar.cc/150?img=11',
    username: 'john_doe',
    subject: 'Login issue',
    description: 'Unable to log in using correct credentials.',
    createdAt: '2025-02-01T10:15:00Z',
    status: 'closed',
  },
  {
    id: 'st_002',
    ticketNo: 'TCK-1002',
    photo: 'https://i.pravatar.cc/150?img=22',
    username: 'sarah_k',
    subject: 'Payment failed',
    description: 'Transaction failed but amount was deducted.',
    createdAt: '2025-02-02T14:30:00Z',
    status: 'pending',
  },
  {
    id: 'st_003',
    ticketNo: 'TCK-1003',
    photo: 'https://i.pravatar.cc/150?img=33',
    username: 'ali_hassan',
    subject: 'Event ticket not received',
    description: 'I did not receive my ticket after successful booking.',
    createdAt: '2025-02-03T09:45:00Z',
    status: 'closed',
  },
  {
    id: 'st_004',
    ticketNo: 'TCK-1004',
    photo: 'https://i.pravatar.cc/150?img=44',
    username: 'emma_w',
    subject: 'App crash',
    description: 'App crashes when opening the giveaways page.',
    createdAt: '2025-02-04T18:20:00Z',
    status: 'open',
  },
  {
    id: 'st_005',
    ticketNo: 'TCK-1005',
    photo: 'https://i.pravatar.cc/150?img=55',
    username: 'usman_dev',
    subject: 'Incorrect event details',
    description: 'The event date shown is incorrect.',
    createdAt: '2025-02-05T11:05:00Z',
    status: 'pending',
  },
];

const HEAD_LABEL = [
  { id: 'photo', label: 'Photo', align: 'left' },
  {
    id: 'username',
    label: 'Username',
    align: 'left',
    sortable: true,
    sortKey: 'username',
  },
  { id: 'ticketNumber', label: 'Ticket #', align: 'left' },
  { id: 'subject', label: 'Subject', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'actions', label: 'Action', align: 'center' },
];

const HelpSupportTable: FC<SamplePageProps> = ({
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
  status = '',
  onStatusChange = () => {},
  date,
  onDateChange = () => {},
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
            <h3 className="ml-2 text-xl font-semibold md:ml-0">Help Support List</h3>

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
                            dateFilter={{
                              id: 'organization-date',
                              placeholder: 'Select date',
                              value: date,
                              onChange: onDateChange,
                            }}
                            searchFilter={{
                              placeholder: 'Search level status...',
                              value: search,
                              onChange: onSearch,
                            }}
                            selectFilters={[
                              {
                                id: 'sheet-revenue',
                                label: 'Status',
                                placeholder: 'Select by Status',
                                value: status,
                                onChange: onStatusChange,
                                options: [
                                  { value: 'all', label: 'All' },
                                  { value: 'active', label: 'Active' },
                                  { value: 'inactive', label: 'Inactive' },
                                ],
                              },
                            ]}
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

              <TableBodyWrapper loading={loading} colSpan={HEAD_LABEL.length} dataLength={supportTicketsDummyData?.length || 0}>
                {supportTicketsDummyData?.map((item, idx) => (
                  <HelpSupportTableRow key={item?.id || idx} item={item} handleDelete={handleDelete} handleEdit={handleEdit} />
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

export default HelpSupportTable;
