"use client";

import TableHeadCustom from '@/components/table/table-head-custom';
import { Table } from '@/components/ui/table';
import React, { Fragment, useMemo, useState } from 'react';
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
import { TableCell, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetClubMembersAnalyticsTransactionsQuery } from '@/store/Reducer/members-api';

type LoyaltyListProps = {
  userId?: string;
  companyOrganizer?: string;
};

type MappedTransaction = {
  id: string;
  menuItem: string;
  buyerName: string;
  points: number;
  dateTime: string;
  amount: number;
  total: number;
};

const formatCurrency = (amount: number) => `€${Number(amount || 0).toLocaleString()}`;

const truncateText = (value: string, maxLength = 28) => {
  if (!value) return '-';
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}..`;
};

const formatDateTime = (value: string) => {
  if (!value) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const getItemName = (item: any) => {
  if (typeof item === 'string') return item;
  return item?.name || item?.title || item?.itemName || item?.productName || '-';
};

const headLabel = [
  {
    id: 'transactionId',
    label: 'Transaction ID',
    align: 'left',
  },
  {
    id: 'menuItem',
    label: 'Menu Item',
    align: 'center',
  },
  {
    id: 'buyerName',
    label: 'Buyer Name',
    align: 'left',
  },
  {
    id: 'points',
    label: 'Points',
    align: 'left',
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
];

const LoyaltyList = ({ userId, companyOrganizer }: LoyaltyListProps) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [selectedMenuItemText, setSelectedMenuItemText] = useState('');

  const { data, isLoading, isFetching, error } = useGetClubMembersAnalyticsTransactionsQuery(
    {
      user: userId || '',
      companyOrganizer,
      page,
      limit,
    },
    {
      skip: !userId,
      refetchOnMountOrArgChange: true,
    }
  );

  const rows = useMemo<MappedTransaction[]>(() => {
    const list = Array.isArray(data?.data) ? data.data : [];

    const mappedRows = list.map((item: any, index: number) => {
      const rawItems = item?.items || item?.orderItems || item?.products || [];
      const itemsBought = Array.isArray(rawItems)
        ? rawItems.map((entry: any) => getItemName(entry)).filter(Boolean)
        : [];

      const firstItem = Array.isArray(rawItems) && rawItems.length > 0 ? rawItems[0] : undefined;
      const buyerFirstName = item?.user?.firstName || item?.firstName || '';
      const buyerLastName = item?.user?.lastName || item?.lastName || '';
      const buyerName = `${buyerFirstName} ${buyerLastName}`.trim() || '-';
      const amount = Number(item?.price ?? firstItem?.price ?? 0);
      const total = Number(item?.totalPrice ?? item?.total ?? item?.amount ?? amount);

      return {
        id: String(item?._id || item?.id || item?.transactionId || `tx-${index}`),
        menuItem: itemsBought.length > 0 ? itemsBought.join(', ') : '-',
        buyerName,
        points: Number(item?.points ?? item?.pointsEarned ?? item?.loyaltyPoints ?? 0),
        dateTime: item?.createdAt || item?.transactionDate || item?.date || '',
        amount,
        total,
      };
    });

    return mappedRows.sort((a, b) => {
      const aTime = new Date(a.dateTime).getTime();
      const bTime = new Date(b.dateTime).getTime();

      if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
      if (Number.isNaN(aTime)) return 1;
      if (Number.isNaN(bTime)) return -1;

      return bTime - aTime;
    });
  }, [data]);

  const totalPages = Number(data?.meta?.totalPages || 1);
  const totalRecords = Number(data?.meta?.totalRecords || 0);
  const loading = isLoading || isFetching;
  const errorMessage =
    (error as any)?.data?.message ||
    (error as any)?.error ||
    (error ? 'Failed to fetch transactions.' : '');

  return (
    <div>
      <div className="rounded-lg border md:m-4">
        <Table className="w-full">
          <TableHeadCustom headLabel={headLabel} />
          <tbody>
            {!userId ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-sm text-gray-400">
                  Missing user context.
                </TableCell>
              </TableRow>
            ) : loading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-sm text-gray-400">
                  Loading transactions...
                </TableCell>
              </TableRow>
            ) : errorMessage ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-sm text-red-500">
                  {errorMessage}
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-sm text-gray-400">
                  No transactions available
                </TableCell>
              </TableRow>
            ) : (
              rows.map((item) => (
                <TableRow key={item.id} className="h-14">
                  <TableCell className="text-start">{item.id}</TableCell>
                  <TableCell className="text-center">
                    {item.menuItem.length > 28 ? (
                      <button
                        type="button"
                        className="max-w-[220px] cursor-pointer truncate text-left underline"
                        title={item.menuItem}
                        onClick={() => {
                          setSelectedMenuItemText(item.menuItem);
                          setMenuModalOpen(true);
                        }}
                      >
                        {truncateText(item.menuItem)}
                      </button>
                    ) : (
                      item.menuItem
                    )}
                  </TableCell>
                  <TableCell className="text-left">{item.buyerName}</TableCell>
                  <TableCell className="text-left">{item.points}</TableCell>
                  <TableCell className="text-center">{formatDateTime(item.dateTime)}</TableCell>
                  <TableCell className="text-center">{formatCurrency(item.amount)}</TableCell>
                  <TableCell className="text-center">{formatCurrency(item.total)}</TableCell>
                </TableRow>
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
            onValueChange={(value) => {
              setLimit(Number(value));
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

      <Dialog open={menuModalOpen} onOpenChange={setMenuModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Menu Item</DialogTitle>
          </DialogHeader>
          <div className="text-sm break-words">{selectedMenuItemText || '-'}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoyaltyList;
