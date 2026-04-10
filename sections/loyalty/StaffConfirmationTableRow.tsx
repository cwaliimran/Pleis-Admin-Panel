import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { TableCell, TableRow } from '@/components/ui/table';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { FC } from 'react';

interface PageProps {
  item: any;
  isExpanded?: boolean;
  onToggle?: () => void;
}

const StaffLogTableRow: FC<PageProps> = ({ item, isExpanded, onToggle }) => {
  const previousLogs = item.allLogs?.slice(0, -1) || [];
  const hasHistory = previousLogs.length > 0;

  return (
    <>
      {/* Main Row — full row click to expand/collapse */}
      <TableRow
        className={`h-14 ${hasHistory ? 'cursor-pointer hover:bg-muted/20' : ''}`}
        onClick={hasHistory ? onToggle : undefined}
      >
        <TableCell className="text-left">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={item.avatar || 'https://github.com/shadcn.png'} />
            </Avatar>
            {item.staff}
          </div>
        </TableCell>
        <TableCell className="text-left">{item.action}</TableCell>
        <TableCell className="text-left">{item.reservationId}</TableCell>
        <TableCell className="text-left">
          <div className="flex items-center justify-between gap-2">
            <span>{item.date}</span>
            {hasHistory && (
              <span className="text-gray-400">
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            )}
          </div>
        </TableCell>
      </TableRow>

      {/* Expanded previous logs — exclude last log (already shown above) */}
      {isExpanded &&
        previousLogs.map((log: any, idx: number) => (
          <TableRow key={idx} className="bg-muted/30 h-12">
            <TableCell>
              <div className="flex items-center gap-3 pl-6">
                <Avatar>
                  <AvatarImage src={log.avatar || 'https://github.com/shadcn.png'} />
                </Avatar>
                <span className="text-sm text-gray-400">{log.staff}</span>
              </div>
            </TableCell>
            <TableCell className="text-sm text-gray-400">{log.action}</TableCell>
            <TableCell className="text-sm text-gray-400">{item.reservationId}</TableCell>
            <TableCell className="text-sm text-gray-400">{log.date}</TableCell>
          </TableRow>
        ))}
    </>
  );
};

export default StaffLogTableRow;