'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { cn } from '@/lib/utils';
import { BrandFormValues, BrandModalProps } from './types';

const defaultValues: BrandFormValues = {
  name: '',
  principal: '',
  status: 'active',
};

const schema = Yup.object().shape({
  name: Yup.string().required('Brand name is required'),
  principal: Yup.string().required('Principal is required'),
  status: Yup.mixed<'active' | 'inactive'>().oneOf(['active', 'inactive']).required(),
});

const BrandModal = ({ open, onClose, isEdit = false, selectedData, onSubmit }: BrandModalProps) => {
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm<BrandFormValues>({
    resolver: yupResolver(schema as Yup.ObjectSchema<BrandFormValues>),
    defaultValues,
  });

  const { reset, control, formState } = methods;
  const isDirty = formState?.isDirty;

  useEffect(() => {
    if (open && isEdit && selectedData) {
      reset({ name: selectedData.name, principal: selectedData.principal, status: selectedData.status });
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  const handleSubmit = async (formData: BrandFormValues) => {
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
            <DialogTitle>{isEdit ? 'Edit Brand' : 'Create Brand'}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-0 flex w-full flex-col gap-4">
                <RHFTextField name="name" label="Brand name" placeholder="e.g. Hendrick's" />

                <RHFTextField name="principal" label="Principal · parent company / brand owner" placeholder="e.g. William Grant & Sons" />

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
                    {isEdit ? 'Update Brand' : 'Create Brand'}
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

export default BrandModal;
