'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { useDeleteChallengeV2Mutation } from '@/store/Reducer/challenges-v2-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import React, { useMemo, useState } from 'react';
import { LoyaltyViewProps } from '../types';
import ChallengesTable from './challenges-table';
import ChallengesStatsCards from './components/challenges-stats-cards';
import { DEFAULT_PAGE_LIMIT } from './constants';
import ChallengeDetailModal from './modals/challenge-detail-modal';
import ChallengeFormModal from './modals/challenge-form-modal';
import {
  Challenge,
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
 * props. Data comes from `useChallengesView`, backed by the v2 challenges API.
 */
export const ChallengesViewV2: React.FC<LoyaltyViewProps> = ({ userType = 'super-admin' }) => {
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

  const { data, meta, stats, isLoading, isFetching } = useChallengesView(query, userType);

  const [deleteChallenge, { isLoading: isDeleting }] = useDeleteChallengeV2Mutation();

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

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      const response = await deleteChallenge({ id: pendingDelete.id }).unwrap();
      showSuccess(response?.message || 'Challenge deleted');
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
        userType={userType}
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

export default ChallengesViewV2;
