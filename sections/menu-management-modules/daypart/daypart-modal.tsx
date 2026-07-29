'use client';

import ButtonLoading from '@/components/common/button-loading';
import Time24hInput from '@/components/common/time-24h-input';
import FormProvider, { RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useAddDaypartMutation, useGetDaypartCodeQuery, useUpdateDaypartMutation } from '@/store/Reducer/daypart-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import * as Yup from 'yup';
import { DaypartFormValues, DaypartModalProps } from './types';

const isValidTime = (time?: string) => !!time && /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

const defaultValues: DaypartFormValues = {
  name: '',
  startTime: '',
  endTime: '',
  isAllDay: false,
  status: 'active',
};

const schema = Yup.object().shape({
  name: Yup.string().required('Daypart name is required'),
  isAllDay: Yup.boolean().required(),
  startTime: Yup.string().when('isAllDay', {
    is: false,
    then: (s) => s.required('Start time is required').test('valid-time', 'Invalid time format', isValidTime),
  }),
  endTime: Yup.string().when('isAllDay', {
    is: false,
    then: (s) => s.required('End time is required').test('valid-time', 'Invalid time format', isValidTime),
  }),
  status: Yup.mixed<'active' | 'inactive'>().oneOf(['active', 'inactive']).required(),
});

const DaypartModal = ({ open, onClose, isEdit = false, selectedData }: DaypartModalProps) => {
  const { data: codeData, isLoading: codeLoading } = useGetDaypartCodeQuery(undefined, { skip: isEdit });
  const [addDaypart, { isLoading: addLoading }] = useAddDaypartMutation();
  const [updateDaypart, { isLoading: updateLoading }] = useUpdateDaypartMutation();
  const submitting = addLoading || updateLoading;

  const methods = useForm<DaypartFormValues>({
    resolver: yupResolver(schema as Yup.ObjectSchema<DaypartFormValues>),
    defaultValues,
  });

  const { reset, control, formState } = methods;
  const isDirty = formState?.isDirty;
  const isAllDay = useWatch({ control, name: 'isAllDay' });

  useEffect(() => {
    if (open && isEdit && selectedData) {
      reset({
        name: selectedData.name,
        startTime: selectedData.startTime,
        endTime: selectedData.endTime,
        isAllDay: !!selectedData.isAllDay,
        status: selectedData.status,
      });
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  const handleSubmit = async (formData: DaypartFormValues) => {
    const payload = {
      ...formData,
      name: formData.name.toLowerCase(),
      ...(formData.isAllDay ? { startTime: '00:00', endTime: '23:59' } : {}),
    };
    

    try {
      if (isEdit && selectedData?._id) {
        await updateDaypart({ id: selectedData._id, ...payload }).unwrap();
        showSuccess('Daypart updated successfully');
      } else {
        await addDaypart({ ...payload, code: codeData?.code }).unwrap();
        showSuccess('Daypart created successfully');
      }
      reset(defaultValues);
      onClose();
    } catch (error) {
      showError(getErrorMessage(error));
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
            <DialogTitle>{isEdit ? 'Edit Daypart' : 'Create Daypart'}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-0 flex w-full flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">Code</Label>
                  <Input
                    value={isEdit ? selectedData?.code || '' : codeLoading ? 'Loading...' : codeData?.code || ''}
                    disabled
                    className="h-10 bg-gray-50 dark:bg-gray-800"
                  />
                  <p className="text-muted-foreground text-xs">Auto-generated</p>
                </div>

                <RHFTextField name="name" label="Daypart name" placeholder="e.g. midnight snack" />

                <FormField
                  control={control}
                  name="isAllDay"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between gap-4">
                      <FormLabel>All day</FormLabel>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={!!field.value}
                        onClick={() => field.onChange(!field.value)}
                        className={cn(
                          'relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors',
                          field.value ? 'bg-primary' : 'bg-input'
                        )}
                      >
                        <span
                          className={cn(
                            'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                            field.value && 'translate-x-5'
                          )}
                        />
                      </button>
                    </FormItem>
                  )}
                />

                {!isAllDay && (
                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start time</FormLabel>
                          <FormControl>
                            <Time24hInput value={field.value || ''} onChange={field.onChange} placeholder="HH:mm" title="Start Time" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End time</FormLabel>
                          <FormControl>
                            <Time24hInput value={field.value || ''} onChange={field.onChange} placeholder="HH:mm" title="End Time" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <FormField
                  control={control}
                  name="status"
                  render={({ field }) => {
                    const checked = field.value === 'active';
                    return (
                      <FormItem className="flex flex-row items-center justify-between gap-4">
                        <FormLabel>Active</FormLabel>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={checked}
                          onClick={() => field.onChange(checked ? 'inactive' : 'active')}
                          className={cn(
                            'relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors',
                            checked ? 'bg-primary' : 'bg-input'
                          )}
                        >
                          <span
                            className={cn(
                              'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                              checked && 'translate-x-5'
                            )}
                          />
                        </button>
                      </FormItem>
                    );
                  }}
                />
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
                    {isEdit ? 'Update Daypart' : 'Create Daypart'}
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

export default DaypartModal;
