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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings2 } from 'lucide-react';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import OrderingTransactionTableRow from './ordering-transaction-table-row';
import { SamplePageProps } from './types';

const HEAD_LABEL = [
  { id: 'user', label: 'User', align: 'left', sortable: true, sortKey: 'user.firstName' },
  { id: 'organization', label: 'Organization', align: 'left' },
  { id: 'transactionId', label: 'Transaction ID', align: 'left' },
  { id: 'orderNo', label: 'Order No', align: 'left' },
  { id: 'transactionType', label: 'Type', align: 'left' },
  { id: 'transactionAmount', label: 'Amount', align: 'left' },
  { id: 'paymentMethod', label: 'Payment Method', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'timestamp', label: 'Timestamp', align: 'left', sortable: true, sortKey: 'createdAt' },
];

const OrderingTransactionTable: FC<SamplePageProps> = ({
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
  paymentStatus = '',
  onPaymentStatusChange = () => {},
  paymentMethod = '',
  onPaymentMethodChange = () => {},
  minAmount = '',
  onMinAmountChange = () => {},
  maxAmount = '',
  onMaxAmountChange = () => {},
  // status = '',
  // onStatusChange = () => {},
  // date,
  startDate,
  endDate,
  // onDateChange = () => {},
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
            <h3 className="ml-2 text-xl font-semibold md:ml-0">Ordering Transaction List</h3>

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
                            // dateFilter={{
                            //   id: 'organization-date',
                            //   placeholder: 'Select date',
                            //   value: date,
                            //   onChange: onDateChange,
                            // }}
                            searchFilter={{
                              placeholder: 'Search...',
                              value: search,
                              onChange: onSearch,
                            }}
                            selectFilters={[
                              {
                                id: 'sheet-payment-status',
                                label: 'Payment Status',
                                placeholder: 'Select Payment Status',
                                value: paymentStatus,
                                onChange: onPaymentStatusChange,
                                options: [
                                  { value: 'all', label: 'All' },
                                  { value: 'pending', label: 'Pending' },
                                  { value: 'paid', label: 'Paid' },
                                  { value: 'failed', label: 'Failed' },
                                  { value: 'refunded', label: 'Refunded' },
                                ],
                              },
                              {
                                id: 'sheet-payment-method',
                                label: 'Payment Method',
                                placeholder: 'Select Payment Method',
                                value: paymentMethod,
                                onChange: onPaymentMethodChange,
                                options: [
                                  { value: 'all', label: 'All' },
                                  { value: 'applePay', label: 'Apple Pay' },
                                  { value: 'card', label: 'Card' },
                                  { value: 'cash', label: 'Cash' },
                                ],
                              },
                            ]}
                            filtersAlignment="left"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="-mt-4 flex w-full flex-col gap-2">
                      <Label className="text-sm font-medium">Amount Range</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Input
                            type="number"
                            placeholder="Min"
                            min={0}
                            value={minAmount}
                            onChange={(e) => onMinAmountChange(e.target.value)}
                            className="h-10 w-full"
                          />
                        </div>
                        <span className="text-muted-foreground text-sm">to</span>
                        <div className="flex-1">
                          <Input
                            type="number"
                            placeholder="Max"
                            min={0}
                            value={maxAmount}
                            onChange={(e) => onMaxAmountChange(e.target.value)}
                            className="h-10 w-full"
                          />
                        </div>
                      </div>
                      {minAmount && maxAmount && Number(minAmount) > Number(maxAmount) && (
                        <p className="text-xs text-red-500">Max amount cannot be less than min amount</p>
                      )}
                    </div>

                    {(search || paymentStatus || paymentMethod || minAmount || maxAmount || startDate || endDate) && (
                      <button
                        className="bg-muted text-foreground border-border hover:bg-muted/80 w-full cursor-pointer rounded-md border py-2 font-semibold transition"
                        type="button"
                        onClick={onResetFilters}
                      >
                        Reset
                      </button>
                    )}
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
                  <OrderingTransactionTableRow key={item?._id || idx} item={item} handleDelete={handleDelete} handleEdit={handleEdit} />
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

export default OrderingTransactionTable;
