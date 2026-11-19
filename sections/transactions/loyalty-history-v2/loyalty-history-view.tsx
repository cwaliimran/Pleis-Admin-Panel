'use client';

import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { showSuccess } from '@/utils/toast';
import { Download } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FilterValues, getDefaultFilterValues, matchesAdvancedFilters } from './advanced-filters';
import LoyaltyDetailModal from './components/modals/loyalty-detail-modal';
import LoyaltyHistoryTable from './components/table/loyalty-history-table';
import { matchesSearch, PresetId, PRESET_OPTIONS } from './components/filters/filters';
import { ALL_MOCK_LOYALTY_ENTRIES, MOCK_PAGE_SIZE, MOCK_TOTAL_PAGES, MOCK_TOTAL_RECORDS } from './data/mock-data';
import { LoyaltyEntry } from './types/types';

const LoyaltyHistoryView = () => {
  const [page, setPage] = useState(1);
  const [selectedEntry, setSelectedEntry] = useState<LoyaltyEntry | null>(null);

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

    return ALL_MOCK_LOYALTY_ENTRIES.filter((entry) => matchesSearch(entry, search))
      .filter((entry) => !preset || preset.predicate(entry))
      .filter((entry) => matchesAdvancedFilters(entry, advancedFilters));
  }, [search, activePreset, advancedFilters]);

  const isFiltered = Boolean(search) || Boolean(activePreset) || filteredData.length !== ALL_MOCK_LOYALTY_ENTRIES.length;
  const totalRecords = isFiltered ? filteredData.length : MOCK_TOTAL_RECORDS;
  const totalPages = isFiltered ? Math.max(1, Math.ceil(filteredData.length / MOCK_PAGE_SIZE)) : MOCK_TOTAL_PAGES;
  const currentPage = Math.min(page, totalPages);
  const data = filteredData.slice((currentPage - 1) * MOCK_PAGE_SIZE, currentPage * MOCK_PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePresetChange = (preset: PresetId | null) => {
    setActivePreset(preset);
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

  const handleView = (entry: LoyaltyEntry) => {
    setSelectedEntry(entry);
    detailModal.onTrue();
  };

  const handleCloseDetail = () => {
    detailModal.onFalse();
    setSelectedEntry(null);
  };

  return (
    <div>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Loyalty history</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
            Every point movement, local and global, in one list. A purchase writes two paired entries — same base points, different totals. A reward
            grant can move zero points.
          </p>
        </div>

        <Button variant="default" className="bg-primary flex items-center gap-2 text-white" onClick={() => showSuccess('Exporting loyalty history to CSV')}>
          <Download className="h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      <LoyaltyHistoryTable
        data={data}
        currentPage={currentPage}
        totalPages={totalPages}
        shownCount={data.length}
        totalRecords={totalRecords}
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

      <LoyaltyDetailModal open={detailModal.value} onClose={handleCloseDetail} entry={selectedEntry} />
    </div>
  );
};

export default LoyaltyHistoryView;
