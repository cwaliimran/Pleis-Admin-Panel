'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBoolean } from '@/hooks/useBoolean';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import React, { useMemo, useState } from 'react';
import { CONDITION_TYPE_FILTER_OPTIONS, SELECT_ITEM_CLASS, STATUS_FILTER_OPTIONS, getTotalMaxCapacity } from './constants';
import { ReservationTypeModal } from './modals/reservation-type-modal';
import { ReservationTypesTable } from './reservation-types-table';
import { SettingsCard } from './settings-card';
import { ConditionType, ReservationType, ReservationTypePayload, ReservationTypeStatus } from './types';

const FILTER_TRIGGER_CLASS = 'h-10 w-full cursor-pointer bg-white shadow-none sm:w-auto sm:min-w-[180px] dark:bg-[#1a1a1a]';

interface ReservationTypesSectionProps {
  data: ReservationType[];
  isLoading: boolean;
  isMutating: boolean;
  onCreate: (payload: ReservationTypePayload) => Promise<void>;
  onUpdate: (id: string, payload: ReservationTypePayload) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const ReservationTypesSection: React.FC<ReservationTypesSectionProps> = ({ data, isLoading, isMutating, onCreate, onUpdate, onDelete }) => {
  const [conditionType, setConditionType] = useState<ConditionType | 'all'>('all');
  const [status, setStatus] = useState<ReservationTypeStatus | 'all'>('all');

  const [editing, setEditing] = useState<ReservationType | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ReservationType | null>(null);

  const typeModal = useBoolean();
  const deleteConfirm = useBoolean();

  const filtered = useMemo(
    () =>
      data
        .filter((type) => conditionType === 'all' || type.conditionType === conditionType)
        .filter((type) => status === 'all' || type.status === status),
    [data, conditionType, status]
  );

  // Deliberately from the full list, not the filtered one — it is the venue's
  // real bookable capacity, not a total of whatever is on screen.
  const totalMaxCapacity = useMemo(() => getTotalMaxCapacity(data), [data]);

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
      await onUpdate(editing.id, payload);
      return;
    }
    await onCreate(payload);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      await onDelete(pendingDelete.id);
      showSuccess('Reservation type deleted');
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
          <Button type="button" onClick={handleOpenCreate} disabled={isMutating} className="h-10 shrink-0 cursor-pointer font-semibold">
            + Create reservation type
          </Button>
        }
        footer={
          <div className="flex items-center justify-end gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Total max capacity (active types):</span>
            <span className="font-bold text-gray-900 dark:text-gray-100">{totalMaxCapacity} seats</span>
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
          data={filtered}
          loading={isLoading}
          disabled={isMutating}
          onEdit={handleOpenEdit}
          onDelete={(item) => {
            setPendingDelete(item);
            deleteConfirm.onTrue();
          }}
        />
      </SettingsCard>

      <ReservationTypeModal
        open={typeModal.value}
        reservationType={editing}
        existingNames={data.map((type) => type.name)}
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
