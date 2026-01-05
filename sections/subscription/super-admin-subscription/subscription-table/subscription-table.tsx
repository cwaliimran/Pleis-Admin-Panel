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
import SubscriptionTableRow from './subscription-table-row';
import { SamplePageProps } from './types';

const HEAD_LABEL = [
  { id: 'organizer', label: 'Organizer', align: 'left' },
  { id: 'modules', label: 'Modules', align: 'left' },
  { id: 'organizations', label: 'Organizations', align: 'left' },
  { id: 'type', label: 'Sub. Type', align: 'left' },
  { id: 'billing', label: 'Billing', align: 'left' },
  { id: 'period', label: 'Period', align: 'left' },
  { id: 'price', label: 'Price', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'nextRenewal', label: 'Next Renewal', align: 'left' },
  { id: 'actions', label: 'Actions', align: 'center' },
];

const SubscriptionTable: FC<SamplePageProps> = ({
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
  billing = '',
  onBillingChange = () => {},
  subType = '',
  onSubTypeChange = () => {},
  orgRange = '',
  onOrgRangeChange = () => {},
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

  const methods = useForm({
    defaultValues: {
      location: sheetLocation,
    },
  });

  return (
    <div>
      <div className="grid grid-cols-12">
        <Card className="dark:bg-secondary col-span-12 mt-0 mb-5 px-2 shadow-md md:px-8 lg:col-span-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Subscriptions List</h2>
              <p className="text-sm text-gray-600 dark:text-gray-500">Manage all organizer subscriptions</p>
            </div>

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
                    <div className="flex w-full flex-col gap-3">
                      <div className="w-full">
                        <TableFilters
                          className="w-full [&_.w-44]:w-full [&_.w-\[180px\]]:w-full"
                          searchFilter={{
                            placeholder: 'Search organizers...',
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
                              id: 'sheet-billing',
                              label: 'Billing',
                              placeholder: 'Select by Billing',
                              value: billing,
                              onChange: onBillingChange,
                              options: [
                                { value: 'monthly', label: 'Monthly' },
                                { value: 'yearly', label: 'Yearly' },
                              ],
                            },
                            {
                              id: 'sheet-sub-type',
                              label: 'Sub. Type',
                              placeholder: 'Select by Sub. Type',
                              value: subType,
                              onChange: onSubTypeChange,
                              options: [
                                { value: 'all', label: 'All' },
                                { value: 'paid', label: 'Paid' },
                                { value: 'free', label: 'Free' },
                              ],
                            },
                            {
                              id: 'sheet-org-range',
                              label: 'Organizations',
                              placeholder: 'Select Organization Range',
                              value: orgRange,
                              onChange: onOrgRangeChange,
                              options: [
                                { value: 'all', label: 'All' },
                                { value: '1-10', label: '1 - 10' },
                                { value: '11-20', label: '11 - 20' },
                                { value: '21-30', label: '21 - 30' },
                                { value: '31-40', label: '31 - 40' },
                                { value: '41-50', label: '41 - 50' },
                                { value: '50', label: '50+' },
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
                  </form>
                </FormProvider>
              </SheetContent>
            </Sheet>
          </div>

          <div className="min-h-[45vh] rounded-lg border">
            <Table className="w-full rounded-md border">
              <TableHeadCustom headLabel={HEAD_LABEL} onSort={handleSort} sortConfig={sortConfig} />

              <TableBodyWrapper loading={loading} colSpan={HEAD_LABEL.length} dataLength={sortedData?.length || 0}>
                {sortedData?.map((item, idx) => (
                  <SubscriptionTableRow key={item?.id || idx} item={item} handleDelete={handleDelete} handleEdit={handleEdit} />
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

export default SubscriptionTable;
