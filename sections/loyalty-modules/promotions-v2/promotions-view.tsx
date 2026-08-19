'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { useDeletePromotionV2Mutation } from '@/store/Reducer/promotions-v2-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import React, { useMemo, useState } from 'react';
import PromotionsStatsCards from './components/promotions-stats-cards';
import { DEFAULT_PAGE_LIMIT } from './constants';
import PromotionDetailModal from './modals/promotion-detail-modal';
import PromotionFormModal from './modals/promotion-form-modal';
import PromotionsTable from './promotions-table';
import { Promotion, PromotionSortKey, PromotionSortOrder, PromotionType, PromotionsQuery } from './types';
import { usePromotionsView } from './use-promotions-view';

export const PromotionsViewV2: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_PAGE_LIMIT);
  const [search, setSearch] = useState('');
  const [type, setType] = useState<PromotionType | ''>('');
  const [startDateFrom, setStartDateFrom] = useState<Date | undefined>(undefined);
  const [endDateTo, setEndDateTo] = useState<Date | undefined>(undefined);
  const [sortBy, setSortBy] = useState<PromotionSortKey | ''>('');
  const [sortOrder, setSortOrder] = useState<PromotionSortOrder>('');

  const [editing, setEditing] = useState<Promotion | null>(null);
  const [viewing, setViewing] = useState<Promotion | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Promotion | null>(null);

  const formModal = useBoolean();
  const detailModal = useBoolean();
  const deleteConfirm = useBoolean();

  const query: PromotionsQuery = useMemo(
    () => ({ page, limit, search, type, startDateFrom, endDateTo, sortBy, sortOrder }),
    [page, limit, search, type, startDateFrom, endDateTo, sortBy, sortOrder]
  );

  const { data, meta, stats, isLoading, isFetching } = usePromotionsView(query);

  const [deletePromotion, { isLoading: isDeleting }] = useDeletePromotionV2Mutation();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleTypeChange = (value: PromotionType | '') => {
    setType(value);
    setPage(1);
  };

  const handleStartDateFromChange = (value: Date | undefined) => {
    setStartDateFrom(value);
    setPage(1);
  };

  const handleEndDateToChange = (value: Date | undefined) => {
    setEndDateTo(value);
    setPage(1);
  };

  const handleSortChange = (nextSortBy: PromotionSortKey | '', nextSortOrder: PromotionSortOrder) => {
    setSortBy(nextSortBy);
    setSortOrder(nextSortOrder);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setType('');
    setStartDateFrom(undefined);
    setEndDateTo(undefined);
    setSortBy('');
    setSortOrder('');
    setPage(1);
  };

  const handleViewAnalytics = (item: Promotion) => {
    setViewing(item);
    detailModal.onTrue();
  };

  const handleCreate = () => {
    setEditing(null);
    formModal.onTrue();
  };

  const handleEdit = (item: Promotion) => {
    setEditing(item);
    formModal.onTrue();
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      const response = await deletePromotion({ id: pendingDelete.id }).unwrap();
      showSuccess(response?.message || 'Promotion deleted');
      deleteConfirm.onFalse();
      setPendingDelete(null);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  return (
    <div className="flex flex-col gap-2 pb-6">
      <PromotionsStatsCards stats={stats} isLoading={isLoading} />

      <PromotionsTable
        data={data}
        meta={meta}
        loading={isLoading || isFetching}
        isMutating={isDeleting}
        onCreate={handleCreate}
        onViewAnalytics={handleViewAnalytics}
        onEdit={handleEdit}
        onDelete={(item) => {
          setPendingDelete(item);
          deleteConfirm.onTrue();
        }}
        onPageChange={setPage}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        search={search}
        onSearchChange={handleSearchChange}
        type={type}
        onTypeChange={handleTypeChange}
        startDateFrom={startDateFrom}
        onStartDateFromChange={handleStartDateFromChange}
        endDateTo={endDateTo}
        onEndDateToChange={handleEndDateToChange}
        onResetFilters={handleResetFilters}
      />

      <PromotionFormModal
        open={formModal.value}
        promotion={editing}
        onCreated={() => setPage(1)}
        onClose={() => {
          formModal.onFalse();
          setEditing(null);
        }}
      />

      <PromotionDetailModal
        open={detailModal.value}
        promotion={viewing}
        onClose={() => {
          detailModal.onFalse();
          setViewing(null);
        }}
      />

      <ConfirmDialog
        open={deleteConfirm.value}
        title="Delete Promotion"
        content={`Are you sure you want to delete "${pendingDelete?.title}"? This cannot be undone.`}
        isLoading={isDeleting}
        onClose={() => {
          deleteConfirm.onFalse();
          setPendingDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default PromotionsViewV2;
