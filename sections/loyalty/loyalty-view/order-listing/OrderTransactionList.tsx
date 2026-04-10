'use client';

import { useState, Fragment } from 'react';
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
import OrderTransactionTableRow from './OrderTransactionTableRow';
import { useGetOrderTransactionsQuery } from '@/store/Reducer/orders-api';
import { useCompanySelection } from '@/app/common/header/company-selection-storage';

const transactionListHeadLabel = [
  { id: 'user', label: 'Customer', align: 'left' },
  { id: 'orderTime', label: 'Time', align: 'start' },
  { id: 'paymentStatus', label: 'Payment Status', align: 'start' },
  { id: 'paymentMethod', label: 'Payment Method', align: 'start' },
  { id: 'totalAmount', label: 'Total Amount', align: 'start' },
  { id: 'orderStatus', label: 'Order Status', align: 'start' },
  { id: 'paidAt', label: 'Paid At', align: 'start' },
];

const OrderTransactionList = ({ userType }: { userType: string }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const { organizerOrganizationIds } = useCompanySelection();
  const { data: transactionsRaw, isLoading } = useGetOrderTransactionsQuery(
    { page, limit , organizations: userType === 'organizer' ? organizerOrganizationIds : undefined },
    { refetchOnMountOrArgChange: true }
  );

  const totalPages = transactionsRaw?.meta?.totalPages || 1;
  const totalRecords = transactionsRaw?.meta?.totalRecords || 0;

  const mappedData = (transactionsRaw?.data || []).map((item: any) => ({
    user: `${item.user?.firstName || ''} ${item.user?.lastName || ''}`.trim() || '-',
    avatar: item.user?.profileIcon || '',
    orderTime: item.createdAt
      ? new Date(item.createdAt).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '-',
    paymentStatus: item.paymentStatus || '-',
    paymentMethod: item.paymentMethod || '-',
    totalAmount: item.totalPrice ? `€${item.totalPrice}` : '-',
    orderStatus: item.status || '-',
    paidAt: item.paidAt
      ? new Date(item.paidAt).toLocaleString('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '-',
  }));

  return (
    <div>
      <div className="rounded-lg border md:m-4">
        <Table className="w-full">
          <TableHeadCustom headLabel={transactionListHeadLabel} />
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-sm text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : mappedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-sm text-gray-400">
                  No transactions found.
                </td>
              </tr>
            ) : (
              mappedData.map((item: any, index: number) => (
                <OrderTransactionTableRow key={index} item={item} />
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

export default OrderTransactionList;