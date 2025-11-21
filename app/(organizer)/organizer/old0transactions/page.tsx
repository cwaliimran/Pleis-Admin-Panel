'use client';
import Header from '@/app/common/header/header';
import FilterDropdown from '@/components/filter-dropdown/FilterDropdown';
import TableHeadCustom from '@/components/table/table-head-custom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Table, TableBody } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { TransactionHistoryData } from '@/sections/invoices/data';
import TransactionHitoryTableRow from '@/sections/invoices/transactionHistoryRow';
import React from 'react';
const headLabel = [
  { id: 'user', label: 'User', align: 'left' },
  { id: 'contact', label: 'Contact', align: 'left' },
  { id: 'invoice', label: 'Invoice', align: 'left' },
  { id: 'organizer', label: 'Organizer', align: 'left' },
  { id: 'date', label: 'Date', align: 'left' },
  { id: 'total', label: 'Total' },
  { id: 'transactionType', label: 'Transaction Type', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'action', label: '' },
];

const Page = () => {
  const [active, setActive] = React.useState('all');
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
  return (
    <>
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer' },
          { name: 'Transaction', href: '' },
        ]}
      />
      <div className="grid grid-cols-12">
        <Card className="col-span-12 mt-5 mb-5 px-2 shadow-md md:px-8 lg:col-span-12 dark:bg-[#171717]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h3 className="text-xl font-semibold">Transaction History</h3>
            <div>
              <Tabs value={active} onValueChange={setActive} defaultValue="all" className="w-full">
                <TabsList className="flex items-center gap-2 rounded-full border bg-[#EBEBEB] p-1 dark:border-white dark:bg-black">
                  <TabsTrigger
                    value="all"
                    className={cn('text-md relative z-10 cursor-pointer rounded-full px-4 py-2 font-semibold transition-colors')}
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="transactions"
                    className={cn('text-md relative z-10 cursor-pointer rounded-full px-4 py-2 font-semibold transition-colors')}
                  >
                    Transactions
                  </TabsTrigger>
                  <TabsTrigger
                    value="refunds"
                    className={cn('text-md relative z-10 cursor-pointer rounded-full px-4 py-2 font-semibold transition-colors')}
                  >
                    Refunds
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex flex-col items-end md:items-center">
              <FilterDropdown
                selectedOptions={selectedOptions}
                onSelectOption={setSelectedOptions}
                options={[
                  { id: 'user', label: 'User' },
                  { id: 'contact', label: 'Contact' },
                  { id: 'invoice', label: 'Invoice' },
                  { id: 'organizer', label: 'Organizer ' },
                  { id: 'date', label: 'Date' },
                  { id: 'total', label: 'Total' },
                  { id: 'transactionType', label: 'Transaction Type' },
                  { id: 'status', label: 'Status' },
                ]}
              />
            </div>
          </div>
          <Input
            placeholder="Search Transaction"
            // value={globalFilter}
            // onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-10 w-full"
          />
          <div className="rounded-lg border">
            <Table className="w-full rounded-md border">
              <TableHeadCustom headLabel={headLabel} />
              <TableBody>
                {TransactionHistoryData.map((item: any, index: number) => (
                  <TransactionHitoryTableRow key={index} item={item} />
                ))}
              </TableBody>
            </Table>
          </div>
          <div></div>
          <Pagination className="mt-2 flex w-full justify-end">
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
    </>
  );
};

export default Page;
