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

const SUBSCRIPTION_TYPE_PRICES: Record<SubscriptionType, number> = {
  ordering: 30,
  loyalty: 40,
  reservations: 30,
  analytics: 20,
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

  console.log('pricingData', pricingData);

  const methods = useForm<SubscriptionFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const { reset, formState, watch, setValue } = methods;
  const isDirty = formState?.isDirty;

  const watchedSubscriptionTypes = watch('subscriptionTypes');
  const watchedNumberOfOrganizations = watch('numberOfOrganizations');

  const selectedSubscriptionTypes = useMemo(() => watchedSubscriptionTypes || [], [watchedSubscriptionTypes]);
  const numberOfOrganizations = useMemo(() => watchedNumberOfOrganizations || 1, [watchedNumberOfOrganizations]);

  // Calculate total based on selected subscription types and number of organizations
  const calculatedTotal = useMemo(() => {
    const subtotal = selectedSubscriptionTypes.reduce((total, type) => {
      return total + (SUBSCRIPTION_TYPE_PRICES[type] || 0);
    }, 0);
    return subtotal * numberOfOrganizations;
  }, [selectedSubscriptionTypes, numberOfOrganizations]);

  // Update total amount when calculated total changes
  useEffect(() => {
    if (calculatedTotal > 0) {
      setValue('totalSubscriptionAmount', calculatedTotal, { shouldDirty: false });
    }
  }, [calculatedTotal, setValue]);

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
      const payload: any = {
        userId: selectedData?.userId,
        subscription: {
          subscriptionTypes: formData.subscriptionTypes,
          pricingPlan: formData.pricingPlan,
          numberOfOrganizations: Number(formData.numberOfOrganizations),
          startDate: fDate(formData.startDate, formatStr.paramCase.db),
          endDate: fDate(formData.endDate, formatStr.paramCase.db),
          orderingCommission: Number(formData.orderingCommission),
          ticketingCommission: Number(formData.ticketingCommission),
          reservationCommission: Number(formData.reservationCommission),
          totalSubscriptionAmount: Number(formData.totalSubscriptionAmount),
          status: formData.status,
        },
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
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[35vh] w-full flex-col items-center overflow-y-auto md:max-w-[650px]!"
        >
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-6 flex w-full flex-col gap-4">
                {/* User Info Display */}
                {selectedData && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      User: {selectedData?.firstName || ''} {selectedData?.lastName || ''}
                    </p>
                    {selectedData?.username && <p className="text-xs text-gray-500 dark:text-gray-400">Username: {selectedData.username}</p>}
                  </div>
                )}

                {/* Pricing Plan */}
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

                {/* Subscription Types */}
                <div>
                  <Label className="mb-2 block text-sm font-medium">Subscription Types</Label>
                  <div className="space-y-3 rounded-lg border p-4 dark:border-gray-700">
                    {(Object.keys(SUBSCRIPTION_TYPE_NAMES) as SubscriptionType[]).map((type) => (
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
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">€{SUBSCRIPTION_TYPE_PRICES[type]}</span>
                      </div>
                    ))}
                  </div>
                  {formState.errors.subscriptionTypes && <p className="mt-1 text-sm text-red-500">{formState.errors.subscriptionTypes.message}</p>}
                </div>

                {/* Number of Organizations */}
                <RHFTextField name="numberOfOrganizations" label="Number of Organizations" type="number" placeholder="Enter number" min="1" />

                {/* Date Range */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFDate name="startDate" label="Start Date" placeholder="Select start date" />
                  <RHFDate name="endDate" label="End Date" placeholder="Select end date" />
                </div>

                {/* Commission Overrides */}
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

                {/* Total Amount Section */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                  <div className="mb-3 flex items-center justify-between">
                    <Label className="text-sm font-semibold">Total Subscription Amount</Label>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Calculated: €{calculatedTotal.toFixed(2)}</span>
                  </div>

                  <RHFTextField name="totalSubscriptionAmount" label="Final Amount" type="number" placeholder="Enter amount" min="0" step="0.01" />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Adjust the amount to apply discounts or custom pricing</p>
                </div>

                {/* Status Dropdown */}
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
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {formState.errors.status && <p className="mt-1 text-sm text-red-500">{formState.errors.status.message}</p>}
                </div>
              </div>

              {/* Action Buttons */}
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

// 'use client';

// import ButtonLoading from '@/components/common/button-loading';
// import FormProvider, { RHFDate, RHFTextField } from '@/components/rhf';
// import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { useUpdateSubscriptionMutation } from '@/store/Reducer/subscriptions-api';
// import { getErrorMessage } from '@/utils/api';
// import { fDate, formatStr } from '@/utils/format-time';
// import { showError, showSuccess } from '@/utils/toast';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { useEffect, useMemo } from 'react';
// import { Controller, useForm } from 'react-hook-form';
// import * as Yup from 'yup';

// type ModuleType = 'ordering' | 'loyalty' | 'reservations' | 'analytics';

// type SubscriptionFormValues = {
//   organizer: string;
//   subscriptionTypes: ModuleType[];
//   numberOfOrganizations: number;
//   startDate: string | Date;
//   endDate: string | Date;
//   pricingPlan: string;
//   orderingCommission: number;
//   ticketingCommission: number;
//   reservationCommission: number;
//   totalSubscriptionAmount: number;
//   status: string;
// };

// type SubscriptionModalProps = {
//   open: boolean;
//   onClose: () => void;
//   selectedData: any;
// };

// const MODULE_NAMES: Record<ModuleType, string> = {
//   ordering: 'Ordering',
//   loyalty: 'Loyalty',
//   reservations: 'Reservations',
//   analytics: 'Analytics',
// };

// const MODULE_PRICES: Record<ModuleType, number> = {
//   ordering: 30,
//   loyalty: 40,
//   reservations: 30,
//   analytics: 20,
// };

// const schema = Yup.object().shape({
//   organizer: Yup.string().required('Organizer is required').default(''),
//   subscriptionTypes: Yup.array()
//     .of(Yup.string().oneOf(['ordering', 'loyalty', 'reservations', 'analytics']))
//     .min(1, 'Select at least one module')
//     .default([]),
//   numberOfOrganizations: Yup.number()
//     .transform((value, originalValue) => (originalValue === '' ? undefined : value))
//     .required('Number of organizations is required')
//     .min(1, 'Must be at least 1')
//     .default(1),
//   startDate: Yup.date().required('Start date is required').typeError('Invalid date'),
//   endDate: Yup.date().required('End date is required').min(Yup.ref('startDate'), 'End date must be after start date').typeError('Invalid date'),
//   pricingPlan: Yup.string().default('monthly'),
//   orderingCommission: Yup.number()
//     .transform((value, originalValue) => (originalValue === '' ? 0 : value))
//     .min(0, 'Must be at least 0')
//     .max(100, 'Cannot exceed 100%')
//     .default(0),
//   ticketingCommission: Yup.number()
//     .transform((value, originalValue) => (originalValue === '' ? 0 : value))
//     .min(0, 'Must be at least 0')
//     .max(100, 'Cannot exceed 100%')
//     .default(0),
//   reservationCommission: Yup.number()
//     .transform((value, originalValue) => (originalValue === '' ? 0 : value))
//     .min(0, 'Must be at least 0')
//     .max(100, 'Cannot exceed 100%')
//     .default(0),
//   totalSubscriptionAmount: Yup.number()
//     .transform((value, originalValue) => (originalValue === '' ? 0 : value))
//     .min(0, 'Amount must be at least 0')
//     .required('Total subscription amount is required')
//     .default(0),
//   status: Yup.string().oneOf(['active', 'inactive', 'cancelled']).default('active'),
// }) as Yup.ObjectSchema<SubscriptionFormValues>;

// const defaultValues: SubscriptionFormValues = {
//   organizer: '',
//   subscriptionTypes: [],
//   numberOfOrganizations: 1,
//   startDate: '',
//   endDate: '',
//   pricingPlan: 'monthly',
//   orderingCommission: 0,
//   ticketingCommission: 0,
//   reservationCommission: 0,
//   totalSubscriptionAmount: 0,
//   status: 'active',
// };

// const SubscriptionModal = ({ open, onClose, selectedData }: SubscriptionModalProps) => {
//   const [updateSubscription, { isLoading: isUpdating }] = useUpdateSubscriptionMutation();

//   console.log("selectedData", selectedData);

//   const methods = useForm<SubscriptionFormValues>({
//     resolver: yupResolver(schema),
//     defaultValues,
//     mode: 'onChange',
//   });

//   const { reset, formState, watch, setValue } = methods;
//   const isDirty = formState?.isDirty;

//   const watchedModules = watch('subscriptionTypes');
//   const watchedOrganizations = watch('numberOfOrganizations');

//   const selectedModules = useMemo(() => watchedModules || [], [watchedModules]);
//   const organizations = useMemo(() => watchedOrganizations || 1, [watchedOrganizations]);

//   // Calculate total based on selected modules and organizations
//   const calculatedTotal = useMemo(() => {
//     const subtotal = selectedModules.reduce((total, module) => {
//       return total + (MODULE_PRICES[module] || 0);
//     }, 0);
//     return subtotal * organizations;
//   }, [selectedModules, organizations]);

//   // Update final amount when calculated total changes
//   useEffect(() => {
//     if (calculatedTotal > 0) {
//       setValue('totalSubscriptionAmount', calculatedTotal, { shouldDirty: false });
//     }
//   }, [calculatedTotal, setValue]);

//   useEffect(() => {
//     if (open && selectedData) {
//       const mappedData: SubscriptionFormValues = {
//         organizer: selectedData?.organizer || '',
//         subscriptionTypes: selectedData?.subscriptionTypes || [],
//         numberOfOrganizations: selectedData?.numberOfOrganizations || 1,
//         startDate: selectedData?.startDate ? new Date(selectedData.startDate) : '',
//         endDate: selectedData?.endDate ? new Date(selectedData.endDate) : '',
//         pricingPlan: selectedData?.pricingPlan || 'monthly',
//         orderingCommission: selectedData?.orderingCommission || 0,
//         ticketingCommission: selectedData?.ticketingCommission || 0,
//         reservationCommission: selectedData?.reservationCommission || 0,
//         totalSubscriptionAmount: selectedData?.totalSubscriptionAmount || 0,
//         status: selectedData?.status || 'active',
//       };

//       reset(mappedData);
//     } else if (open && !selectedData) {
//       reset(defaultValues);
//     }
//   }, [open, selectedData, reset]);

//   const handleModuleToggle = (module: ModuleType) => {
//     const updatedModules = selectedModules.includes(module) ? selectedModules.filter((m) => m !== module) : [...selectedModules, module];

//     setValue('subscriptionTypes', updatedModules, { shouldDirty: true, shouldValidate: true });
//   };

//   const handleSubmit = async (formData: SubscriptionFormValues) => {
//     try {
//       const payload: any = {
//         id: selectedData?._id,
//         subscription: {
//           subscriptionTypes: formData.subscriptionTypes,
//           pricingPlan: formData.pricingPlan,
//           numberOfOrganizations: Number(formData.numberOfOrganizations),
//           startDate: fDate(formData.startDate, formatStr.paramCase.db),
//           endDate: fDate(formData.endDate, formatStr.paramCase.db),
//           orderingCommission: Number(formData.orderingCommission),
//           ticketingCommission: Number(formData.ticketingCommission),
//           reservationCommission: Number(formData.reservationCommission),
//           totalSubscriptionAmount: Number(formData.totalSubscriptionAmount),
//           status: formData.status,
//         },
//       };

//       const response = await updateSubscription(payload).unwrap();

//       if (!response) {
//         showError('No response from server. Please try again later.');
//         return;
//       }

//       if (response?.error) {
//         showError(getErrorMessage(response.error));
//         return;
//       }

//       showSuccess(response?.message || 'Subscription updated successfully');

//       methods.reset(defaultValues);
//       onClose();
//     } catch (error) {
//       const errorMessage = getErrorMessage(error);
//       showError(errorMessage);
//     }
//   };

//   const handleClose = () => {
//     reset(defaultValues);
//     onClose();
//   };

//   return (
//     <Dialog open={open} onOpenChange={handleClose}>
//       <DialogOverlay className="bg-opacity-30 fixed inset-0">
//         <DialogContent
//           aria-describedby={undefined}
//           className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[35vh] w-full flex-col items-center overflow-y-auto md:max-w-[650px]!"
//         >
//           <DialogHeader>
//             <DialogTitle>Edit Subscription</DialogTitle>
//           </DialogHeader>

//           <div className="w-full">
//             <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
//               <div className="mt-6 flex w-full flex-col gap-4">
//                 <RHFTextField name="organizer" label="Organizer" placeholder="Organizer name" disabled />

//                 <div>
//                   <Label className="mb-2 block text-sm font-medium">Billing Cycle</Label>
//                   <Controller
//                     name="pricingPlan"
//                     control={methods.control}
//                     render={({ field }) => (
//                       <Select onValueChange={field.onChange} value={field.value}>
//                         <SelectTrigger className="w-full">
//                           <SelectValue placeholder="Select billing cycle" />
//                         </SelectTrigger>
//                         <SelectContent aria-describedby={undefined}>
//                           <SelectItem value="monthly">Monthly</SelectItem>
//                           <SelectItem value="yearly">Yearly</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     )}
//                   />
//                   {formState.errors.pricingPlan && <p className="mt-1 text-sm text-red-500">{formState.errors.pricingPlan.message}</p>}
//                 </div>

//                 <div>
//                   <Label className="mb-2 block text-sm font-medium">Modules</Label>
//                   <div className="space-y-3 rounded-lg border p-4 dark:border-gray-700">
//                     {(Object.keys(MODULE_NAMES) as ModuleType[]).map((module) => (
//                       <div key={module} className="flex items-center justify-between gap-3">
//                         <div className="flex items-center gap-3">
//                           <Checkbox id={module} checked={selectedModules.includes(module)} onCheckedChange={() => handleModuleToggle(module)} />
//                           <Label htmlFor={module} className="cursor-pointer text-sm font-normal">
//                             {MODULE_NAMES[module]}
//                           </Label>
//                         </div>
//                         <span className="text-sm font-medium text-gray-600 dark:text-gray-400">€{MODULE_PRICES[module]}</span>
//                       </div>
//                     ))}
//                   </div>
//                   {formState.errors.subscriptionTypes && <p className="mt-1 text-sm text-red-500">{formState.errors.subscriptionTypes.message}</p>}
//                 </div>

//                 <RHFTextField name="numberOfOrganizations" label="Number of Organizations" type="number" placeholder="Enter number" min="1" />

//                 <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
//                   <RHFDate name="startDate" label="Start Date" placeholder="Select start date" />
//                   <RHFDate name="endDate" label="End Date" placeholder="Select end date" />
//                 </div>

//                 <div>
//                   <Label className="mb-2 block text-sm font-medium">Commission Overrides (%)</Label>
//                   <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
//                     <RHFTextField name="orderingCommission" label="Ordering" type="number" placeholder="0" min="0" max="100" />

//                     <RHFTextField name="ticketingCommission" label="Ticketing" type="number" placeholder="0" min="0" max="100" />

//                     <RHFTextField name="reservationCommission" label="Reservations" type="number" placeholder="0" min="0" max="100" />
//                   </div>
//                 </div>

//                 <div className="rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-900/20">
//                   <p className="font-medium text-blue-900 dark:text-blue-300">💡 Note:</p>
//                   <p className="mt-1 text-xs text-blue-800 dark:text-blue-400">
//                     Commission rates are percentage values. Enter values between 0-100%.
//                   </p>
//                 </div>

//                 {/* Total Amount Section */}
//                 <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
//                   <div className="mb-3 flex items-center justify-between">
//                     <Label className="text-sm font-semibold">Total Amount</Label>
//                     <span className="text-sm text-gray-600 dark:text-gray-400">Calculated: €{calculatedTotal.toFixed(2)}</span>
//                   </div>

//                   <RHFTextField name="totalSubscriptionAmount" label="Final Amount" type="number" placeholder="Enter amount" min="0" step="0.01" />
//                   <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Adjust the amount to apply discounts or custom pricing</p>
//                 </div>

//                 {/* Status Dropdown */}
//                 <div>
//                   <Label className="mb-2 block text-sm font-medium">Status</Label>
//                   <Controller
//                     name="status"
//                     control={methods.control}
//                     render={({ field }) => (
//                       <Select onValueChange={field.onChange} value={field.value}>
//                         <SelectTrigger className="w-full">
//                           <SelectValue placeholder="Select status" />
//                         </SelectTrigger>
//                         <SelectContent aria-describedby={undefined}>
//                           <SelectItem value="active">Active</SelectItem>
//                           <SelectItem value="inactive">Inactive</SelectItem>
//                           <SelectItem value="cancelled">Cancelled</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     )}
//                   />
//                   {formState.errors.status && <p className="mt-1 text-sm text-red-500">{formState.errors.status.message}</p>}
//                 </div>
//               </div>

//               <div className="mt-6 flex items-center justify-center gap-3">
//                 <Button type="button" variant="outline" onClick={handleClose} className="px-6">
//                   Cancel
//                 </Button>

//                 {isUpdating ? (
//                   <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-6 text-white">
//                     <ButtonLoading title="Updating" />
//                   </Button>
//                 ) : (
//                   <Button type="submit" className="bg-primary hover:bg-primary-dark cursor-pointer px-6 text-white" disabled={!isDirty}>
//                     Save Changes
//                   </Button>
//                 )}
//               </div>
//             </FormProvider>
//           </div>
//         </DialogContent>
//       </DialogOverlay>
//     </Dialog>
//   );
// };

// export default SubscriptionModal;

// // 'use client';

// // import ButtonLoading from '@/components/common/button-loading';
// // import FormProvider, { RHFDate, RHFTextField } from '@/components/rhf';
// // import { Button } from '@/components/ui/button';
// // import { Checkbox } from '@/components/ui/checkbox';
// // import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
// // import { Label } from '@/components/ui/label';
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// // import { useUpdateSubscriptionMutation } from '@/store/Reducer/subscriptions-api';
// // import { getErrorMessage } from '@/utils/api';
// // import { showError } from '@/utils/toast';
// // import { yupResolver } from '@hookform/resolvers/yup';
// // import { useEffect, useMemo } from 'react';
// // import { Controller, useForm } from 'react-hook-form';
// // import * as Yup from 'yup';

// // type ModuleType = 'ordering' | 'loyalty' | 'reservations' | 'analytics';

// // type SubscriptionFormValues = {
// //   organizer: string;
// //   modules: ModuleType[];
// //   organizations: number;
// //   startDate: string;
// //   endDate: string;
// //   billing: string;
// //   commissions: {
// //     ordering: number;
// //     ticketing: number;
// //     reservations: number;
// //   };
// //   finalAmount: number;
// //   status: string;
// // };

// // type SubscriptionModalProps = {
// //   open: boolean;
// //   onClose: () => void;
// //   selectedData: any;
// // };

// // const MODULE_NAMES: Record<ModuleType, string> = {
// //   ordering: 'Ordering',
// //   loyalty: 'Loyalty',
// //   reservations: 'Reservations',
// //   analytics: 'Analytics',
// // };

// // const MODULE_PRICES: Record<ModuleType, number> = {
// //   ordering: 30,
// //   loyalty: 40,
// //   reservations: 30,
// //   analytics: 20,
// // };

// // const schema = Yup.object().shape({
// //   organizer: Yup.string().required('Organizer is required').default(''),
// //   modules: Yup.array()
// //     .of(Yup.string().oneOf(['ordering', 'loyalty', 'reservations', 'analytics']))
// //     .min(1, 'Select at least one module')
// //     .default([]),
// //   organizations: Yup.number()
// //     .transform((value, originalValue) => (originalValue === '' ? undefined : value))
// //     .required('Number of organizations is required')
// //     .min(1, 'Must be at least 1')
// //     .default(1),
// //   startDate: Yup.string().required('Start date is required').default(''),
// //   endDate: Yup.string()
// //     .required('End date is required')
// //     .test('is-after-start', 'End date must be after start date', function (value) {
// //       const { startDate } = this.parent;
// //       if (!startDate || !value) return true;
// //       return new Date(value) > new Date(startDate);
// //     })
// //     .default(''),
// //   billing: Yup.string().default('monthly'),
// //   commissions: Yup.object()
// //     .shape({
// //       ordering: Yup.number()
// //         .transform((value, originalValue) => (originalValue === '' ? 0 : value))
// //         .min(0, 'Must be at least 0')
// //         .max(100, 'Cannot exceed 100%')
// //         .default(0),
// //       ticketing: Yup.number()
// //         .transform((value, originalValue) => (originalValue === '' ? 0 : value))
// //         .min(0, 'Must be at least 0')
// //         .max(100, 'Cannot exceed 100%')
// //         .default(0),
// //       reservations: Yup.number()
// //         .transform((value, originalValue) => (originalValue === '' ? 0 : value))
// //         .min(0, 'Must be at least 0')
// //         .max(100, 'Cannot exceed 100%')
// //         .default(0),
// //     })
// //     .default({ ordering: 0, ticketing: 0, reservations: 0 }),
// //   finalAmount: Yup.number()
// //     .transform((value, originalValue) => (originalValue === '' ? 0 : value))
// //     .min(0, 'Amount must be at least 0')
// //     .required('Final amount is required')
// //     .default(0),
// //   status: Yup.string().oneOf(['active', 'inactive']).default('active'),
// // }) as Yup.ObjectSchema<SubscriptionFormValues>;

// // const defaultValues: SubscriptionFormValues = {
// //   organizer: '',
// //   modules: [],
// //   organizations: 1,
// //   startDate: '',
// //   endDate: '',
// //   billing: 'monthly',
// //   commissions: { ordering: 0, ticketing: 0, reservations: 0 },
// //   finalAmount: 0,
// //   status: 'active',
// // };

// // const SubscriptionModal = ({ open, onClose, selectedData }: SubscriptionModalProps) => {
// //   const [updateSubscription, { isLoading: isUpdating }] = useUpdateSubscriptionMutation();

// //   const methods = useForm<SubscriptionFormValues>({
// //     resolver: yupResolver(schema),
// //     defaultValues,
// //     mode: 'onChange',
// //   });

// //   const { reset, formState, watch, setValue } = methods;
// //   const isDirty = formState?.isDirty;

// //   const watchedModules = watch('modules');
// //   const watchedOrganizations = watch('organizations');

// //   const selectedModules = useMemo(() => watchedModules || [], [watchedModules]);
// //   const organizations = useMemo(() => watchedOrganizations || 1, [watchedOrganizations]);

// //   // Calculate total based on selected modules and organizations
// //   const calculatedTotal = useMemo(() => {
// //     const subtotal = selectedModules.reduce((total, module) => {
// //       return total + (MODULE_PRICES[module] || 0);
// //     }, 0);
// //     return subtotal * organizations;
// //   }, [selectedModules, organizations]);

// //   // Update final amount when calculated total changes
// //   useEffect(() => {
// //     if (calculatedTotal > 0) {
// //       setValue('finalAmount', calculatedTotal, { shouldDirty: false });
// //     }
// //   }, [calculatedTotal, setValue]);

// //   useEffect(() => {
// //     if (open && selectedData) {
// //       const mappedData: SubscriptionFormValues = {
// //         organizer: selectedData?.organizer || '',
// //         modules: selectedData?.modules || [],
// //         organizations: selectedData?.organizations || 1,
// //         startDate: selectedData?.startDate || '',
// //         endDate: selectedData?.endDate || '',
// //         billing: selectedData?.billing || 'monthly',
// //         commissions: {
// //           ordering: selectedData?.commissions?.ordering || 0,
// //           ticketing: selectedData?.commissions?.ticketing || 0,
// //           reservations: selectedData?.commissions?.reservations || 0,
// //         },
// //         finalAmount: selectedData?.finalAmount || 0,
// //         status: selectedData?.status || 'active',
// //       };

// //       reset(mappedData);
// //     } else if (open && !selectedData) {
// //       reset(defaultValues);
// //     }
// //   }, [open, selectedData, reset]);

// //   const handleModuleToggle = (module: ModuleType) => {
// //     const updatedModules = selectedModules.includes(module) ? selectedModules.filter((m) => m !== module) : [...selectedModules, module];

// //     setValue('modules', updatedModules, { shouldDirty: true, shouldValidate: true });
// //   };

// //   const handleSubmit = async (formData: SubscriptionFormValues) => {
// //     try {
// //       const payload: any = {
// //         id: selectedData?._id,
// //         organizer: formData.organizer,
// //         modules: formData.modules,
// //         organizations: Number(formData.organizations),
// //         startDate: formData.startDate,
// //         endDate: formData.endDate,
// //         billing: formData.billing,
// //         commissions: {
// //           ordering: Number(formData.commissions.ordering),
// //           ticketing: Number(formData.commissions.ticketing),
// //           reservations: Number(formData.commissions.reservations),
// //         },
// //         finalAmount: Number(formData.finalAmount),
// //         status: formData.status,
// //       };

// //       console.log('Subscription Payload:', payload);

// //       // const response = await updateSubscription(payload).unwrap();

// //       // if (!response) {
// //       //   showError('No response from server. Please try again later.');
// //       //   return;
// //       // }

// //       // if (response?.error) {
// //       //   showError(getErrorMessage(response.error));
// //       //   return;
// //       // }

// //       // showSuccess(response?.message || 'Subscription updated successfully');

// //       // methods.reset(defaultValues);
// //       onClose();
// //     } catch (error) {
// //       const errorMessage = getErrorMessage(error);
// //       showError(errorMessage);
// //     }
// //   };

// //   const handleClose = () => {
// //     reset(defaultValues);
// //     onClose();
// //   };

// //   return (
// //     <Dialog open={open} onOpenChange={handleClose}>
// //       <DialogOverlay className="bg-opacity-30 fixed inset-0">
// //         <DialogContent
// //           aria-describedby={undefined}
// //           className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[35vh] w-full flex-col items-center overflow-y-auto md:max-w-[650px]!"
// //         >
// //           <DialogHeader>
// //             <DialogTitle>Edit Subscription</DialogTitle>
// //           </DialogHeader>

// //           <div className="w-full">
// //             <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
// //               <div className="mt-6 flex w-full flex-col gap-4">
// //                 <RHFTextField name="organizer" label="Organizer" placeholder="Organizer name" disabled />

// //                 <div>
// //                   <Label className="mb-2 block text-sm font-medium">Billing Cycle</Label>
// //                   <Controller
// //                     name="billing"
// //                     control={methods.control}
// //                     render={({ field }) => (
// //                       <Select onValueChange={field.onChange} value={field.value}>
// //                         <SelectTrigger className="w-full">
// //                           <SelectValue placeholder="Select billing cycle" />
// //                         </SelectTrigger>
// //                         <SelectContent aria-describedby={undefined}>
// //                           <SelectItem value="monthly">Monthly</SelectItem>
// //                           <SelectItem value="yearly">Yearly</SelectItem>
// //                         </SelectContent>
// //                       </Select>
// //                     )}
// //                   />
// //                   {formState.errors.billing && <p className="mt-1 text-sm text-red-500">{formState.errors.billing.message}</p>}
// //                 </div>

// //                 <div>
// //                   <Label className="mb-2 block text-sm font-medium">Modules</Label>
// //                   <div className="space-y-3 rounded-lg border p-4 dark:border-gray-700">
// //                     {(Object.keys(MODULE_NAMES) as ModuleType[]).map((module) => (
// //                       <div key={module} className="flex items-center justify-between gap-3">
// //                         <div className="flex items-center gap-3">
// //                           <Checkbox id={module} checked={selectedModules.includes(module)} onCheckedChange={() => handleModuleToggle(module)} />
// //                           <Label htmlFor={module} className="cursor-pointer text-sm font-normal">
// //                             {MODULE_NAMES[module]}
// //                           </Label>
// //                         </div>
// //                         <span className="text-sm font-medium text-gray-600 dark:text-gray-400">€{MODULE_PRICES[module]}</span>
// //                       </div>
// //                     ))}
// //                   </div>
// //                   {formState.errors.modules && <p className="mt-1 text-sm text-red-500">{formState.errors.modules.message}</p>}
// //                 </div>

// //                 <RHFTextField name="organizations" label="Number of Organizations" type="number" placeholder="Enter number" min="1" />

// //                 <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
// //                   <div>
// //                     <Label className="mb-2 block text-sm font-medium">Start Date</Label>
// //                     <RHFDate name="startDate" className="w-full cursor-pointer border-gray-200 focus:border-blue-600" />
// //                   </div>

// //                   <div>
// //                     <Label className="mb-2 block text-sm font-medium">End Date</Label>
// //                     <RHFDate name="endDate" className="w-full cursor-pointer border-gray-200 focus:border-blue-600" />
// //                   </div>
// //                 </div>

// //                 <div>
// //                   <Label className="mb-2 block text-sm font-medium">Commission Overrides (%)</Label>
// //                   <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
// //                     <RHFTextField name="commissions.ordering" label="Ordering" type="number" placeholder="0" min="0" max="100" />

// //                     <RHFTextField name="commissions.ticketing" label="Ticketing" type="number" placeholder="0" min="0" max="100" />

// //                     <RHFTextField name="commissions.reservations" label="Reservations" type="number" placeholder="0" min="0" max="100" />
// //                   </div>
// //                 </div>

// //                 <div className="rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-900/20">
// //                   <p className="font-medium text-blue-900 dark:text-blue-300">💡 Note:</p>
// //                   <p className="mt-1 text-xs text-blue-800 dark:text-blue-400">
// //                     Commission rates are percentage values. Enter values between 0-100%.
// //                   </p>
// //                 </div>

// //                 {/* Total Amount Section */}
// //                 <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
// //                   <div className="mb-3 flex items-center justify-between">
// //                     <Label className="text-sm font-semibold">Total Amount</Label>
// //                     <span className="text-sm text-gray-600 dark:text-gray-400">Calculated: €{calculatedTotal.toFixed(2)}</span>
// //                   </div>

// //                   <RHFTextField name="finalAmount" label="Final Amount" type="number" placeholder="Enter amount" min="0" step="0.01" />
// //                   <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Adjust the amount to apply discounts or custom pricing</p>
// //                 </div>

// //                 {/* Status Dropdown */}
// //                 <div>
// //                   <Label className="mb-2 block text-sm font-medium">Status</Label>
// //                   <Controller
// //                     name="status"
// //                     control={methods.control}
// //                     render={({ field }) => (
// //                       <Select onValueChange={field.onChange} value={field.value}>
// //                         <SelectTrigger className="w-full">
// //                           <SelectValue placeholder="Select status" />
// //                         </SelectTrigger>
// //                         <SelectContent aria-describedby={undefined}>
// //                           <SelectItem value="active">Active</SelectItem>
// //                           <SelectItem value="inactive">Inactive</SelectItem>
// //                           <SelectItem value="cancelled">Cancelled</SelectItem>
// //                         </SelectContent>
// //                       </Select>
// //                     )}
// //                   />
// //                   {formState.errors.status && <p className="mt-1 text-sm text-red-500">{formState.errors.status.message}</p>}
// //                 </div>
// //               </div>

// //               <div className="mt-6 flex items-center justify-center gap-3">
// //                 <Button type="button" variant="outline" onClick={handleClose} className="px-6">
// //                   Cancel
// //                 </Button>

// //                 {false ? (
// //                   <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-6 text-white">
// //                     <ButtonLoading title="Updating" />
// //                   </Button>
// //                 ) : (
// //                   <Button type="submit" className="bg-primary hover:bg-primary-dark cursor-pointer px-6 text-white" disabled={!isDirty}>
// //                     Save Changes
// //                   </Button>
// //                 )}
// //               </div>
// //             </FormProvider>
// //           </div>
// //         </DialogContent>
// //       </DialogOverlay>
// //     </Dialog>
// //   );
// // };

// // export default SubscriptionModal;
