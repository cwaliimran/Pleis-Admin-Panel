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
import GiveawaysTableRow from './giveaways-table-row';
import { SamplePageProps } from './types';

export const giveawaysDummyData = [
  {
    _id: 'gw_001',
    title: 'New Year Mega Giveaway',
    winners: 5,
    ticketsPerWinner: 2,
    ticketType: 'VIP',
    entries: 1240,
    createdAt: '2025-01-10T18:30:00Z',
    endedAt: '2025-01-10T23:30:00Z',
    status: 'inactive',
  },
  {
    _id: 'gw_002',
    title: 'Food Festival Free Pass Draw',
    winners: 10,
    ticketsPerWinner: 1,
    ticketType: 'Standard',
    entries: 980,
    createdAt: '2025-02-01T12:00:00Z',
    endedAt: '2025-02-01T17:00:00Z',
    status: 'active',
  },
  {
    _id: 'gw_003',
    title: 'Backstage Meet & Greet Contest',
    winners: 3,
    ticketsPerWinner: 1,
    ticketType: 'Backstage',
    entries: 540,
    createdAt: '2025-01-25T15:45:00Z',
    endedAt: '2025-01-25T20:45:00Z',
    status: 'inactive',
  },
  {
    _id: 'gw_004',
    title: 'Family Event Ticket Giveaway',
    winners: 8,
    ticketsPerWinner: 4,
    ticketType: 'Family Pass',
    entries: 2100,
    createdAt: '2025-02-05T10:20:00Z',
    endedAt: '2025-02-05T15:20:00Z',
    status: 'inactive',
  },
  {
    _id: 'gw_005',
    title: 'Tech Summit Free Entry',
    winners: 15,
    ticketsPerWinner: 1,
    ticketType: 'General',
    entries: 3250,
    createdAt: '2025-01-30T09:10:00Z',
    endedAt: '2025-01-30T14:10:00Z',
    status: 'inactive',
  },
  {
    _id: 'gw_006',
    title: 'Music Night Golden Pass Giveaway',
    winners: 2,
    ticketsPerWinner: 2,
    ticketType: 'Golden',
    entries: 760,
    createdAt: '2025-02-07T22:00:00Z',
    endedAt: '2025-02-08T03:00:00Z',
    status: 'active',
  },
];


const HEAD_LABEL = [
  {
    id: 'title',
    label: 'Title',
    align: 'left',
    sortable: true,
    sortKey: 'title',
  },
  { id: 'winners', label: 'Winners', align: 'center' },
  { id: 'ticketsPerWinner', label: 'Tickets / Winner', align: 'center' },
  { id: 'ticketType', label: 'Ticket Type', align: 'left' },
  { id: 'entries', label: 'Entries', align: 'left' },
  { id: 'created', label: 'Created At', align: 'left' },
  { id: 'ended', label: 'Ended At', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'actions', label: 'Action', align: 'left' },
];

const GiveawaysTable: FC<SamplePageProps> = ({
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
            <h3 className="ml-2 text-xl font-semibold md:ml-0">Giveaways List</h3>

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
                              placeholder: 'Search by title, events...',
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

              <TableBodyWrapper loading={loading} colSpan={HEAD_LABEL.length} dataLength={giveawaysDummyData?.length || 0}>
                {/* {sortedData?.map((item, idx) => ( */}
                {giveawaysDummyData?.map((item, idx) => (
                  <GiveawaysTableRow key={item?._id || idx} item={item} handleDelete={handleDelete} handleEdit={handleEdit} />
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

export default GiveawaysTable;
