'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { SubcategoryFormValues, SubcategoryModalProps } from './types';

const schema = Yup.object().shape({
  title: Yup.string().required('Name is required'),
  categoryId: Yup.string().required('Category is required'),
  sortOrder: Yup.string()
    .required('Sort order is required')
    .test('is-integer', 'Sort order must be a whole number', (value) => !!value && Number.isInteger(Number(value)) && Number(value) > 0),
  status: Yup.mixed<'active' | 'inactive'>().oneOf(['active', 'inactive']).required(),
});

const SubcategoryModal = ({ open, onClose, isEdit = false, selectedData, categories, nextSortOrder, onSubmit }: SubcategoryModalProps) => {
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: SubcategoryFormValues = {
    title: '',
    categoryId: '',
    sortOrder: String(nextSortOrder),
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
        title: selectedData.title,
        categoryId: selectedData.categoryId,
        sortOrder: String(selectedData.sortOrder),
        status: selectedData.status,
      });
    } else if (open && !isEdit) {
      reset({ ...defaultValues, sortOrder: String(nextSortOrder) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isEdit, selectedData, reset, nextSortOrder]);

  const categoryOptions = categories.map((category) => ({ value: category._id, label: category.code }));

  const handleSubmit = async (formData: SubcategoryFormValues) => {
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
            <DialogTitle>{isEdit ? 'Edit Subcategory' : 'Create Subcategory'}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-0 flex w-full flex-col gap-4">
                <RHFTextField name="title" label="Name" placeholder="e.g. House Cocktails" />

                <RHFSelectField name="categoryId" label="Category" placeholder="Select category" options={categoryOptions} />

                <RHFTextField name="sortOrder" label="Sort order" type="number" step="1" min="1" />

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
