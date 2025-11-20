'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useUpdateUserReservationMutation } from '@/store/Reducer/reservations-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

interface UpdateReservationFormValues {
  userName: string;
  phone: string;
  reservationType: string;
  specialRequirements: string;
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
  userName: Yup.string().required('Name is required').default(''),
  phone: Yup.string().default(''),
  reservationType: Yup.string().required('Reservation type is required').default(''),
  specialRequirements: Yup.string().default(''),
  partySize: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .typeError('Party size must be a number')
    .positive('Party size must be positive')
    .integer('Party size must be a whole number')
    .required('Party size is required')
    .default(0),
  date: Yup.string().required('Date is required').default(''),
  startTime: Yup.string().required('Start time is required').default(''),
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
    })
    .default(''),
}) as Yup.ObjectSchema<UpdateReservationFormValues>;

// ============================================
// 3. DEFAULT VALUES
// ============================================
const defaultValues: UpdateReservationFormValues = {
  userName: '',
  phone: '',
  reservationType: '',
  specialRequirements: '',
  partySize: '' as any,
  date: '',
  startTime: '',
  endTime: '',
};

//  MAIN COMPONENT
const UpdateReservationModal = ({ open, onClose, selectedData }: UpdateReservationModalProps) => {
  const [updateReservation, { isLoading: isUpdating }] = useUpdateUserReservationMutation();

  //  FORM INITIALIZATION
  const methods = useForm<UpdateReservationFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const { reset, formState } = methods;
  const isDirty = formState?.isDirty;

  //  OPTIONS
  const reservationTypeOptions = [
    { label: 'Regular', value: 'regular' },
    { label: 'VIP', value: 'vip' },
    { label: 'Outdoor', value: 'outdoor' },
    { label: 'Private', value: 'private' },
    { label: 'Bar', value: 'bar' },
    { label: 'Window', value: 'window' },
  ];

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
        userName: selectedData?.userName || '',
        phone: selectedData?.phone || '',
        reservationType: selectedData?.reservationType || '',
        specialRequirements: selectedData?.specialRequirements || '',
        partySize: selectedData?.partySize || ('' as any),
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
    try {
      // Build payload
      const payload: any = {
        id: selectedData?._id,
        userId: selectedData?.userId,
        userName: formData.userName,
        partySize: Number(formData.partySize),
        reservationType: formData.reservationType,
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

      if (formData.phone) {
        payload.phone = formData.phone;
      }
      if (formData.specialRequirements) {
        payload.specialRequirements = formData.specialRequirements;
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
                {/* Name & Phone */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFTextField name="userName" label="Customer Name" placeholder="Enter name" />

                  <RHFTextField name="phone" label="Phone (Optional)" placeholder="Enter phone number" type="tel" />
                </div>

                {/* Party Size & Reservation Type */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFTextField name="partySize" label="Party Size" placeholder="Enter number of guests" type="number" min="1" />

                  <RHFCustomDropdown
                    name="reservationType"
                    label="Reservation Type"
                    placeholder="Select Type"
                    options={reservationTypeOptions}
                    isLoading={false}
                    showNone={false}
                  />
                </div>

                {/* Date */}
                <div className="grid w-full grid-cols-1 gap-4">
                  <RHFTextField name="date" label="Date" placeholder="Select date" type="date" />
                </div>

                {/* Start Time & End Time */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFTextField name="startTime" label="Start Time" placeholder="Select start time" type="time" />

                  <RHFTextField name="endTime" label="End Time" placeholder="Select end time" type="time" />
                </div>

                {/* Special Requirements */}
                <div className="grid w-full grid-cols-1 gap-4">
                  <RHFTextField
                    name="specialRequirements"
                    label="Special Requirements (Optional)"
                    placeholder="Any special requests..."
                    rows={3}
                    multiline
                  />
                </div>

                {/* Info Box */}
                {selectedData && (
                  <div className="rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-900/20">
                    <p className="font-medium text-blue-900 dark:text-blue-300">Reservation Details:</p>
                    <ul className="mt-1 space-y-1 text-xs text-blue-800 dark:text-blue-400">
                      <li>
                        • Status: <strong>{selectedData.reservationStatus}</strong>
                      </li>
                      <li>
                        • Member Tier: <strong>{selectedData.member}</strong>
                      </li>
                      {selectedData.eventTitle && (
                        <li>
                          • Event: <strong>{selectedData.eventTitle}</strong>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <Button type="button" variant="outline" onClick={handleClose} className="px-6">
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
