'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFAsyncCombobox, RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useGetMenuSubcategoriesQuery } from '@/store/Reducer/menu-subcategories-api';
import { useAddSubcategoryTypeMutation, useUpdateSubcategoryTypeMutation } from '@/store/Reducer/subcategory-types-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { SubcategoryTypeFormValues, SubcategoryTypeModalProps } from './types';

const defaultValues: SubcategoryTypeFormValues = {
  name: '',
  subCategory: '',
  status: 'active',
};

const schema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  subCategory: Yup.string().required('Subcategory is required'),
  status: Yup.mixed<'active' | 'inactive'>().oneOf(['active', 'inactive']).required(),
});

const SubcategoryTypeModal = ({ open, onClose, isEdit = false, selectedData }: SubcategoryTypeModalProps) => {
  const [addSubcategoryType, { isLoading: addLoading }] = useAddSubcategoryTypeMutation();
  const [updateSubcategoryType, { isLoading: updateLoading }] = useUpdateSubcategoryTypeMutation();
  const submitting = addLoading || updateLoading;

  const methods = useForm<SubcategoryTypeFormValues>({
    resolver: yupResolver(schema as Yup.ObjectSchema<SubcategoryTypeFormValues>),
    defaultValues,
  });

  const { reset, control, formState } = methods;
  const isDirty = formState?.isDirty;

  useEffect(() => {
    if (open && isEdit && selectedData) {
      reset({
        name: selectedData.name,
        subCategory: selectedData.subCategory?._id || '',
        status: selectedData.status,
      });
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  const handleSubmit = async (formData: SubcategoryTypeFormValues) => {
    const payload = {
      name: formData.name,
      subCategory: formData.subCategory,
      status: formData.status,
    };

    try {
      if (isEdit && selectedData?._id) {
        await updateSubcategoryType({ id: selectedData._id, ...payload }).unwrap();
        showSuccess('Type updated successfully');
      } else {
        await addSubcategoryType(payload).unwrap();
        showSuccess('Type created successfully');
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
          className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col items-center overflow-y-auto md:max-w-137.5!"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Type' : 'Create Type'}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-0 flex w-full flex-col gap-4">
                <RHFTextField name="name" label="Name" placeholder="e.g. Signature Cocktails" />

                <RHFAsyncCombobox
                  name="subCategory"
                  label="Subcategory"
                  placeholder="Select subcategory"
                  searchPlaceholder="Search subcategories..."
                  selectedLabel={selectedData?.subCategory?.name}
                  useOptionsQuery={useGetMenuSubcategoriesQuery}
                  getOptionValue={(subcategory) => subcategory._id}
                  getOptionLabel={(subcategory) => subcategory.name}
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
                    {isEdit ? 'Update Type' : 'Create Type'}
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

export default SubcategoryTypeModal;
