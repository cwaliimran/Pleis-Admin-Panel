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
import { TransactionData } from './data';
import TransactionsTableRow from './transactions-table-row';
import { SamplePageProps } from './types';

// const HEAD_LABEL = [
//   { id: 'organization', label: 'Organization', align: 'left' },
//   { id: 'user', label: 'User', align: 'left' },
//   { id: 'transactionType', label: 'Transaction Type', align: 'left' },
//   { id: 'challengeCompletions', label: 'Challenge completions', align: 'left' },
//   { id: 'timeStamp', label: 'TimeStamp', align: 'left' },
//   { id: 'points', label: 'Points', align: 'left' },
//   { id: 'manualPointGifts', label: 'Manual point gifts', align: 'left' },
//   { id: 'pointExpirations', label: 'Point expirations', align: 'left' },
//   { id: 'referrals', label: 'Referrals', align: 'left' },
//   { id: 'actions', label: 'View', align: 'left' },
// ];

const HEAD_LABEL = [
  { id: 'organization', label: 'Organizer', align: 'left' },
  { id: 'user', label: 'User', align: 'left' },
  { id: 'transactionId', label: 'Transaction ID', align: 'left' },
  { id: 'transactionType', label: 'Transaction Type', align: 'left' },
  { id: 'points', label: 'Points', align: 'left' },
  { id: 'reference', label: 'Reference', align: 'left' },
  { id: 'timestamp', label: 'Timestamp', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'actions', label: 'Action', align: 'left' },
];

const TransactionsTable: FC<SamplePageProps> = ({
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
  onResetFilters = () => {},
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  transactionType,
  onTransactionTypeChange,
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
            <h3 className="ml-2 text-xl font-semibold md:ml-0">
              Loyalty Transaction List
            </h3>

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
                            dateRangeFilter={{
                              startDate: {
                                id: 'start-date',
                                placeholder: 'Select start date',
                                value: startDate,
                                onChange: onStartDateChange,
                              },
                              endDate: {
                                id: 'end-date',
                                placeholder: 'Select end date',
                                value: endDate,
                                onChange: onEndDateChange,
                              },
                            }}
                            searchFilter={{
                              placeholder:
                                'Search by User, Organization, Venue, Reference ...',
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
                                id: 'sheet-transaction-type',
                                label: 'Transaction Type',
                                placeholder: 'Select by Transaction Type',
                                value: transactionType,
                                onChange: onTransactionTypeChange,
                                options: [
                                  { value: 'type1', label: 'Type 1' },
                                  { value: 'type2', label: 'Type 2' },
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
              <TableHeadCustom headLabel={HEAD_LABEL} />

              <TableBodyWrapper
                loading={loading}
                colSpan={HEAD_LABEL.length}
                dataLength={data?.length || 0}
              >
                {/* {data?.map((item, idx) => ( */}
                {TransactionData?.map((item, idx) => (
                  <TransactionsTableRow
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

export default TransactionsTable;
