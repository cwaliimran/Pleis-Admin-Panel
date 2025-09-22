import TableHeadCustom from '@/components/table/table-head-custom';
import { Table } from '@/components/ui/table';
import React from 'react';
import { loyaltylistData } from './data';
import LoyaltyTableRow from './loyaltyTableRow';
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

const headLabel = [
  {
    id: 'menuItem',
    label: 'Menu Item',
    align: 'left',
  },
  {
    id: 'buyerName',
    label: 'Buyer Name',
    align: 'center',
  },
  {
    id: 'venue',
    label: 'Venue',
    align: 'left',
  },
  {
    id: 'points',
    label: 'Points',
    align: 'center',
  },
  {
    id: 'dateTime',
    label: 'Date and Time',
    align: 'center',
  },
  {
    id: 'amount',
    label: 'Amount',
    align: 'center',
  },
  {
    id: 'total',
    label: 'Total',
    align: 'center',
  },
  {
    id: 'actions',
    label: '',
    align: 'center',
  },
];

const LoyaltyList = () => {
  return (
    <div>
      <div className="rounded-lg border md:m-4">
        <Table className="w-full">
          <TableHeadCustom headLabel={headLabel} />
          <tbody>
            {loyaltylistData.map((item: any, index: number) => (
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

export default LoyaltyList;
