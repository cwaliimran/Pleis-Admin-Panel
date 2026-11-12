'use client';

import { Button } from '@/components/ui/button';
import { CurrentUrl } from '@/constant/constant';
import { useBoolean } from '@/hooks/useBoolean';
import { API_ROUTES } from '@/store/apiRoutes';
import { useExcludeLedgerEntryMutation, useGetTransactionLedgerQuery } from '@/store/Reducer/loyalty-transactions-api';
import { RootState } from '@/store/store';
import { showError, showSuccess } from '@/utils/toast';
import { CreditCard, Download } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { FilterValues, getDefaultFilterValues } from './advanced-filters';
import ExcludeTransactionModal from './components/modals/exclude-transaction-modal';
import TransactionDetailModal from './components/modals/transaction-detail-modal';
import TransactionStatCard from './components/stats/transaction-stat-card';
import TransactionHistoryTable from './components/table/transaction-history-table';
import { formatEuro } from './forms/format';
import { Transaction, TransactionStat } from './types/types';

interface TransactionHistoryViewProps {
  payoutsBatchesHref?: string;
  /** Organizer visibility (#8): own company only, no superadmin figures or actions. */
  isOrganizer?: boolean;
}

const PAGE_SIZE = 25;

// Advanced-filter values (Logging Schema v11.2 names) → stored ledger values.
const PAYMENT_METHOD_PARAM: Record<string, string> = {
  card: 'card',
  apple_pay: 'applePay',
  google_pay: 'googlePay',
  cash: 'cash',
  organizer_pos: 'cardTerminal',
  organizer_other: 'other',
  voucher: 'voucher',
};
const TRACK_PARAM: Record<string, string> = { payout: 'pleis', offapp: 'offapp' };
const PAYOUT_STATUS_PARAM: Record<string, string> = { HELD: 'HELD', PENDING: 'PENDING', SETTLED: 'PAID', PAID: 'PAID', EXCLUDED: 'EXCLUDED' };

const asArray = (value: unknown): string[] => (Array.isArray(value) ? value.map(String) : value ? [String(value)] : []);
const joinMapped = (value: unknown, map?: Record<string, string>) =>
  asArray(value)
    .map((v) => (map ? map[v] : v))
    .filter(Boolean)
    .join(',') || undefined;

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};
const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/** From / To for the period chip; the server compares in UTC, inclusive on both ends. */
const resolveRange = (period: string, customStart?: Date, customEnd?: Date): { from?: string; to?: string } => {
  const now = new Date();
  const today = startOfDay(now);
  const iso = (d?: Date) => d?.toISOString();
  switch (period) {
    case 'current_working_day':
      return { from: iso(today), to: iso(now) };
    case 'yesterday':
      return { from: iso(addDays(today, -1)), to: iso(new Date(today.getTime() - 1)) };
    case 'last_7_days':
      return { from: iso(addDays(today, -6)), to: iso(now) };
    case 'this_month':
      return { from: iso(new Date(now.getFullYear(), now.getMonth(), 1)), to: iso(now) };
    case 'last_month':
      return {
        from: iso(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
        to: iso(new Date(new Date(now.getFullYear(), now.getMonth(), 1).getTime() - 1)),
      };
    case 'custom_range':
      return {
        from: iso(customStart ? startOfDay(customStart) : undefined),
        to: iso(customEnd ? new Date(startOfDay(customEnd).getTime() + 86_399_999) : undefined),
      };
    default:
      return { from: iso(addDays(today, -29)), to: iso(now) };
  }
};

const TransactionHistoryView = ({ payoutsBatchesHref = '/super-admin/payouts-batches', isOrganizer = false }: TransactionHistoryViewProps) => {
  const { user } = useSelector((state: RootState) => state.userSlice);
  const [page, setPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactionToExclude, setTransactionToExclude] = useState<Transaction | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const [dateBasis, setDateBasis] = useState('captured_at');
  const [period, setPeriod] = useState('last_30_days');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState<FilterValues>(getDefaultFilterValues);

  const detailModal = useBoolean();
  const excludeModal = useBoolean();
  const [excludeLedgerEntry] = useExcludeLedgerEntryMutation();

  const queryParams = useMemo(() => {
    const range = resolveRange(period, customStartDate, customEndDate);
    const values = advancedFilters as Record<string, unknown>;
    const keyword = [search, values.transactionId, values.customer, values.email]
      .map((v) => (typeof v === 'string' ? v.trim() : ''))
      .find(Boolean);
    return {
      dateBasis,
      from: range.from,
      to: range.to,
      keyword,
      module: joinMapped(values.module),
      paymentMethod: joinMapped(values.paymentMethod, PAYMENT_METHOD_PARAM),
      track: joinMapped(values.settlementTrack, TRACK_PARAM),
      payoutStatus: joinMapped(values.settlementStatus, PAYOUT_STATUS_PARAM),
      fiscalizationStatus: joinMapped(values.fiscalizationStatus),
    };
  }, [dateBasis, period, customStartDate, customEndDate, search, advancedFilters]);

  const { data, isFetching, refetch } = useGetTransactionLedgerQuery({ isAdmin: !isOrganizer, page, limit: PAGE_SIZE, ...queryParams });

  const rows: Transaction[] = data?.rows ?? [];
  const totalRecords: number = data?.meta?.total ?? 0;
  const totalPages: number = data?.meta?.totalPages ?? 1;
  const stats = data?.stats ?? {};

  const statCards: TransactionStat[] = [
    { key: 'count', title: 'Transactions', value: String(stats.count ?? 0), raise: '' },
    { key: 'gross', title: 'Gross', value: formatEuro(stats.gross ?? 0), raise: '' },
    { key: 'commission', title: 'Commission', value: formatEuro(stats.commission ?? 0), raise: '' },
    { key: 'organizerNet', title: 'Organizer payout', value: formatEuro(stats.organizerNet ?? 0), raise: '' },
    ...(isOrganizer
      ? []
      : [
          { key: 'serviceFee', title: 'Service fee', value: formatEuro(stats.serviceFee ?? 0), raise: '' },
          { key: 'pleisNet', title: 'Pleis net', value: formatEuro(stats.pleisNet ?? 0), raise: '' },
        ]),
  ];

  const resetPage = () => setPage(1);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const params = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
      const base = (CurrentUrl || '').replace(/\/+$/, '');
      const path = API_ROUTES.TRANSACTION_LEDGER_EXPORT(!isOrganizer).replace(/^\/+/, '');
      const response = await fetch(`${base}/${path}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (!response.ok) throw new Error('Failed to export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pleis-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showSuccess('CSV exported');
    } catch {
      showError('Could not export the transactions');
    } finally {
      setIsExporting(false);
    }
  };

  const handleView = (item: Transaction) => {
    setSelectedTransaction(item);
    detailModal.onTrue();
  };

  const handleCloseDetail = () => {
    detailModal.onFalse();
    setSelectedTransaction(null);
  };

  const handleDownloadDocuments = (item: Transaction) => {
    if (!item.detail.fiscalization.documents.length) {
      showSuccess('No documents available for this transaction');
      return;
    }
    handleView(item);
  };

  const handleRequestExclude = (item: Transaction) => {
    setTransactionToExclude(item);
    excludeModal.onTrue();
  };

  const handleCloseExclude = () => {
    excludeModal.onFalse();
    setTransactionToExclude(null);
  };

  const handleConfirmExclude = async (item: Transaction, reason: string) => {
    try {
      await excludeLedgerEntry({ entryId: item.ledgerEntryId || item.id, reason }).unwrap();
      showSuccess(`Transaction ${item.transactionId} excluded from payout · ${reason}`);
      handleCloseExclude();
      refetch();
    } catch (error: unknown) {
      showError((error as { data?: { message?: string } })?.data?.message || 'Could not exclude the transaction');
    }
  };

  return (
    <div>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transaction list</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
            One row per captured payment, every module, including subscription payments.
            {!isOrganizer && ' Settlement runs from the Payouts & batches screen.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isOrganizer && (
            <Button variant="outline" asChild>
              <Link href={payoutsBatchesHref}>
                <CreditCard className="h-4 w-4" />
                Payouts & batches
              </Link>
            </Button>
          )}

          <Button variant="default" className="bg-primary flex items-center gap-2 text-white" disabled={isExporting} onClick={handleExport}>
            <Download className="h-4 w-4" />
            {isExporting ? 'Exporting…' : 'Export to CSV'}
          </Button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-x-4 md:gap-y-4 lg:grid-cols-4">
        {statCards.map((stat) => (
          <TransactionStatCard key={stat.key} stat={stat} />
        ))}
      </div>

      <TransactionHistoryTable
        data={rows}
        isOrganizer={isOrganizer}
        currentPage={Math.min(page, totalPages)}
        totalPages={totalPages}
        totalRecords={totalRecords}
        shownCount={rows.length}
        onPageChange={setPage}
        onView={handleView}
        onDownloadDocuments={handleDownloadDocuments}
        onExclude={handleRequestExclude}
        dateBasis={dateBasis}
        onDateBasisChange={(value: string) => {
          setDateBasis(value);
          resetPage();
        }}
        period={period}
        onPeriodChange={(value: string) => {
          setPeriod(value);
          resetPage();
        }}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        onCustomDateChange={(start: Date | undefined, end: Date | undefined) => {
          setCustomStartDate(start);
          setCustomEndDate(end);
          resetPage();
        }}
        search={search}
        onSearchChange={(value: string) => {
          setSearch(value);
          resetPage();
        }}
        activePreset={null}
        onPresetChange={() => undefined}
        advancedFilters={advancedFilters}
        onApplyAdvancedFilters={(values: FilterValues) => {
          setAdvancedFilters(values);
          resetPage();
        }}
        onClearAdvancedFilters={() => {
          setAdvancedFilters(getDefaultFilterValues());
          resetPage();
        }}
      />

      <TransactionDetailModal open={detailModal.value} onClose={handleCloseDetail} transaction={selectedTransaction} />

      {!isOrganizer && (
        <ExcludeTransactionModal open={excludeModal.value} transaction={transactionToExclude} onClose={handleCloseExclude} onConfirm={handleConfirmExclude} />
      )}
      {isFetching && <span className="sr-only">Loading transactions</span>}
    </div>
  );
};

export default TransactionHistoryView;
