'use client';

import { AppLoading } from '@/components/atoms/app-loading';
import ButtonLoading from '@/components/common/button-loading';
import FormProvider from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetUserByIdQuery, useUpdateUserForUserListMutation } from '@/store/Reducer/user-list';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { ORDER_FLOW_WITH_ACCEPTANCE, ORDER_FLOW_WITHOUT_ACCEPTANCE } from './constants';
import { InfoBox } from './info-box';
import { RadioOption } from './radio-option';
import { StatusFlow } from './status-flow';
import { ToggleSwitch } from './toggle-switch';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

// Validation Schema
const schema = Yup.object().shape({
  paymentMethods: Yup.object().shape({
    instantPayment: Yup.boolean(),
    payLater: Yup.object().shape({
      allow: Yup.boolean(),
      enableOrderAcceptance: Yup.boolean(),
      chargeOnAcceptance: Yup.boolean(),
      chargeOnDelivery: Yup.boolean(),
    }),
    cashPayment: Yup.boolean(),
  }),
  deliveryMethods: Yup.object().shape({
    counterPickup: Yup.boolean(),
    tableDelivery: Yup.boolean(),
    toGo: Yup.boolean(),
  }),
});

type FormValues = {
  paymentMethods: {
    instantPayment: boolean;
    payLater: {
      allow: boolean;
      enableOrderAcceptance: boolean;
      chargeOnAcceptance: boolean;
      chargeOnDelivery: boolean;
    };
    cashPayment: boolean;
  };
  deliveryMethods: {
    counterPickup: boolean;
    tableDelivery: boolean;
    toGo: boolean;
  };
};

const defaultFormValues: FormValues = {
  paymentMethods: {
    instantPayment: false,
    payLater: {
      allow: false,
      enableOrderAcceptance: false,
      chargeOnAcceptance: false,
      chargeOnDelivery: false,
    },
    cashPayment: false,
  },
  deliveryMethods: {
    counterPickup: true,
    tableDelivery: false,
    toGo: false,
  },
};

export const OrderingSettingsView: React.FC<{ userType: string }> = ({ userType }) => {
  const { companyId: selectedCompanyId } = useCompanySelectionState();
  const { user } = useSelector((state: RootState) => state.userSlice);

  const {
    data: apiData,
    isLoading,
    refetch,
  } = useGetUserByIdQuery(
    { id: userType === 'organizer' ? user?.basicInfo?._id : selectedCompanyId },
    {
      skip: userType === 'super-admin' && !selectedCompanyId,
    }
  );

  const [updateUser, { isLoading: updateUserLoading }] = useUpdateUserForUserListMutation();

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: defaultFormValues,
    mode: 'onChange',
  });

  const {
    reset,
    setValue,
    watch,
    formState: { isDirty, dirtyFields },
  } = methods;

  const payLaterAllow = watch('paymentMethods.payLater.allow');
  const enableOrderAcceptance = watch('paymentMethods.payLater.enableOrderAcceptance');
  const chargeOnAcceptance = watch('paymentMethods.payLater.chargeOnAcceptance');
  const chargeOnDelivery = watch('paymentMethods.payLater.chargeOnDelivery');

  // Payment methods
  const instantPayment = watch('paymentMethods.instantPayment');
  const cashPayment = watch('paymentMethods.cashPayment');

  // Delivery methods
  const counterPickup = watch('deliveryMethods.counterPickup');
  const tableDelivery = watch('deliveryMethods.tableDelivery');
  const toGo = watch('deliveryMethods.toGo');

  // Load initial data from API
  useEffect(() => {
    if (apiData?.basicInfo?.companyDetails?.inAppOrderingSettings) {
      const settings = apiData.basicInfo.companyDetails.inAppOrderingSettings;

      const mappedData: FormValues = {
        paymentMethods: {
          instantPayment: settings.paymentMethods?.instantPayment ?? false,
          payLater: {
            allow: settings.paymentMethods?.payLater?.allow ?? false,
            enableOrderAcceptance: settings.paymentMethods?.payLater?.enableOrderAcceptance ?? false,
            chargeOnAcceptance: settings.paymentMethods?.payLater?.chargeOnAcceptance ?? false,
            chargeOnDelivery: settings.paymentMethods?.payLater?.chargeOnDelivery ?? false,
          },
          cashPayment: settings.paymentMethods?.cashPayment ?? false,
        },
        deliveryMethods: {
          counterPickup: settings.deliveryMethods?.counterPickup ?? true,
          tableDelivery: settings.deliveryMethods?.tableDelivery ?? false,
          toGo: settings.deliveryMethods?.toGo ?? false,
        },
      };

      reset(mappedData);
    }
  }, [apiData, reset]);

  // Validate at least one delivery method is enabled
  const validateDeliveryMethods = (counterPickup: boolean, tableDelivery: boolean, toGo: boolean): boolean => {
    return counterPickup || tableDelivery || toGo;
  };

  // Handle delivery method toggle with validation
  const handleDeliveryMethodToggle = (field: 'counterPickup' | 'tableDelivery' | 'toGo', newValue: boolean) => {
    // Check if this would leave no delivery methods enabled
    const futureState = {
      counterPickup: field === 'counterPickup' ? newValue : counterPickup,
      tableDelivery: field === 'tableDelivery' ? newValue : tableDelivery,
      toGo: field === 'toGo' ? newValue : toGo,
    };

    if (!validateDeliveryMethods(futureState.counterPickup, futureState.tableDelivery, futureState.toGo)) {
      showError('At least one delivery method must be enabled. Ordering will be unavailable if all methods are disabled.');
      return;
    }

    setValue(`deliveryMethods.${field}`, newValue, { shouldDirty: true });
  };

  // Handle payment timing radio selection
  const handlePaymentTimingChange = (timing: 'acceptance' | 'delivery') => {
    if (timing === 'acceptance') {
      setValue('paymentMethods.payLater.chargeOnAcceptance', true, { shouldDirty: true });
      setValue('paymentMethods.payLater.chargeOnDelivery', false, { shouldDirty: true });
    } else {
      setValue('paymentMethods.payLater.chargeOnAcceptance', false, { shouldDirty: true });
      setValue('paymentMethods.payLater.chargeOnDelivery', true, { shouldDirty: true });
    }
  };

  // Build payload with only changed fields
  const buildPartialPayload = (data: FormValues) => {
    const payload: any = {
      id: userType === 'organizer' ? user?.basicInfo?._id : selectedCompanyId,
      companyDetails: {
        inAppOrderingSettings: {},
      },
    };

    // Check if any payment method fields are dirty
    const paymentMethodsDirty =
      dirtyFields.paymentMethods?.instantPayment ||
      dirtyFields.paymentMethods?.cashPayment ||
      dirtyFields.paymentMethods?.payLater?.allow ||
      dirtyFields.paymentMethods?.payLater?.enableOrderAcceptance ||
      dirtyFields.paymentMethods?.payLater?.chargeOnAcceptance ||
      dirtyFields.paymentMethods?.payLater?.chargeOnDelivery;

    if (paymentMethodsDirty) {
      payload.companyDetails.inAppOrderingSettings.paymentMethods = data.paymentMethods;
    }

    // Check if any delivery method fields are dirty
    const deliveryMethodsDirty =
      dirtyFields.deliveryMethods?.counterPickup || dirtyFields.deliveryMethods?.tableDelivery || dirtyFields.deliveryMethods?.toGo;

    if (deliveryMethodsDirty) {
      payload.companyDetails.inAppOrderingSettings.deliveryMethods = data.deliveryMethods;
    }

    return payload;
  };

  // Submit handler
  const handleSubmit = async (data: FormValues) => {
    if (userType === 'super-admin' && !selectedCompanyId) {
      showError('Please select a company first');
      return;
    }

    // Validate at least one delivery method
    if (!validateDeliveryMethods(data.deliveryMethods.counterPickup, data.deliveryMethods.tableDelivery, data.deliveryMethods.toGo)) {
      showError('At least one delivery method must be enabled');
      return;
    }

    try {
      const payload = buildPartialPayload(data);

      // Only proceed if there are changes
      if (!payload.companyDetails.inAppOrderingSettings.paymentMethods && !payload.companyDetails.inAppOrderingSettings.deliveryMethods) {
        showError('No changes to save');
        return;
      }

      const response = await updateUser(payload).unwrap();

      if (response?.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      showSuccess(response?.message || 'Settings saved successfully');

      // Refetch to get updated data
      await refetch();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  if (userType === 'super-admin' && !selectedCompanyId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl opacity-30">🏢</div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">No Company Selected</h3>
          <p className="text-sm text-gray-500 dark:text-gray-500">Please select a company to manage ordering settings</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <AppLoading />
      </div>
    );
  }

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
      <section className="min-h-screen">
        <div className="mx-auto max-w-full rounded-2xl dark:bg-black">
          {/* Payment Methods Section */}
          <div className="mb-6 rounded-2xl bg-white px-7 py-7 shadow-sm dark:bg-[#222121]">
            <div className="mb-6 flex items-center gap-4 border-b-2 border-gray-100 pb-5 dark:border-gray-800">
              <div className="flex-1">
                <h2 className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">Payment Methods</h2>
                <p className="text-[15px] leading-relaxed text-gray-500 dark:text-gray-500">
                  Choose which payment options are available to customers when placing orders
                </p>
              </div>
            </div>

            {/* Instant Payment */}
            <div className="border-b border-gray-100 py-6 dark:border-gray-800">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1 pr-5">
                  <h3 className="mb-1.5 text-lg font-bold text-gray-900 dark:text-gray-100">Instant Payment</h3>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    Customers pay immediately when placing their order. Payment is captured before the order is sent to staff.
                  </p>
                </div>
                <ToggleSwitch
                  checked={instantPayment}
                  onChange={(val) => setValue('paymentMethods.instantPayment', val, { shouldDirty: true })}
                  disabled={isLoading || updateUserLoading}
                />
              </div>
              <InfoBox
                variant="info"
                title="Recommended for most venues"
                description="Instant payment reduces no-shows and ensures guaranteed revenue. Payment is processed securely before order preparation begins."
              />
            </div>

            {/* Pay Later */}
            <div className="border-b border-gray-100 py-6 dark:border-gray-800">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1 pr-5">
                  <h3 className="mb-1.5 text-lg font-bold text-gray-900 dark:text-gray-100">Pay Later</h3>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    Allow customers to order now and pay after the order is prepared or delivered. Payment is captured at a later stage in the order
                    workflow.
                  </p>
                </div>
                <ToggleSwitch
                  checked={payLaterAllow}
                  onChange={(val) => setValue('paymentMethods.payLater.allow', val, { shouldDirty: true })}
                  disabled={isLoading || updateUserLoading}
                />
              </div>

              {payLaterAllow && (
                <div className="mt-5">
                  <div className="rounded-xl bg-gray-50 p-5 dark:bg-[#1a1a1a]">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1 pr-5">
                        <h4 className="mb-1.5 text-base font-bold text-gray-900 dark:text-gray-100">Enable Order Acceptance</h4>
                        <p className="text-[13px] leading-relaxed text-gray-600 dark:text-gray-400">
                          Staff must accept orders before preparation begins. Enables &quot;Sent&quot; → &quot;Accepted&quot; workflow.
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={enableOrderAcceptance}
                        onChange={(val) => setValue('paymentMethods.payLater.enableOrderAcceptance', val, { shouldDirty: true })}
                        disabled={isLoading || updateUserLoading}
                      />
                    </div>

                    {enableOrderAcceptance && (
                      <div className="mt-4 flex flex-col gap-3">
                        <RadioOption
                          value="acceptance"
                          label="Charge on Acceptance"
                          description="Payment is captured when staff accepts the order and begins preparation."
                          selected={chargeOnAcceptance}
                          onSelect={() => handlePaymentTimingChange('acceptance')}
                        />
                        <RadioOption
                          value="delivery"
                          label="Charge on Delivery"
                          description="Payment is captured after the order is fully completed and delivered to the customer."
                          selected={chargeOnDelivery}
                          onSelect={() => handlePaymentTimingChange('delivery')}
                        />
                      </div>
                    )}

                    <StatusFlow
                      title={enableOrderAcceptance ? 'Order Status Flow with Acceptance:' : 'Order Status Flow without Acceptance:'}
                      steps={enableOrderAcceptance ? ORDER_FLOW_WITH_ACCEPTANCE : ORDER_FLOW_WITHOUT_ACCEPTANCE}
                    />
                  </div>
                </div>
              )}

              <InfoBox
                variant="warning"
                title="Important"
                description="Pay later orders may have a higher cancellation rate. Consider enabling order acceptance to confirm availability before preparation."
              />
            </div>

            {/* Cash Payment */}
            <div className="py-6">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1 pr-5">
                  <h3 className="mb-1.5 text-lg font-bold text-gray-900 dark:text-gray-100">Cash Payment</h3>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    Allow customers to pay with cash upon pickup or delivery. Staff marks the order as paid after receiving payment.
                  </p>
                </div>
                <ToggleSwitch
                  checked={cashPayment}
                  onChange={(val) => setValue('paymentMethods.cashPayment', val, { shouldDirty: true })}
                  disabled={isLoading || updateUserLoading}
                />
              </div>
              <InfoBox
                variant="info"
                title="Cash handling workflow"
                description='Orders are marked as "Waiting for Payment" after delivery. Staff confirms payment receipt in the app to complete the order.'
              />
            </div>

            {/* Save Button */}
            <div className="mt-6 flex justify-end border-t border-gray-100 pt-6 dark:border-gray-800">
              {updateUserLoading ? (
                <Button type="button" disabled className="h-10 cursor-not-allowed gap-2 font-semibold">
                  <ButtonLoading title="Saving" />
                </Button>
              ) : (
                <Button type="submit" className="h-10 gap-2 font-semibold" disabled={!isDirty}>
                  Save Payment Settings
                </Button>
              )}
            </div>
          </div>

          {/* Delivery Methods Section */}
          <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-[#222121]">
            <div className="mb-6 flex items-center justify-between gap-4 border-b-2 border-gray-100 pb-5 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h2 className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">Delivery Methods</h2>
                  <p className="text-[15px] leading-relaxed text-gray-500 dark:text-gray-500">
                    Select which delivery options customers can choose when placing orders
                  </p>
                </div>
              </div>
              {/* <Button variant="outline" onClick={handleReset} className="gap-2 font-semibold" disabled>
                <RotateCcw className="h-4 w-4" />
                Reset to Default
              </Button> */}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Counter Pickup */}
              <div
                className={`rounded-xl border-2 p-5 transition-all ${
                  counterPickup
                    ? 'border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-950/30'
                    : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-[#1a1a1a]'
                }`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="mb-2 text-3xl">🥡</div>
                    <h3 className="mb-1.5 text-lg font-bold text-gray-900 dark:text-gray-100">Counter Pickup</h3>
                  </div>
                  <ToggleSwitch
                    checked={counterPickup}
                    onChange={(val) => handleDeliveryMethodToggle('counterPickup', val)}
                    disabled={isLoading || updateUserLoading}
                  />
                </div>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  Customers receive an order number and collect items at the counter when ready.
                </p>
              </div>

              {/* Table Delivery */}
              <div
                className={`rounded-xl border-2 p-5 transition-all ${
                  tableDelivery
                    ? 'border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-950/30'
                    : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-[#1a1a1a]'
                }`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="mb-2 text-3xl">🍽️</div>
                    <h3 className="mb-1.5 text-lg font-bold text-gray-900 dark:text-gray-100">Table Delivery</h3>
                  </div>
                  <ToggleSwitch
                    checked={tableDelivery}
                    onChange={(val) => handleDeliveryMethodToggle('tableDelivery', val)}
                    disabled={isLoading || updateUserLoading}
                  />
                </div>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  Customers enter their table number. Staff delivers orders directly to the table.
                </p>
              </div>

              {/* To Go */}
              <div
                className={`rounded-xl border-2 p-5 transition-all ${
                  toGo
                    ? 'border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-950/30'
                    : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-[#1a1a1a]'
                }`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="mb-2 text-3xl">🛍️</div>
                    <h3 className="mb-1.5 text-lg font-bold text-gray-900 dark:text-gray-100">To Go</h3>
                  </div>
                  <ToggleSwitch
                    checked={toGo}
                    onChange={(val) => handleDeliveryMethodToggle('toGo', val)}
                    disabled={isLoading || updateUserLoading}
                  />
                </div>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  Similar to counter pickup but specifically marked for takeaway orders. Packaged for transport.
                </p>
              </div>
            </div>

            <InfoBox
              variant="warning"
              title="At least one delivery method required"
              description="You must enable at least one delivery method for customers to place orders. If all methods are disabled, ordering will be unavailable."
            />

            {/* Save Button */}
            <div className="mt-6 flex justify-end border-t border-gray-100 pt-6 dark:border-gray-800">
              {updateUserLoading ? (
                <Button type="button" disabled className="h-10 cursor-not-allowed gap-2 font-semibold">
                  <ButtonLoading title="Saving" />
                </Button>
              ) : (
                <Button type="submit" className="h-10 gap-2 font-semibold" disabled={!isDirty}>
                  Save Delivery Settings
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </FormProvider>
  );
};
