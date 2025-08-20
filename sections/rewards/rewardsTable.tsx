'use client';

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
import { RewardsData } from './data';
import RewardsTableRow from './rewardsRow';

const headLabel = [
  { id: 'photo', label: 'Photo', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'description', label: 'Description' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'creationMethod', label: 'Creation Method', align: 'left' },
  { id: 'pointValue', label: 'Point Value', align: 'left' },
  { id: 'limit', label: 'Limit', align: 'left' },
  { id: 'tierLimit', label: 'Tier Limit', align: 'left' },
  { id: 'percentOff', label: '% Off', align: 'left' },
  { id: 'actions', label: 'Actions' },
];

interface PageProps {
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

const RewardsTable: FC<PageProps> = ({ handleDelete, handleEdit }) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [type, setType] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleResetFilters = () => {
    setDate(undefined);
    setType('');
    setSearchTerm('');
  };

  return (
    <div>
      <div className="grid grid-cols-12">
        <Card className="dark:bg-secondary col-span-12 mt-5 mb-5 px-2 shadow-md md:px-8 lg:col-span-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h3 className="ml-2 text-xl font-semibold md:ml-0">Rewards List</h3>
          </div>

          <TableFilters
            selectFilters={[
              {
                id: 'type',
                label: 'Type',
                placeholder: 'Select type',
                value: type,
                onChange: setType,
                options: [
                  { value: 'food', label: 'Food' },
                  { value: 'beverage', label: 'Beverage' },
                  { value: 'dessert', label: 'Dessert' },
                  { value: 'experience', label: 'Experience' },
                  { value: 'merchandise', label: 'Merchandise' },
                ],
              },
            ]}
            searchFilter={{
              placeholder: 'Search Rewards',
              value: searchTerm,
              onChange: setSearchTerm,
            }}
            resetFilter={{
              onReset: handleResetFilters,
              showResetButton: true,
            }}
            filtersAlignment="right"
          />

          <div className="rounded-lg border">
            <Table className="w-full rounded-md border">
              <TableHeadCustom headLabel={headLabel} />
              <TableBody>
                {RewardsData.map((item: any, index: number) => (
                  <RewardsTableRow
                    key={index}
                    item={item}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
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

export default RewardsTable;
