'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFDate, RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateSubscriptionMutation } from '@/store/Reducer/subscriptions-api';
import { getErrorMessage } from '@/utils/api';
import { fDate, formatStr } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';

type SubscriptionType = 'ordering' | 'loyalty' | 'reservations' | 'analytics';

type SubscriptionFormValues = {
  subscriptionTypes: SubscriptionType[];
  pricingPlan: 'monthly' | 'yearly';
  numberOfOrganizations: number;
  startDate: string | Date;
  endDate: string | Date;
  orderingCommission: number;
  ticketingCommission: number;
  reservationCommission: number;
  totalSubscriptionAmount: number;
  status: 'active' | 'inactive' | 'cancelled';
};

type SubscriptionModalProps = {
  open: boolean;
  onClose: () => void;
  selectedData: any;
  pricingData: any;
};

const SUBSCRIPTION_TYPE_NAMES: Record<SubscriptionType, string> = {
  ordering: 'Ordering',
  loyalty: 'Loyalty',
  reservations: 'Reservations',
  analytics: 'Analytics',
};

const schema = Yup.object().shape({
  subscriptionTypes: Yup.array()
    .of(Yup.string().oneOf(['ordering', 'loyalty', 'reservations', 'analytics']))
    .min(1, 'Select at least one subscription type')
    .required('Subscription types are required')
    .default([]),
  pricingPlan: Yup.string().oneOf(['monthly', 'yearly']).required('Pricing plan is required').default('monthly'),
  numberOfOrganizations: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Number of organizations is required')
    .min(1, 'Must be at least 1')
    .default(1),
  startDate: Yup.date().required('Start date is required').typeError('Invalid date'),
  endDate: Yup.date().required('End date is required').min(Yup.ref('startDate'), 'End date must be after start date').typeError('Invalid date'),
  orderingCommission: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? 0 : value))
    .min(0, 'Must be at least 0')
    .max(100, 'Cannot exceed 100%')
    .default(0),
  ticketingCommission: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? 0 : value))
    .min(0, 'Must be at least 0')
    .max(100, 'Cannot exceed 100%')
    .default(0),
  reservationCommission: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? 0 : value))
    .min(0, 'Must be at least 0')
    .max(100, 'Cannot exceed 100%')
    .default(0),
  totalSubscriptionAmount: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? 0 : value))
    .min(0, 'Amount must be at least 0')
    .required('Total subscription amount is required')
    .default(0),
  status: Yup.string().oneOf(['active', 'inactive', 'cancelled']).required('Status is required').default('active'),
}) as Yup.ObjectSchema<SubscriptionFormValues>;

const defaultValues: SubscriptionFormValues = {
  subscriptionTypes: [],
  pricingPlan: 'monthly',
  numberOfOrganizations: 1,
  startDate: '',
  endDate: '',
  orderingCommission: 0,
  ticketingCommission: 0,
  reservationCommission: 0,
  totalSubscriptionAmount: 0,
  status: 'active',
};

const SubscriptionModal = ({ open, onClose, selectedData, pricingData }: SubscriptionModalProps) => {
  const [updateSubscription, { isLoading: isUpdating }] = useUpdateSubscriptionMutation();

  const methods = useForm<SubscriptionFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const { reset, formState, watch, setValue } = methods;
  const isDirty = formState?.isDirty;

  const errors = formState?.errors;
  console.log('errors', errors);

  const watchedSubscriptionTypes = watch('subscriptionTypes');
  const watchedNumberOfOrganizations = watch('numberOfOrganizations');
  const watchedPricingPlan = watch('pricingPlan');

  const selectedSubscriptionTypes = useMemo(() => watchedSubscriptionTypes || [], [watchedSubscriptionTypes]);
  const numberOfOrganizations = useMemo(() => {
    const num = Number(watchedNumberOfOrganizations) || 1;
    return num;
  }, [watchedNumberOfOrganizations]);
  const pricingPlan = useMemo(() => watchedPricingPlan || 'monthly', [watchedPricingPlan]);

  const modulePrices = (() => {
    if (!pricingData?.modulePricing) return {};

    return pricingData.modulePricing.reduce((acc: Record<string, number>, item: any) => {
      acc[item.module] = item.price || 0;
      return acc;
    }, {});
  })();

  const bundleDiscounts = (() => {
    return {
      twoModules: pricingData?.bundleDiscounts?.twoModules || 0,
      threeModules: pricingData?.bundleDiscounts?.threeModules || 0,
    };
  })();

  const yearlyDiscount = (() => {
    return pricingData?.yearlyDiscount?.discountPercent || 0;
  })();

  const pricingCalculation = useMemo(() => {
    const baseModulePrice = selectedSubscriptionTypes.reduce((total, type) => {
      return total + (modulePrices[type] || 0);
    }, 0);

    const nonAnalyticsModules = selectedSubscriptionTypes.filter((type) => type !== 'analytics');
    const nonAnalyticsCount = nonAnalyticsModules.length;

    let bundleDiscountPercent = 0;

    if (nonAnalyticsCount === 2) {
      bundleDiscountPercent = bundleDiscounts.twoModules;
    } else if (nonAnalyticsCount === 3) {
      bundleDiscountPercent = bundleDiscounts.threeModules;
    }

    const bundleDiscountAmount = (baseModulePrice * bundleDiscountPercent) / 100;
    const priceAfterBundleDiscount = baseModulePrice - bundleDiscountAmount;

    let orgPricingPercent = 100;

    const freshMultiOrgPricing = {
      oneOrg: pricingData?.multiOrgPricing?.oneOrg || 100,
      twoOrgs: pricingData?.multiOrgPricing?.twoOrgs || 95,
      threeOrgs: pricingData?.multiOrgPricing?.threeOrgs || 90,
      fourOrgs: pricingData?.multiOrgPricing?.fourOrgs || 85,
      fiveOrgs: pricingData?.multiOrgPricing?.fiveOrgs || 80,
      sixPlusOrgs: pricingData?.multiOrgPricing?.sixPlusOrgs || 75,
    };

    const numOrgs = Number(numberOfOrganizations);
    if (numOrgs === 1) {
      orgPricingPercent = freshMultiOrgPricing.oneOrg;
    } else if (numOrgs === 2) {
      orgPricingPercent = freshMultiOrgPricing.twoOrgs;
    } else if (numOrgs === 3) {
      orgPricingPercent = freshMultiOrgPricing.threeOrgs;
    } else if (numOrgs === 4) {
      orgPricingPercent = freshMultiOrgPricing.fourOrgs;
    } else if (numOrgs === 5) {
      orgPricingPercent = freshMultiOrgPricing.fiveOrgs;
    } else if (numOrgs >= 6) {
      orgPricingPercent = freshMultiOrgPricing.sixPlusOrgs;
    }

    const pricePerOrg = (priceAfterBundleDiscount * orgPricingPercent) / 100;
    const totalMultiOrgPrice = pricePerOrg * numOrgs;

    let yearlyDiscountAmount = 0;
    const finalMonthlyPrice = totalMultiOrgPrice;
    let finalYearlyPrice = totalMultiOrgPrice * 12;

    if (pricingPlan === 'yearly') {
      yearlyDiscountAmount = (finalYearlyPrice * yearlyDiscount) / 100;
      finalYearlyPrice = finalYearlyPrice - yearlyDiscountAmount;
    }

    return {
      baseModulePrice,
      nonAnalyticsCount,
      bundleDiscountPercent,
      bundleDiscountAmount,
      priceAfterBundleDiscount,
      orgPricingPercent,
      pricePerOrg,
      totalMultiOrgPrice,
      yearlyDiscountAmount,
      finalMonthlyPrice,
      finalYearlyPrice,
      finalAmount: pricingPlan === 'yearly' ? finalYearlyPrice : finalMonthlyPrice,
    };
  }, [selectedSubscriptionTypes, modulePrices, numberOfOrganizations, pricingPlan, bundleDiscounts, yearlyDiscount, pricingData]);

  useEffect(() => {
    if (pricingCalculation.finalAmount >= 0) {
      setValue('totalSubscriptionAmount', Number(pricingCalculation.finalAmount.toFixed(2)), { shouldDirty: false });
    }
  }, [pricingCalculation.finalAmount, setValue]);

  useEffect(() => {
    if (open && selectedData?.subscription) {
      const subscription = selectedData.subscription;

      const mappedData: SubscriptionFormValues = {
        subscriptionTypes: subscription?.subscriptionTypes || [],
        pricingPlan: subscription?.pricingPlan || 'monthly',
        numberOfOrganizations: subscription?.numberOfOrganizations || 1,
        startDate: subscription?.startDate ? new Date(subscription.startDate) : '',
        endDate: subscription?.endDate ? new Date(subscription.endDate) : '',
        orderingCommission: subscription?.orderingCommission || 0,
        ticketingCommission: subscription?.ticketingCommission || 0,
        reservationCommission: subscription?.reservationCommission || 0,
        totalSubscriptionAmount: subscription?.totalSubscriptionAmount || 0,
        status: subscription?.status || 'active',
      };

      reset(mappedData);
    } else if (open && !selectedData) {
      reset(defaultValues);
    }
  }, [open, selectedData, reset]);

  const handleSubscriptionTypeToggle = (type: SubscriptionType) => {
    const updatedTypes = selectedSubscriptionTypes.includes(type)
      ? selectedSubscriptionTypes.filter((t) => t !== type)
      : [...selectedSubscriptionTypes, type];

    setValue('subscriptionTypes', updatedTypes, { shouldDirty: true, shouldValidate: true });
  };

  const handleSubmit = async (formData: SubscriptionFormValues) => {
    try {
      const dirtyFields = formState.dirtyFields;

      const updatedSubscriptionFields: Partial<SubscriptionFormValues> = {};

      const pricingAffectingFields = ['subscriptionTypes', 'pricingPlan', 'numberOfOrganizations'];
      const isPricingAffected = pricingAffectingFields.some((field) => dirtyFields[field as keyof typeof dirtyFields]);

      if (dirtyFields.subscriptionTypes) {
        updatedSubscriptionFields.subscriptionTypes = formData.subscriptionTypes;
      }
      if (dirtyFields.pricingPlan) {
        updatedSubscriptionFields.pricingPlan = formData.pricingPlan;
      }
      if (dirtyFields.numberOfOrganizations) {
        updatedSubscriptionFields.numberOfOrganizations = Number(formData.numberOfOrganizations);
      }
      if (dirtyFields.startDate) {
        updatedSubscriptionFields.startDate = fDate(formData.startDate, formatStr.paramCase.db) as any;
      }
      if (dirtyFields.endDate) {
        updatedSubscriptionFields.endDate = fDate(formData.endDate, formatStr.paramCase.db) as any;
      }
      if (dirtyFields.orderingCommission) {
        updatedSubscriptionFields.orderingCommission = Number(formData.orderingCommission);
      }
      if (dirtyFields.ticketingCommission) {
        updatedSubscriptionFields.ticketingCommission = Number(formData.ticketingCommission);
      }
      if (dirtyFields.reservationCommission) {
        updatedSubscriptionFields.reservationCommission = Number(formData.reservationCommission);
      }
      if (dirtyFields.totalSubscriptionAmount) {
        updatedSubscriptionFields.totalSubscriptionAmount = Number(formData.totalSubscriptionAmount);
      }
      if (dirtyFields.status) {
        updatedSubscriptionFields.status = formData.status;
      }

      if (isPricingAffected && !dirtyFields.totalSubscriptionAmount) {
        updatedSubscriptionFields.totalSubscriptionAmount = Number(formData.totalSubscriptionAmount);
      }

      const payload: any = {
        userId: selectedData?.userId,
        subscription: updatedSubscriptionFields,
      };

      const response = await updateSubscription(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'Subscription updated successfully');

      methods.reset(defaultValues);
      onClose();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[35vh] w-full flex-col items-center overflow-y-auto md:max-w-[700px]!"
        >
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-6 flex w-full flex-col gap-4">
                {selectedData && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      User: {selectedData?.firstName || ''} {selectedData?.lastName || ''}
                    </p>
                    {selectedData?.username && <p className="text-xs text-gray-500 dark:text-gray-400">Username: {selectedData.username}</p>}
                  </div>
                )}

                <div>
                  <Label className="mb-2 block text-sm font-medium">Pricing Plan</Label>
                  <Controller
                    name="pricingPlan"
                    control={methods.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select pricing plan" />
                        </SelectTrigger>
                        <SelectContent aria-describedby={undefined}>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {formState.errors.pricingPlan && <p className="mt-1 text-sm text-red-500">{formState.errors.pricingPlan.message}</p>}
                </div>

                <div>
                  <Label className="mb-2 block text-sm font-medium">Subscription Types</Label>
                  <div className="space-y-3 rounded-lg border p-4 dark:border-gray-700">
                    {(Object.keys(SUBSCRIPTION_TYPE_NAMES) as SubscriptionType[]).map((type) => {
                      const price = modulePrices[type] || 0;
                      return (
                        <div key={type} className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              id={type}
                              checked={selectedSubscriptionTypes.includes(type)}
                              onCheckedChange={() => handleSubscriptionTypeToggle(type)}
                            />
                            <Label htmlFor={type} className="cursor-pointer text-sm font-normal">
                              {SUBSCRIPTION_TYPE_NAMES[type]}
                            </Label>
                          </div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">€{price.toFixed(2)}/month</span>
                        </div>
                      );
                    })}
                  </div>
                  {formState.errors.subscriptionTypes && <p className="mt-1 text-sm text-red-500">{formState.errors.subscriptionTypes.message}</p>}
                </div>

                <RHFTextField name="numberOfOrganizations" label="Number of Organizations" type="number" placeholder="Enter number" min="1" />

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFDate name="startDate" label="Start Date" placeholder="Select start date" />
                  <RHFDate name="endDate" label="End Date" placeholder="Select end date" />
                </div>

                <div>
                  <Label className="mb-2 block text-sm font-medium">Commission Overrides (%)</Label>
                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
                    <RHFTextField name="orderingCommission" label="Ordering" type="number" placeholder="0" min="0" max="100" step="0.01" />

                    <RHFTextField name="ticketingCommission" label="Ticketing" type="number" placeholder="0" min="0" max="100" step="0.01" />

                    <RHFTextField name="reservationCommission" label="Reservations" type="number" placeholder="0" min="0" max="100" step="0.01" />
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-900/20">
                  <p className="font-medium text-blue-900 dark:text-blue-300">💡 Note:</p>
                  <p className="mt-1 text-xs text-blue-800 dark:text-blue-400">
                    Commission rates are percentage values. Enter values between 0-100%.
                  </p>
                </div>

                {selectedSubscriptionTypes.length > 0 && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                    <h4 className="mb-3 text-sm font-semibold text-blue-900 dark:text-blue-300">📊 Pricing Breakdown</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">
                          Base Module Price ({selectedSubscriptionTypes.length} module{selectedSubscriptionTypes.length > 1 ? 's' : ''}):
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">€{pricingCalculation.baseModulePrice.toFixed(2)}</span>
                      </div>

                      {pricingCalculation.bundleDiscountPercent > 0 && (
                        <>
                          <div className="flex items-center justify-between text-green-700 dark:text-green-400">
                            <span>
                              Bundle Discount ({pricingCalculation.nonAnalyticsCount} non-analytics modules -{' '}
                              {pricingCalculation.bundleDiscountPercent}
                              %):
                            </span>
                            <span className="font-medium">-€{pricingCalculation.bundleDiscountAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between border-t border-blue-300 pt-2 dark:border-blue-700">
                            <span className="text-gray-700 dark:text-gray-300">After Bundle Discount:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              €{pricingCalculation.priceAfterBundleDiscount.toFixed(2)}
                            </span>
                          </div>
                        </>
                      )}

                      <div className="flex items-center justify-between border-t border-blue-300 pt-2 dark:border-blue-700">
                        <span className="text-gray-700 dark:text-gray-300">Price per Org (at {pricingCalculation.orgPricingPercent}%):</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">€{pricingCalculation.pricePerOrg.toFixed(2)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">
                          × {numberOfOrganizations} Organization{numberOfOrganizations > 1 ? 's' : ''}:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">€{pricingCalculation.totalMultiOrgPrice.toFixed(2)}</span>
                      </div>

                      {pricingPlan === 'yearly' && (
                        <>
                          <div className="flex items-center justify-between border-t border-blue-300 pt-2 dark:border-blue-700">
                            <span className="text-gray-700 dark:text-gray-300">Monthly × 12:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              €{(pricingCalculation.totalMultiOrgPrice * 12).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-green-700 dark:text-green-400">
                            <span>Yearly Discount ({yearlyDiscount}%):</span>
                            <span className="font-medium">-€{pricingCalculation.yearlyDiscountAmount.toFixed(2)}</span>
                          </div>
                        </>
                      )}

                      <div className="flex items-center justify-between border-t-2 border-blue-400 pt-2 dark:border-blue-600">
                        <span className="font-semibold text-blue-900 dark:text-blue-300">
                          Total {pricingPlan === 'yearly' ? 'Yearly' : 'Monthly'} Amount:
                        </span>
                        <span className="text-lg font-bold text-blue-900 dark:text-blue-300">€{pricingCalculation.finalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                  <RHFTextField
                    name="totalSubscriptionAmount"
                    label="Final Amount (Editable)"
                    type="number"
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    You can adjust this amount to apply additional discounts or custom pricing
                  </p>
                </div>

                <div>
                  <Label className="mb-2 block text-sm font-medium">Status</Label>
                  <Controller
                    name="status"
                    control={methods.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent aria-describedby={undefined}>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          {/* <SelectItem value="cancelled">Cancelled</SelectItem> */}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {formState.errors.status && <p className="mt-1 text-sm text-red-500">{formState.errors.status.message}</p>}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-3">
                <Button type="button" variant="outline" onClick={handleClose} disabled={isUpdating} className="px-6">
                  Cancel
                </Button>

                {isUpdating ? (
                  <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-6 text-white">
                    <ButtonLoading title="Updating" />
                  </Button>
                ) : (
                  <Button type="submit" className="bg-primary hover:bg-primary-dark cursor-pointer px-6 text-white" disabled={!isDirty}>
                    Save Changes
                  </Button>
                )}
              </div>
            </FormProvider>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default SubscriptionModal;
