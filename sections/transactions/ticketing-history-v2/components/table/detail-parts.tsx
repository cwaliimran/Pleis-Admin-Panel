import { Button } from '@/components/ui/button';
import { FC, ReactNode } from 'react';
import { ScanAttempt, TicketDocument } from '../../types/types';

export const SectionHeading: FC<{ title: string }> = ({ title }) => (
  <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">{title}</p>
);

export const InfoLine: FC<{ label: string; value?: ReactNode }> = ({ label, value }) => {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-2 last:border-0 dark:border-gray-800">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-right text-sm font-medium text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  );
};

export const DocumentCard: FC<{ document: TicketDocument; onView: () => void; onDownload: () => void }> = ({ document, onView, onDownload }) => (
  <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gray-100 text-[10px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
        {document.code}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{document.label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{document.subtitle}</p>
      </div>
    </div>
    <div className="flex shrink-0 items-center gap-2">
      <Button variant="outline" size="sm" onClick={onView}>
        View
      </Button>
      <Button variant="outline" size="sm" onClick={onDownload}>
        Download
      </Button>
    </div>
  </div>
);

const SCAN_RESULT_LABEL: Record<ScanAttempt['result'], string> = {
  accepted: 'Accepted',
  rejected_already_used: 'Rejected (already used)',
  rejected_max_uses_reached: 'Rejected (max uses reached)',
  rejected_expired: 'Rejected (expired)',
  rejected_invalid: 'Rejected (invalid)',
};

const SCAN_RESULT_CLASSNAME: Record<ScanAttempt['result'], string> = {
  accepted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  rejected_already_used: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  rejected_max_uses_reached: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  rejected_expired: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  rejected_invalid: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

export const ScanAttemptRow: FC<{ scan: ScanAttempt }> = ({ scan }) => (
  <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
      {scan.index}
    </div>
    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${SCAN_RESULT_CLASSNAME[scan.result]}`}>{SCAN_RESULT_LABEL[scan.result]}</span>
    <p className="text-sm text-gray-700 dark:text-gray-300">{scan.detail}</p>
  </div>
);
