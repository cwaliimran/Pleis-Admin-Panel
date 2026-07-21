'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFDate, RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFMultiSelectField from '@/components/rhf/RHFMultiSelectField';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { MenuItemFormValues, MenuItemModalProps } from './types';

const defaultValues: MenuItemFormValues = {
  title: '',
  description: '',
  organizations: [],
  validFrom: undefined,
  status: 'draft',
};

const schema = Yup.object().shape({
  title: Yup.string().required('Name is required'),
  description: Yup.string().optional(),
  organizations: Yup.array().of(Yup.string().required()).min(1, 'Select at least one organization').required('Organization is required'),
  validFrom: Yup.date().required('Valid from date is required'),
  status: Yup.mixed<'draft' | 'active' | 'inactive'>().oneOf(['draft', 'active', 'inactive']).required('Status is required'),
});

const MenuItemModal = ({ open, onClose, isEdit = false, selectedData, organizations, onSubmit }: MenuItemModalProps) => {
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm<MenuItemFormValues>({
    resolver: yupResolver(schema as Yup.ObjectSchema<MenuItemFormValues>),
    defaultValues,
  });

  const { reset, formState } = methods;
  const isDirty = formState?.isDirty;

  const prepareFormData = (data: any): MenuItemFormValues => ({
    title: data?.title || '',
    description: data?.description || '',
    organizations: data?.organizations || [],
    validFrom: data?.validFrom ? new Date(data.validFrom) : undefined,
    status: data?.status || 'draft',
  });

  useEffect(() => {
    if (open && isEdit && selectedData) {
      reset(prepareFormData(selectedData));
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  const organizationOptions = organizations?.map((org) => ({ value: org._id, label: org.name })) || [];

  const handleSubmit = async (formData: MenuItemFormValues) => {
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
            <DialogTitle>{isEdit ? 'Edit Menu' : 'Create Menu'}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-0 flex w-full flex-col gap-4">
                <RHFTextField name="title" label="Name" placeholder="e.g. Summer Menu 2026" />

                <RHFTextField name="description" label="Description" placeholder="Brief description of this menu" multiline rows={2} />

                <div className="grid w-full grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
                  <RHFDate name="validFrom" label="Valid From" placeholder="Select date" />

                  <RHFSelectField
                    name="status"
                    label="Status"
                    placeholder="Select Status"
                    className="w-full flex-1"
                    options={[
                      { value: 'draft', label: 'Draft' },
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                    ]}
                  />
                </div>

                <RHFMultiSelectField name="organizations" label="Organizations" placeholder="Select Organization" options={organizationOptions} />
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <div className="flex w-full items-center justify-center">
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
                      {isEdit ? 'Update Menu' : 'Create Menu'}
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

export default MenuItemModal;
