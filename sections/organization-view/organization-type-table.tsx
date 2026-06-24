'use client';

import { TableFilters } from '@/components/table-filters';
import PaginationControls from '@/components/table/pagination-controls';
import TableHeadCustom, { SortConfig } from '@/components/table/table-head-custom';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table } from '@/components/ui/table';
import TableBodyWrapper from '@/components/ui/table-body-wrapper';
import { useGetAllOrganizationsAdminQuery } from '@/store/Reducer/organization';
import { Settings2 } from 'lucide-react';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import OrganizationTypeTableRow from './organization-type-table-row';

const SUBSCRIPTION_TYPE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'free', label: 'Free' },
  { value: 'ordering', label: 'Ordering' },
  { value: 'loyalty', label: 'Loyalty' },
  { value: 'reservations', label: 'Reservations' },
  { value: 'analytics', label: 'Analytics' },
];

const headLabel = [
  { id: 'log', label: 'Logo', align: 'left' },
  {
    id: 'name',
    label: 'Name',
    align: 'left',
    sortable: true,
    sortKey: 'organizationName',
  },
  {
    id: 'organizer',
    label: 'Organizer',
    align: 'left',
    sortable: true,
    sortKey: 'organizerName',
  },
  {
    id: 'createdDate',
    label: 'Created Date',
    align: 'left',
    sortable: true,
    sortKey: 'createdAt',
  },
  { id: 'subscriptionType', label: 'Sub Type', align: 'left', sortable: true, sortKey: 'subType' },
  { id: 'subscriptionValidity', label: 'Sub End Date', align: 'left', sortable: true, sortKey: 'subEndDate' },
  // { id: 'commission', label: 'Commissions (%)', align: 'left' },
  { id: 'totalViews', label: 'T. Views', align: 'left', sortable: true, sortKey: 'views' },
  // { id: 'totalRevenue', label: 'Total Revenue', align: 'left' },
  { id: 'favourite', label: 'Favorites', align: 'left', sortable: true, sortKey: 'favorites' },
  { id: 'activeEvents', label: 'A. Events', align: 'left', sortable: true, sortKey: 'events' },
  { id: 'status', label: 'Status' },
  { id: 'actions', label: 'Action' },
];

interface Meta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

interface PageProps {
  page: any;
  data: any[];
  meta: Meta;
  userType?: any;
  loading?: boolean;
  handleDelete?: (id: string) => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSearch?: (search: string) => void;
  search?: string;
  limit?: number;
  status?: string;
  onStatusChange?: (status: string) => void;
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  onResetFilters?: () => void;
  sortBy?: string;
  sortOrder?: string;
  onSortChange?: (sortBy: string, sortOrder: string) => void;
  subType?: string;
  onSubTypeChange?: (subType: string) => void;
  organization?: string;
  onOrganizationChange?: (organization: string) => void;
}

const OrganizationTypeTable: FC<PageProps> = ({
  data = [],
  meta,
  loading,
  handleDelete,
  onPageChange,
  userType,
  // onLimitChange,
  // limit = 10,
  status = '',
  onStatusChange = () => {},
  date,
  onDateChange = () => {},
  onResetFilters = () => {},
  sortBy = '',
  sortOrder = '',
  onSortChange,
  subType = '',
  onSubTypeChange = () => {},
  organization = '',
  onOrganizationChange = () => {},
}) => {
  const { data: allOrgsData } = useGetAllOrganizationsAdminQuery(undefined, {
    skip: userType !== 'super-admin',
  });
  // Pagination logic
  const totalPages = meta?.totalPages || 1;
  const currentPage = meta?.currentPage || 1;
  const totalRecords = meta?.totalRecords || 0;
  const [sheetLocation] = useState<string[]>([]);

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
      location: sheetLocation,
    },
  });

  const visibleHeadLabel = userType === 'organizer' ? headLabel.filter((column) => column.id !== 'organizer') : headLabel;

  return (
    <div>
      <div className="grid grid-cols-12">
        <Card className="dark:bg-secondary col-span-12 mt-5 mb-5 px-2 shadow-md md:px-8 lg:col-span-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h3 className="ml-2 text-xl font-semibold md:ml-0">Organization List</h3>

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
                          Select by created date
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
                              {
                                id: 'sheet-sub-type',
                                label: 'Sub Type',
                                placeholder: 'Select by Sub Type',
                                value: subType,
                                onChange: onSubTypeChange,
                                options: SUBSCRIPTION_TYPE_OPTIONS,
                              },
                              ...(userType === 'super-admin'
                                ? [
                                    {
                                      id: 'sheet-organization',
                                      label: 'Organization',
                                      placeholder: 'Select by Organization',
                                      value: organization,
                                      onChange: onOrganizationChange,
                                      searchable: true,
                                      options:
                                        allOrgsData?.data?.map((org: any) => ({
                                          value: org._id,
                                          label: org?.basicInfo?.name,
                                        })) || [],
                                    },
                                  ]
                                : []),
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

          <div className="rounded-lg border">
            <Table className="w-full rounded-md border">
              <TableHeadCustom headLabel={visibleHeadLabel} sortConfig={sortConfig} onSort={handleSort} />

              <TableBodyWrapper loading={loading} colSpan={visibleHeadLabel.length} dataLength={data?.length || 0}>
                {data?.map((item: any, index: number) => (
                  <OrganizationTypeTableRow key={item._id || index} item={item} handleDelete={handleDelete} userType={userType} />
                ))}
              </TableBodyWrapper>
            </Table>
          </div>

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

export default OrganizationTypeTable;
