'use client';

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { FC } from 'react';
import { MOCK_TIMEZONE_NOTE } from '../../data/mock-data';

interface OrderingHistoryPaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  shownCount: number;
  onPageChange: (page: number) => void;
}

const OrderingHistoryPagination: FC<OrderingHistoryPaginationProps> = ({ currentPage, totalPages, totalRecords, shownCount, onPageChange }) => {
  const getPageNumbers = () => {
    const maxPagesToShow = 4;
    const end = Math.min(totalPages, maxPagesToShow);
    return Array.from({ length: end }, (_, i) => i + 1);
  };

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
      <p className="text-muted-foreground">
        Page {currentPage} of {totalPages} | Showing {shownCount} of {totalRecords} · {MOCK_TIMEZONE_NOTE}
      </p>

      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={currentPage === 1}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
            />
          </PaginationItem>

          {getPageNumbers().map((pageNum) => (
            <PaginationItem key={pageNum}>
              <PaginationLink
                href="#"
                isActive={pageNum === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  if (pageNum !== currentPage) onPageChange(pageNum);
                }}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          ))}

          {totalPages > 4 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={currentPage === totalPages}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) onPageChange(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default OrderingHistoryPagination;
