import { TableFilters } from '@/components/table-filters';
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
import { Table, TableBody } from '@/components/ui/table';
import { FC, useState } from 'react';
import { eventData } from './data';
import EventTableRow from './eventTAbleRow';
import { Badge } from '@/components/ui/badge';
import { Settings2 } from 'lucide-react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { RHFMultiSelect } from '@/components/rhf/rhf-multiselect';
import { useForm, FormProvider } from 'react-hook-form';

const headLabel = [
  { id: 'image', label: 'Image', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'Organization', label: 'Organization', align: 'left' },
  { id: 'venue', label: 'Venue', align: 'left' },
  { id: 'startDate', label: 'Start Date', align: 'left' },
  { id: 'endDate', label: 'End Date', align: 'left' },
  { id: 'totalRevenue', label: 'Revenue', align: 'left' },
  { id: 'totalViews', label: 'Views', align: 'left' },
  { id: 'region', label: 'Region', align: 'left' },
  { id: 'actions', label: 'Action', align: 'left' },
];
interface PageProps {
  handleDelete?: (id: string) => void;
  userType?: string;
}
const EventTable: FC<PageProps> = ({ handleDelete, userType }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  // For sheet multi-select
  const [sheetLocation, setSheetLocation] = useState<string[]>([]);

  // react-hook-form for sheet multi-select (for demo, not required for main filters)
  const methods = useForm({
    defaultValues: {
      location: sheetLocation,
    },
  });

  const handleResetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setStatus('');
    setLocation('');
    setSearchTerm('');
    setSheetLocation([]);
    methods.reset({ location: [] });
  };

  return (
    <div>
      <div className="grid grid-cols-12">
        <Card className="dark:bg-secondary col-span-12 mt-5 mb-5 px-2 shadow-md md:px-8 lg:col-span-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h3 className="ml-2 text-xl font-semibold md:ml-0">Event List</h3>

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

          {/* <TableFilters
            dateRangeFilter={{
              startDate: {
                id: 'event-start-date',
                label: 'Start Date',
                placeholder: 'Select start date',
                value: startDate,
                onChange: setStartDate,
              },
              endDate: {
                id: 'event-end-date',
                label: 'End Date',
                placeholder: 'Select end date',
                value: endDate,
                onChange: setEndDate,
              },
            }}
            selectFilters={[
              {
                id: 'revenue',
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
              {
                id: 'location',
                label: 'Location',
                placeholder: 'Select Location',
                value: location,
                onChange: setLocation,
                options: [
                  { value: 'punjab', label: 'Punjab' },
                  { value: 'sindh', label: 'Sindh' },
                  { value: 'kashmir', label: 'Kashmir' },
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
              showResetButton: true,
            }}
            filtersAlignment="right"
          /> */}

          <div className="rounded-lg border">
            <Table className="w-full rounded-md border">
              <TableHeadCustom headLabel={headLabel} />
              <TableBody>
                {eventData.map((item, index) => (
                  <EventTableRow
                    key={index}
                    active={index === 0}
                    item={item}
                    handleDelete={handleDelete}
                    userType={userType}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination className="mt-4 flex flex-wrap items-center justify-end gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">Rows per page:</span>
              <Select defaultValue="10">
                <SelectTrigger className="h-8 w-[70px] text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Page info */}
            <div className="text-muted-foreground">Page 1 of 1</div>

            {/* Pagination controls */}
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </Card>
      </div>
    </div>
  );
};

export default EventTable;
