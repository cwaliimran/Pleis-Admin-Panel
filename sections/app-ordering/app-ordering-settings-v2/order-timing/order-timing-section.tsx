'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { SettingRow } from '../common/setting-row';
import { SettingRowSkeleton } from '../common/setting-row-skeleton';
import { SettingsCard } from '../common/settings-card';
import { ToggleSwitch } from '../common/toggle-switch';
import { SESSION_LENGTH_OPTIONS } from './constants';
import { OrderTimingSettings } from './types';
import { useOrderTiming } from './use-order-timing';

interface OrderTimingSectionProps {
  /** The section loads and saves its own data; this is all it needs from the page. */
  organizationId?: string;
}

export const OrderTimingSection: React.FC<OrderTimingSectionProps> = ({ organizationId }) => {
  const { settings, isLoading, isFetching, isSaving, save } = useOrderTiming(organizationId);

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isDirty },
  } = useForm<OrderTimingSettings>({
    defaultValues: settings,
    mode: 'onChange',
  });

  // Re-seed whenever the loaded record changes (org switch, save round-trip).
  useEffect(() => {
    reset(settings);
  }, [settings, reset]);

  const sessionTimerEnabled = watch('sessionTimerEnabled');
  const sessionLengthMinutes = watch('sessionLengthMinutes');

  // A stored length need not be one of the suggestions — surface it as its
  // own option so the select shows the real value instead of coming up blank.
  const sessionLengthOptions = useMemo(() => {
    if (!sessionLengthMinutes || SESSION_LENGTH_OPTIONS.some((option) => option.value === sessionLengthMinutes)) {
      return SESSION_LENGTH_OPTIONS;
    }

    return [...SESSION_LENGTH_OPTIONS, { value: sessionLengthMinutes, label: `${sessionLengthMinutes} minutes` }].sort(
      (a, b) => a.value - b.value
    );
  }, [sessionLengthMinutes]);

  const isBusy = isFetching || isSaving;

  const submit = handleSubmit(async (formValues) => {
    try {
      const message = await save(formValues);
      reset(formValues);
      showSuccess(message || 'Timing settings saved');
    } catch (error) {
      showError(getErrorMessage(error));
    }
  });

  return (
    <SettingsCard
      title="Order Timing"
      description="Control the active ordering session length"
      saveLabel="Save Timing Settings"
      onSave={submit}
      isSaving={isSaving}
      canSave={isDirty && !isBusy}
    >
      {isLoading ? (
        <SettingRowSkeleton />
      ) : (
        <SettingRow
          title="Session Timer"
          description="Active ordering session duration. After expiry, the customer's cart is cleared and ordering is disabled until a new session starts."
          control={
            <ToggleSwitch
              ariaLabel="Session timer"
              checked={sessionTimerEnabled}
              disabled={isBusy}
              onChange={(next) => setValue('sessionTimerEnabled', next, { shouldDirty: true })}
            />
          }
        >
          {sessionTimerEnabled && (
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Session length</span>
              <Select
                value={String(sessionLengthMinutes)}
                disabled={isBusy}
                onValueChange={(next) => setValue('sessionLengthMinutes', Number(next), { shouldDirty: true })}
              >
                <SelectTrigger className="w-44" aria-label="Session length">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sessionLengthOptions.map((option) => (
                    <SelectItem key={option.value} value={String(option.value)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </SettingRow>
      )}
    </SettingsCard>
  );
};
