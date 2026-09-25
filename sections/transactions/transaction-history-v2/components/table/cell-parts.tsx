import { FC } from 'react';
import { CATEGORY_CONFIG, DOCUMENT_LABEL, FISCALIZATION_CONFIG, SETTLEMENT_CONFIG } from '../../config/config';
import { DocumentCode, FiscalizationStatus, SettlementStatus, TransactionCategory } from '../../types/types';

export const CategoryTypeCell: FC<{ category: TransactionCategory; subtype: string; status: string }> = ({ category, subtype, status }) => {
  const config = CATEGORY_CONFIG[category];
  return (
    <div>
      <div className="flex items-center gap-2 font-medium">
        <span className={`h-2 w-2 rounded-full ${config.dotClassName}`} />
        {config.label}
      </div>
      <p className="max-w-45 text-xs whitespace-normal text-gray-500 dark:text-gray-400">
        {subtype} · <span className="font-medium">{status}</span>
      </p>
    </div>
  );
};

export const SettlementCell: FC<{ status: SettlementStatus; note?: string }> = ({ status, note }) => {
  if (!status) return <span className="text-gray-400">—</span>;
  const config = SETTLEMENT_CONFIG[status];
  return (
    <div>
      <p className={`text-xs font-semibold tracking-wide uppercase ${config.className}`}>{status}</p>
      {note && <p className="mt-0.5 max-w-55 text-xs whitespace-normal text-gray-500 dark:text-gray-400">{note}</p>}
    </div>
  );
};

export const FiscalizationCell: FC<{ status: FiscalizationStatus }> = ({ status }) => {
  if (!status) return <span className="text-gray-400">—</span>;
  const config = FISCALIZATION_CONFIG[status];
  return <p className={`text-xs font-semibold tracking-wide uppercase ${config.className}`}>{status}</p>;
};

export const DocumentBadges: FC<{ documents: DocumentCode[] }> = ({ documents }) => {
  if (!documents.length) return <span className="text-gray-400">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {documents.map((code, idx) => (
        <span
          key={`${code}-${idx}`}
          className="rounded-md border border-gray-300 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 dark:border-gray-600 dark:text-gray-300"
        >
          {DOCUMENT_LABEL[code]}
        </span>
      ))}
    </div>
  );
};
