'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFAsyncCombobox, RHFSelectField, RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useGetItemsCategoryQuery } from '@/store/Reducer/items-category-api';
import { useAddMenuSubcategoryMutation, useUpdateMenuSubcategoryMutation } from '@/store/Reducer/menu-subcategories-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { SubcategoryFormValues, SubcategoryModalProps } from './types';

const schema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  category: Yup.string().required('Category is required'),
  status: Yup.mixed<'active' | 'inactive'>().oneOf(['active', 'inactive']).required(),
});

const SubcategoryModal = ({ open, onClose, isEdit = false, selectedData }: SubcategoryModalProps) => {
  const [addSubcategory, { isLoading: addLoading }] = useAddMenuSubcategoryMutation();
  const [updateSubcategory, { isLoading: updateLoading }] = useUpdateMenuSubcategoryMutation();
  const submitting = addLoading || updateLoading;

  const defaultValues: SubcategoryFormValues = {
    name: '',
    category: '',
    status: 'active',
  };

  const methods = useForm<SubcategoryFormValues>({
    resolver: yupResolver(schema as Yup.ObjectSchema<SubcategoryFormValues>),
    defaultValues,
  });

  const { reset, formState } = methods;
  const isDirty = formState?.isDirty;

  useEffect(() => {
    if (open && isEdit && selectedData) {
      reset({
        name: selectedData.name,
        category: selectedData.category?._id || '',
        status: selectedData.status,
      });
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isEdit, selectedData, reset]);

  const handleSubmit = async (formData: SubcategoryFormValues) => {
    const payload = {
      name: formData.name,
      category: formData.category,
      status: formData.status,
    };

    try {
      if (isEdit && selectedData?._id) {
        await updateSubcategory({ id: selectedData._id, ...payload }).unwrap();
        showSuccess('Subcategory updated successfully');
      } else {
        await addSubcategory(payload).unwrap();
        showSuccess('Subcategory created successfully');
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
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[30vh] w-full flex-col items-center overflow-y-auto md:max-w-[550px]!"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Subcategory' : 'Create Subcategory'}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-0 flex w-full flex-col gap-4">
                <RHFTextField name="name" label="Name" placeholder="e.g. House Cocktails" />

                <RHFAsyncCombobox
                  name="category"
                  label="Category"
                  placeholder="Select category"
                  searchPlaceholder="Search categories..."
                  selectedLabel={selectedData?.category?.title}
                  useOptionsQuery={useGetItemsCategoryQuery}
                  getOptionValue={(category) => category._id}
                  getOptionLabel={(category) => category.title}
                />

                {isEdit && (
                  <RHFSelectField
                    name="status"
                    label="Status"
                    placeholder="Select Status"
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                    ]}
                  />
                )}
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
                    {isEdit ? 'Update Subcategory' : 'Create Subcategory'}
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

export default SubcategoryModal;
