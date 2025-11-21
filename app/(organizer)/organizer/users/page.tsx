'use client';
import TableHeadCustom from '@/components/table/table-head-custom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBoolean } from '@/hooks/useBoolean';
import { organizerData, UserTableRow } from '@/sections/users';
import { organizerTabs } from '@/sections/users/data';
import { Plus, Settings2 } from 'lucide-react';
import { useState } from 'react';
import Header from '../../../common/header/header';

const headLabel = [
  { id: 'user', label: 'User', align: 'left' },
  { id: 'totalrevenue', label: 'Total Revenue', align: 'center' },
  { id: 'views', label: 'Views', align: 'center' },
  { id: 'tickets', label: 'Tickets Sold', align: 'center' },
  { id: 'date', label: 'Date', align: 'center' },
  { id: 'commission', label: 'Commission', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'actions', label: '', align: 'end' },
];
const Page = () => {
  const openModal = useBoolean();
  const [active, setActive] = useState('all');

  return (
    <div className="">
      <Header links={[{ name: 'Dashboard', href: '/organizer' }, { name: 'Organizers' }]} />
      <div className="mt-10 flex justify-between">
        <div></div>
        <div>
          <Button
            className="bg-primary flex cursor-pointer items-center gap-2 rounded-3xl px-4 py-2 text-white transition-colors"
            onClick={openModal.onTrue}
          >
            <Plus />
            Add Organizer
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-12">
        <Card className="col-span-12 mt-5 px-2 shadow-md md:px-8 lg:col-span-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h3 className="ml-2 text-xl font-semibold md:ml-0">Organizer List</h3>
            <div>
              <Tabs value={active} onValueChange={setActive} className="w-full">
                <div className="scrollbar-hide overflow-x-auto whitespace-nowrap">
                  <TabsList className="flex items-center gap-2 rounded-full border bg-[#EBEBEB] p-1 dark:border-white dark:bg-black">
                    {organizerTabs.map((tab: any, index: number) => (
                      <TabsTrigger
                        key={index}
                        value={tab.value}
                        className={`text-md relative rounded-full px-4 py-2 font-semibold transition-colors ${
                          active === tab.value ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          {tab.label}
                          {tab.icon && <tab.icon className="h-4 w-4" />}
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </Tabs>
            </div>
            <div className="flex flex-col items-end md:items-center">
              <Badge className="text-md flex w-fit items-center gap-2 rounded-2xl bg-white px-3 py-1 text-black shadow-md">
                <Settings2 className="h-10 w-10" />
                <span className="cursor-pointer whitespace-nowrap">By Profile</span>
              </Badge>
            </div>
          </div>
          <div className="w-full">
            <Input
              placeholder="Search Organizer"
              // value={globalFilter}
              // onChange={(e) => setGlobalFilter(e.target.value)}
              className="h-10 w-full rounded-2xl"
            />
          </div>
          <div className="rounded-lg border">
            <Table className="w-full rounded-md border">
              <TableHeadCustom headLabel={headLabel} />
              {organizerData.map((user, index) => (
                <UserTableRow key={index} item={user} />
              ))}
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
      <Dialog open={openModal.value} onOpenChange={openModal.onToggle}>
        <DialogOverlay className="bg-opacity-30 fixed inset-0 flex items-center justify-center bg-white">
          <DialogContent>
            <DialogTitle>Update User Information </DialogTitle>
            <div className="flex flex-col gap-4">
              <input type="text" placeholder="Organizer Name" className="z-10 rounded-md p-2 shadow-md" />
              <input type="email" placeholder="Email" className="z-10 rounded-md p-2 shadow-md" />
              <input type="tel" placeholder="Phone Number" className="z-10 rounded-md p-2 shadow-md" />
              <input type="text" placeholder="Address" className="z-10 rounded-md p-2 shadow-md" />
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={openModal.onFalse} variant={'outline'} className="mr-2 cursor-pointer">
                Cancel
              </Button>
              <Button onClick={openModal.onFalse} className="cursor-pointer">
                Update User
              </Button>
            </div>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
    </div>
  );
};

export default Page;
