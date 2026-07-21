'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { ServingFormValues, ServingModalProps } from './types';

const NONE_LEVEL2 = 'none';
const NONE_UNIT = 'none';

const defaultValues: ServingFormValues = {
  level2: NONE_LEVEL2,
  type: '',
  unit: NONE_UNIT,
  status: 'active',
};

const schema = Yup.object().shape({
  level2: Yup.string().optional(),
  type: Yup.string().required('Type is required'),
  unit: Yup.string().optional(),
  status: Yup.mixed<'active' | 'inactive'>().oneOf(['active', 'inactive']).required(),
});

const ServingModal = ({ open, onClose, isEdit = false, selectedData, nextCode, onSubmit }: ServingModalProps) => {
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm<ServingFormValues>({
    resolver: yupResolver(schema as Yup.ObjectSchema<ServingFormValues>),
    defaultValues,
  });

  const { reset, control, formState } = methods;
  const isDirty = formState?.isDirty;

  useEffect(() => {
    if (open && isEdit && selectedData) {
      reset({
        level2: selectedData.level2 || NONE_LEVEL2,
        type: selectedData.type,
        unit: selectedData.unit || NONE_UNIT,
        status: selectedData.status,
      });
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  const handleSubmit = async (formData: ServingFormValues) => {
    setSubmitting(true);
    try {
      onSubmit({
        ...formData,
        level2: formData.level2 === NONE_LEVEL2 ? '' : formData.level2,
        unit: formData.unit === NONE_UNIT ? '' : formData.unit,
      });
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
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[35vh] w-full flex-col items-center overflow-y-auto md:max-w-[550px]!"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Serving' : 'Create Serving'}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-0 flex w-full flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">Code</Label>
                  <Input value={isEdit ? selectedData?.code || '' : nextCode} disabled className="h-[40px] bg-gray-50 dark:bg-gray-800" />
                  <p className="text-muted-foreground text-xs">Auto-generated</p>
                </div>

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFSelectField
                    name="level2"
                    label="Level 2"
                    placeholder="None (cross-category)"
                    options={[
                      { value: NONE_LEVEL2, label: 'None (cross-category)' },
                      { value: 'food', label: 'Food' },
                      { value: 'drink', label: 'Drink' },
                    ]}
                  />

                  <RHFTextField name="type" label="Type" placeholder="e.g. individual" />
                </div>

                <RHFSelectField
                  name="unit"
                  label="Unit (Optional)"
                  placeholder="None"
                  options={[
                    { value: NONE_UNIT, label: 'None' },
                    { value: 'l', label: 'l' },
                    { value: 'g', label: 'g' },
                    { value: 'pcs', label: 'pcs' },
                  ]}
                />

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
                          className={cn('relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors', checked ? 'bg-primary' : 'bg-input')}
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
                    {isEdit ? 'Update Serving' : 'Create Serving'}
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

export default ServingModal;
