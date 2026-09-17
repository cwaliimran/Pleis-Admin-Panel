'use client';

import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { showSuccess } from '@/utils/toast';
import { Download } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FilterValues, getDefaultFilterValues, matchesAdvancedFilters } from './advanced-filters';
import OrderDetailModal from './components/modals/order-detail-modal';
import { matchesSearch, PresetId, PRESET_OPTIONS } from './components/filters/filters';
import OrderingHistoryTable from './components/table/ordering-history-table';
import { ALL_MOCK_ORDERS, MOCK_PAGE_SIZE } from './data/mock-data';
import { Order } from './types/types';

const OrderingHistoryView = () => {
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [dateBasis, setDateBasis] = useState('order_created_at');
  const [period, setPeriod] = useState('current_working_day');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [activePreset, setActivePreset] = useState<PresetId | null>(null);
  const [advancedFilters, setAdvancedFilters] = useState<FilterValues>(getDefaultFilterValues);

  const detailModal = useBoolean();

  const filteredData = useMemo(() => {
    const preset = activePreset ? PRESET_OPTIONS.find((option) => option.id === activePreset) : undefined;

    return ALL_MOCK_ORDERS.filter((order) => matchesSearch(order, search))
      .filter((order) => !preset || preset.predicate(order))
      .filter((order) => matchesAdvancedFilters(order, advancedFilters));
  }, [search, activePreset, advancedFilters]);

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

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    detailModal.onTrue();
  };

  const handleCloseDetail = () => {
    detailModal.onFalse();
    setSelectedOrder(null);
  };

  return (
    <div>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Ordering history</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
            One row per order round — includes orders that never produced a Pleis payment (cash, organizer POS, rejected). Those route to the off-app
            track instead of a payout.
          </p>
        </div>

        <Button variant="default" className="bg-primary flex items-center gap-2 text-white" onClick={() => showSuccess('Exporting ordering history to CSV')}>
          <Download className="h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      <OrderingHistoryTable
        data={data}
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        shownCount={data.length}
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

      <OrderDetailModal open={detailModal.value} onClose={handleCloseDetail} order={selectedOrder} />
    </div>
  );
};

export default OrderingHistoryView;
