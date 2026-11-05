import { FC } from 'react';
import { CONDITION_CONFIG, RESERVATION_TYPE_CONFIG, SETTLEMENT_CONFIG, STATUS_CONFIG, VOUCHER_STATUS_CONFIG } from '../../config/config';
import { formatEuro } from '../../forms/format';
import { ReservationCondition, ReservationStatus, ReservationTypeCategory, ReservationVoucher, SettlementStatus } from '../../types/types';

export const ReservationTypeCell: FC<{ typeCategory: ReservationTypeCategory; typeLabel: string }> = ({ typeCategory, typeLabel }) => {
  const config = RESERVATION_TYPE_CONFIG[typeCategory];
  return (
    <div className="flex items-center gap-2 font-medium">
      <span className={`h-2 w-2 rounded-full ${config.dotClassName}`} />
      {typeLabel}
    </div>
  );
};

export const ConditionCell: FC<{ condition: ReservationCondition }> = ({ condition }) => {
  const config = CONDITION_CONFIG[condition];
  return <span className={`rounded-full border px-3 py-1 text-xs font-medium ${config.className}`}>{config.label}</span>;
};

export const StatusCell: FC<{ status: ReservationStatus }> = ({ status }) => (
  <span className={`text-sm font-semibold capitalize ${STATUS_CONFIG[status].className}`}>{status}</span>
);

export const VoucherCell: FC<{ voucher: ReservationVoucher | null }> = ({ voucher }) => {
  if (!voucher) return <span className="text-gray-400">—</span>;
  return (
    <div className="max-w-52">
      <p className="font-medium">{voucher.code}</p>
      <p className={`text-xs font-semibold tracking-wide uppercase ${VOUCHER_STATUS_CONFIG[voucher.status].className}`}>{voucher.status}</p>
      <p className="text-xs whitespace-normal text-gray-500 dark:text-gray-400">
        {formatEuro(voucher.balance)} / {formatEuro(voucher.prepaidAmount)}
        {voucher.validUntil && ` · ${voucher.validUntil}`}
      </p>
    </div>
  );
};

export const SettlementCell: FC<{ status: SettlementStatus }> = ({ status }) => {
  if (!status) return <span className="text-gray-400">—</span>;
  const config = SETTLEMENT_CONFIG[status];
  return <p className={`text-xs font-semibold tracking-wide uppercase ${config.className}`}>{config.label}</p>;
};
