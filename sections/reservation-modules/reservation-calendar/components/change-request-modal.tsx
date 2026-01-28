'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useUpdateUserReservationMutation } from '@/store/Reducer/reservations-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import * as Yup from 'yup';

interface UpdateReservationFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  phoneCode: string;
  // reservationType: string;
  notes: string;
  partySize: number;
  startTime: string;
  endTime: string;
  date: string;
}

interface UpdateReservationModalProps {
  open: boolean;
  onClose: () => void;
  selectedData?: any;
}

// SCHEMA VALIDATION
const schema = Yup.object().shape({
  firstName: Yup.string().required('First name is required').trim().min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string().required('Last name is required').trim().min(2, 'Last name must be at least 2 characters'),
  phone: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .required('Phone number is required'),
  phoneCode: Yup.string().required('Phone code is required'),
  // reservationType: Yup.string().required('Reservation type is required'),
  notes: Yup.string().default(''),
  partySize: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .typeError('Party size must be a number')
    .positive('Party size must be positive')
    .integer('Party size must be a whole number')
    .required('Party size is required'),
  date: Yup.string().required('Date is required'),
  startTime: Yup.string().required('Start time is required'),
  endTime: Yup.string()
    .required('End time is required')
    .test('is-after-start', 'End time must be after start time', function (value) {
      const { startTime } = this.parent;
      if (!startTime || !value) return true;

      // Convert "02:00 PM" format to comparable time
      const parseTime = (timeStr: string) => {
        const [time, period] = timeStr.split(' ');
        let hours;
        const [h, minutes] = time.split(':').map(Number);
        hours = h;
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };

      return parseTime(value) > parseTime(startTime);
    }),
});

// DEFAULT VALUES
const defaultValues: UpdateReservationFormValues = {
  firstName: '',
  lastName: '',
  phone: '',
  phoneCode: '',
  // reservationType: '',
  notes: '',
  partySize: 0,
  date: '',
  startTime: '',
  endTime: '',
};

// MAIN COMPONENT
const UpdateReservationModal = ({ open, onClose, selectedData }: UpdateReservationModalProps) => {
  const [updateReservation, { isLoading: isUpdating }] = useUpdateUserReservationMutation();

  console.log('selectedData', selectedData);

  // FORM INITIALIZATION
  const methods = useForm<UpdateReservationFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const { reset, formState, control, setValue } = methods;
  const isDirty = formState?.isDirty;

  // OPTIONS
  // const reservationTypeOptions = [
  //   { label: 'Regular', value: 'regular' },
  //   { label: 'VIP', value: 'vip' },
  //   { label: 'Outdoor', value: 'outdoor' },
  //   { label: 'Private', value: 'private' },
  //   { label: 'Bar', value: 'bar' },
  //   { label: 'Window', value: 'window' },
  // ];

  // EDIT MODE DATA POPULATION
  const convertTo24Hour = (timeStr: string) => {
    if (!timeStr) return '';
    const [time, period] = timeStr.split(' ');
    let hours;
    const [h, minutes] = time.split(':').map(Number);
    hours = h;
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    // Pad with leading zeros if needed
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}`;
  };

  useEffect(() => {
    if (open && selectedData) {
      // Extract time slot data
      const firstDateSlot = selectedData?.timingSlots?.dateTimeSlots?.[0];
      const firstTimeSlot = firstDateSlot?.timeSlots?.[0];

      const mappedData: UpdateReservationFormValues = {
        firstName: selectedData?.user?.firstName || '',
        lastName: selectedData?.user?.lastName || '',
        phone: selectedData?.user?.phoneNumber?.number || '',
        phoneCode: selectedData?.user?.phoneNumber?.code || '',
        // reservationType: selectedData?.reservationType || '',
        notes: selectedData?.notes || '',
        partySize: selectedData?.partySize || 0,
        date: firstDateSlot?.date || '',
        startTime: convertTo24Hour(firstTimeSlot?.startTime || ''),
        endTime: convertTo24Hour(firstTimeSlot?.endTime || ''),
      };

      console.log('Mapped form data:', mappedData);
      reset(mappedData);
    } else if (open && !selectedData) {
      reset(defaultValues);
    }
  }, [open, selectedData, reset]);

  // SUBMIT HANDLER
  const handleSubmit = async (formData: UpdateReservationFormValues) => {
    if (!selectedData?.user?._id) {
      showError('User ID is missing. Cannot update reservation.');
      return;
    }

    try {
      // Build payload
      const payload: any = {
        id: selectedData?._id,
        userId: selectedData?.user?._id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: {
          code: formData.phoneCode,
          number: formData.phone,
        },
        partySize: Number(formData.partySize),
        // reservationType: formData.reservationType,
        timingSlots: {
          dateTimeSlots: [
            {
              date: formData.date,
              timeSlots: [
                {
                  startTime: formData.startTime,
                  endTime: formData.endTime,
                },
              ],
            },
          ],
        },
      };

      if (formData.notes) {
        payload.notes = formData.notes;
      }

      console.log('Update Payload:', payload);

      const response = await updateReservation(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'Reservation updated successfully');
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
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[35vh] w-full flex-col items-center overflow-y-auto md:max-w-[550px]!"
        >
          <DialogHeader>
            <DialogTitle>Update Reservation</DialogTitle>
          </DialogHeader>

          <div className="mt-5 w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-0 flex w-full flex-col gap-4">
                {/* First Name & Last Name */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFTextField name="firstName" label="First Name" placeholder="Enter first name" />

                  <RHFTextField name="lastName" label="Last Name" placeholder="Enter last name" />
                </div>

                {/* Phone Number */}
                <div className="grid w-full grid-cols-1 gap-4">
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field, fieldState }) => {
                      const phoneCodeValue = methods.getValues('phoneCode') || '';
                      const displayValue = field.value && phoneCodeValue ? `${phoneCodeValue}${field.value}` : field.value || '';

                      return (
                        <div>
                          <p className="mb-0.5 text-sm font-medium">Phone</p>
                          <PhoneInput
                            value={displayValue}
                            country="hr"
                            onChange={(value, country: any) => {
                              const phoneCode = `+${country?.dialCode || ''}`;
                              const phoneNumber = value.replace(country?.dialCode || '', '');
                              field.onChange(phoneNumber);
                              setValue('phoneCode', phoneCode, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            }}
                            placeholder="Phone Number"
                            inputProps={{
                              required: true,
                              'aria-invalid': fieldState.invalid,
                            }}
                            containerClass="w-full"
                            dropdownStyle={{
                              zIndex: 9999,
                              position: 'fixed',
                              width: '16rem',
                            }}
                            buttonClass="!bg-transparent !border-none !shadow-none px-2 text-gray-800"
                            inputClass={`file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input !border-gray-100 dark:!border-gray-500 !shadow-sm flex !h-[42px] !w-full min-w-0 rounded-lg !bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ${fieldState.invalid ? 'border-destructive ring-destructive/40' : ''}`}
                          />
                          {fieldState.error && <p className="mt-1 text-xs text-red-500">{fieldState.error.message}</p>}
                        </div>
                      );
                    }}
                  />
                </div>

                {/* Party Size & Reservation Type */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFTextField name="partySize" label="Party Size" placeholder="Enter number of guests" type="number" min="1" />

                  {/* <RHFCustomDropdown
                    name="reservationType"
                    label="Reservation Type"
                    placeholder="Select Type"
                    options={reservationTypeOptions}
                    isLoading={false}
                    showNone={false}
                  /> */}

                  {/* Date */}
                  <RHFTextField name="date" label="Date" placeholder="Select date" type="date" />
                </div>

                {/* Start Time & End Time */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFTextField name="startTime" label="Start Time" placeholder="Select start time" type="time" />

                  <RHFTextField name="endTime" label="End Time" placeholder="Select end time" type="time" />
                </div>

                {/* Notes */}
                <div className="grid w-full grid-cols-1 gap-4">
                  <RHFTextField name="notes" label="Notes (Optional)" placeholder="Any special requests..." rows={3} multiline />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <Button type="button" variant="outline" onClick={handleClose} className="px-6" disabled={isUpdating}>
                  Cancel
                </Button>

                {isUpdating ? (
                  <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-6 text-white">
                    <ButtonLoading title="Updating" />
                  </Button>
                ) : (
                  <Button type="submit" className="bg-primary hover:bg-primary-dark cursor-pointer px-6 text-white" disabled={!isDirty}>
                    Update Reservation
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

export default UpdateReservationModal;
