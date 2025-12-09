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
import UpdatesTableRow from './updates-table-row';

const eventHighlightDummyData = [
  {
    _id: 'eh_001',
    image: 'https://pleisstorage.blob.core.windows.net/pleisappcontainer/noimage.png',
    title: 'Concert Opening Ceremony',
    description: 'A spectacular opening ceremony featuring live performances.',
    linkedEvent: 'Music Fest 2025',
    status: 'active',
    createdAt: '2025-02-01T10:15:00Z',
  },
  {
    _id: 'eh_002',
    image: 'https://pleisstorage.blob.core.windows.net/pleisappcontainer/noimage.png',
    title: 'Food Carnival Special',
    description: 'Showcasing the best food stalls and audience moments.',
    linkedEvent: 'Food Fiesta 2025',
    status: 'inactive',
    createdAt: '2025-02-03T12:00:00Z',
  },
  {
    _id: 'eh_003',
    image: 'https://pleisstorage.blob.core.windows.net/pleisappcontainer/noimage.png',
    title: 'Guest Speaker Session',
    description: 'Highlights from the keynote session with industry experts.',
    linkedEvent: 'Tech Summit 2025',
    status: 'active',
    createdAt: '2025-02-05T09:30:00Z',
  },
  {
    _id: 'eh_004',
    image: 'https://pleisstorage.blob.core.windows.net/pleisappcontainer/noimage.png',
    title: 'Kids Fun Activities',
    description: 'Fun-filled activities for children during the festival.',
    linkedEvent: 'Family Gala 2025',
    status: 'inactive',
    createdAt: '2025-02-06T14:10:00Z',
  },
  {
    _id: 'eh_005',
    image: 'https://pleisstorage.blob.core.windows.net/pleisappcontainer/noimage.png',
    title: 'Award Distribution Night',
    description: 'Moments from the award ceremony honoring top performers.',
    linkedEvent: 'Annual Awards 2025',
    status: 'active',
    createdAt: '2025-02-07T16:25:00Z',
  },
  {
    _id: 'eh_006',
    image: 'https://pleisstorage.blob.core.windows.net/pleisappcontainer/noimage.png',
    title: 'Closing Fireworks Show',
    description: 'A beautiful fireworks show marking the end of the event.',
    linkedEvent: 'Music Fest 2025',
    status: 'inactive',
    createdAt: '2025-02-08T20:45:00Z',
  },
];

const HEAD_LABEL = [
  { id: 'image', label: 'Image', align: 'left' },
  {
    id: 'title',
    label: 'Title',
    align: 'left',
    sortable: true,
    sortKey: 'title',
  },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'linkedEvent', label: 'Linked Event', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'actions', label: 'Action', align: 'left' },
];

const UpdatesTable: FC<SamplePageProps> = ({
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
            <h3 className="ml-2 text-xl font-semibold md:ml-0">Updates List</h3>

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

              <TableBodyWrapper loading={loading} colSpan={HEAD_LABEL.length} dataLength={eventHighlightDummyData?.length || 0}>
                {/* {sortedData?.map((item, idx) => ( */}
                {eventHighlightDummyData?.map((item, idx) => (
                  <UpdatesTableRow key={item?._id || idx} item={item} handleDelete={handleDelete} handleEdit={handleEdit} />
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

export default UpdatesTable;
