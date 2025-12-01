'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useAddMenuListMutation, useUpdateMenuListMutation } from '@/store/Reducer/menu-list-api';
import { useGetOrganizationByCompanyQuery } from '@/store/Reducer/organization';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { MenuItemFormValues, MenuItemModalProps } from './types';

const defaultValues: MenuItemFormValues = {
  title: '',
  description: '',
  organization: '',
  status: 'active',
};

const schema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  organization: Yup.string().required('Organization is required'),
  status: Yup.string().required('Status is required'),
});

const MenuItemModal = ({ open, onClose, isEdit = false, selectedData, selectedCompany }: MenuItemModalProps) => {
  const methods = useForm<MenuItemFormValues>({
    resolver: yupResolver(schema as Yup.ObjectSchema<MenuItemFormValues>),
    defaultValues,
  });

  const { reset, formState } = methods;
  const isDirty = formState?.isDirty;

  const prepareFormData = (data: any): MenuItemFormValues => ({
    title: data?.title || '',
    description: data?.description || '',
    organization: data?.organization?._id || '',
    status: data?.status || 'active',
  });

  useEffect(() => {
    if (open && isEdit && selectedData) {
      const formData = prepareFormData(selectedData);
      reset(formData);
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  const { data: { data: organizations = [] } = {}, isLoading: organizationsLoading } = useGetOrganizationByCompanyQuery({
    companyOrganizer: selectedCompany || undefined,
  });

  const [addMenuList, { isLoading: addMenuListLoading }] = useAddMenuListMutation();

  const [updateMenuList, { isLoading: updateMenuListLoading }] = useUpdateMenuListMutation();

  const handleSubmit = async (formData: any) => {
    try {
      const payload: any = {
        title: formData?.title,
        description: formData?.description,
        organization: formData?.organization,
      };

      if (isEdit && selectedData) {
        payload.status = formData?.status;
        payload.id = selectedData?._id;
      }

      const response = isEdit && selectedData ? await updateMenuList(payload).unwrap() : await addMenuList(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || (isEdit ? 'Menu List updated successfully' : 'Menu List created successfully'));

      methods.reset(defaultValues);
      onClose();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
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
                <div className="grid w-full grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
                  <div className={`${isEdit ? 'col-span-1' : 'col-span-2'}`}>
                    <RHFTextField name="title" label="Name" placeholder="Enter Name" />
                  </div>

                  {isEdit && (
                    <RHFSelectField
                      name="status"
                      label="Select Status"
                      placeholder="Select Status"
                      className="w-full flex-1"
                      options={[
                        { value: 'active', label: 'Active' },
                        { value: 'inactive', label: 'Inactive' },
                      ]}
                    />
                  )}

                  <div className="col-span-2">
                    <RHFCustomDropdown
                      name="organization"
                      label="Organization"
                      placeholder="Select Organization"
                      options={organizations?.map((val: any) => ({
                        value: val?._id,
                        label: val?.basicInfo?.name,
                      }))}
                      isLoading={organizationsLoading}
                      showNone={false}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="grid w-full grid-cols-1 gap-4">
                  <RHFTextField name="description" label="Description" placeholder="Enter Description" multiline rows={2} />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <div className="flex w-full items-center justify-center">
                  {addMenuListLoading || updateMenuListLoading ? (
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
