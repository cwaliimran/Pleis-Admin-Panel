'use client';

import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { showSuccess } from '@/utils/toast';
import { CreditCard, Download } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { FilterValues, getDefaultFilterValues, matchesAdvancedFilters } from './advanced-filters';
import ExcludeTransactionModal from './components/modals/exclude-transaction-modal';
import TransactionDetailModal from './components/modals/transaction-detail-modal';
import TransactionStatCard from './components/stats/transaction-stat-card';
import TransactionHistoryTable from './components/table/transaction-history-table';
import { matchesSearch, PresetId, PRESET_OPTIONS } from './components/filters/filters';
import { ALL_MOCK_TRANSACTIONS, MOCK_PAGE_SIZE, MOCK_PAYOUTS_BATCHES_COUNT, MOCK_STATS } from './data/mock-data';
import { Transaction } from './types/types';

interface TransactionHistoryViewProps {
  payoutsBatchesHref?: string;
}

const TransactionHistoryView = ({ payoutsBatchesHref = '/super-admin/payouts-batches' }: TransactionHistoryViewProps) => {
  const [page, setPage] = useState(1);
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactionToExclude, setTransactionToExclude] = useState<Transaction | null>(null);

  const [dateBasis, setDateBasis] = useState('captured_at');
  const [period, setPeriod] = useState('last_30_days');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [activePreset, setActivePreset] = useState<PresetId | null>(null);
  const [advancedFilters, setAdvancedFilters] = useState<FilterValues>(getDefaultFilterValues);

  const detailModal = useBoolean();
  const excludeModal = useBoolean();

  const filteredData = useMemo(() => {
    const preset = activePreset ? PRESET_OPTIONS.find((option) => option.id === activePreset) : undefined;

    return ALL_MOCK_TRANSACTIONS.map((row) => (excludedIds.has(row.id) ? { ...row, settlementStatus: 'EXCLUDED' as const } : row))
      .filter((row) => matchesSearch(row, search))
      .filter((row) => !preset || preset.predicate(row))
      .filter((row) => matchesAdvancedFilters(row, advancedFilters));
  }, [search, activePreset, excludedIds, advancedFilters]);

  const totalRecords = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / MOCK_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const data = filteredData.slice((currentPage - 1) * MOCK_PAGE_SIZE, currentPage * MOCK_PAGE_SIZE);

  const handlePresetChange = (preset: PresetId | null) => {
    setActivePreset(preset);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCustomDateChange = (start: Date | undefined, end: Date | undefined) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    setPage(1);
  };

  const handleApplyAdvancedFilters = (values: FilterValues) => {
    setAdvancedFilters(values);
    setPage(1);
  };

  const handleClearAdvancedFilters = () => {
    setAdvancedFilters(getDefaultFilterValues());
    setPage(1);
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
    if (!item.documents.length) {
      showSuccess('No documents available for this transaction');
      return;
    }
    showSuccess(`Downloading ${item.documents.length} document(s) for ${item.transactionId}`);
  };

  const handleRequestExclude = (item: Transaction) => {
    setTransactionToExclude(item);
    excludeModal.onTrue();
  };

  const handleCloseExclude = () => {
    excludeModal.onFalse();
    setTransactionToExclude(null);
  };

  const handleConfirmExclude = (item: Transaction, reason: string) => {
    setExcludedIds((prev) => new Set(prev).add(item.id));
    showSuccess(`Transaction ${item.transactionId} excluded from payout · ${reason}`);
    handleCloseExclude();
  };

  return (
    <div>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transaction list</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
            One row per transaction, every module — the only page that shows subscription payments. Settlement runs from the Payouts & batches screen.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href={payoutsBatchesHref}>
              <CreditCard className="h-4 w-4" />
              Payouts & batches
              <span className="bg-primary text-primary-foreground ml-1 rounded-full px-2 py-0.5 text-xs font-semibold">{MOCK_PAYOUTS_BATCHES_COUNT}</span>
            </Link>
          </Button>

          <Button variant="default" className="bg-primary flex items-center gap-2 text-white" onClick={() => showSuccess('Exporting transactions to CSV')}>
            <Download className="h-4 w-4" />
            Export to CSV
          </Button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-x-4 md:gap-y-4 lg:grid-cols-4">
        {MOCK_STATS.map((stat) => (
          <TransactionStatCard key={stat.key} stat={stat} />
        ))}
      </div>

      <TransactionHistoryTable
        data={data}
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        shownCount={data.length}
        onPageChange={setPage}
        onView={handleView}
        onDownloadDocuments={handleDownloadDocuments}
        onExclude={handleRequestExclude}
        dateBasis={dateBasis}
        onDateBasisChange={setDateBasis}
        period={period}
        onPeriodChange={setPeriod}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        onCustomDateChange={handleCustomDateChange}
        search={search}
        onSearchChange={handleSearchChange}
        activePreset={activePreset}
        onPresetChange={handlePresetChange}
        advancedFilters={advancedFilters}
        onApplyAdvancedFilters={handleApplyAdvancedFilters}
        onClearAdvancedFilters={handleClearAdvancedFilters}
      />

      <TransactionDetailModal open={detailModal.value} onClose={handleCloseDetail} transaction={selectedTransaction} />

      <ExcludeTransactionModal open={excludeModal.value} transaction={transactionToExclude} onClose={handleCloseExclude} onConfirm={handleConfirmExclude} />
    </div>
  );
};

export default TransactionHistoryView;
