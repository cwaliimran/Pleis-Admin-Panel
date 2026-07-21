'use client';

import ButtonLoading from '@/components/common/button-loading';
import Time24hInput from '@/components/common/time-24h-input';
import FormProvider, { RHFDate, RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import * as Yup from 'yup';
import { DiscountTypeCards, ItemsPicker } from './discounts-modal-fields';
import { DiscountFormValues, DiscountModalProps } from './types';

const NO_MIN_DATE = new Date(0);

const defaultValues: DiscountFormValues = {
  title: '',
  description: '',
  type: 'percentage',
  value: '',
  itemIds: [],
  startDateDate: undefined,
  startTime: '',
  endDateDate: undefined,
  endTime: '',
};

const isValidTime = (time?: string) => !!time && /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

const combineDateTime = (date?: Date, time?: string): number | null => {
  if (!date || !isValidTime(time)) return null;
  const [hours, minutes] = time!.split(':').map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined.getTime();
};

const schema = Yup.object().shape({
  title: Yup.string().required('Discount name is required'),
  description: Yup.string().optional(),
  type: Yup.mixed<'percentage' | 'fixed'>().oneOf(['percentage', 'fixed']).required(),
  value: Yup.string()
    .required('Value is required')
    .test('is-decimal', 'Value must be a valid number greater than 0', (value) => !!value && !isNaN(Number(value)) && Number(value) > 0),
  itemIds: Yup.array().of(Yup.string().required()).min(1, 'Select at least one menu item').required(),
  startDateDate: Yup.date().required('Start date is required'),
  startTime: Yup.string().required('Start time is required').test('valid-time', 'Invalid time format', isValidTime),
  endDateDate: Yup.date()
    .required('End date is required')
    .test('after-start', 'End date/time must be after the start date/time', function (value) {
      const { startDateDate, startTime, endTime } = this.parent;
      const start = combineDateTime(startDateDate, startTime);
      const end = combineDateTime(value, endTime);
      if (start === null || end === null) return true;
      return end > start;
    }),
  endTime: Yup.string().required('End time is required').test('valid-time', 'Invalid time format', isValidTime),
});

const DiscountModal = ({ open, onClose, isEdit = false, selectedData, onSubmit }: DiscountModalProps) => {
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm<DiscountFormValues>({
    resolver: yupResolver(schema as Yup.ObjectSchema<DiscountFormValues>),
    defaultValues,
  });

  const { reset, control, trigger, formState } = methods;
  const isDirty = formState?.isDirty;
  const type = useWatch({ control, name: 'type' });
  const startDateDate = useWatch({ control, name: 'startDateDate' });
  const startTime = useWatch({ control, name: 'startTime' });
  const endTime = useWatch({ control, name: 'endTime' });

  // Re-check the end-after-start rule live as the surrounding fields change, not just on submit.
  useEffect(() => {
    if (formState.touchedFields.endDateDate || formState.submitCount > 0) {
      trigger('endDateDate');
    }
  }, [startDateDate, startTime, endTime, trigger, formState.touchedFields.endDateDate, formState.submitCount]);

  useEffect(() => {
    if (open && isEdit && selectedData) {
      const [startDatePart, startTimePart] = selectedData.startDate.split('T');
      const [endDatePart, endTimePart] = selectedData.endDate.split('T');

      reset({
        title: selectedData.title,
        description: selectedData.description || '',
        type: selectedData.type,
        value: String(selectedData.value),
        itemIds: selectedData.itemIds,
        startDateDate: new Date(startDatePart),
        startTime: startTimePart || '',
        endDateDate: new Date(endDatePart),
        endTime: endTimePart || '',
      });
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  const handleSubmit = async (formData: DiscountFormValues) => {
    setSubmitting(true);
    try {
      onSubmit(formData);
      methods.reset(defaultValues);
      onClose();
    } finally {
      setSubmitting(false);
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
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[45vh] w-full flex-col items-center overflow-y-auto md:max-w-[650px]!"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Discount' : 'Create Discount'}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-0 flex w-full flex-col gap-5">
                {/* BASIC INFORMATION */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-muted-foreground border-b pb-2 text-xs font-semibold tracking-wide uppercase">Basic Information</h4>

                  <RHFTextField name="title" label="Discount name" placeholder="e.g. Summer Happy Hour" />

                  <RHFTextField
                    name="description"
                    label="Description (Optional)"
                    placeholder="Internal description of this discount"
                    multiline
                    rows={2}
                  />
                </div>

                {/* DISCOUNT VALUE */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-muted-foreground border-b pb-2 text-xs font-semibold tracking-wide uppercase">Discount Value</h4>

                  <DiscountTypeCards />

                  <div>
                    <RHFTextField name="value" label="Value" type="number" placeholder="e.g. 15" step="0.01" min="0.01" />
                    <p className="text-muted-foreground mt-1 text-xs">
                      {type === 'fixed' ? 'Enter fixed amount in € (e.g. 5 = €5 off)' : 'Enter percentage (e.g. 15 = 15% off)'}
                    </p>
                  </div>
                </div>

                {/* APPLIES TO */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-muted-foreground border-b pb-2 text-xs font-semibold tracking-wide uppercase">
                    Applies To <span className="normal-case">· select one or more menu items</span>
                  </h4>

                  <ItemsPicker name="itemIds" />
                </div>

                {/* SCHEDULE */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-muted-foreground border-b pb-2 text-xs font-semibold tracking-wide uppercase">Schedule</h4>

                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <RHFDate name="startDateDate" label="Start date" placeholder="Select date" minDate={NO_MIN_DATE} displayFormat="dd/MM/yyyy" />

                    <FormField
                      control={control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start time</FormLabel>
                          <FormControl>
                            <Time24hInput value={field.value || ''} onChange={field.onChange} placeholder="HH:mm" title="Start Time" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <RHFDate name="endDateDate" label="End date" placeholder="Select date" minDate={NO_MIN_DATE} displayFormat="dd/MM/yyyy" />

                    <FormField
                      control={control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End time</FormLabel>
                          <FormControl>
                            <Time24hInput value={field.value || ''} onChange={field.onChange} placeholder="HH:mm" title="End Time" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex w-full items-center justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose} disabled={submitting} className="cursor-pointer px-4 py-2">
                  Cancel
                </Button>

                {submitting ? (
                  <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white">
                    <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark cursor-pointer px-4 py-2 text-white"
                    disabled={isEdit ? !isDirty : false}
                  >
                    {isEdit ? 'Update Discount' : 'Create Discount'}
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

export default DiscountModal;
