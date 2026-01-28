'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFDate, RHFTextField } from '@/components/rhf';
import { RHFCustomCombobox } from '@/components/rhf/rhf-custom-combobox';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useGetEventsByOrganizationQuery } from '@/store/Reducer/events';
import { useAddLimitedTimeItemsMutation } from '@/store/Reducer/menu-management-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';

interface MenuItem {
  _id: string;
  title: string;
  basePrice: number;
  discountPrice: number;
  taxPercent: number;
}

interface LimitedTimeItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems?: MenuItem[];
  menuItemLoading?: boolean;
  organizationId: string | null;
}

type AvailabilityType = 'preOrdersOnly' | 'preOrdersEvent' | 'preOrderExclusive';

type LimitedTimeFormValues = {
  selectedMenuItems: string[];
  startDate: Date | string;
  startTime: string;
  endDate: Date | string;
  endTime: string;
  availabilityType: AvailabilityType;
  event: string;
  isUpsell: boolean;
  isScheduled: boolean;
};

const AVAILABILITY_OPTIONS = [
  {
    value: 'preOrdersOnly',
    label: 'Pre-orders Only',
    description: 'Available exclusively for pre-orders',
  },
  {
    value: 'preOrdersEvent',
    label: 'Pre-orders + Events',
    description: 'Available for pre-orders and specific events',
  },
  {
    value: 'preOrderExclusive',
    label: 'Pre-order Exclusive',
    description: 'Exclusive pre-order limited time offer',
  },
];

const schema = Yup.object().shape({
  selectedMenuItems: Yup.array().of(Yup.string()).min(1, 'Please select at least one menu item').required('Menu items are required'),
  startDate: Yup.date().required('Start date is required').typeError('Invalid date'),
  startTime: Yup.string()
    .required('Start time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format')
    .default(''),
  endDate: Yup.date().required('End date is required').min(Yup.ref('startDate'), 'End date must be after start date').typeError('Invalid date'),
  endTime: Yup.string()
    .required('End time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format')
    .default(''),
  availabilityType: Yup.string()
    .oneOf(['preOrdersOnly', 'preOrdersEvent', 'preOrderExclusive'] as const)
    .required('Availability type is required')
    .default('preOrdersOnly'),
  event: Yup.string().when('availabilityType', {
    is: 'preOrdersEvent',
    then: (schema) => schema.required('Event is required for Pre-orders + Events'),
    otherwise: (schema) => schema.default(''),
  }),
  isUpsell: Yup.boolean().default(false),
  isScheduled: Yup.boolean().default(false),
}) as Yup.ObjectSchema<LimitedTimeFormValues>;

const defaultValues: LimitedTimeFormValues = {
  selectedMenuItems: [],
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  availabilityType: 'preOrdersOnly',
  event: '',
  isUpsell: false,
  isScheduled: false,
};

const formatTimeToAPI = (time: string): string => {
  // Convert 24h time (HH:mm) to 12h format (hh:mm AM/PM)
  const [hours24, minutes] = time.split(':').map(Number);
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  return `${String(hours12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
};

const formatDateToAPI = (date: Date | string): string => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const LimitedTimeItemModal: React.FC<LimitedTimeItemModalProps> = ({
  isOpen,
  onClose,
  menuItems = [],
  menuItemLoading = false,
  organizationId,
}) => {
  const [addLimitedTimeItems, { isLoading: addLoading }] = useAddLimitedTimeItemsMutation();

  const { data: eventData, isLoading: isLoadingEvents } = useGetEventsByOrganizationQuery(
    {
      organization: organizationId,
    },
    {
      skip: !organizationId,
    }
  );

  const methods = useForm<LimitedTimeFormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues,
    mode: 'onChange',
  });

  const { reset, watch, control } = methods;

  const availabilityType = watch('availabilityType');

  const menuItemOptions = useMemo(
    () =>
      menuItems.map((item) => {
        const effectivePrice = item.discountPrice ?? item.basePrice;
        return {
          label: `${item.title} - €${effectivePrice.toFixed(2)}`,
          value: item._id,
        };
      }),
    [menuItems]
  );

  const eventOptions = useMemo(
    () =>
      (eventData || []).map((v: any) => ({
        value: v?._id.toString(),
        label: v?.basicInfo?.title || 'No Title',
      })),
    [eventData]
  );

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, reset]);

  const handleSubmit = async (formData: LimitedTimeFormValues) => {
    try {
      const payload: any = {
        menuItems: formData.selectedMenuItems,
        startTime: formatTimeToAPI(formData.startTime),
        endTime: formatTimeToAPI(formData.endTime),
        startDate: formatDateToAPI(formData.startDate),
        endDate: formatDateToAPI(formData.endDate),
        availabilityType: formData.availabilityType,
        upSellItem: formData.isUpsell.toString(),
        isSheduled: formData.isScheduled.toString(),
      };

      // Only include event if availabilityType is preOrdersEvent
      if (formData.availabilityType === 'preOrdersEvent' && formData.event) {
        payload.event = formData.event;
      }

      const response = await addLimitedTimeItems(payload).unwrap();

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'Limited-time items added successfully');
      handleClose();
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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[50vh] w-full flex-col items-center overflow-y-auto md:max-w-[600px]!"
        >
          <DialogHeader>
            <DialogTitle>Add Limited-Time Item</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="w-full space-y-5">
                {/* Select Menu Items */}
                {menuItemLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="ml-1 h-3 w-32 rounded-4xl" />
                    <Skeleton className="h-32 rounded-4xl" />
                  </div>
                ) : (
                  <RHFCustomCombobox
                    name="selectedMenuItems"
                    label="Select Menu Items"
                    placeholder="Select menu items"
                    className="w-full"
                    multiple={true}
                    allowCustom={false}
                    options={menuItemOptions}
                  />
                )}

                {/* Availability Period */}
                <div className="space-y-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Availability Period</div>

                  {/* Start Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <RHFDate name="startDate" label="Start Date" placeholder="Select start date" />
                    <RHFTextField name="startTime" label="Start Time" placeholder="00:00" type="time" />
                  </div>

                  {/* End Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <RHFDate name="endDate" label="End Date" placeholder="Select end date" />
                    <RHFTextField name="endTime" label="End Time" placeholder="00:00" type="time" />
                  </div>
                </div>

                {/* Availability Type */}
                <div className="space-y-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Availability Type</div>

                  <Controller
                    name="availabilityType"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup value={field.value} onValueChange={field.onChange}>
                        <div className="space-y-2">
                          {AVAILABILITY_OPTIONS.map((option) => (
                            <Label
                              key={option.value}
                              htmlFor={option.value}
                              className={cn(
                                'flex cursor-pointer items-start gap-3 rounded-lg border-2 bg-white p-3 transition-all dark:bg-[#222121]',
                                field.value === option.value
                                  ? 'border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-950'
                                  : 'border-gray-200 dark:border-gray-800'
                              )}
                            >
                              <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
                              <div className="flex-1">
                                <div className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{option.label}</div>
                                <div className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">{option.description}</div>
                              </div>
                            </Label>
                          ))}
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>

                {/* Event Selection - Only show when preOrdersEvent is selected */}
                {availabilityType === 'preOrdersEvent' && (
                  <>
                    {isLoadingEvents ? (
                      <div className="space-y-2">
                        <Skeleton className="ml-1 h-3 w-24 rounded-4xl" />
                        <Skeleton className="h-11 rounded-4xl" />
                      </div>
                    ) : (
                      <RHFCustomDropdown
                        name="event"
                        label="Select Event"
                        placeholder="Choose an event"
                        options={eventOptions}
                        isLoading={isLoadingEvents}
                        showNone={false}
                      />
                    )}
                  </>
                )}

                {/* Upsell Checkbox */}
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                  <Controller
                    name="isUpsell"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-start gap-4">
                        <Checkbox id="limitedUpsell" checked={field.value} onCheckedChange={field.onChange} className="mt-1 h-5 w-5" />
                        <div className="flex-1">
                          <Label htmlFor="limitedUpsell" className="cursor-pointer text-sm font-semibold text-gray-900 dark:text-gray-100">
                            Enable as Upsell Item
                          </Label>
                          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Show this limited-time item in upsell popups</p>
                        </div>
                      </div>
                    )}
                  />
                </div>

                {/* Scheduled Checkbox */}
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                  <Controller
                    name="isScheduled"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-start gap-4">
                        <Checkbox id="isScheduled" checked={field.value} onCheckedChange={field.onChange} className="mt-1 h-5 w-5" />
                        <div className="flex-1">
                          <Label htmlFor="isScheduled" className="cursor-pointer text-sm font-semibold text-gray-900 dark:text-gray-100">
                            Schedule Item
                          </Label>
                          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Enable scheduling for this limited-time item</p>
                        </div>
                      </div>
                    )}
                  />
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
                  <Button type="button" variant="outline" onClick={handleClose} disabled={addLoading} className="h-10 font-bold">
                    Cancel
                  </Button>

                  {addLoading ? (
                    <Button type="button" disabled className="bg-primary hover:bg-primary h-10 cursor-not-allowed px-4 text-white">
                      <ButtonLoading title="Creating" />
                    </Button>
                  ) : (
                    <Button type="submit" className="bg-primary hover:bg-primary-dark h-10 cursor-pointer px-4 text-white">
                      Create Limited-Time Item
                    </Button>
                  )}
                </div>
              </div>
            </FormProvider>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};
