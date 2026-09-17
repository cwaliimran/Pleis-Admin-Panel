import { FC } from 'react';
import { SETTLEMENT_CONFIG, STATUS_CONFIG } from '../../config/config';
import { CancelReason, Order, SettlementStatus } from '../../types/types';

const CANCEL_REASON_LABEL: Record<CancelReason, string> = {
  item_out_of_stock: 'item_out_of_stock',
  venue_busy_or_closing: 'venue_busy_or_closing',
  customer_request: 'customer_request',
  customer_not_found_at_table: 'customer_not_found_at_table',
  other: 'other',
};

export const OrderStatusCell: FC<Pick<Order, 'status' | 'cancelReason' | 'customerNotified'>> = ({ status, cancelReason, customerNotified }) => (
  <div className="max-w-40">
    <p className={`text-sm font-semibold capitalize ${STATUS_CONFIG[status].className}`}>{status}</p>
    {cancelReason && (
      <p className="flex flex-wrap items-center gap-1 text-xs whitespace-normal text-gray-500 dark:text-gray-400">
        {CANCEL_REASON_LABEL[cancelReason]}
        {customerNotified === true && ' · notified'}
        {customerNotified === false && (
          <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-semibold text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">
            customer not notified
          </span>
        )}
      </p>
    )}
  </div>
);

export const SettlementCell: FC<{ status: SettlementStatus }> = ({ status }) => {
  if (!status) {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">–</span>
    );
  }
  const config = SETTLEMENT_CONFIG[status];
  return <span className={`text-xs font-semibold tracking-wide uppercase ${config.className}`}>{status}</span>;
};
