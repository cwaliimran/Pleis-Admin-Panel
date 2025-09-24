'use client';

import { TableFilters } from '@/components/table-filters';
import TableHeadCustom from '@/components/table/table-head-custom';
import { Card } from '@/components/ui/card';
import { Table, TableBody } from '@/components/ui/table';
import { FC } from 'react';
import EventTableRow from './eventTAbleRow'; // Import EventTableRow to handle table rows
import { Badge } from '@/components/ui/badge';
import { Settings2 } from 'lucide-react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useForm, FormProvider } from 'react-hook-form';
import { LoadingBar } from '@/components/table/table-bar-loading';
import PaginationControls from '@/components/table/pagination-controls';
import { useTableSort } from '@/hooks/useTableSort';

// Define headers for the table
const headLabel = [
  { id: 'image', label: 'Image', align: 'left', sortable: false },
  {
    id: 'name',
    label: 'Name',
    align: 'left',
    sortable: true,
    sortKey: 'basicInfo.title',
  },
  {
    id: 'organization',
    label: 'Organization',
    align: 'left',
    sortable: true,
    sortKey: 'basicInfo.organization.basicInfo.name',
  },
  {
    id: 'venue',
    label: 'Venue',
    align: 'left',
    sortable: true,
    sortKey: 'basicInfo.venue.title',
  },
  {
    id: 'startDate',
    label: 'Start Date',
    align: 'left',
  },
  {
    id: 'endDate',
    label: 'End Date',
    align: 'left',
  },
  {
    id: 'totalRevenue',
    label: 'Revenue',
    align: 'left',
  },
  {
    id: 'totalViews',
    label: 'Views',
    align: 'left',
  },
  {
    id: 'region',
    label: 'Region',
    align: 'left',
  },
  {
    id: 'status',
    label: 'Status',
    align: 'left',
  },
  { id: 'actions', label: 'Action', align: 'left', sortable: false },
];

interface Meta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

interface PageProps {
  page?: any;
  data?: any[];
  meta?: Meta;
  loading?: boolean;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSearch?: (search: string) => void;
  search?: string;
  limit?: number;
  status?: string;
  onStatusChange?: (status: string) => void;
  startDate?: Date;
  endDate?: Date;
  userType?: any;
  onDateChange?: (
    startDate: Date | undefined,
    endDate: Date | undefined
  ) => void;
  onResetFilters?: () => void;
}

const EventTable: FC<PageProps> = ({
  data = [],
  meta,
  loading,
  userType,
  handleDelete,
  onPageChange,
  onSearch = () => {},
  search = '',
  status = '',
  onStatusChange = () => {},
  startDate,
  endDate,
  onDateChange = () => {},
  onResetFilters = () => {},
}) => {
  // Pagination logic
  const totalPages = meta?.totalPages || 1;
  const currentPage = meta?.currentPage || 1;
  const totalRecords = meta?.totalRecords || 0;

  // Sorting logic
  const { sortedData, sortConfig, handleSort } = useTableSort({
    data: data || [],
  });

  const methods = useForm({
    defaultValues: {
      location: [],
    },
  });

  return (
    <div>
      <div className="grid grid-cols-12">
        <Card className="dark:bg-secondary col-span-12 mt-5 mb-5 px-2 shadow-md md:px-8 lg:col-span-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h3 className="ml-2 text-xl font-semibold md:ml-0">Event List</h3>

            {/* Filter Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Badge className="text-md flex cursor-pointer items-center gap-2 rounded-3xl border border-gray-300 bg-white px-4 py-2 text-black">
                  <Settings2 className="h-5 w-5" />
                  <span className="whitespace-nowrap">Filter</span>
                </Badge>
              </SheetTrigger>
              <SheetContent
                aria-describedby={undefined}
                side="right"
                className="dark:bg-secondary p-0"
              >
                <SheetHeader className="mb-2 border-b pb-2">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <FormProvider {...methods}>
                  <form className="flex flex-col gap-6 px-4 py-2">
                    {/* Date Range Filters */}
                    <TableFilters
                      className="w-full [&_.w-44]:w-full [&_.w-\[180px\]]:w-full"
                      dateRangeFilter={{
                        startDate: {
                          id: 'start-date',
                          placeholder: 'Select start date',
                          value: startDate,
                          onChange: (newStartDate) =>
                            onDateChange(newStartDate, endDate),
                        },
                        endDate: {
                          id: 'end-date',
                          placeholder: 'Select end date',
                          value: endDate,
                          onChange: (newEndDate) =>
                            onDateChange(startDate, newEndDate),
                        },
                      }}
                      selectFilters={[
                        {
                          id: 'status',
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
                      searchFilter={{
                        placeholder: 'Search Events...',
                        value: search,
                        onChange: onSearch,
                      }}
                      resetFilter={{
                        onReset: onResetFilters,
                        showResetButton: true,
                      }}
                    />
                  </form>
                </FormProvider>
              </SheetContent>
            </Sheet>
          </div>

          {/* Table with event data */}
          <div className="rounded-lg border">
            <Table className="w-full rounded-md border">
              <TableHeadCustom
                headLabel={headLabel}
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <TableBody>
                {loading ? (
                  <tr>
                    <td colSpan={headLabel.length} className="py-0 text-center">
                      <LoadingBar variant="default" />
                    </td>
                  </tr>
                ) : sortedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={headLabel.length}
                      className="h-[40vh] border-b-0 text-center align-middle"
                    >
                      <div className="flex h-full w-full items-center justify-center text-xl">
                        No data found
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedData.map((item, index) => (
                    <EventTableRow
                      key={item._id || index}
                      item={item}
                      handleDelete={handleDelete}
                      userType={userType}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            limit={10}
            onPageChange={(p) => onPageChange?.(p)}
          />
        </Card>
      </div>
    </div>
  );
};

export default EventTable;
