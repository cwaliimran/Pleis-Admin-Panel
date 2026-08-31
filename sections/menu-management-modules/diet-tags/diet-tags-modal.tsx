'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useAddDietTagMutation, useGetDietTagCodeQuery, useUpdateDietTagMutation } from '@/store/Reducer/diet-tags-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { DietTagFormValues, DietTagModalProps } from './types';

const defaultValues: DietTagFormValues = {
  name: '',
  description: '',
  status: 'active',
};

const SNAKE_CASE_REGEX = /^[a-z0-9]+(_[a-z0-9]+)*$/;

const schema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .matches(SNAKE_CASE_REGEX, 'Name must be lowercase and in snake_case format (e.g. raw_food)'),
  description: Yup.string().required('Description is required'),
  status: Yup.mixed<'active' | 'inactive'>().oneOf(['active', 'inactive']).required(),
});

const DietTagModal = ({ open, onClose, isEdit = false, selectedData }: DietTagModalProps) => {
  const { data: codeData, isLoading: codeLoading } = useGetDietTagCodeQuery(undefined, { skip: isEdit });
  const [addDietTag, { isLoading: addLoading }] = useAddDietTagMutation();
  const [updateDietTag, { isLoading: updateLoading }] = useUpdateDietTagMutation();
  const submitting = addLoading || updateLoading;

  const methods = useForm<DietTagFormValues>({
    resolver: yupResolver(schema as Yup.ObjectSchema<DietTagFormValues>),
    defaultValues,
  });

  const { reset, control, setValue, formState } = methods;
  const isDirty = formState?.isDirty;

  const toSnakeCase = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+/, '');

  useEffect(() => {
    if (open && isEdit && selectedData) {
      reset({ name: selectedData.name, description: selectedData.description, status: selectedData.status });
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  const handleSubmit = async (formData: DietTagFormValues) => {
    const payload = { ...formData, name: toSnakeCase(formData.name).replace(/_+$/, '') };

    try {
      if (isEdit && selectedData?._id) {
        await updateDietTag({ id: selectedData._id, ...payload }).unwrap();
        showSuccess('Diet tag updated successfully');
      } else {
        await addDietTag({ ...payload, code: codeData?.code }).unwrap();
        showSuccess('Diet tag created successfully');
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
            <DialogTitle>{isEdit ? 'Edit Diet Tag' : 'Create Diet Tag'}</DialogTitle>
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

                <div className="flex flex-col gap-1">
                  <RHFTextField
                    name="name"
                    label="Name"
                    placeholder="e.g. raw_food"
                    onChange={(e) => setValue('name', toSnakeCase(e.target.value), { shouldDirty: true, shouldValidate: true })}
                  />
                  <p className="text-muted-foreground text-xs">Lowercase snake_case only (letters, numbers and underscores)</p>
                </div>

                <RHFTextField name="description" label="Description" placeholder="e.g. No cooked or processed ingredients" multiline rows={2} />

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
