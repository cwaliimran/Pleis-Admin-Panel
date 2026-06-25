'use client';

'use client';

import { TableFilters } from '@/components/table-filters';
import PaginationControls from '@/components/table/pagination-controls';
import { LoadingBar } from '@/components/table/table-bar-loading';
import TableHeadCustom, { SortConfig } from '@/components/table/table-head-custom';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody } from '@/components/ui/table';
import { useGetAllOrganizationsAdminQuery } from '@/store/Reducer/organization';
import { useGetUsersForCompanyFilterQuery } from '@/store/Reducer/user-list';
import { RootState } from '@/store/store';
import { Settings2 } from 'lucide-react';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import UserListTypeTableRow from './user-list-type-table-row';

const MEMBERHEADLABEL = [
  { id: 'image', label: 'Image', align: 'left' },
  { id: 'username', label: 'Username', align: 'left', sortable: true, sortKey: 'userName' },
  { id: 'globalStatus', label: 'Global Status', align: 'left', sortable: true, sortKey: 'globalStatus' },
  { id: 'totalPoints', label: 'Points Earned', align: 'left' },
  { id: 'totalRevenue', label: "User's Revenue", align: 'left' },
  { id: 'status', label: 'Status', align: 'left', sortable: true, sortKey: 'status' },
  { id: 'region', label: 'Region', align: 'left', sortable: true, sortKey: 'region' },
  { id: 'action', label: 'Action', align: 'center' },
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
  sortBy?: string;
  sortOrder?: string;
  onSortChange?: (sortBy: string, sortOrder: string) => void;
  userType?: any;
  memberPage?: boolean;
  organization?: string;
  onOrganizationChange?: (val: string) => void;
  company?: string;
  onCompanyChange?: (val: string) => void;
}

const UserListTypeTable: FC<PageProps> = ({
  data = [],
  meta,
  loading,
  handleDelete,
  handleEdit,
  onPageChange,
  userType,
  memberPage,
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
  sortBy = '',
  sortOrder = '',
  onSortChange,
  organization = '',
  onOrganizationChange = () => {},
  company = '',
  onCompanyChange = () => {},
}) => {
  const isAdmin = userType !== 'organizer';

  const { data: allOrgsData } = useGetAllOrganizationsAdminQuery(undefined, { skip: !isAdmin });
  const { data: companyOptions = [] } = useGetUsersForCompanyFilterQuery(undefined, { skip: !isAdmin });
  // Pagination logic
  const totalPages = meta?.totalPages || 1;
  const currentPage = meta?.currentPage || 1;
  const totalRecords = meta?.totalRecords || 0;
  const [sheetLocation] = useState<string[]>([]);

  const { user } = useSelector((state: RootState) => state.userSlice);

  const USERHEADLABEL = [
    { id: 'image', label: 'Image', align: 'left' },
    { id: 'name', label: 'Name', align: 'left', sortable: true, sortKey: 'name' },
    ...(userType !== 'organizer' ? [{ id: 'username', label: 'Username', align: 'left', sortable: true, sortKey: 'userName' }] : []),
    { id: 'role', label: 'Role', align: 'left', sortable: true, sortKey: 'role' },
    { id: 'globalStatus', label: 'Global Status', align: 'left', sortable: true, sortKey: 'globalStatus' },
    { id: 'company', label: 'Company', align: 'left', sortable: true, sortKey: 'companyName' },
    { id: 'lastActiveDate', label: 'Last Active Date', align: 'left', sortable: true, sortKey: 'lastLogin' },
    { id: 'status', label: 'Status', align: 'left', sortable: true, sortKey: 'status' },
    { id: 'region', label: 'Region', align: 'left', sortable: true, sortKey: 'region' },
    { id: 'createdAt', label: 'Created At', align: 'left', sortable: true, sortKey: 'createdAt' },
    ...(user?.accountState?.userType !== 'manager' ? [{ id: 'action', label: 'Action', align: 'left' }] : []),
  ];

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

  const headLabel = memberPage ? MEMBERHEADLABEL : USERHEADLABEL;

  return (
    <div>
      <div className="grid grid-cols-12">
        <Card className="dark:bg-secondary col-span-12 mt-5 mb-5 px-2 shadow-md md:px-8 lg:col-span-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h3 className="ml-2 text-xl font-semibold md:ml-0">{memberPage ? 'Members' : 'Users'} List</h3>

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
                              placeholder: `Search ${memberPage ? 'Member' : 'User'}...`,
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
                                  { value: 'suspended', label: 'Suspended' },
                                ],
                              },
                              ...(!memberPage
                                ? [
                                    {
                                      id: 'sheet-role',
                                      label: 'Role',
                                      placeholder: 'Select by Role',
                                      value: role,
                                      onChange: onRoleChange,
                                      options:
                                        userType === 'organizer'
                                          ? [
                                              { value: 'staff', label: 'Staff' },
                                              { value: 'manager', label: 'Manager' },
                                            ]
                                          : [
                                              { value: 'all', label: 'All' },
                                              { value: 'admin', label: 'Admin' },
                                              { value: 'organizer', label: 'Organizer' },
                                              { value: 'manager', label: 'Manager' },
                                              { value: 'staff', label: 'Staff' },
                                              { value: 'guest', label: 'Guest' },
                                              { value: 'user', label: 'User' },
                                            ],
                                    },
                                  ]
                                : []),
                              ...(isAdmin
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
                                    {
                                      id: 'sheet-company',
                                      label: 'Company',
                                      placeholder: 'Select by Company',
                                      value: company,
                                      onChange: onCompanyChange,
                                      searchable: true,
                                      options: companyOptions,
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

          <div
            className={`min-h-[40vh] rounded-lg border ${!loading && data.filter((item: any) => item.status !== 'deleted').length === 0 ? 'border-b-0' : ''}`}
          >
            <Table className="w-full rounded-md border">
              <TableHeadCustom headLabel={headLabel} sortConfig={sortConfig} onSort={handleSort} />
              <TableBody>
                {loading ? (
                  <tr>
                    <td colSpan={headLabel.length} className="py-0 text-center">
                      <LoadingBar variant="default" />
                    </td>
                  </tr>
                ) : data.filter((item: any) => item.status !== 'deleted').length === 0 ? (
                  <tr>
                    <td colSpan={headLabel.length} className="h-[40vh] border-b-0 text-center align-middle">
                      <div className="flex h-full w-full items-center justify-center text-xl">No data found</div>
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
                        memberPage={memberPage}
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
