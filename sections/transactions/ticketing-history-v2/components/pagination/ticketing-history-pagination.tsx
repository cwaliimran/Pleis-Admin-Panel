'use client';

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { FC } from 'react';

interface TicketingHistoryPaginationProps {
  currentPage: number;
  totalPages: number;
  shownCount: number;
  latestStateOnly: boolean;
  onPageChange: (page: number) => void;
}

const TicketingHistoryPagination: FC<TicketingHistoryPaginationProps> = ({ currentPage, totalPages, shownCount, latestStateOnly, onPageChange }) => {
  const getPageNumbers = () => {
    const maxPagesToShow = 4;
    const end = Math.min(totalPages, maxPagesToShow);
    return Array.from({ length: end }, (_, i) => i + 1);
  };

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
      <p className="text-muted-foreground">
        Showing {shownCount} ticket state{shownCount === 1 ? '' : 's'}
        {latestStateOnly && ' · superseded rows hidden'}
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

export default TicketingHistoryPagination;
