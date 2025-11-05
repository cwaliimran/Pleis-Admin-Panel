import TableHeadCustom from '@/components/table/table-head-custom';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table } from '@/components/ui/table';
import LoyaltyTableRow from './loyaltyTableRow2';

const headLabel = [
  { id: 'user', label: 'User', align: 'left' },
  { id: 'reservationType', label: 'Reservation Type', align: 'start' },
  { id: 'timeslot', label: 'Timeslot', align: 'start' },
  { id: 'tickets', label: 'Linked Tickets', align: 'start' },
  { id: 'amount', label: 'Total Amount', align: 'start' },
  { id: 'paymentStatus', label: 'Payment Status', align: 'start' },
  { id: 'confirmation', label: 'Confirmation', align: 'start' },
  { id: 'staff', label: 'Staff', align: 'start' },
  { id: 'actions', label: '', align: 'center' },
];

export const reservationListData = [
  {
    user: 'John Doe',
    avatar: 'https://github.com/shadcn.png',
    reservationType: 'Prepay',
    timeslot: '7:00 PM - 9:00 PM',
    tickets: '2 VIP Tickets',
    amount: '€250',
    paymentStatus: 'Paid',
    staff: 'Alice Smith',
    confirmation: 'Confirmed',
  },
  {
    user: 'Sarah Khan',
    avatar: 'https://github.com/shadcn.png',
    reservationType: 'Fixed',
    timeslot: '9:00 PM - 11:00 PM',
    tickets: '1 Standard Ticket',
    amount: '€120',
    paymentStatus: 'Pending',
    staff: 'Alice Smith',
    confirmation: 'Awaiting',
  },
  {
    user: 'David Miller',
    avatar: 'https://github.com/shadcn.png',
    reservationType: 'Min Spend',
    timeslot: '6:00 PM - 8:00 PM',
    tickets: '3 Entry Passes',
    amount: '€400',
    paymentStatus: 'Paid',
    staff: 'Alice Smith',
    confirmation: 'Completed',
  },
];

const ReservationList = () => {
  return (
    <div>
      <div className="rounded-lg border md:m-4">
        <Table className="w-full">
          <TableHeadCustom headLabel={headLabel} />
          <tbody>
            {reservationListData.map((item: any, index: number) => (
              <LoyaltyTableRow key={index} item={item} />
            ))}
          </tbody>
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
    </div>
  );
};

export default ReservationList;
