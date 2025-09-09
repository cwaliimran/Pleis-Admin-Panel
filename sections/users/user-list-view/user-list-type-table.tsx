'use client';

import TableHeadCustom from '@/components/table/table-head-custom';
import { Card } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { TableFilters } from '@/components/table-filters';
import PaginationControls from '@/components/table/pagination-controls';
import { LoadingBar } from '@/components/table/table-bar-loading';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody } from '@/components/ui/table';
import { Settings2 } from 'lucide-react';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import UserListTypeTableRow from './user-list-type-table-row';

const headLabel = [
  { id: 'image', label: 'Image', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'username', label: 'Username', align: 'left' },
  { id: 'role', label: 'Role', align: 'left' },
  { id: 'globalStatus', label: 'Global Status', align: 'left' },
  { id: 'totalPoints', label: 'Points Earned', align: 'left' },
  { id: 'totalRevenue', label: "User's Revenue", align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'region', label: 'Region', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
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
  loading?: boolean;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSearch?: (search: string) => void;
  search?: string;
  limit?: number;
  status?: string;
  role?: string;
  onStatusChange?: (status: string) => void;
  onRoleChange?: (role: string) => void;
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  onResetFilters?: () => void;
  userType?: any;
}

const UserListTypeTable: FC<PageProps> = ({
  data = [],
  meta,
  loading,
  handleDelete,
  handleEdit,
  onPageChange,
  userType,
  // onLimitChange,
  onSearch = () => {},
  search = '',
  // limit = 10,
  status = '',
  role = '',
  onStatusChange = () => {},
  onRoleChange = () => {},
  date,
  onDateChange = () => {},
  onResetFilters = () => {},
}) => {
  // Pagination logic
  const totalPages = meta?.totalPages || 1;
  const currentPage = meta?.currentPage || 1;
  const totalRecords = meta?.totalRecords || 0;
  const [sheetLocation] = useState<string[]>([]);

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
            <h3 className="ml-2 text-xl font-semibold md:ml-0">User List</h3>

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
                    {/* Date Range Filters full width */}
                    <div className="flex w-full flex-col gap-3">
                      <div className="flex w-full flex-col gap-3">
                        <label
                          htmlFor="sheet-event-start-date"
                          className="px-1 text-sm font-medium"
                        >
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
                              placeholder: 'Search Organization...',
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
                              {
                                id: 'sheet-role',
                                label: 'Role',
                                placeholder: 'Select by Role',
                                value: role,
                                onChange: onRoleChange,
                                options: [
                                  { value: 'all', label: 'All' },
                                  { value: 'admin', label: 'Admin' },
                                  { value: 'organizer', label: 'Organizer' },
                                  { value: 'manager', label: 'Manager' },
                                  { value: 'staff', label: 'Staff' },
                                  { value: 'guest', label: 'Guest' },
                                  { value: 'user', label: 'User' },
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

          <div
            className={`min-h-[40vh] rounded-lg border ${!loading && data.filter((item: any) => item.status !== 'deleted').length === 0 ? 'border-b-0' : ''}`}
          >
            <Table className="w-full rounded-md border">
              <TableHeadCustom headLabel={headLabel} />
              <TableBody>
                {loading ? (
                  <tr>
                    <td colSpan={headLabel.length} className="py-0 text-center">
                      <LoadingBar variant="default" />
                    </td>
                  </tr>
                ) : data.filter((item: any) => item.status !== 'deleted')
                    .length === 0 ? (
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
                  data
                    .filter((item: any) => item.status !== 'deleted')
                    .map((item: any, index: number) => (
                      <UserListTypeTableRow
                        key={item._id || index}
                        item={item}
                        handleDelete={handleDelete}
                        handleEdit={handleEdit}
                        userType={userType}
                      />
                    ))
                )}
              </TableBody>
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

export default UserListTypeTable;
