'use client';

import { TableFilters } from '@/components/table-filters';
import PaginationControls from '@/components/table/pagination-controls';
import TableHeadCustom, { SortConfig } from '@/components/table/table-head-custom';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table } from '@/components/ui/table';
import TableBodyWrapper from '@/components/ui/table-body-wrapper';
import { Settings2 } from 'lucide-react';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import EventTableRowV2 from './event-table-row';
import { useGetOrganizationQuery } from '@/store/Reducer/organization';
// import EventTableRow from './eventTableRow';

const headLabel = [
  { id: 'image', label: 'Image', align: 'left', sortable: false },
  {
    id: 'name',
    label: 'Name',
    align: 'left',
    sortable: true,
    sortKey: 'eventName',
  },
  {
    id: 'organization',
    label: 'Organization',
    align: 'left',
    sortable: true,
    sortKey: 'organizationName',
  },
  {
    id: 'venue',
    label: 'Venue',
    align: 'left',
    sortable: true,
    sortKey: 'venueName',
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
  handleDelete?: (item: any) => void;
  handleEdit?: (id: string) => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSearch?: (search: string) => void;
  search?: string;
  limit?: number;
  status?: string;
  onStatusChange?: (status: string) => void;
  organization?: string;
  onOrganizationChange?: (organization: string) => void;
  startDate?: Date;
  endDate?: Date;
  userType?: any;
  onDateChange?: (startDate: Date | undefined, endDate: Date | undefined) => void;
  onResetFilters?: () => void;
  sortBy?: string;
  sortOrder?: string;
  onSortChange?: (sortBy: string, sortOrder: string) => void;
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
  organization = '',
  onOrganizationChange = () => {},
  startDate,
  endDate,
  onDateChange = () => {},
  onResetFilters = () => {},
  sortBy = '',
  sortOrder = '',
  onSortChange,
}) => {
  // Pagination logic
  const totalPages = meta?.totalPages || 1;
  const currentPage = meta?.currentPage || 1;
  const totalRecords = meta?.totalRecords || 0;

  const { data: organizationData } = useGetOrganizationQuery(
    {
      page: 0,
      search: '',
      limit: '2000',
      status: '',
    },
    {
      skip: userType !== 'super-admin',
    }
  );

  const sortConfig: SortConfig = {
    key: sortBy || null,
    direction: sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : null,
  };

  const handleSort = (key: string) => {
    if (sortBy !== key) {
      onSortChange?.(key, 'asc');
    } else if (sortOrder === 'asc') {
      onSortChange?.(key, 'desc');
    } else if (sortOrder === 'desc') {
      onSortChange?.('', '');
    } else {
      onSortChange?.(key, 'asc');
    }
  };

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
              <SheetContent aria-describedby={undefined} side="right" className="dark:bg-secondary p-0">
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
                          onChange: (newStartDate) => onDateChange(newStartDate, endDate),
                        },
                        endDate: {
                          id: 'end-date',
                          placeholder: 'Select end date',
                          value: endDate,
                          onChange: (newEndDate) => onDateChange(startDate, newEndDate),
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
                        ...(userType === 'super-admin'
                          ? [
                              {
                                id: 'organization',
                                label: 'Organization',
                                placeholder: 'Select by Organization',
                                value: organization,
                                onChange: onOrganizationChange,
                                options:
                                  organizationData?.data.map((org: any) => ({
                                    value: org._id,
                                    label: org?.basicInfo?.name,
                                  })) || [],
                              },
                            ]
                          : []),
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
              <TableHeadCustom headLabel={headLabel} sortConfig={sortConfig} onSort={handleSort} />

              <TableBodyWrapper loading={loading} colSpan={headLabel.length} dataLength={data?.length || 0}>
                {data?.map((item, index) => (
                  <EventTableRowV2 key={item?._id || index} item={item} handleDelete={handleDelete} userType={userType} />
                ))}
              </TableBodyWrapper>
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
