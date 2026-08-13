'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import React, { useMemo, useState } from 'react';
import { DEFAULT_PAGE_LIMIT } from './constants';
import RewardDetailModal from './reward-detail-modal';
import RewardFormModal from './reward-form-modal';
import RewardsStatsCards from './rewards-stats-cards';
import RewardsTable from './rewards-table';
import { Reward, RewardSortKey, RewardSortOrder, RewardStatus, RewardType, RewardsQuery } from './types';
import { useRewardsView } from './use-rewards-view';
import { useDeleteRewardV2Mutation } from '@/store/Reducer/rewards-v2-api';

/**
 * Rewards V2 — owns every piece of list state and hands the table plain props.
 * Data comes from `useRewardsView`, which is backed by the v2 rewards API.
 */
export const RewardsViewV2: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_PAGE_LIMIT);
  const [search, setSearch] = useState('');
  const [type, setType] = useState<RewardType | ''>('');
  const [status, setStatus] = useState<RewardStatus | ''>('');
  const [sortBy, setSortBy] = useState<RewardSortKey | ''>('');
  const [sortOrder, setSortOrder] = useState<RewardSortOrder>('');

  const [editing, setEditing] = useState<Reward | null>(null);
  const [viewing, setViewing] = useState<Reward | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Reward | null>(null);

  const formModal = useBoolean();
  const detailModal = useBoolean();
  const deleteConfirm = useBoolean();

  const query: RewardsQuery = useMemo(
    () => ({ page, limit, search, type, status, sortBy, sortOrder }),
    [page, limit, search, type, status, sortBy, sortOrder]
  );

  const { data, meta, stats, typeOptions, isLoading, isFetching } = useRewardsView(query);

  const [deleteReward, { isLoading: isDeleting }] = useDeleteRewardV2Mutation();

  // Every filter and sort change invalidates the current offset.
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleTypeChange = (value: RewardType | '') => {
    setType(value);
    setPage(1);
  };

  const handleStatusChange = (value: RewardStatus | '') => {
    setStatus(value);
    setPage(1);
  };

  const handleSortChange = (nextSortBy: RewardSortKey | '', nextSortOrder: RewardSortOrder) => {
    setSortBy(nextSortBy);
    setSortOrder(nextSortOrder);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setType('');
    setStatus('');
    setSortBy('');
    setSortOrder('');
    setPage(1);
  };

  const handleCreate = () => {
    setEditing(null);
    formModal.onTrue();
  };

  const handleEdit = (item: Reward) => {
    setEditing(item);
    formModal.onTrue();
  };

  const handleViewAnalytics = (item: Reward) => {
    setViewing(item);
    detailModal.onTrue();
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      const response = await deleteReward({ id: pendingDelete.id }).unwrap();
      showSuccess(response?.message || 'Reward deleted');
      deleteConfirm.onFalse();
      setPendingDelete(null);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  return (
    <div className="flex flex-col gap-2 pb-6">
      <RewardsStatsCards stats={stats} isLoading={isLoading} />

      <RewardsTable
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
        typeOptions={typeOptions}
        onTypeChange={handleTypeChange}
        status={status}
        onStatusChange={handleStatusChange}
        onResetFilters={handleResetFilters}
      />

      <RewardFormModal
        open={formModal.value}
        reward={editing}
        onClose={() => {
          formModal.onFalse();
          setEditing(null);
        }}
      />

      <RewardDetailModal
        open={detailModal.value}
        reward={viewing}
        onClose={() => {
          detailModal.onFalse();
          setViewing(null);
        }}
      />

      <ConfirmDialog
        open={deleteConfirm.value}
        title="Delete Reward"
        content={`Are you sure you want to delete "${pendingDelete?.name}"? This cannot be undone.`}
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

export default RewardsViewV2;
