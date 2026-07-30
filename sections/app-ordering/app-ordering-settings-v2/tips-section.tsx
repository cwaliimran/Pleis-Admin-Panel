'use client';

import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { InfoBox } from './info-box';
import { SettingRow } from './setting-row';
import { SettingsCard } from './settings-card';
import { TipPresetsEditor } from './tip-presets-editor';
import { ToggleSwitch } from './toggle-switch';
import { TipSettings } from './types';

interface TipsSectionProps {
  value: TipSettings;
  onSave: (tips: TipSettings) => Promise<void>;
  isSaving: boolean;
  disabled?: boolean;
}

export const TipsSection: React.FC<TipsSectionProps> = ({ value, onSave, isSaving, disabled = false }) => {
  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isDirty },
  } = useForm<TipSettings>({
    defaultValues: value,
    mode: 'onChange',
  });

  useEffect(() => {
    reset(value);
  }, [value, reset]);

  const enabled = watch('enabled');
  const presets = watch('presets');
  const allowCustomAmount = watch('allowCustomAmount');

  const isBusy = disabled || isSaving;

  const submit = handleSubmit(async (formValues) => {
    // Tipping enabled with no presets and no custom option renders an empty selector.
    if (formValues.enabled && formValues.presets.length === 0 && !formValues.allowCustomAmount) {
      showError('Add at least one tip preset or allow a custom tip amount');
      return;
    }

    try {
      await onSave(formValues);
      reset(formValues);
      showSuccess('Tip settings saved');
    } catch (error) {
      showError(getErrorMessage(error));
    }
  });

  return (
    <SettingsCard
      title="Tips"
      description="Allow customers to add a tip before final payment. Tips are not covered by the reservation voucher."
      saveLabel="Save Tip Settings"
      onSave={submit}
      isSaving={isSaving}
      canSave={isDirty && !disabled}
    >
      <SettingRow
        title="Enable customer tipping"
        description="When enabled, customers see a tip selector on the checkout screen before placing an order."
        control={
          <ToggleSwitch
            ariaLabel="Enable customer tipping"
            checked={enabled}
            disabled={isBusy}
            onChange={(next) => setValue('enabled', next, { shouldDirty: true })}
          />
        }
      >
        {enabled && (
          <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
            <TipPresetsEditor presets={presets} disabled={isBusy} onChange={(next) => setValue('presets', next, { shouldDirty: true })} />

            <div className="flex items-start justify-between gap-5 border-t border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-[#222121]">
              <div className="flex-1">
                <h4 className="mb-1 text-sm font-bold text-gray-900 dark:text-gray-100">Allow custom tip amount</h4>
                <p className="text-[13px] leading-relaxed text-gray-500 dark:text-gray-400">
                  Adds a &quot;Custom&quot; option so the customer can enter their own amount.
                </p>
              </div>
              <ToggleSwitch
                ariaLabel="Allow custom tip amount"
                checked={allowCustomAmount}
                disabled={isBusy}
                onChange={(next) => setValue('allowCustomAmount', next, { shouldDirty: true })}
              />
            </div>
          </div>
        )}
      </SettingRow>

      {enabled && (
        <div className="px-7 pb-6">
          <InfoBox
            title="Tips are charged separately — booked as “Napojnica” at 0% tax"
            description="Tips are never covered by reservation vouchers, rewards, or promo codes. They're added to the final payable amount and paid by the customer's chosen payment method."
          />
        </div>
      )}
    </SettingsCard>
  );
};
