'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import PaginationControls from '@/components/table/pagination-controls';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBoolean } from '@/hooks/useBoolean';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import React, { useEffect, useState } from 'react';
import { SELECT_ITEM_CLASS } from '../constants';
import { SettingsCard } from '../settings-card';
import { CONDITION_TYPE_FILTER_OPTIONS, STATUS_FILTER_OPTIONS } from './constants';
import { ReservationTypeModal } from './reservation-type-modal';
import { ReservationTypesTable } from './reservation-types-table';
import { ConditionType, ReservationType, ReservationTypePayload, ReservationTypeStatus } from './types';
import { useReservationTypes } from './use-reservation-types';

const FILTER_TRIGGER_CLASS = 'h-10 w-full cursor-pointer bg-white shadow-none sm:w-auto sm:min-w-[180px] dark:bg-[#1a1a1a]';

interface ReservationTypesSectionProps {
  organizationId?: string;
}

export const ReservationTypesSection: React.FC<ReservationTypesSectionProps> = ({ organizationId }) => {
  const [conditionType, setConditionType] = useState<ConditionType | 'all'>('all');
  const [status, setStatus] = useState<ReservationTypeStatus | 'all'>('all');
  const [page, setPage] = useState(1);

  const { reservationTypes, pagination, isLoading, isMutating, pendingTypeId, createReservationType, updateReservationType, deleteReservationType } =
    useReservationTypes({ organizationId, filters: { conditionType, status }, page });

  // Filtering and paging both happen server-side, so a narrowed result set
  // must start from page one — and so must a different organization.
  useEffect(() => {
    setPage(1);
  }, [conditionType, status, organizationId]);

  // A deleted last row leaves the page empty; step back rather than show nothing.
  useEffect(() => {
    if (pagination.totalPages > 0 && page > pagination.totalPages) {
      setPage(pagination.totalPages);
    }
  }, [page, pagination.totalPages]);

  const [editing, setEditing] = useState<ReservationType | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ReservationType | null>(null);

  const typeModal = useBoolean();
  const deleteConfirm = useBoolean();

  const handleOpenCreate = () => {
    setEditing(null);
    typeModal.onTrue();
  };

  const handleOpenEdit = (item: ReservationType) => {
    setEditing(item);
    typeModal.onTrue();
  };

  const handleSubmit = async (payload: ReservationTypePayload) => {
    if (editing) {
      return updateReservationType(editing.id, payload);
    }
    return createReservationType(payload);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      const message = await deleteReservationType(pendingDelete.id);
      showSuccess(message || 'Reservation type deleted');
      deleteConfirm.onFalse();
      setPendingDelete(null);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  return (
    <>
      <SettingsCard
        title="Reservation types"
        description="Types of reservations available at this location."
        headerAction={
          <Button
            type="button"
            onClick={handleOpenCreate}
            disabled={isMutating || !organizationId}
            className="h-10 shrink-0 cursor-pointer font-semibold disabled:cursor-not-allowed"
          >
            + Create reservation type
          </Button>
        }
        footer={
          <div className="flex items-center justify-end gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Total max capacity (active types):</span>
            <span className="font-bold text-gray-900 dark:text-gray-100">{pagination.totalMaxCapacity} seats</span>
          </div>
        }
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select value={conditionType} onValueChange={(next) => setConditionType(next as ConditionType | 'all')}>
            <SelectTrigger className={FILTER_TRIGGER_CLASS} aria-label="Filter by condition type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONDITION_TYPE_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className={SELECT_ITEM_CLASS}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={(next) => setStatus(next as ReservationTypeStatus | 'all')}>
            <SelectTrigger className={FILTER_TRIGGER_CLASS} aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className={SELECT_ITEM_CLASS}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ReservationTypesTable
          data={reservationTypes}
          loading={isLoading}
          disabled={isMutating}
          pendingTypeId={pendingTypeId}
          onEdit={handleOpenEdit}
          onDelete={(item) => {
            setPendingDelete(item);
            deleteConfirm.onTrue();
          }}
        />

        {pagination.totalRecords > 0 && (
          <PaginationControls
            currentPage={page}
            totalPages={pagination.totalPages}
            totalRecords={pagination.totalRecords}
            limit={pagination.limit}
            onPageChange={setPage}
          />
        )}
      </SettingsCard>

      <ReservationTypeModal
        open={typeModal.value}
        reservationType={editing}
        // Only the current page's names — the backend is the real authority on
        // duplicates; this just catches the obvious case without a round trip.
        existingNames={reservationTypes.map((type) => type.name)}
        isSubmitting={isMutating}
        onSubmit={handleSubmit}
        onClose={() => {
          typeModal.onFalse();
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={deleteConfirm.value}
        title="Delete reservation type?"
        content={`"${pendingDelete?.name}" will no longer be available for new reservations. This cannot be undone.`}
        isLoading={isMutating}
        onClose={() => {
          deleteConfirm.onFalse();
          setPendingDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
