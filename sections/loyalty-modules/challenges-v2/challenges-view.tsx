'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import React, { useMemo, useState } from 'react';
import ChallengeDetailModal from './modals/challenge-detail-modal';
import ChallengeFormModal from './modals/challenge-form-modal';
import ChallengesStatsCards from './components/challenges-stats-cards';
import ChallengesTable from './challenges-table';
import { DEFAULT_PAGE_LIMIT } from './constants';
import {
  Challenge,
  ChallengePayload,
  ChallengeRewardType,
  ChallengeSortKey,
  ChallengeSortOrder,
  ChallengeStatus,
  ChallengeTaskType,
  ChallengesQuery,
} from './types';
import { useChallengesView } from './use-challenges-view';

/**
 * Challenges V2 — owns every piece of list state and hands the table plain
 * props. Data still comes from `useChallengesView` (mock).
 */
export const ChallengesViewV2: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_PAGE_LIMIT);
  const [search, setSearch] = useState('');
  const [taskType, setTaskType] = useState<ChallengeTaskType | ''>('');
  const [rewardType, setRewardType] = useState<ChallengeRewardType | ''>('');
  const [status, setStatus] = useState<ChallengeStatus | ''>('');
  const [sortBy, setSortBy] = useState<ChallengeSortKey | ''>('');
  const [sortOrder, setSortOrder] = useState<ChallengeSortOrder>('');

  const [editing, setEditing] = useState<Challenge | null>(null);
  const [viewing, setViewing] = useState<Challenge | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Challenge | null>(null);

  const formModal = useBoolean();
  const detailModal = useBoolean();
  const deleteConfirm = useBoolean();

  const query: ChallengesQuery = useMemo(
    () => ({ page, limit, search, taskType, rewardType, status, sortBy, sortOrder }),
    [page, limit, search, taskType, rewardType, status, sortBy, sortOrder]
  );

  const { data, meta, stats, isLoading, isMutating, createChallenge, updateChallenge, deleteChallenge } = useChallengesView(query);

  // Every filter and sort change invalidates the current offset.
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleTaskTypeChange = (value: ChallengeTaskType | '') => {
    setTaskType(value);
    setPage(1);
  };

  const handleRewardTypeChange = (value: ChallengeRewardType | '') => {
    setRewardType(value);
    setPage(1);
  };

  const handleStatusChange = (value: ChallengeStatus | '') => {
    setStatus(value);
    setPage(1);
  };

  const handleSortChange = (nextSortBy: ChallengeSortKey | '', nextSortOrder: ChallengeSortOrder) => {
    setSortBy(nextSortBy);
    setSortOrder(nextSortOrder);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setTaskType('');
    setRewardType('');
    setStatus('');
    setSortBy('');
    setSortOrder('');
    setPage(1);
  };

  const handleCreate = () => {
    setEditing(null);
    formModal.onTrue();
  };

  const handleEdit = (item: Challenge) => {
    setEditing(item);
    formModal.onTrue();
  };

  const handleViewAnalytics = (item: Challenge) => {
    setViewing(item);
    detailModal.onTrue();
  };

  const handleSubmit = async (payload: ChallengePayload) => {
    if (editing) {
      await updateChallenge(editing.id, payload);
      showSuccess('Challenge updated');
      return;
    }

    await createChallenge(payload);
    showSuccess('Challenge created');
    // A new challenge lands at the top of the unsorted list.
    setPage(1);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      await deleteChallenge(pendingDelete.id);
      showSuccess('Challenge deleted');
      deleteConfirm.onFalse();
      setPendingDelete(null);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  return (
    <div className="flex flex-col gap-2 pb-6">
      <ChallengesStatsCards stats={stats} isLoading={isLoading} />

      <ChallengesTable
        data={data}
        meta={meta}
        loading={isLoading}
        isMutating={isMutating}
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
        taskType={taskType}
        onTaskTypeChange={handleTaskTypeChange}
        rewardType={rewardType}
        onRewardTypeChange={handleRewardTypeChange}
        status={status}
        onStatusChange={handleStatusChange}
        onResetFilters={handleResetFilters}
      />

      <ChallengeFormModal
        open={formModal.value}
        challenge={editing}
        isSubmitting={isMutating}
        onSubmit={handleSubmit}
        onClose={() => {
          formModal.onFalse();
          setEditing(null);
        }}
      />

      <ChallengeDetailModal
        open={detailModal.value}
        challenge={viewing}
        onClose={() => {
          detailModal.onFalse();
          setViewing(null);
        }}
      />

      <ConfirmDialog
        open={deleteConfirm.value}
        title="Delete Challenge"
        content={`Are you sure you want to delete "${pendingDelete?.name}"? This cannot be undone.`}
        isLoading={isMutating}
        onClose={() => {
          deleteConfirm.onFalse();
          setPendingDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ChallengesViewV2;
