'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFAsyncCombobox, RHFSelectField, RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useAddMenuItemSubcategoryMutation, useUpdateMenuItemSubcategoryMutation } from '@/store/Reducer/menu-item-subcategories-api';
import { useGetOrganizationQuery } from '@/store/Reducer/organization';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { SubcategoryFormValues, SubcategoryModalProps } from './types';

const defaultValues: SubcategoryFormValues = {
  title: '',
  organization: '',
  status: 'active',
};

const schema = Yup.object().shape({
  title: Yup.string().required('Name is required'),
  organization: Yup.string().required('Organization is required'),
  status: Yup.mixed<'active' | 'inactive'>().oneOf(['active', 'inactive']).required(),
});

const SubcategoryModal = ({ open, onClose, isEdit = false, selectedData, companyId, userType }: SubcategoryModalProps) => {
  const [addSubcategory, { isLoading: addLoading }] = useAddMenuItemSubcategoryMutation();
  const [updateSubcategory, { isLoading: updateLoading }] = useUpdateMenuItemSubcategoryMutation();
  const submitting = addLoading || updateLoading;

  const methods = useForm<SubcategoryFormValues>({
    resolver: yupResolver(schema as Yup.ObjectSchema<SubcategoryFormValues>),
    defaultValues,
  });

  const { reset, formState } = methods;
  const isDirty = formState?.isDirty;

  useEffect(() => {
    if (!open) return;

    if (isEdit && selectedData) {
      reset({
        title: selectedData.title,
        organization: selectedData.organization?._id || '',
        status: selectedData.status,
      });
    } else if (!isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  const handleSubmit = async (formData: SubcategoryFormValues) => {
    const payload: any = {
      title: formData.title,
      organization: formData.organization,
      status: formData.status,
    };

    // Organizers are scoped by their token; only super-admin has to name the company explicitly.
    if (userType === 'super-admin' && companyId) payload.companyOrganizer = companyId;

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
                <RHFTextField name="title" label="Name" placeholder="e.g. Beverages" />

                {/*
                  `getOrganization` is role-routed: super-admin hits /admin/organizations scoped by the
                  selected company, organizers hit /organizer/organizations where `companyOrganizer` is
                  stripped by `adminOnlyParams` and the token scopes the result.
                */}
                <RHFAsyncCombobox
                  name="organization"
                  label="Organization"
                  placeholder="Select organization..."
                  searchPlaceholder="Search organizations..."
                  selectedLabel={selectedData?.organization?.basicInfo?.name}
                  useOptionsQuery={useGetOrganizationQuery}
                  queryArgs={{
                    companyOrganizer: userType === 'super-admin' ? companyId || undefined : undefined,
                    status: 'active',
                  }}
                  skip={userType === 'super-admin' && !companyId}
                  getOptionValue={(organization) => organization._id}
                  getOptionLabel={(organization) => organization?.basicInfo?.name || 'Unknown Organization'}
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
