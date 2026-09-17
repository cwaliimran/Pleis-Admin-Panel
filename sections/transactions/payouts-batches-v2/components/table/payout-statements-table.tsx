'use client';

import TableHeadCustom from '@/components/table/table-head-custom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { showSuccess } from '@/utils/toast';
import { FC } from 'react';
import { formatEuro } from '../../forms/format';
import { PayoutStatement } from '../../types/types';

const HEAD_LABEL = [
  { id: 'statement', label: 'Statement', align: 'left' },
  { id: 'period', label: 'Period', align: 'left' },
  { id: 'generated', label: 'Generated', align: 'left' },
  { id: 'transactions', label: 'Transactions', align: 'left' },
  { id: 'lines', label: 'Lines', align: 'left' },
  { id: 'organizerTotal', label: 'Organizer total', align: 'left' },
  { id: 'commission', label: 'Commission', align: 'left' },
  { id: 'controlSum', label: 'Control sum', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'actions', label: '', align: 'right' },
];

const STATUS_CLASSNAME: Record<PayoutStatement['status'], string> = {
  PENDING: 'text-amber-500',
  PAID: 'text-green-600 dark:text-green-400',
  CANCELLED: 'text-red-500',
};

interface PayoutStatementsTableProps {
  data: PayoutStatement[];
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
}

const PayoutStatementsTable: FC<PayoutStatementsTableProps> = ({ data, onConfirm, onCancel }) => (
  <div className="min-h-[30vh] rounded-lg border">
    <Table className="w-full rounded-md border">
      <TableHeadCustom headLabel={HEAD_LABEL} />

      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={HEAD_LABEL.length} className="h-[30vh] text-center align-middle">
              No payout statements yet
            </TableCell>
          </TableRow>
        ) : (
          data.map((statement) => (
            <TableRow key={statement.id} className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
              <TableCell className="text-left">
                <p className="font-medium">{statement.code}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {statement.fileName} · MsgId {statement.msgId}
                </p>
              </TableCell>
              <TableCell className="text-left">
                {statement.periodStart} – {statement.periodEnd}
              </TableCell>
              <TableCell className="text-left">
                <p>{statement.generatedAt}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">by {statement.generatedBy}</p>
              </TableCell>
              <TableCell className="text-left">{statement.transactionsCount}</TableCell>
              <TableCell className="text-left">
                <p>{statement.linesCount}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{statement.linesNote}</p>
              </TableCell>
              <TableCell className="text-left font-medium">{formatEuro(statement.organizerTotal)}</TableCell>
              <TableCell className="text-left font-medium">{formatEuro(statement.commission)}</TableCell>
              <TableCell className="text-left font-medium">{formatEuro(statement.controlSum)}</TableCell>
              <TableCell className="text-left">
                <p className={`text-sm font-semibold ${STATUS_CLASSNAME[statement.status]}`}>{statement.status}</p>
                {statement.confirmedAt && <p className="text-xs text-gray-500 dark:text-gray-400">confirmed {statement.confirmedAt}</p>}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => showSuccess(`Downloading ${statement.fileName}`)}>
                    pain.001
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => showSuccess(`Viewing lines for ${statement.code}`)}>
                    Lines
                  </Button>
                  {statement.status === 'PENDING' && (
                    <>
                      <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => onConfirm(statement.id)}>
                        Confirm
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => onCancel(statement.id)}>
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
);

export default PayoutStatementsTable;
