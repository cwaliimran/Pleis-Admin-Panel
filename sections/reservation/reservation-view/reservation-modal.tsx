'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useGeteventsQuery } from '@/store/Reducer/events';
import { getErrorMessage } from '@/utils/api';
import { showError } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Info } from 'lucide-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

type ReservationFormValues = {
  type: string;
  available: string;
  capacity: string;
  condition: string;
  price: string;
  minimumSpendAmount?: string;
  minimumSpendText?: string;
  prepayAmount?: string;
  ticketRequired?: string;
  customConditionText?: string;
  taxPercent: string;
  needsConfirmation: boolean;
  eventLink?: string;
  status?: string;
};

type ReservationModalProps = {
  open: boolean;
  onClose: () => void;
  timeslot: any;
  isEdit?: boolean;
  selectedData?: any;
};

const defaultValues: ReservationFormValues = {
  type: '',
  available: '',
  capacity: '',
  condition: 'fixed_price',
  price: '',
  minimumSpendAmount: '',
  minimumSpendText: '',
  prepayAmount: '',
  ticketRequired: '',
  customConditionText: '',
  taxPercent: '25',
  needsConfirmation: false,
  eventLink: '',
  status: 'active',
};

const schema: Yup.ObjectSchema<ReservationFormValues> = Yup.object({
  type: Yup.string().required('Reservation type is required'),
  available: Yup.string().required('Number of available reservations is required'),
  capacity: Yup.string().required('Max capacity is required'),
  condition: Yup.string().required('Condition type is required'),
  price: Yup.string()
    .when('condition', {
      is: (val: string) => ['fixed_price', 'minimum_spend', 'prepay'].includes(val),
      then: (schema) => schema.required('Price is required for this condition'),
      otherwise: (schema) => schema.notRequired(),
    })
    .default(''),
  minimumSpendAmount: Yup.string().default(''),
  minimumSpendText: Yup.string().default(''),
  prepayAmount: Yup.string().default(''),
  ticketRequired: Yup.string().default(''),
  customConditionText: Yup.string().default(''),
  taxPercent: Yup.string().required('Tax percentage is required'),
  needsConfirmation: Yup.boolean().required(),
  eventLink: Yup.string().default(''),
  status: Yup.string().default(''),
});

const ReservationModal = ({ open, onClose, timeslot, isEdit = false, selectedData }: ReservationModalProps) => {
  //   const [addReservation, { isLoading: addReservationLoading }] =
  //     useAddReservationMutation();

  //   const [updateReservation, { isLoading: updateReservationLoading }] =
  //     useUpdateReservationMutation();

  const { data: eventsData, isLoading: eventsLoading } = useGeteventsQuery({
    page: 0,
    search: '',
    limit: '10000',
    status: 'active',
    date: undefined,
  });

  const methods = useForm<ReservationFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { reset, formState, watch, setValue } = methods;
  const isDirty = formState?.isDirty;
  const selectedCondition = watch('condition');

  const eventOptions =
    eventsData?.data?.map((event: any) => ({
      label: event?.basicInfo?.title,
      value: event?._id,
    })) || [];

  const conditionOptions = [
    {
      label: 'Fixed Price - User pays full amount at reservation',
      value: 'fixed_price',
    },
    {
      label: 'Minimum Spend on Location - Minimum order requirement',
      value: 'minimum_spend',
    },
    {
      label: 'Prepay Option - Pay upfront, deducted from in-app ordering',
      value: 'prepay',
    },
    { label: 'No Condition - Free reservation', value: 'no_condition' },
    {
      label: 'Ticket Requirement - Requires specific ticket type',
      value: 'ticket_required',
    },
    { label: 'Custom Text Condition', value: 'custom' },
  ];

  const ticketOptions = [
    { label: 'VIP Event Pass', value: 'vip' },
    { label: 'General Admission', value: 'general' },
    { label: 'Premium Access', value: 'premium' },
  ];

  useEffect(() => {
    if (isEdit && selectedData) {
      reset({
        type: selectedData.type || '',
        available: selectedData.available?.toString() || '',
        capacity: selectedData.capacity?.toString() || '',
        condition: selectedData.condition || 'fixed_price',
        price: selectedData.price?.toString() || '',
        minimumSpendAmount: selectedData.minimumSpendAmount?.toString() || '',
        minimumSpendText: selectedData.minimumSpendText || '',
        prepayAmount: selectedData.prepayAmount?.toString() || '',
        ticketRequired: selectedData.ticketRequired || '',
        customConditionText: selectedData.customConditionText || '',
        taxPercent: selectedData.taxPercent?.toString() || '25',
        needsConfirmation: selectedData.needsConfirmation || false,
        eventLink: selectedData.eventLink?._id || '',
        status: selectedData.status || 'active',
      });
    } else {
      reset(defaultValues);
    }
  }, [isEdit, selectedData, reset]);

  const handleSubmit = async (formData: ReservationFormValues) => {
    try {
      // Validation logic
      if (Number(formData.available) <= 0) {
        showError('Number of available reservations must be greater than 0.');
        return;
      }

      if (Number(formData.capacity) <= 0) {
        showError('Max capacity must be greater than 0.');
        return;
      }

      if (['fixed_price', 'minimum_spend', 'prepay'].includes(formData.condition) && Number(formData.price) <= 0) {
        showError('Price must be greater than 0 for this condition type.');
        return;
      }

      const payload: any = {
        timeslot: timeslot?.id,
        type: formData.type,
        available: Number(formData.available),
        capacity: Number(formData.capacity),
        condition: formData.condition,
        taxPercent: Number(formData.taxPercent),
        needsConfirmation: formData.needsConfirmation,
      };

      // Condition-specific fields
      switch (formData.condition) {
        case 'fixed_price':
        case 'minimum_spend':
        case 'prepay':
          payload.price = Number(formData.price);
          break;
        case 'ticket_required':
          payload.ticketRequired = formData.ticketRequired;
          break;
        case 'custom':
          payload.customConditionText = formData.customConditionText;
          break;
      }

      // Optional fields
      if (formData.minimumSpendAmount) {
        payload.minimumSpendAmount = Number(formData.minimumSpendAmount);
      }
      if (formData.minimumSpendText) {
        payload.minimumSpendText = formData.minimumSpendText;
      }
      if (formData.prepayAmount) {
        payload.prepayAmount = Number(formData.prepayAmount);
      }
      if (formData.eventLink) {
        payload.eventLink = formData.eventLink;
      }

      if (isEdit && selectedData) {
        payload.status = formData?.status;
        payload.id = selectedData?._id;
      }

      console.log('payload', payload);

      //   const response =
      //     isEdit && selectedData
      //       ? await updateReservation(payload).unwrap()
      //       : await addReservation(payload).unwrap();

      //   if (!response) {
      //     showError('No response from server. Please try again later.');
      //     return;
      //   }

      //   if (response?.error) {
      //     showError(getErrorMessage(response.error));
      //     return;
      //   }

      //   showSuccess(
      //     response?.message ||
      //       (isEdit
      //         ? 'Reservation updated successfully'
      //         : 'Reservation created successfully')
      //   );

      //   methods.reset(defaultValues);
      //   onClose();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const renderConditionFields = () => {
    switch (selectedCondition) {
      case 'fixed_price':
        return <RHFTextField name="price" label="Fixed Price (EUR)" type="number" placeholder="150" />;

      case 'minimum_spend':
        return (
          <div className="col-span-2 space-y-4">
            <RHFTextField name="minimumSpendAmount" label="Minimum Spend Amount (EUR)" type="number" placeholder="100" />
            <RHFTextField
              name="minimumSpendText"
              label="Or Custom Requirement Text"
              placeholder="e.g., Purchase at least two bottle packs"
              multiline
              rows={2}
            />
            <p className="text-xs text-gray-500">Not automatically tracked, communicated to guest</p>
          </div>
        );

      case 'prepay':
        return (
          <div className="col-span-2">
            <RHFTextField name="prepayAmount" label="Prepay Amount (EUR)" type="number" placeholder="80" />
            <p className="mt-2 text-xs text-gray-500">Will be deducted from in-app ordering during event</p>
          </div>
        );

      case 'ticket_required':
        return (
          <div className="col-span-2">
            <RHFCustomDropdown
              name="ticketRequired"
              label="Required Ticket Type"
              placeholder="Select required ticket"
              options={ticketOptions}
              showNone={false}
            />
            <p className="mt-2 text-xs text-gray-500">User must own or purchase this ticket type</p>
          </div>
        );

      case 'custom':
        return (
          <div className="col-span-2">
            <RHFTextField
              name="customConditionText"
              label="Custom Condition Text"
              placeholder="Enter custom condition requirements..."
              multiline
              rows={3}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col overflow-y-auto md:!max-w-[700px]"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Reservation Type' : 'Create New Reservation Type'}</DialogTitle>
            <p className="text-sm text-gray-500">{timeslot?.time && `For timeslot: ${timeslot.time}`}</p>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-4 flex w-full flex-col gap-6">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Basic Information</h3>

                  <RHFTextField name="type" label="Reservation Type Name" placeholder="e.g., VIP Table, Lounge, Standing Table" />

                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <RHFTextField name="available" label="Number of Available Reservations" type="number" placeholder="5" />
                      <p className="mt-1 text-xs text-gray-500">How many of this type exist in this timeslot</p>
                    </div>

                    <div>
                      <RHFTextField name="capacity" label="Max Capacity per Reservation" type="number" placeholder="8" />
                      <p className="mt-1 text-xs text-gray-500">Max people per table/area</p>
                    </div>
                  </div>
                </div>

                {/* Reservation Condition Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Reservation Condition</h3>

                  <RHFCustomDropdown
                    name="condition"
                    label="Condition Type"
                    placeholder="Select condition type"
                    options={conditionOptions}
                    showNone={false}
                  />

                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">{renderConditionFields()}</div>
                </div>

                {/* Additional Settings Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Additional Settings</h3>

                  <RHFSelectField
                    name="taxPercent"
                    label="Tax Percentage"
                    placeholder="Select Tax %"
                    className="w-full"
                    options={[
                      { value: '0', label: '0%' },
                      { value: '5', label: '5%' },
                      { value: '13', label: '13%' },
                      { value: '25', label: '25%' },
                    ]}
                  />

                  <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
                    <Checkbox
                      id="needsConfirmation"
                      checked={watch('needsConfirmation')}
                      onCheckedChange={(checked) =>
                        setValue('needsConfirmation', !!checked, {
                          shouldDirty: true,
                        })
                      }
                      className="mt-0.5 border-gray-800"
                    />
                    <div className="flex-1">
                      <Label htmlFor="needsConfirmation" className="cursor-pointer font-medium text-gray-900">
                        Needs Confirmation
                      </Label>
                      <p className="text-sm text-gray-600">Reservation requests must be manually approved before payment</p>
                    </div>
                  </div>

                  {eventsLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="ml-1 h-[12px] w-32" />
                      <Skeleton className="h-[40px] w-full" />
                    </div>
                  ) : (
                    <>
                      <RHFCustomDropdown
                        name="eventLink"
                        label="Optional Event Link"
                        placeholder="No linked event"
                        options={eventOptions}
                        isLoading={eventsLoading}
                        showNone={true}
                      />
                      <p className="text-xs text-gray-500">Shows on event page and in checkout upselling</p>
                    </>
                  )}

                  {isEdit && (
                    <RHFSelectField
                      name="status"
                      label="Status"
                      placeholder="Select Status"
                      options={[
                        { label: 'Active', value: 'active' },
                        { label: 'Inactive', value: 'inactive' },
                      ]}
                    />
                  )}
                </div>

                {/* Info Box */}
                <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <Info size={20} className="mt-0.5 flex-shrink-0 text-blue-600" />
                  <div className="text-sm text-blue-900">
                    <strong>Note:</strong> While there is a max capacity, users will receive the amount of reservation codes they enter at the
                    reservation.
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-center">
                {false ? (
                  <Button type="button" disabled className="bg-primary hover:bg-primary w-full cursor-not-allowed px-4 py-2 text-white md:w-auto">
                    <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark w-full cursor-pointer px-6 py-2 text-white md:w-auto"
                    disabled={isEdit ? !isDirty : false}
                  >
                    {isEdit ? 'Update Reservation' : 'Create Reservation'}
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

export default ReservationModal;
