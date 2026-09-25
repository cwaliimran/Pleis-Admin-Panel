'use client';

import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { showSuccess } from '@/utils/toast';
import { Download } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FilterValues, getDefaultFilterValues, matchesAdvancedFilters } from './advanced-filters';
import TicketDetailModal from './components/modals/ticket-detail-modal';
import TicketingHistoryTable from './components/table/ticketing-history-table';
import { matchesSearch, PresetId, PRESET_OPTIONS } from './components/filters/filters';
import { ALL_MOCK_TICKETS, ALL_MOCK_TICKETS_WITH_SUPERSEDED, MOCK_PAGE_SIZE } from './data/mock-data';
import { Ticket } from './types/types';

const TicketingHistoryView = () => {
  const [page, setPage] = useState(1);
  const [latestStateOnly, setLatestStateOnly] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const [dateBasis, setDateBasis] = useState('created_at');
  const [period, setPeriod] = useState('last_30_days');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [activePreset, setActivePreset] = useState<PresetId | null>(null);
  const [advancedFilters, setAdvancedFilters] = useState<FilterValues>(getDefaultFilterValues);

  const detailModal = useBoolean();

  const filteredData = useMemo(() => {
    const preset = activePreset ? PRESET_OPTIONS.find((option) => option.id === activePreset) : undefined;
    const source = latestStateOnly ? ALL_MOCK_TICKETS : ALL_MOCK_TICKETS_WITH_SUPERSEDED;

    return source
      .filter((ticket) => matchesSearch(ticket, search))
      .filter((ticket) => !preset || preset.predicate(ticket))
      .filter((ticket) => matchesAdvancedFilters(ticket, advancedFilters));
  }, [search, activePreset, advancedFilters, latestStateOnly]);

  const totalRecords = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / MOCK_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const data = filteredData.slice((currentPage - 1) * MOCK_PAGE_SIZE, currentPage * MOCK_PAGE_SIZE);

  const handleLatestStateOnlyChange = (value: boolean) => {
    setLatestStateOnly(value);
    setPage(1);
  };

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

  const handleView = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    detailModal.onTrue();
  };

  const handleCloseDetail = () => {
    detailModal.onFalse();
    setSelectedTicket(null);
  };

  return (
    <div>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Ticketing history</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
            One row per ticket state — a gift or transfer writes a new row that supersedes the old one. Gift rows carry no transaction and no price.
          </p>
        </div>

        <Button variant="default" className="bg-primary flex items-center gap-2 text-white" onClick={() => showSuccess('Exporting ticketing history to CSV')}>
          <Download className="h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      <TicketingHistoryTable
        data={data}
        currentPage={currentPage}
        totalPages={totalPages}
        shownCount={data.length}
        latestStateOnly={latestStateOnly}
        onLatestStateOnlyChange={handleLatestStateOnlyChange}
        onPageChange={setPage}
        onView={handleView}
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

      <TicketDetailModal open={detailModal.value} onClose={handleCloseDetail} ticket={selectedTicket} />
    </div>
  );
};

export default TicketingHistoryView;
