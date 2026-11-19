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
import { toApiPaymentMethods } from './mappers';
import { PaymentSettings } from './types';
import { usePaymentMethods } from './use-payment-methods';

const schema: Yup.ObjectSchema<PaymentSettings> = Yup.object().shape({
  inAppPayment: Yup.boolean().required(),
  payNow: Yup.boolean().required(),
  cash: Yup.boolean().required(),
  card: Yup.boolean().required(),
  other: Yup.boolean().required(),
});

interface PaymentMethodsSectionProps {
  /** The section loads and saves its own data; this is all it needs from the page. */
  organizationId?: string;
}

export const PaymentMethodsSection: React.FC<PaymentMethodsSectionProps> = ({ organizationId }) => {
  const { settings, isLoading, isFetching, isSaving, save } = usePaymentMethods(organizationId);

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isDirty },
  } = useForm<PaymentSettings>({
    resolver: yupResolver(schema),
    defaultValues: settings,
    mode: 'onChange',
  });

  // Re-seed whenever the loaded record changes (org switch, save round-trip).
  useEffect(() => {
    reset(settings);
  }, [settings, reset]);

  const inAppPayment = watch('inAppPayment');
  const payNow = watch('payNow');
  const cash = watch('cash');
  const card = watch('card');
  const other = watch('other');

  const isBusy = isFetching || isSaving;

  const submit = handleSubmit(async (formValues) => {
    // At least one method must stay enabled (Legal_req_features_2 §1).
    if (!formValues.inAppPayment && !formValues.cash && !formValues.card && !formValues.other) {
      showError('Enable at least one payment method: In-app payment, Cash, Card or Other');
      return;
    }

    try {
      const payload = toApiPaymentMethods(formValues);
      const message = await save(payload);
      reset(payload);
      showSuccess(message || 'Payment settings saved');
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
      canSave={isDirty && !isBusy}
    >
      {isLoading ? (
        // One placeholder per real row, so the card keeps its shape.
        <>
          <SettingRowSkeleton divider />
          <SettingRowSkeleton divider descriptionLines={3} />
          <SettingRowSkeleton divider />
          <SettingRowSkeleton divider />
          <SettingRowSkeleton />
        </>
      ) : (
        <>
          <SettingRow
            divider
            title="In-app payment"
            description={
              <>
                Customers can pay directly through the app using a connected payment provider. Shown to the guest as{' '}
                <span className="font-semibold text-gray-900 dark:text-gray-200">Pleis Payment</span>; the receipt marker is always{' '}
                <span className="font-semibold text-gray-900 dark:text-gray-200">Ostalo</span>, because Pleis is the intermediary in that payment. If
                disabled, the guest sees only the Off App Payment Options enabled below.
              </>
            }
            control={
              <ToggleSwitch
                ariaLabel="In-app payment"
                checked={inAppPayment}
                disabled={isBusy}
                onChange={(next) => {
                  setValue('inAppPayment', next, { shouldDirty: true });
                  if (!next) setValue('payNow', false, { shouldDirty: true });
                }}
              />
            }
          />

          <SettingRow
            divider
            title="Pay now"
            // Charge timing only exists when there is a provider to charge through.
            className={!inAppPayment ? 'opacity-50' : undefined}
            description={
              <>
                Payment is captured as soon as the order is accepted — automatically or by staff — and before preparation begins. When off, orders
                use <span className="font-semibold text-gray-900 dark:text-gray-200">Pay later</span> — the bill stays open and is settled after
                delivery.
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

          <div className="pt-4 pb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">Off App Payment Options</div>

          <SettingRow
            divider
            title="Cash"
            description={
              <>
                Customers can pay with cash at the venue. The order moves to{' '}
                <span className="font-semibold text-gray-900 dark:text-gray-200">Waiting for payment</span> after delivery; staff confirm receipt in
                the app to mark it <span className="font-semibold text-gray-900 dark:text-gray-200">Paid</span>. Receipt marker:{' '}
                <span className="font-semibold text-gray-900 dark:text-gray-200">Gotovina</span>.
              </>
            }
            control={
              <ToggleSwitch ariaLabel="Cash" checked={cash} disabled={isBusy} onChange={(next) => setValue('cash', next, { shouldDirty: true })} />
            }
          />

          <SettingRow
            divider
            title="Card"
            description={
              <>
                Customers can pay by card on the venue&apos;s own terminal. The money never passes through Pleis, so the order carries no processing
                fee. Receipt marker: <span className="font-semibold text-gray-900 dark:text-gray-200">Kartica</span>.
              </>
            }
            control={
              <ToggleSwitch ariaLabel="Card" checked={card} disabled={isBusy} onChange={(next) => setValue('card', next, { shouldDirty: true })} />
            }
          />

          <SettingRow
            title="Other"
            description={
              <>
                A voucher or any other method the venue accepts. Shown to the guest as{' '}
                <span className="font-semibold text-gray-900 dark:text-gray-200">Other</span>. Receipt marker:{' '}
                <span className="font-semibold text-gray-900 dark:text-gray-200">Ostalo</span>.
              </>
            }
            control={
              <ToggleSwitch ariaLabel="Other" checked={other} disabled={isBusy} onChange={(next) => setValue('other', next, { shouldDirty: true })} />
            }
          />
        </>
      )}
    </SettingsCard>
  );
};
