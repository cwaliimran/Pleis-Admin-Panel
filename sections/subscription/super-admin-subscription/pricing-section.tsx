'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { useAddSubscriptionPricingMutation, useUpdateSubscriptionPricingMutation } from '@/store/Reducer/subscriptions-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Calendar, Package, TrendingUp, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { PricingSectionSkeleton } from './pricing-section-skeleton';

type PricingFormValues = {
  // Module Pricing
  orderingPrice: number;
  loyaltyPrice: number;
  reservationsPrice: number;
  analyticsPrice: number;
  // Commissions
  orderingCommission: number;
  ticketingCommission: number;
  reservationCommission: number;
  // Bundle Discounts
  twoModulesDiscount: number;
  threeModulesDiscount: number;
  // Multi-Org Pricing
  oneOrg: number;
  twoOrgs: number;
  threeOrgs: number;
  fourOrgs: number;
  fiveOrgs: number;
  sixPlusOrgs: number;
  // Yearly Discount
  yearlyDiscount: number;
};

const schema = Yup.object().shape({
  // Module Pricing
  orderingPrice: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? 0 : value))
    .min(0, 'Must be at least 0')
    .required('Ordering price is required')
    .default(0),
  loyaltyPrice: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? 0 : value))
    .min(0, 'Must be at least 0')
    .required('Loyalty price is required')
    .default(0),
  reservationsPrice: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? 0 : value))
    .min(0, 'Must be at least 0')
    .required('Reservations price is required')
    .default(0),
  analyticsPrice: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? 0 : value))
    .min(0, 'Must be at least 0')
    .required('Analytics price is required')
    .default(0),
  // Commissions
  orderingCommission: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? 0 : value))
    .min(0, 'Must be at least 0')
    .max(100, 'Cannot exceed 100%')
    .required('Ordering commission is required')
    .default(0),
  ticketingCommission: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? 0 : value))
    .min(0, 'Must be at least 0')
    .max(100, 'Cannot exceed 100%')
    .required('Ticketing commission is required')
    .default(0),
  reservationCommission: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? 0 : value))
    .min(0, 'Must be at least 0')
    .max(100, 'Cannot exceed 100%')
    .required('Reservation commission is required')
    .default(0),
  // Bundle Discounts
  twoModulesDiscount: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? 0 : value))
    .min(0, 'Must be at least 0')
    .max(100, 'Cannot exceed 100%')
    .required('Two modules discount is required')
    .default(0),
  threeModulesDiscount: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? 0 : value))
    .min(0, 'Must be at least 0')
    .max(100, 'Cannot exceed 100%')
    .required('Three modules discount is required')
    .default(0),
  // Multi-Org Pricing
  oneOrg: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? 0 : value))
    .min(0, 'Must be at least 0')
    .max(100, 'Cannot exceed 100%')
    .required('One org pricing is required')
    .default(100),
  twoOrgs: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? 0 : value))
    .min(0, 'Must be at least 0')
    .max(100, 'Cannot exceed 100%')
    .required('Two orgs pricing is required')
    .default(95),
  threeOrgs: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? 0 : value))
    .min(0, 'Must be at least 0')
    .max(100, 'Cannot exceed 100%')
    .required('Three orgs pricing is required')
    .default(90),
  fourOrgs: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? 0 : value))
    .min(0, 'Must be at least 0')
    .max(100, 'Cannot exceed 100%')
    .required('Four orgs pricing is required')
    .default(85),
  fiveOrgs: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? 0 : value))
    .min(0, 'Must be at least 0')
    .max(100, 'Cannot exceed 100%')
    .required('Five orgs pricing is required')
    .default(80),
  sixPlusOrgs: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? 0 : value))
    .min(0, 'Must be at least 0')
    .max(100, 'Cannot exceed 100%')
    .required('Six plus orgs pricing is required')
    .default(75),
  // Yearly Discount
  yearlyDiscount: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? 0 : value))
    .min(0, 'Must be at least 0')
    .max(100, 'Cannot exceed 100%')
    .required('Yearly discount is required')
    .default(0),
}) as Yup.ObjectSchema<PricingFormValues>;

const defaultValues: PricingFormValues = {
  orderingPrice: 0,
  loyaltyPrice: 0,
  reservationsPrice: 0,
  analyticsPrice: 0,
  orderingCommission: 0,
  ticketingCommission: 0,
  reservationCommission: 0,
  twoModulesDiscount: 0,
  threeModulesDiscount: 0,
  oneOrg: 100,
  twoOrgs: 95,
  threeOrgs: 90,
  fourOrgs: 85,
  fiveOrgs: 80,
  sixPlusOrgs: 75,
  yearlyDiscount: 0,
};

interface PricingSectionProps {
  apiData: any;
  isLoading: boolean;
  isFetching: boolean;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ apiData, isLoading, isFetching }) => {
  const [addSubPricing, { isLoading: isAdding }] = useAddSubscriptionPricingMutation();
  const [updateSubPricing, { isLoading: isUpdating }] = useUpdateSubscriptionPricingMutation();

  const [existingPricingId, setExistingPricingId] = useState<string | null>(null);

  const methods = useForm<PricingFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const { reset, formState, watch } = methods;
  const isDirty = formState?.isDirty;

  // Watch values for display calculations
  const oneOrgValue = watch('oneOrg');
  const twoOrgsValue = watch('twoOrgs');
  const threeOrgsValue = watch('threeOrgs');
  const fourOrgsValue = watch('fourOrgs');
  const fiveOrgsValue = watch('fiveOrgs');
  const sixPlusOrgsValue = watch('sixPlusOrgs');
  // const yearlyDiscountValue = watch('yearlyDiscount');

  // Load existing pricing data when available
  useEffect(() => {
    if (!isLoading && !isFetching && apiData?.data) {
      if (Array.isArray(apiData.data) && apiData.data.length > 0) {
        const existingPricing = apiData.data[0];
        setExistingPricingId(existingPricing._id);

        // Map API response to form values
        const mappedValues: PricingFormValues = {
          orderingPrice: existingPricing.modulePricing.find((m: any) => m.module === 'ordering')?.price || 0,
          loyaltyPrice: existingPricing.modulePricing.find((m: any) => m.module === 'loyalty')?.price || 0,
          reservationsPrice: existingPricing.modulePricing.find((m: any) => m.module === 'reservations')?.price || 0,
          analyticsPrice: existingPricing.modulePricing.find((m: any) => m.module === 'analytics')?.price || 0,
          orderingCommission: existingPricing.commissions?.orderingCommission || 0,
          ticketingCommission: existingPricing.commissions?.ticketingCommission || 0,
          reservationCommission: existingPricing.commissions?.reservationCommission || 0,
          twoModulesDiscount: existingPricing.bundleDiscounts?.twoModules || 0,
          threeModulesDiscount: existingPricing.bundleDiscounts?.threeModules || 0,
          oneOrg: existingPricing.multiOrgPricing?.oneOrg || 100,
          twoOrgs: existingPricing.multiOrgPricing?.twoOrgs || 95,
          threeOrgs: existingPricing.multiOrgPricing?.threeOrgs || 90,
          fourOrgs: existingPricing.multiOrgPricing?.fourOrgs || 85,
          fiveOrgs: existingPricing.multiOrgPricing?.fiveOrgs || 80,
          sixPlusOrgs: existingPricing.multiOrgPricing?.sixPlusOrgs || 75,
          yearlyDiscount: existingPricing.yearlyDiscount?.discountPercent || 0,
        };

        reset(mappedValues);
      } else {
        // No existing data
        setExistingPricingId(null);
        reset(defaultValues);
      }
    }
  }, [apiData, isLoading, isFetching, reset]);

  const handleSubmit = async (formData: PricingFormValues) => {
    try {
      // Transform form data to API payload format
      const payload = {
        modulePricing: [
          { module: 'ordering', price: Number(formData.orderingPrice) },
          { module: 'loyalty', price: Number(formData.loyaltyPrice) },
          { module: 'reservations', price: Number(formData.reservationsPrice) },
          { module: 'analytics', price: Number(formData.analyticsPrice) },
        ],
        commissions: {
          orderingCommission: Number(formData.orderingCommission),
          ticketingCommission: Number(formData.ticketingCommission),
          reservationCommission: Number(formData.reservationCommission),
        },
        bundleDiscounts: {
          twoModules: Number(formData.twoModulesDiscount),
          threeModules: Number(formData.threeModulesDiscount),
        },
        multiOrgPricing: {
          oneOrg: Number(formData.oneOrg),
          twoOrgs: Number(formData.twoOrgs),
          threeOrgs: Number(formData.threeOrgs),
          fourOrgs: Number(formData.fourOrgs),
          fiveOrgs: Number(formData.fiveOrgs),
          sixPlusOrgs: Number(formData.sixPlusOrgs),
        },
        yearlyDiscount: {
          discountPercent: Number(formData.yearlyDiscount),
        },
      };

      let response;

      if (existingPricingId) {
        // Update existing pricing
        response = await updateSubPricing({ id: existingPricingId, ...payload }).unwrap();
      } else {
        // Create new pricing
        response = await addSubPricing(payload).unwrap();
      }

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || `Pricing configuration ${existingPricingId ? 'updated' : 'created'} successfully`);

      // Update existing pricing ID if this was a creation
      if (!existingPricingId && response?.data?._id) {
        setExistingPricingId(response.data._id);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  const isSaving = isAdding || isUpdating;

  // Show skeleton while loading
  if (isLoading) {
    return <PricingSectionSkeleton />;
  }

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
      <div className="space-y-6">
        {/* Module Pricing */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-[#1a1a1a]">
          <div className="mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Module Pricing</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Ordering */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Ordering</label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">€</span>
                <RHFTextField name="orderingPrice" type="number" placeholder="0" min="0" step="0.01" className="pr-16 pl-8" />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">/month</span>
              </div>
            </div>

            {/* Loyalty */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Loyalty</label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">€</span>
                <RHFTextField name="loyaltyPrice" type="number" placeholder="0" min="0" step="0.01" className="pr-16 pl-8" />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">/month</span>
              </div>
            </div>

            {/* Reservations */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Reservations</label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">€</span>
                <RHFTextField name="reservationsPrice" type="number" placeholder="0" min="0" step="0.01" className="pr-16 pl-8" />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">/month</span>
              </div>
            </div>

            {/* Analytics */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Analytics
                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">(Fixed price, no discounts)</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">€</span>
                <RHFTextField name="analyticsPrice" type="number" placeholder="0" min="0" step="0.01" className="pr-16 pl-8" />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">/month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Commission Settings */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-[#1a1a1a]">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Default Commission Rates</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {/* Ordering Commission */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Ordering</label>
              <div className="relative">
                <RHFTextField name="orderingCommission" type="number" placeholder="0" min="0" max="100" step="0.01" className="pr-8" />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>

            {/* Ticketing Commission */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Ticketing</label>
              <div className="relative">
                <RHFTextField name="ticketingCommission" type="number" placeholder="0" min="0" max="100" step="0.01" className="pr-8" />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>

            {/* Reservation Commission */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Reservations</label>
              <div className="relative">
                <RHFTextField name="reservationCommission" type="number" placeholder="0" min="0" max="100" step="0.01" className="pr-8" />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bundle Discounts */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-[#1a1a1a]">
          <div className="mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Bundle Discounts</h3>
          </div>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Discounts applied when multiple modules are selected (excludes Analytics)</p>
          <div className="grid grid-cols-2 gap-4">
            {/* 2 Modules Discount */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">2 Modules Selected</label>
              <div className="relative">
                <RHFTextField name="twoModulesDiscount" type="number" placeholder="0" min="0" max="100" step="0.01" className="pr-8" />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>

            {/* 3 Modules Discount */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">3 Modules Selected</label>
              <div className="relative">
                <RHFTextField name="threeModulesDiscount" type="number" placeholder="0" min="0" max="100" step="0.01" className="pr-8" />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Organization Pricing */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-[#1a1a1a]">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Multi-Organization Pricing</h3>
          </div>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Percentage of base price per organization</p>
          <div className="space-y-3">
            {/* 1 Org */}
            <div className="flex items-center gap-4">
              <div className="w-32">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">1 Org</label>
              </div>
              <div className="relative flex-1">
                <RHFTextField name="oneOrg" type="number" placeholder="0" min="0" max="100" step="0.01" className="pr-8" />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
              </div>
              <div className="w-40 text-sm text-gray-600 dark:text-gray-400">Total: {(1 * oneOrgValue).toFixed(0)}%</div>
            </div>

            {/* 2 Orgs */}
            <div className="flex items-center gap-4">
              <div className="w-32">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">2 Orgs</label>
              </div>
              <div className="relative flex-1">
                <RHFTextField name="twoOrgs" type="number" placeholder="0" min="0" max="100" step="0.01" className="pr-8" />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
              </div>
              <div className="w-40 text-sm text-gray-600 dark:text-gray-400">Total: {(2 * twoOrgsValue).toFixed(0)}%</div>
            </div>

            {/* 3 Orgs */}
            <div className="flex items-center gap-4">
              <div className="w-32">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">3 Orgs</label>
              </div>
              <div className="relative flex-1">
                <RHFTextField name="threeOrgs" type="number" placeholder="0" min="0" max="100" step="0.01" className="pr-8" />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
              </div>
              <div className="w-40 text-sm text-gray-600 dark:text-gray-400">Total: {(3 * threeOrgsValue).toFixed(0)}%</div>
            </div>

            {/* 4 Orgs */}
            <div className="flex items-center gap-4">
              <div className="w-32">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">4 Orgs</label>
              </div>
              <div className="relative flex-1">
                <RHFTextField name="fourOrgs" type="number" placeholder="0" min="0" max="100" step="0.01" className="pr-8" />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
              </div>
              <div className="w-40 text-sm text-gray-600 dark:text-gray-400">Total: {(4 * fourOrgsValue).toFixed(0)}%</div>
            </div>

            {/* 5 Orgs */}
            <div className="flex items-center gap-4">
              <div className="w-32">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">5 Orgs</label>
              </div>
              <div className="relative flex-1">
                <RHFTextField name="fiveOrgs" type="number" placeholder="0" min="0" max="100" step="0.01" className="pr-8" />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
              </div>
              <div className="w-40 text-sm text-gray-600 dark:text-gray-400">Total: {(5 * fiveOrgsValue).toFixed(0)}%</div>
            </div>

            {/* 6+ Orgs */}
            <div className="flex items-center gap-4">
              <div className="w-32">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">6+ Orgs</label>
              </div>
              <div className="relative flex-1">
                <RHFTextField name="sixPlusOrgs" type="number" placeholder="0" min="0" max="100" step="0.01" className="pr-8" />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
              </div>
              <div className="w-40 text-sm text-gray-600 dark:text-gray-400">Total: {(6 * sixPlusOrgsValue).toFixed(0)}%</div>
            </div>
          </div>
        </div>

        {/* Yearly Discount */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-[#1a1a1a]">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Yearly Subscription Discount</h3>
          </div>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Discount applied when paying yearly instead of monthly</p>

          <div className="max-w-xs space-y-2">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Yearly Discount</label>
            <div className="relative">
              <RHFTextField name="yearlyDiscount" type="number" placeholder="0" min="0" max="100" step="0.01" className="pr-8" />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">%</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          {isSaving ? (
            <Button disabled className="bg-primary hover:bg-primary h-10 cursor-not-allowed gap-2 font-semibold text-white">
              <ButtonLoading title={existingPricingId ? 'Updating' : 'Saving'} />
            </Button>
          ) : (
            <Button type="submit" className="bg-primary hover:bg-primary-dark h-10 gap-2 font-semibold text-white" disabled={!isDirty}>
              {existingPricingId ? 'Update Pricing' : 'Save Pricing'}
            </Button>
          )}
        </div>
      </div>
    </FormProvider>
  );
};
