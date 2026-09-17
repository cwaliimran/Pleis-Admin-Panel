'use client';

import TableHeadCustom from '@/components/table/table-head-custom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { showSuccess } from '@/utils/toast';
import { FC } from 'react';
import { formatEuro } from '../../forms/format';
import { OffAppBatch } from '../../types/types';

const HEAD_LABEL = [
  { id: 'batch', label: 'Batch', align: 'left' },
  { id: 'period', label: 'Period', align: 'left' },
  { id: 'generated', label: 'Generated', align: 'left' },
  { id: 'orders', label: 'Orders', align: 'left' },
  { id: 'offAppOrderValue', label: 'Off-app order value', align: 'left' },
  { id: 'pleisCommission', label: 'Pleis commission', align: 'left' },
  { id: 'lines', label: 'Lines', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'actions', label: 'Actions', align: 'right' },
];

const STATUS_CLASSNAME: Record<OffAppBatch['status'], string> = {
  PENDING: 'text-amber-500',
  CONFIRMED: 'text-green-600 dark:text-green-400',
  CANCELLED: 'text-red-500',
};

interface OffAppBatchesTableProps {
  data: OffAppBatch[];
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
}

const OffAppBatchesTable: FC<OffAppBatchesTableProps> = ({ data, onConfirm, onCancel }) => (
  <div className="min-h-[30vh] rounded-lg border">
    <Table className="w-full rounded-md border">
      <TableHeadCustom headLabel={HEAD_LABEL} />

      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={HEAD_LABEL.length} className="h-[30vh] text-center align-middle">
              No off-app batches yet
            </TableCell>
          </TableRow>
        ) : (
          data.map((batch) => (
            <TableRow key={batch.id} className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
              <TableCell className="text-left font-medium">{batch.code}</TableCell>
              <TableCell className="text-left">
                {batch.periodStart} – {batch.periodEnd}
              </TableCell>
              <TableCell className="text-left">
                <p>{batch.generatedAt}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">by {batch.generatedBy}</p>
              </TableCell>
              <TableCell className="text-left">{batch.ordersCount}</TableCell>
              <TableCell className="text-left font-medium">{formatEuro(batch.offAppOrderValue)}</TableCell>
              <TableCell className="text-left font-medium">{formatEuro(batch.pleisCommission)}</TableCell>
              <TableCell className="text-left">{batch.linesCount}</TableCell>
              <TableCell className="text-left">
                <p className={`text-sm font-semibold ${STATUS_CLASSNAME[batch.status]}`}>{batch.status}</p>
                {batch.confirmedAt && <p className="text-xs text-gray-500 dark:text-gray-400">confirmed {batch.confirmedAt} · permanently logged</p>}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {batch.status === 'PENDING' ? (
                    <>
                      <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => onConfirm(batch.id)}>
                        Confirm
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => onCancel(batch.id)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => showSuccess(`Opening verification report for ${batch.code}`)}>
                      Verification report
                    </Button>
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

export default OffAppBatchesTable;
