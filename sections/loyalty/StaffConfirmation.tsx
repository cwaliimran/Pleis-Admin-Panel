'use client';

import { useState, Fragment } from 'react';
import TableHeadCustom from '@/components/table/table-head-custom';
import { Table } from '@/components/ui/table';
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
import StaffLogTableRow from './StaffConfirmationTableRow';
import { useGetStaffChangeLogsQuery } from '@/store/Reducer/reservations-api';
import { useCompanySelection } from '@/app/common/header/company-selection-storage';

const headLabel = [
  { id: 'staff', label: 'Staff Member', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
  { id: 'reservationId', label: 'Reservation ID', align: 'left' },
  { id: 'date', label: 'Date', align: 'left' },
];

const StaffConfirmationsLog = ({ userType }: { userType: string }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

   const { organizerOrganizationIds } = useCompanySelection();

  const { data: logsRaw, isLoading } = useGetStaffChangeLogsQuery(
    { page, limit, organizations: userType === 'organizer' ? organizerOrganizationIds : undefined },
    { refetchOnMountOrArgChange: true }
  );

  const totalPages = logsRaw?.meta?.totalPages || 1;
  const totalRecords = logsRaw?.meta?.totalRecords || 0;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

  const staffLogs = (logsRaw?.data || [])
    .filter((item: any) => item?.reservation?.changeLogs?.length > 0)
    .map((item: any) => {
      const changeLogs = item.reservation.changeLogs;
      const lastLog = changeLogs[changeLogs.length - 1];
      return {
        staff: `${lastLog.changedBy?.firstName || ''} ${lastLog.changedBy?.lastName || ''}`.trim() || '-',
        avatar: lastLog.changedBy?.profileIcon || '',
        action: lastLog.action || '-',
        reservationId: item.reservation?.reservationId || '-',
        date: lastLog.createdAt ? formatDate(lastLog.createdAt) : '-',
        allLogs: changeLogs.map((log: any) => ({
          staff: `${log.changedBy?.firstName || ''} ${log.changedBy?.lastName || ''}`.trim() || '-',
          avatar: log.changedBy?.profileIcon || '',
          action: log.action || '-',
          date: log.createdAt ? formatDate(log.createdAt) : '-',
        })),
      };
    });

  return (
    <div>
      <div className="rounded-lg border md:m-4">
        <Table className="w-full">
          <TableHeadCustom headLabel={headLabel} />
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : staffLogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-gray-400">
                  No staff logs found.
                </td>
              </tr>
            ) : (
              staffLogs.map((item: any, index: number) => (
                <StaffLogTableRow
                  key={index}
                  item={item}
                  isExpanded={expandedRow === item.reservationId}
                  onToggle={() =>
                    setExpandedRow(expandedRow === item.reservationId ? null : item.reservationId)
                  }
                />
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

export default StaffConfirmationsLog;