'use client';

import { TableFilters } from '@/components/table-filters';
import PaginationControls from '@/components/table/pagination-controls';
import TableHeadCustom from '@/components/table/table-head-custom';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Table } from '@/components/ui/table';
import TableBodyWrapper from '@/components/ui/table-body-wrapper';
import { Settings2 } from 'lucide-react';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SamplePageProps } from './types';
// import { useTableSort } from '@/hooks/useTableSort';
import BundleTableRow from './bundles-table-row';

const HEAD_LABEL = [
  { id: 'bundleName', label: 'Bundle Name', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'itemsIncluded', label: 'Items Included', align: 'left' },
  { id: 'price', label: 'Price', align: 'left' },
  { id: 'discount', label: 'Discount', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
];

// Sample data
const bundles = [
  {
    _id: 1,
    name: 'Standard Party Package',
    description: 'Perfect for small groups looking for a great night out',
    price: 450,
    originalPrice: 520,
    discount: 300,
    items: { tickets: 4, reservations: 1, preorders: 0 },
    status: 'active',
    createdAt: '10-02-2025',
    sold: 45,
  },
  {
    _id: 2,
    name: 'VIP Experience Bundle',
    description: 'Premium package with exclusive table and bottle service',
    price: 850,
    originalPrice: 950,
    discount: 650,
    items: { tickets: 1, reservations: 1, preorders: 1 },
    status: 'active',
    createdAt: '10-02-2025',
    sold: 28,
  },
  {
    _id: 3,
    name: 'Group Early Bird Special',
    description: 'Best value for large groups booking in advance',
    price: 620,
    originalPrice: 700,
    discount: 540,
    items: { tickets: 6, reservations: 2, preorders: 0 },
    status: 'inactive',
    createdAt: '09-01-2025',
    sold: 12,
  },
];

const BundleTable: FC<SamplePageProps> = ({
  // data = [],
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

  // const { sortedData, sortConfig, handleSort } = useTableSort({
  //   data: data || [],
  // });

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
            <h3 className="ml-2 text-xl font-semibold md:ml-0">Bundles List</h3>

            {/* FILTER SHEET */}
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
                              placeholder: 'Search by Bundle Name',
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
              <TableHeadCustom
                headLabel={HEAD_LABEL}
                // onSort={handleSort}
                // sortConfig={sortConfig}
              />

              <TableBodyWrapper
                loading={loading}
                colSpan={HEAD_LABEL.length}
                dataLength={bundles?.length || 0}
              >
                {bundles?.map((item, idx) => (
                  <BundleTableRow
                    key={item?._id || idx}
                    item={item}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                  />
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

export default BundleTable;
