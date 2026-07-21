'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFTextField } from '@/components/rhf';
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
import { DietTagFormValues, DietTagModalProps } from './types';

const defaultValues: DietTagFormValues = {
  tag: '',
  description: '',
  status: 'active',
};

const schema = Yup.object().shape({
  tag: Yup.string()
    .required('Tag identifier is required')
    .matches(/^[a-z][a-z0-9_]*$/, 'Use snake_case (lowercase letters, numbers, underscores)'),
  description: Yup.string().required('Description is required'),
  status: Yup.mixed<'active' | 'inactive'>().oneOf(['active', 'inactive']).required(),
});

const DietTagModal = ({ open, onClose, isEdit = false, selectedData, nextCode, onSubmit }: DietTagModalProps) => {
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm<DietTagFormValues>({
    resolver: yupResolver(schema as Yup.ObjectSchema<DietTagFormValues>),
    defaultValues,
  });

  const { reset, control, formState } = methods;
  const isDirty = formState?.isDirty;

  useEffect(() => {
    if (open && isEdit && selectedData) {
      reset({ tag: selectedData.tag, description: selectedData.description, status: selectedData.status });
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  const handleSubmit = async (formData: DietTagFormValues) => {
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
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[35vh] w-full flex-col items-center overflow-y-auto md:max-w-[550px]!"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Diet Tag' : 'Create Diet Tag'}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-0 flex w-full flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">Code</Label>
                  <Input value={isEdit ? selectedData?.code || '' : nextCode} disabled className="h-[40px] bg-gray-50 dark:bg-gray-800" />
                  <p className="text-muted-foreground text-xs">Auto-generated</p>
                </div>

                <RHFTextField name="tag" label="Tag identifier" placeholder="e.g. raw_food (snake_case)" />

                <RHFTextField
                  name="description"
                  label="Description"
                  placeholder="e.g. No cooked or processed ingredients"
                  multiline
                  rows={2}
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
                    {isEdit ? 'Update Diet Tag' : 'Create Diet Tag'}
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

export default DietTagModal;
