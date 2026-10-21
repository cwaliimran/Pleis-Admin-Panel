import { Button } from '@/components/ui/button';
import { FC, ReactNode } from 'react';
import { OrderDocument } from '../../types/types';

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

export const DocumentCard: FC<{ document: OrderDocument; onView: () => void; onDownload: () => void }> = ({ document, onView, onDownload }) => (
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
