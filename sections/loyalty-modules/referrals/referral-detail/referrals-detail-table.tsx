'use client';

import { useState } from 'react';
import TableHeadCustom from '@/components/table/table-head-custom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import { useGetReferralsQuery } from '@/store/Reducer/referrals-api';

type ReferralItem = {
  friendName: string;
  status: 'joined' | 'pending';
  dateReferred: string;
  pointsAwarded: number;
};

const headLabel = [
  { id: 'friendName', label: 'Friend Name', align: 'left' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'dateReferred', label: 'Date Referred', align: 'center' },
  { id: 'pointsAwarded', label: 'Points Awarded', align: 'center' },
];

const ReferralsDetailPageTable = ({global , companyId }: {global: boolean, companyId: any  }) => {

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

   const { data: apiData, isLoading, isFetching} = useGetReferralsQuery({
     page: page - 1, limit,
     isGlobal: global,
     companyOrganizer: companyId || undefined,
   }, { refetchOnMountOrArgChange: true });
 

  const totalPages = apiData?.meta?.totalPages || 1;
  const currentPage = page;
  const generatePagination = (currentPage: number, totalPages: number) => {
    const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      // Calculate range around current page
      const showLeft = currentPage > 3;
      const showRight = currentPage < totalPages - 2;
      if (showLeft) {
        pages.push('ellipsis-start');
      }
      // Determine the range of pages to show around current
      const rangeStart = Math.max(2, currentPage - 1);
      const rangeEnd = Math.min(totalPages - 1, currentPage + 1);
      for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push(i);
      }
      if (showRight) {
        pages.push('ellipsis-end');
      }
      // Always show last page
      pages.push(totalPages);
    }
    return pages;
  };
  const paginationNumbers = generatePagination(currentPage, totalPages);
  const handlePrevious = () => {
    if (currentPage > 1) {
      setPage((prev) => prev - 1);
    }
  };
  const handleNext = () => {
    if (currentPage < totalPages) {
      setPage((prev) => prev + 1);
    }
  };
  const handlePageClick = (pageNum: number) => {
    setPage(pageNum);
  };
  

  return (
    <Card className="dark:bg-secondary shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Referral List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-md border">
          <Table className="w-full">
            <TableHeadCustom headLabel={headLabel} />
            <tbody>
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : Array.isArray(apiData?.data) && apiData.data.length > 0 ? (
                apiData.data.map((item: any, index: number) => (
                  <tr
                    key={index}
                    className="border-b text-sm last:border-0 dark:border-gray-700"
                  >
                    <td className="px-4 py-3 text-left">
                      {`${item?.firstName || ''} ${item?.lastName || ''}`.trim()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium capitalize ${
                          item?.status === 'joined'
                            ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200'
                        }`}
                      >
                        {item?.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item?.referrerCount}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
              <div className="mt-4">
                <Pagination className="flex flex-wrap items-center justify-between gap-4 text-sm sm:justify-end">
                  {/* Page Info */}
                  <div className="text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  {/* Pagination Controls */}
                  <PaginationContent>
                    {/* Previous Button */}
                    <PaginationItem>
                      <PaginationPrevious onClick={(e) => { e.preventDefault(); handlePrevious() }}
                        className={ currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        aria-disabled={currentPage <= 1}
                      />
                    </PaginationItem>
                    {/* Page Numbers */}
                    {paginationNumbers.map((item, index) => {
                      if (item === 'ellipsis-start' || item === 'ellipsis-end') {
                        return (
                          <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return (
                        <PaginationItem key={item}>
                          <PaginationLink onClick={(e) => { e.preventDefault(); handlePageClick(item as number)}}
                            isActive={currentPage === item} className="cursor-pointer" >
                            {item}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    {/* Next Button */}
                    <PaginationItem>
                      <PaginationNext onClick={(e) => { e.preventDefault(); handleNext() }}
                        className={ currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        aria-disabled={currentPage >= totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
      </CardContent>
    </Card>
  );
};

export default ReferralsDetailPageTable;
