// components/lists/ActivePromotionsList.tsx

'use client';
import { useState, Fragment } from 'react';
import TableHeadCustom from '@/components/table/table-head-custom';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationLink
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table } from '@/components/ui/table';
import { useGetActivePromotionsQuery } from '@/store/Reducer/orders-api';
import PromotionsTableRow from './PromotionsTableRow';
import { useCompanySelection } from '@/app/common/header/company-selection-storage';

const ActivePromotionsList = ({ userType }: { userType: string }) => {
 const headLabel = [
  { id: 'promotionName', label: 'Title', align: 'left' },
  { id: 'type', label: 'Promotion Type', align: 'start' },
  { id: 'discount', label: 'Points Multiplier', align: 'start' },
  { id: 'startDate', label: 'Start Date', align: 'start' },
  { id: 'endDate', label: 'End Date', align: 'start' },
  { id: 'status', label: 'Status', align: 'start' },
];

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const { organizerOrganizationIds } = useCompanySelection();


  const { data: promotionsRaw, isLoading } = useGetActivePromotionsQuery(
    { page, limit, organizations: userType === 'organizer' ? organizerOrganizationIds : undefined },
    { refetchOnMountOrArgChange: true }
  );

  console.log('promotionsRaw', promotionsRaw);

  const totalPages = promotionsRaw?.meta?.totalPages || 1;
  const totalRecords = promotionsRaw?.meta?.totalRecords || 0;
  const promotions = promotionsRaw?.data || [];

  return (
    <div>
      <div className="rounded-lg border md:m-4">
        <Table className="w-full">
          <TableHeadCustom headLabel={headLabel} />
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="py-8 text-center text-sm text-gray-400">Loading...</td></tr>
            ) : promotions.length === 0 ? (
              <tr><td colSpan={7} className="py-8 text-center text-sm text-gray-400">No promotions found.</td></tr>
            ) : (
              promotions.map((item: any, index: number) => (
                <PromotionsTableRow key={index} item={item} />
              ))
            )}
          </tbody>
        </Table>
      </div>

      <Pagination className="mt-4 flex flex-wrap items-center justify-end gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground">Rows per page:</span>
          <Select
            defaultValue={String(limit)}
            onValueChange={(val) => {
              setLimit(Number(val));
              setPage(1);
            }}
          >
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

        <div className="text-muted-foreground">
          Page {page} of {totalPages} ({totalRecords} records)
        </div>

        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) setPage(page - 1);
              }}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
            .map((p, idx, arr) => (
              <Fragment key={p}>
                {idx > 0 && arr[idx - 1] !== p - 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    isActive={p === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(p);
                    }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              </Fragment>
            ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages) setPage(page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ActivePromotionsList;