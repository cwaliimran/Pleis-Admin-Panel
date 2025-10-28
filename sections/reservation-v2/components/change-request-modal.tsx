'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

interface ReservationFormValues {
  name: string;
  phone: string;
  tableType: string;
  speicialRequirements?: string;
  guestNumber: number | string;
  startTime: string;
  endTime: string;
}

interface ReservationModalProps {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: any;
}

const defaultValues: ReservationFormValues = {
  name: '',
  phone: '',
  tableType: 'regular',
  speicialRequirements: '',
  guestNumber: '',
  startTime: '',
  endTime: '',
};

const schema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  phone: Yup.string().required('Phone number is required'),
  tableType: Yup.string().required('Table type is required'),
  speicialRequirements: Yup.string(),
  guestNumber: Yup.number()
    .typeError('Guest number must be a number')
    .positive('Guest number must be positive')
    .integer('Guest number must be a whole number')
    .required('Guest number is required'),
  startTime: Yup.string().required('Start time is required'),
  endTime: Yup.string()
    .required('End time is required')
    .test(
      'is-after-start',
      'End time must be after start time',
      function (value) {
        const { startTime } = this.parent;
        if (!startTime || !value) return true;
        return new Date(value) > new Date(startTime);
      }
    ),
});

const ReservationModal = ({
  open,
  onClose,
  // isEdit = false,
  selectedData,
}: ReservationModalProps) => {
  const methods = useForm<ReservationFormValues>({
    resolver: yupResolver(schema as Yup.ObjectSchema<ReservationFormValues>),
    defaultValues,
  });

  const { reset, formState } = methods;
  const isDirty = formState?.isDirty;
  const [isLoading, setIsLoading] = React.useState(false);

  const prepareFormData = (data: any): ReservationFormValues => {
    console.log('Preparing form data from:', data);

    return {
      name: data?.customer || data?.name || '',
      phone: data?.phone || '',
      tableType: data?.table || '',
      speicialRequirements: data?.note || data?.specialRequirements || '',
      guestNumber: data?.guests || data?.guestNumber || '',
      startTime: data?.startTime || '',
      endTime: data?.endTime || '',
    };
  };

  useEffect(() => {
    if (open && selectedData) {
      const formData = prepareFormData(selectedData);
      console.log('Resetting form with data:', formData);
      reset(formData);
    } else if (open && !selectedData) {
      reset(defaultValues);
    }
  }, [open, selectedData, reset]);

  const handleSubmit = async (formData: ReservationFormValues) => {
    try {
      setIsLoading(true);

      const payload = {
        name: formData.name,
        guestNumber: formData.guestNumber,
        phone: formData.phone,
        tableType: formData.tableType,
        speicialRequirements: formData.speicialRequirements,
        startTime: formData.startTime,
        endTime: formData.endTime,
        ...(selectedData && { id: selectedData?.id || selectedData?._id }),
      };

      console.log('Form submitted with data:', payload);
      console.log('Original Selected Data:', selectedData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      methods.reset(defaultValues);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
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
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[35vh] w-full flex-col items-center overflow-y-auto md:!max-w-[550px]"
        >
          <DialogHeader>
            <DialogTitle>Change Reservation</DialogTitle>
          </DialogHeader>
          <div className="mt-4 w-full">
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(handleSubmit)}
            >
              <div className="mt-0 flex w-full flex-col gap-4">
                {/* Name Field */}
                <div className="grid w-full grid-cols-1 gap-4">
                  <RHFTextField
                    name="name"
                    label="Name"
                    placeholder="Enter name"
                  />

                  <RHFTextField
                    type="number"
                    name="phone"
                    label="Phone"
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="grid w-full grid-cols-1 gap-4">
                  <RHFTextField
                    name="guestNumber"
                    label="Guest Number"
                    placeholder="Enter number of guests"
                    type="number"
                  />

                  <RHFCustomDropdown
                    name="tableType"
                    label="Table Type"
                    placeholder="Select Table Type"
                    options={[
                      { label: 'Regular', value: 'regular' },
                      { label: 'VIP', value: 'vip' },
                      { label: 'Outdoor', value: 'outdoor' },
                      { label: 'Private', value: 'private' },
                      { label: 'Bar', value: 'bar' },
                      { label: 'Window', value: 'window' },
                    ]}
                    isLoading={false}
                    showNone={false}
                  />
                </div>

                {/* Start Time and End Time */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFTextField
                    name="startTime"
                    label="Start Time"
                    placeholder="Select start time"
                    type="time"
                  />

                  <RHFTextField
                    name="endTime"
                    label="End Time"
                    placeholder="Select end time"
                    type="time"
                  />
                </div>

                <div className="grid w-full grid-cols-1 gap-4">
                  <RHFTextField
                    name="speicialRequirements"
                    label="Special Requirements"
                    placeholder="Special Requirements"
                    rows={2}
                    multiline
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                <div className="flex w-full items-center justify-center">
                  {isLoading ? (
                    <Button
                      type="button"
                      disabled
                      className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white"
                    >
                      <ButtonLoading title="Updating" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary-dark cursor-pointer px-4 py-2 text-white"
                      disabled={!isDirty}
                    >
                      Update Reservation
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

export default ReservationModal;
