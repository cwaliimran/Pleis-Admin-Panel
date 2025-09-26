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
import { useTableSort } from '@/hooks/useTableSort';
import { Settings2 } from 'lucide-react';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import TagsTypeTableRow from './tagsTypeTableRow';

const headLabel = [
  {
    id: 'name',
    label: 'Tag Name',
    align: 'left',
    sortable: true,
    sortKey: 'title',
  },
  {
    id: 'type',
    label: 'Tag Type',
    align: 'left',
    sortable: true,
    sortKey: 'type',
  },
  {
    id: 'createdAt',
    label: 'Created At',
    align: 'left',
    sortable: true,
    sortKey: 'createdAt',
  },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'actions', label: 'Action', align: 'left' },
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
  onStatusChange?: (status: string) => void;
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  onResetFilters?: () => void;
}

const TagsTypeTable: FC<PageProps> = ({
  data = [],
  meta,
  loading,
  handleDelete,
  handleEdit,
  onPageChange,
  // onLimitChange,
  onSearch = () => {},
  search = '',
  // limit = 10,
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
            <h3 className="ml-2 text-xl font-semibold md:ml-0">Tags List</h3>

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
                              placeholder: 'Search Tags...',
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
                    {/* <div className="mt-4 flex gap-3">
                      <button
                        className="bg-primary hover:bg-primary/90 w-full cursor-pointer rounded-md py-2 font-semibold text-white transition"
                        type="button"
                      >
                        Apply
                      </button>
                      <button
                        className="bg-muted text-foreground border-border hover:bg-muted/80 w-full cursor-pointer rounded-md border py-2 font-semibold transition"
                        type="button"
                        onClick={onResetFilters}
                      >
                        Reset
                      </button>
                    </div> */}
                  </form>
                </FormProvider>
              </SheetContent>
            </Sheet>
          </div>

          <div className="rounded-lg border">
            <Table className="w-full rounded-md border">
              <TableHeadCustom
                headLabel={headLabel}
                sortConfig={sortConfig}
                onSort={handleSort}
              />

              <TableBodyWrapper
                loading={loading}
                colSpan={headLabel.length}
                dataLength={sortedData?.length || 0}
              >
                {sortedData?.map((item: any, index: number) => (
                  <TagsTypeTableRow
                    key={item?._id || index}
                    item={item}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                  />
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

export default TagsTypeTable;
