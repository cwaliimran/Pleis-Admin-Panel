'use client';

import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { showSuccess } from '@/utils/toast';
import { Download } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FilterValues, getDefaultFilterValues, matchesAdvancedFilters } from './advanced-filters';
import ReservationDetailModal from './components/modals/reservation-detail-modal';
import ReservationHistoryTable from './components/table/reservation-history-table';
import { matchesSearch, PresetId, PRESET_OPTIONS } from './components/filters/filters';
import { ALL_MOCK_RESERVATIONS, ALL_MOCK_RESERVATIONS_WITH_SUPERSEDED, MOCK_PAGE_SIZE } from './data/mock-data';
import { Reservation } from './types/types';

const ReservationHistoryView = () => {
  const [page, setPage] = useState(1);
  const [latestStateOnly, setLatestStateOnly] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const [dateBasis, setDateBasis] = useState('slot_start');
  const [period, setPeriod] = useState('current_working_day');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [activePreset, setActivePreset] = useState<PresetId | null>(null);
  const [advancedFilters, setAdvancedFilters] = useState<FilterValues>(getDefaultFilterValues);

  const detailModal = useBoolean();

  const filteredData = useMemo(() => {
    const preset = activePreset ? PRESET_OPTIONS.find((option) => option.id === activePreset) : undefined;
    const source = latestStateOnly ? ALL_MOCK_RESERVATIONS : ALL_MOCK_RESERVATIONS_WITH_SUPERSEDED;

    return source
      .filter((reservation) => matchesSearch(reservation, search))
      .filter((reservation) => !preset || preset.predicate(reservation))
      .filter((reservation) => matchesAdvancedFilters(reservation, advancedFilters));
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

  const handleView = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    detailModal.onTrue();
  };

  const handleCloseDetail = () => {
    detailModal.onFalse();
    setSelectedReservation(null);
  };

  return (
    <div>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reservation history</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
            One row per reservation action — an update appends a row. Free reservations appear with no transaction; a prepaid min-spend is excluded from
            payout by design (VOUCHER_FUNDED), not an error.
          </p>
        </div>

        <Button variant="default" className="bg-primary flex items-center gap-2 text-white" onClick={() => showSuccess('Exporting reservation history to CSV')}>
          <Download className="h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      <ReservationHistoryTable
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

      <ReservationDetailModal open={detailModal.value} onClose={handleCloseDetail} reservation={selectedReservation} />
    </div>
  );
};

export default ReservationHistoryView;
