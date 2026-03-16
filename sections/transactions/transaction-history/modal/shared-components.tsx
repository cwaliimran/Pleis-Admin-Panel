import { Badge } from '@/components/ui/badge';
import CustomBadge from '@/components/ui/custom-badge';
import { fDate } from '@/utils/format-time';
import { Building2, Calendar, CreditCard, Globe, Mail, Phone, User } from 'lucide-react';
import { FC, ReactNode } from 'react';
import { CompanyOrganizerInfo, OrganizationInfo, TransactionDetailBase, UserInfo } from './types';

// ─── Section Wrapper ────────────────────────────────────────────

export const Section: FC<{ title: string; icon?: ReactNode; children: ReactNode; className?: string }> = ({
  title,
  icon,
  children,
  className = '',
}) => (
  <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/50 ${className}`}>
    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
      {icon}
      {title}
    </h4>
    {children}
  </div>
);

// ─── Info Row ───────────────────────────────────────────────────

export const InfoRow: FC<{ label: string; value?: ReactNode; className?: string }> = ({ label, value, className = '' }) => {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className={`flex items-start justify-between gap-4 py-1.5 ${className}`}>
      <span className="min-w-[120px] shrink-0 text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-right text-xs text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  );
};

// ─── Payment Status Badge (reused across all types) ─────────────

export const PaymentStatusBadge: FC<{ status: string }> = ({ status }) => (
  <CustomBadge
    variant={status === 'paid' ? 'success' : status === 'pending' ? 'warning' : status === 'failed' || status === 'refunded' ? 'error' : 'default'}
  >
    {status || 'N/A'}
  </CustomBadge>
);

// ─── Order Type Label ───────────────────────────────────────────

export const getOrderTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    menuorders: 'Menu Orders',
    userreservations: 'User Reservations',
    ticketingbookings: 'Ticketing Bookings',
    tickettransfer: 'Ticket Transfer',
  };
  return map[type] || type;
};

export const OrderTypeBadge: FC<{ type: string }> = ({ type }) => {
  const colorMap: Record<string, string> = {
    menuorders: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    userreservations: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    ticketingbookings: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    tickettransfer: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorMap[type] || 'bg-gray-100 text-gray-700'}`}>
      {getOrderTypeLabel(type)}
    </span>
  );
};

// ─── Transaction Summary Header ─────────────────────────────────

export const TransactionSummaryHeader: FC<{ data: TransactionDetailBase }> = ({ data }) => (
  <div className="rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-4 dark:border-gray-700 dark:from-gray-900 dark:to-gray-800">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <OrderTypeBadge type={data.orderType} />
          <PaymentStatusBadge status={data.paymentStatus} />
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Transaction ID: {data.transactionId}</p>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {data.payload?.transaction?.currency === 'EUR' ? '€' : data.payload?.transaction?.currency || '€'}
          {Number(data.amount).toFixed(2)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{fDate(data.createdAt, 'DD/MM/YYYY HH:mm')}</p>
      </div>
    </div>
  </div>
);

// ─── User Info Card ─────────────────────────────────────────────

export const UserInfoCard: FC<{ user: UserInfo; label?: string }> = ({ user, label = 'Customer' }) => (
  <Section title={label} icon={<User className="h-4 w-4 text-gray-500" />}>
    <div className="flex items-center gap-3">
      {user?.profileIcon ? (
        <img src={user.profileIcon} alt={user.firstName} className="h-10 w-10 rounded-full border object-cover" />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {user?.firstName?.[0]}
          {user?.lastName?.[0]}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
          {user?.firstName} {user?.lastName}
        </p>
        {user?.username && <p className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</p>}
      </div>
    </div>
    <div className="mt-2 space-y-1 border-t pt-2 dark:border-gray-700">
      <InfoRow label="Email" value={user?.email} />
    </div>
  </Section>
);

// ─── Organization Info Card ─────────────────────────────────────

export const OrganizationInfoCard: FC<{ organization: OrganizationInfo }> = ({ organization }) => {
  const info = organization?.basicInfo;
  return (
    <Section title="Organization" icon={<Building2 className="h-4 w-4 text-gray-500" />}>
      <div className="flex items-center gap-3">
        {info?.media?.logo ? (
          <img src={info.media.logo} alt={info.name} className="h-10 w-10 rounded-lg border object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            {info?.name?.[0]}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{info?.name}</p>
          {info?.website && (
            <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Globe className="h-3 w-3" />
              {info.website}
            </p>
          )}
        </div>
      </div>
      {info?.phoneNumber?.number && (
        <div className="mt-2 border-t pt-2 dark:border-gray-700">
          <InfoRow
            label="Phone"
            value={
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {info.phoneNumber.code} {info.phoneNumber.number}
              </span>
            }
          />
        </div>
      )}
    </Section>
  );
};

// ─── Company Organizer Card ─────────────────────────────────────

export const CompanyOrganizerCard: FC<{ organizer: CompanyOrganizerInfo }> = ({ organizer }) => (
  <Section title="Company Organizer" icon={<User className="h-4 w-4 text-gray-500" />}>
    <div className="flex items-center gap-3">
      {organizer?.profileIcon ? (
        <img src={organizer.profileIcon} alt={organizer.firstName} className="h-10 w-10 rounded-full border object-cover" />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {organizer?.firstName?.[0]}
          {organizer?.lastName?.[0]}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
          {organizer?.firstName} {organizer?.lastName}
        </p>
        <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <Mail className="h-3 w-3" />
          {organizer?.email}
        </p>
      </div>
    </div>
  </Section>
);

// ─── Price Breakdown ────────────────────────────────────────────

interface PriceLineItem {
  label: string;
  value: number;
  isDiscount?: boolean;
  isBold?: boolean;
}

export const PriceBreakdown: FC<{ items: PriceLineItem[]; currency?: string }> = ({ items, currency = '€' }) => (
  <div className="space-y-1.5">
    {items.map((item, idx) => (
      <div key={idx} className={`flex items-center justify-between ${item.isBold ? 'border-t pt-2 dark:border-gray-600' : ''}`}>
        <span className={`text-xs ${item.isBold ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
          {item.label}
        </span>
        <span
          className={`text-xs ${
            item.isDiscount ? 'text-red-500' : item.isBold ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {item.isDiscount ? '-' : ''}
          {currency}
          {Math.abs(item.value).toFixed(2)}
        </span>
      </div>
    ))}
  </div>
);
