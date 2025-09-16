'use client';

import { TableBody } from '@/components/ui/table';
import { LoadingBar } from '@/components/table/table-bar-loading';
import { ReactNode } from 'react';

interface TableBodyWrapperProps {
  loading?: boolean;
  colSpan: number;
  dataLength: number;
  emptyMessage?: string;
  children: ReactNode;
}

const TableBodyWrapper = ({
  loading,
  colSpan,
  dataLength,
  emptyMessage = 'No data found',
  children,
}: TableBodyWrapperProps) => {
  return (
    <TableBody>
      {loading ? (
        <tr>
          <td colSpan={colSpan} className="py-0 text-center">
            <LoadingBar variant="default" />
          </td>
        </tr>
      ) : dataLength === 0 ? (
        <tr>
          <td
            colSpan={colSpan}
            className="h-[40vh] border-b-0 text-center align-middle"
          >
            <div className="flex h-full w-full items-center justify-center text-xl">
              {emptyMessage}
            </div>
          </td>
        </tr>
      ) : (
        children
      )}
    </TableBody>
  );
};

export default TableBodyWrapper;
