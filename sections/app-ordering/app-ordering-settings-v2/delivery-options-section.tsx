'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { Plus } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { DELIVERY_OPTION_STATUS_CONFIG, DELIVERY_OPTION_TYPE_CONFIG } from './constants';
import DeliveryOptionsTable from './delivery-options-table';
import { DeliveryOptionModal } from './modals/delivery-option-modal';
import { SettingsCard } from './settings-card';
import { DeliveryOption, DeliveryOptionPayload, SortDirection } from './types';

interface DeliveryOptionsSectionProps {
  options: DeliveryOption[];
  isLoading: boolean;
  isMutating: boolean;
  onCreate: (payload: DeliveryOptionPayload) => Promise<void>;
  onUpdate: (id: string, payload: DeliveryOptionPayload) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onGenerateQrCode: (id: string) => Promise<void>;
}

/** Sort on what the user actually sees in the cell, not the raw enum key. */
const getSortValue = (option: DeliveryOption, key: string): string => {
  if (key === 'type') return DELIVERY_OPTION_TYPE_CONFIG[option.type].label;
  if (key === 'status') return DELIVERY_OPTION_STATUS_CONFIG[option.status].label;
  return option.name;
};

export const DeliveryOptionsSection: React.FC<DeliveryOptionsSectionProps> = ({
  options,
  isLoading,
  isMutating,
  onCreate,
  onUpdate,
  onDelete,
  onGenerateQrCode,
}) => {
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<SortDirection | ''>('');
  const [editingOption, setEditingOption] = useState<DeliveryOption | null>(null);
  const [optionPendingDelete, setOptionPendingDelete] = useState<DeliveryOption | null>(null);

  const optionModal = useBoolean();
  const deleteDialog = useBoolean();

  // The list is small and unpaginated, so sorting here covers the whole dataset.
  const sortedOptions = useMemo(() => {
    if (!sortBy || !sortOrder) return options;

    return [...options].sort((a, b) => {
      const comparison = getSortValue(a, sortBy).localeCompare(getSortValue(b, sortBy), undefined, {
        numeric: true,
        sensitivity: 'base',
      });
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [options, sortBy, sortOrder]);

  const handleSortChange = (key: string, order: SortDirection | '') => {
    setSortBy(key);
    setSortOrder(order);
  };

  const handleOpenAdd = () => {
    setEditingOption(null);
    optionModal.onTrue();
  };

  const handleEdit = (option: DeliveryOption) => {
    setEditingOption(option);
    optionModal.onTrue();
  };

  const handleSubmit = async (payload: DeliveryOptionPayload) => {
    if (editingOption) {
      await onUpdate(editingOption.id, payload);
      return;
    }
    await onCreate(payload);
  };

  const handleGenerateQrCode = async (option: DeliveryOption) => {
    try {
      await onGenerateQrCode(option.id);
      showSuccess(`QR code generated for ${option.name}`);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleConfirmDelete = async () => {
    if (!optionPendingDelete) return;

    try {
      await onDelete(optionPendingDelete.id);
      showSuccess(`${optionPendingDelete.name} deleted`);
      deleteDialog.onFalse();
      setOptionPendingDelete(null);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  return (
    <>
      <SettingsCard
        title="Delivery Options"
        description="Define the delivery options customers can choose when placing orders"
        bodyClassName="px-7 py-6"
        headerAction={
          <Button type="button" onClick={handleOpenAdd} disabled={isLoading} className="h-10 gap-1.5 font-semibold">
            <Plus className="h-4 w-4" />
            Add DO
          </Button>
        }
      >
        <DeliveryOptionsTable
          data={sortedOptions}
          loading={isLoading}
          disabled={isMutating}
          handleEdit={handleEdit}
          handleGenerateQrCode={handleGenerateQrCode}
          handleDelete={(option) => {
            setOptionPendingDelete(option);
            deleteDialog.onTrue();
          }}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      </SettingsCard>

      <DeliveryOptionModal
        open={optionModal.value}
        onClose={optionModal.onFalse}
        option={editingOption}
        existingNames={options.map((option) => option.name)}
        onSubmit={handleSubmit}
        isSubmitting={isMutating}
      />

      <ConfirmDialog
        open={deleteDialog.value}
        title="Delete delivery option"
        content={`Are you sure you want to delete "${optionPendingDelete?.name}"? Customers will no longer be able to choose it.`}
        isLoading={isMutating}
        onClose={() => {
          deleteDialog.onFalse();
          setOptionPendingDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
