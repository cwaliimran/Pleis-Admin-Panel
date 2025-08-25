import TableHeadCustom from '@/components/table/table-head-custom';
import { Card } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import { Table, TableBody } from '@/components/ui/table';
import { FC, useState } from 'react';
import { VenueTableRow } from '.';
import { Badge } from '@/components/ui/badge';
import { Settings2 } from 'lucide-react';
import { TableFilters } from '@/components/table-filters';
import { RHFMultiSelect } from '@/components/rhf/rhf-multiselect';
import { FormProvider, useForm } from 'react-hook-form';

const headLabel = [
  { id: 'icon', label: 'Icon', align: 'left' },
  { id: 'name', label: 'Venue Type Name', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
  { id: 'actions', label: '', align: 'right' },
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
}

const VenueTypeTable: FC<PageProps> = ({
  data = [],
  meta,
  loading,
  handleDelete,
  handleEdit,
  onPageChange,
  onLimitChange,
  // onSearch,
  // search = '',
  limit = 10,
  // page prop removed
}) => {
  // Pagination logic
  const totalPages = meta?.totalPages || 1;
  const currentPage = meta?.currentPage || 1;
  const totalRecords = meta?.totalRecords || 0;

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<string>('');
  // const [location, setLocation] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  // For sheet multi-select
  const [sheetLocation, setSheetLocation] = useState<string[]>([]);

  const methods = useForm({
    defaultValues: {
      location: sheetLocation,
    },
  });

  const handleResetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setStatus('');
    // setLocation('');
    setSearchTerm('');
    setSheetLocation([]);
    methods.reset({ location: [] });
  };

  // Generate page numbers for pagination (show max 5 pages)
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    let start = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let end = start + maxPagesToShow - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxPagesToShow + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div>
      <div className="grid grid-cols-12">
        <Card className="dark:bg-secondary col-span-12 mt-5 mb-5 px-2 shadow-md md:px-8 lg:col-span-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h3 className="ml-2 text-xl font-semibold md:ml-0">
              Venue Type List
            </h3>

            <Sheet>
              <SheetTrigger asChild>
                <Badge className="text-md flex cursor-pointer items-center gap-2 rounded-3xl border border-gray-300 bg-white px-4 py-2 text-black">
                  <Settings2 className="h-5 w-5" />
                  <span className="whitespace-nowrap">Filter</span>
                </Badge>
              </SheetTrigger>
              <SheetContent side="right" className="p-0">
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
                          Start Date
                        </label>
                        <div className="w-full">
                          <TableFilters
                            className="w-full [&_.w-44]:w-full [&_.w-\[180px\]]:w-full"
                            dateRangeFilter={{
                              startDate: {
                                id: 'sheet-event-start-date',
                                label: '',
                                placeholder: 'Select start date',
                                value: startDate,
                                onChange: setStartDate,
                              },
                              endDate: {
                                id: 'sheet-event-end-date',
                                label: '',
                                placeholder: 'Select end date',
                                value: endDate,
                                onChange: setEndDate,
                              },
                            }}
                            selectFilters={[
                              {
                                id: 'sheet-revenue',
                                label: 'Revenue',
                                placeholder: 'Select by revenue',
                                value: status,
                                onChange: setStatus,
                                options: [
                                  { value: 'lessThan10', label: '< $10k' },
                                  { value: '10to50', label: '$10k - $50k' },
                                  { value: '50to100', label: '$50k - $100k' },
                                ],
                              },
                            ]}
                            searchFilter={{
                              placeholder: 'Search Event',
                              value: searchTerm,
                              onChange: setSearchTerm,
                            }}
                            resetFilter={{
                              onReset: handleResetFilters,
                              showResetButton: false,
                            }}
                            filtersAlignment="left"
                          />
                        </div>
                      </div>
                      {/* Location MultiSelect */}
                      <div className="flex w-full flex-col gap-3">
                        <RHFMultiSelect
                          name="location"
                          label=""
                          placeholder="Select Location"
                          options={[
                            { value: 'punjab', label: 'Punjab' },
                            { value: 'sindh', label: 'Sindh' },
                            { value: 'kashmir', label: 'Kashmir' },
                          ]}
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button
                        className="bg-primary hover:bg-primary/90 w-full cursor-pointer rounded-md py-2 font-semibold text-white transition"
                        type="button"
                        // onClick={...} // Add your apply logic here if needed
                      >
                        Apply
                      </button>
                      <button
                        className="bg-muted text-foreground border-border hover:bg-muted/80 w-full cursor-pointer rounded-md border py-2 font-semibold transition"
                        type="button"
                        onClick={handleResetFilters}
                      >
                        Reset
                      </button>
                    </div>
                  </form>
                </FormProvider>
              </SheetContent>
            </Sheet>
          </div>

          {/* <div className="mb-4 w-full">
            <Input
              placeholder="Search Venue Type"
              className="h-10 w-full"
              value={search}
              onChange={(e) => onSearch?.(e.target.value)}
              disabled={loading}
            />
          </div> */}

          <div className="rounded-lg border">
            <Table className="w-full rounded-md border">
              <TableHeadCustom headLabel={headLabel} />
              <TableBody>
                {loading ? (
                  <tr>
                    <td colSpan={headLabel.length} className="py-8 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={headLabel.length} className="py-8 text-center">
                      No data found
                    </td>
                  </tr>
                ) : (
                  data.map((item: any, index: number) => (
                    <VenueTableRow
                      key={item._id || index}
                      item={item}
                      handleDelete={handleDelete}
                      handleEdit={handleEdit}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <Pagination className="mt-4 flex flex-wrap items-center justify-end gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">Rows per page:</span>
              <Select
                value={String(limit)}
                onValueChange={(v) => onLimitChange?.(Number(v))}
              >
                <SelectTrigger className="h-8 w-[70px] text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {[5, 10, 20, 50, 100].map((opt) => (
                      <SelectItem key={opt} value={String(opt)}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="text-muted-foreground">
              Page {currentPage} of {totalPages} | Total: {totalRecords}
            </div>

            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) onPageChange?.(currentPage - 1);
                  }}
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>
              {getPageNumbers().map((pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    isActive={pageNum === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      if (pageNum !== currentPage) onPageChange?.(pageNum);
                    }}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {totalPages > 5 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      onPageChange?.(currentPage + 1);
                  }}
                  aria-disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </Card>
      </div>
    </div>
  );
};

export default VenueTypeTable;
