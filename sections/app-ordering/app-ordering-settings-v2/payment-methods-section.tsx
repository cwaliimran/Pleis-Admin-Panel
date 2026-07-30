'use client';

import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { SettingRow } from './setting-row';
import { SettingsCard } from './settings-card';
import { ToggleSwitch } from './toggle-switch';
import { PaymentSettings } from './types';

const schema: Yup.ObjectSchema<PaymentSettings> = Yup.object().shape({
  inAppPayment: Yup.boolean().required(),
  payNow: Yup.boolean().required(),
});

interface PaymentMethodsSectionProps {
  value: PaymentSettings;
  onSave: (payment: PaymentSettings) => Promise<void>;
  isSaving: boolean;
  disabled?: boolean;
}

export const PaymentMethodsSection: React.FC<PaymentMethodsSectionProps> = ({ value, onSave, isSaving, disabled = false }) => {
  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isDirty },
  } = useForm<PaymentSettings>({
    resolver: yupResolver(schema),
    defaultValues: value,
    mode: 'onChange',
  });

  // Re-seed whenever the loaded record changes (org switch, save round-trip).
  useEffect(() => {
    reset(value);
  }, [value, reset]);

  const inAppPayment = watch('inAppPayment');
  const payNow = watch('payNow');

  const isBusy = disabled || isSaving;

  const submit = handleSubmit(async (formValues) => {
    try {
      await onSave(formValues);
      reset(formValues);
      showSuccess('Payment settings saved');
    } catch (error) {
      showError(getErrorMessage(error));
    }
  });

  return (
    <SettingsCard
      title="Payment Methods"
      description="Choose which payment options are available to customers when placing orders"
      saveLabel="Save Payment Settings"
      onSave={submit}
      isSaving={isSaving}
      canSave={isDirty && !disabled}
    >
      <SettingRow
        divider
        title="In-app payment"
        description={
          <>
            Customers can pay directly through the app using a connected payment provider. If disabled, only{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-200">Cash</span> at the venue is available.
          </>
        }
        control={
          <ToggleSwitch
            ariaLabel="In-app payment"
            checked={inAppPayment}
            disabled={isBusy}
            onChange={(next) => setValue('inAppPayment', next, { shouldDirty: true })}
          />
        }
      />

      <SettingRow
        title="Pay now"
        // Charge timing only exists when there is a provider to charge through.
        className={!inAppPayment ? 'opacity-50' : undefined}
        description={
          <>
            Payment is captured immediately when the customer places the order, before it is sent to staff. When off, orders use{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-200">Pay later</span> — the bill stays open and is settled after delivery.
          </>
        }
        control={
          <ToggleSwitch
            ariaLabel="Pay now"
            checked={payNow}
            disabled={isBusy || !inAppPayment}
            onChange={(next) => setValue('payNow', next, { shouldDirty: true })}
          />
        }
      />
    </SettingsCard>
  );
};
