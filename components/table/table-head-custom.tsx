import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import React, { FC } from 'react';

export type SortOrder = 'asc' | 'desc' | null;

export interface SortConfig {
  key: string | null;
  direction: SortOrder;
}

interface CustomHeaderProps {
  headLabel: Array<{
    id: string;
    label: string;
    align?: string;
    sortable?: boolean;
    sortKey?: string;
  }>;
  sortConfig?: SortConfig;
  onSort?: (key: string) => void;
}

const TableHeadCustom: FC<CustomHeaderProps> = ({
  headLabel,
  sortConfig,
  onSort,
}) => {
  const getTextAlignClass = (align?: string) => {
    switch (align) {
      case 'right':
        return 'text-right';
      case 'center':
        return 'text-center';
      default:
        return 'text-left';
    }
  };

  const getSortIcon = (header: any) => {
    const sortKey = header.sortKey || header.id;

    if (!sortConfig || sortConfig.key !== sortKey) {
      return <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }

    if (sortConfig.direction === 'asc') {
      return <ChevronUp className="ml-2 h-4 w-4" />;
    }

    if (sortConfig.direction === 'desc') {
      return <ChevronDown className="ml-2 h-4 w-4" />;
    }

    return <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />;
  };

  const handleSort = (header: any) => {
    if (!header.sortable || !onSort) return;

    const sortKey = header.sortKey || header.id;
    onSort(sortKey);
  };

  return (
    <TableHeader>
      <TableRow className="dark:bg-secondary bg-slate-100">
        {headLabel.map((header: any) => (
          <TableHead
            key={header.id}
            className={cn(
              'py-4 text-[16px]',
              'text-slate-700 dark:text-white',
              'bg-slate-100 dark:bg-[#272727]',
              'border-b border-slate-300 dark:border-[#272727]',
              getTextAlignClass(header.align),
              header.sortable &&
                'cursor-pointer transition-colors select-none hover:bg-slate-200 dark:hover:bg-[#333333]'
            )}
            onClick={() => handleSort(header)}
          >
            <div className="flex items-center justify-between">
              <span>{header.label}</span>
              {header.sortable && getSortIcon(header)}
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};

export default TableHeadCustom;
