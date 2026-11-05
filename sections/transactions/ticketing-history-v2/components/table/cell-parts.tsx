import { FC } from 'react';
import { SETTLEMENT_CONFIG, STATUS_CONFIG, TICKET_TYPE_CONFIG } from '../../config/config';
import { ResaleProtection, SettlementStatus, Ticket, TicketStatus } from '../../types/types';

const RESALE_PROTECTION_LABEL: Record<ResaleProtection, string | null> = {
  none: null,
  name: 'Resale protection: name',
  name_oib: 'Resale protection: name_oib',
};

export const TicketTypeCell: FC<Pick<Ticket, 'ticketTypeCategory' | 'ticketTypeLabel' | 'usageNote' | 'resaleProtection' | 'holderDataMissing'>> = ({
  ticketTypeCategory,
  ticketTypeLabel,
  usageNote,
  resaleProtection,
  holderDataMissing,
}) => {
  const config = TICKET_TYPE_CONFIG[ticketTypeCategory];
  const resaleLabel = RESALE_PROTECTION_LABEL[resaleProtection];

  return (
    <div className="max-w-45">
      <div className="flex items-center gap-2 font-medium">
        <span className={`h-2 w-2 rounded-full ${config.dotClassName}`} />
        {ticketTypeLabel}
      </div>
      {usageNote && <p className="text-xs whitespace-normal text-gray-500 dark:text-gray-400">{usageNote}</p>}
      {resaleLabel && (
        <p className="flex flex-wrap items-center gap-1 text-xs whitespace-normal text-gray-500 dark:text-gray-400">
          {resaleLabel}
          {holderDataMissing && (
            <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-semibold text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">
              holder data missing
            </span>
          )}
        </p>
      )}
    </div>
  );
};

export const StatusCell: FC<{ status: TicketStatus }> = ({ status }) => (
  <span className={`text-sm font-semibold capitalize ${STATUS_CONFIG[status].className}`}>{status}</span>
);

export const SettlementCell: FC<{ status: SettlementStatus; note?: string }> = ({ status, note }) => {
  if (!status) return <span className="text-gray-400">—</span>;
  const config = SETTLEMENT_CONFIG[status];
  return (
    <div className="max-w-40">
      <p className={`text-xs font-semibold tracking-wide uppercase ${config.className}`}>{config.label}</p>
      {note && <p className="mt-0.5 text-xs whitespace-normal text-gray-500 dark:text-gray-400">{note}</p>}
    </div>
  );
};
