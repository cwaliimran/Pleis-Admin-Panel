'use client';

import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { SettingRow } from '../common/setting-row';
import { SettingRowSkeleton } from '../common/setting-row-skeleton';
import { SettingsCard } from '../common/settings-card';
import { ToggleSwitch } from '../common/toggle-switch';
import { OrderAcceptanceSettings } from './types';
import { useOrderAcceptance } from './use-order-acceptance';

const schema: Yup.ObjectSchema<OrderAcceptanceSettings> = Yup.object().shape({
  automaticOrderAcceptance: Yup.boolean().required(),
});

interface OrderAcceptanceSectionProps {
  /** The section loads and saves its own data; this is all it needs from the page. */
  organizationId?: string;
}

export const OrderAcceptanceSection: React.FC<OrderAcceptanceSectionProps> = ({ organizationId }) => {
  const { settings, isLoading, isFetching, isSaving, save } = useOrderAcceptance(organizationId);

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isDirty },
  } = useForm<OrderAcceptanceSettings>({
    resolver: yupResolver(schema),
    defaultValues: settings,
    mode: 'onChange',
  });

  // Re-seed whenever the loaded record changes (org switch, save round-trip).
  useEffect(() => {
    reset(settings);
  }, [settings, reset]);

  const automaticOrderAcceptance = watch('automaticOrderAcceptance');

  const isBusy = isFetching || isSaving;

  const submit = handleSubmit(async (formValues) => {
    try {
      const message = await save(formValues);
      reset(formValues);
      showSuccess(message || 'Acceptance settings saved');
    } catch (error) {
      showError(getErrorMessage(error));
    }
  });

  return (
    <SettingsCard
      title="Order Acceptance"
      description="Control whether incoming orders are accepted automatically or must be confirmed by staff before preparation."
      saveLabel="Save Acceptance Settings"
      onSave={submit}
      isSaving={isSaving}
      canSave={isDirty && !isBusy}
    >
      {isLoading ? (
        // The real row carries no description, so neither does its placeholder.
        <SettingRowSkeleton descriptionLines={0} />
      ) : (
        <SettingRow
          title="Automatic order acceptance"
          control={
            <ToggleSwitch
              ariaLabel="Automatic order acceptance"
              checked={automaticOrderAcceptance}
              disabled={isBusy}
              onChange={(next) => setValue('automaticOrderAcceptance', next, { shouldDirty: true })}
            />
          }
        />
      )}
    </SettingsCard>
  );
};
