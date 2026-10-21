'use client';

import { TruncatedTransactionModal } from '@/components/common/transaction-id-modal';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import { Ban, Download, Eye, MoreVertical } from 'lucide-react';
import { FC } from 'react';
import { CategoryTypeCell, DocumentBadges, FiscalizationCell, SettlementCell } from './cell-parts';
import { formatEuro, formatPercent } from '../../forms/format';
import { Transaction } from '../../types/types';

interface TransactionHistoryTableRowProps {
  item: Transaction;
  onView: (item: Transaction) => void;
  onDownloadDocuments: (item: Transaction) => void;
  onExclude: (item: Transaction) => void;
}

const TransactionHistoryTableRow: FC<TransactionHistoryTableRowProps> = ({ item, onView, onDownloadDocuments, onExclude }) => {
  const isGuest = !item.user;

  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell className="max-w-40 text-left whitespace-normal">
        <p className="font-medium">{isGuest ? 'Guest' : item.user!.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{isGuest ? '— no account' : item.user!.email}</p>
      </TableCell>

      <TableCell className="text-left">{item.organization || '—'}</TableCell>

      <TableCell className="text-left">
        <p className="font-medium">{item.transactionId}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          <TruncatedTransactionModal text={item.reference} maxLength={22} title="Transaction Reference" />
        </p>
      </TableCell>

      <TableCell className="text-left">
        <CategoryTypeCell category={item.category} subtype={item.subtype} status={item.status} />
      </TableCell>

      <TableCell className="max-w-40 text-left whitespace-normal">
        <p className="font-medium">{formatEuro(item.amount)}</p>
        {item.amountNote && <p className="text-xs text-gray-500 dark:text-gray-400">{item.amountNote}</p>}
      </TableCell>

      <TableCell className="text-left">
        <p className="font-medium">{formatPercent(item.commissionRate)}</p>
        {item.commissionAmount !== null && <p className="text-xs text-gray-500 dark:text-gray-400">{formatEuro(item.commissionAmount)}</p>}
      </TableCell>

      <TableCell className="text-left">{formatEuro(item.organizerNet)}</TableCell>

      <TableCell className="max-w-35 text-left whitespace-normal">
        <p className="font-medium">{formatEuro(item.pleisNet)}</p>
        {item.pleisNetNote && <p className="text-xs text-gray-500 dark:text-gray-400">{item.pleisNetNote}</p>}
      </TableCell>

      <TableCell className="max-w-40 text-left whitespace-normal">
        <p>{item.paymentMethod || '—'}</p>
        {item.paymentSubNote && <p className="text-xs text-gray-500 dark:text-gray-400">{item.paymentSubNote}</p>}
      </TableCell>

      <TableCell className="max-w-55 text-left whitespace-normal">
        <SettlementCell status={item.settlementStatus} note={item.settlementNote} />
      </TableCell>

      <TableCell className="text-left whitespace-normal">
        <FiscalizationCell status={item.fiscalizationStatus} />
      </TableCell>

      <TableCell className="max-w-32 text-left whitespace-normal">
        <DocumentBadges documents={item.documents} />
      </TableCell>

      <TableCell className="text-left">{item.capturedAt || '—'}</TableCell>

      <TableCell>
        <div className="flex items-center justify-center gap-1">
          <button
            title="View details"
            type="button"
            onClick={() => onView(item)}
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Eye className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(item)}>
                <Eye />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownloadDocuments(item)}>
                <Download />
                Download documents
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" disabled={item.settlementStatus === 'EXCLUDED'} onClick={() => onExclude(item)}>
                <Ban />
                Exclude from payout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TransactionHistoryTableRow;
