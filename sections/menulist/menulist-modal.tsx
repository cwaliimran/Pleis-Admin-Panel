'use client';

import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGetVenuesQuery } from '@/store/Reducer/venue';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { MenuItemFormValues, MenuItemModalProps } from './types';
import { showError, showSuccess } from '@/utils/toast';
import { getErrorMessage } from '@/utils/api';
import {
  useAddMenuListMutation,
  useUpdateMenuListMutation,
} from '@/store/Reducer/menu-list-api';
import ButtonLoading from '@/components/common/button-loading';

const defaultValues: MenuItemFormValues = {
  title: '',
  description: '',
  venue: '',
  status: 'active',
};

const schema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  venue: Yup.string().required('Venue is required'),
  status: Yup.string().required('Status is required'),
});

const MenuItemModal = ({
  open,
  onClose,
  isEdit = false,
  selectedData,
}: MenuItemModalProps) => {
  const methods = useForm<MenuItemFormValues>({
    resolver: yupResolver(schema as Yup.ObjectSchema<MenuItemFormValues>),
    defaultValues,
  });

  console.log("selectedData", selectedData);

  const { reset, formState } = methods;
  const isDirty = formState?.isDirty;

  const prepareFormData = (data: any): MenuItemFormValues => ({
    title: data?.title || '',
    description: data?.description || '',
    venue: data?.venue?._id || '',
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

  const { data: { data: venues = [] } = {}, isLoading: venuesLoading } = useGetVenuesQuery({ page: 0, limit: 10000 });

  const [addMenuList, { isLoading: addMenuListLoading }] = useAddMenuListMutation();
  const [updateMenuList, { isLoading: updateMenuListLoading }] = useUpdateMenuListMutation();

  const handleSubmit = async (formData: any) => {
    try {
      const payload: any = {
        title: formData?.title,
        description: formData?.description,
        venue: formData?.venue,
      };

      if (isEdit && selectedData) {
        payload.status = formData?.status;
        payload.id = selectedData?._id;
      }

      const response =
        isEdit && selectedData
          ? await updateMenuList(payload).unwrap()
          : await addMenuList(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(
        response?.message ||
          (isEdit
            ? 'Preset updated successfully'
            : 'Preset created successfully')
      );

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
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[35vh] w-full flex-col items-center overflow-y-auto md:!max-w-[550px]"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Menu' : 'Create Menu'}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 w-full">
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(handleSubmit)}
            >
              <div className="mt-0 flex w-full flex-col gap-4">
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <div className={`${isEdit ? 'col-span-1' : 'col-span-2'}`}>
                    <RHFTextField
                      name="title"
                      label="Name"
                      placeholder="Enter Name"
                    />
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
                      name="venue"
                      label="Venue"
                      placeholder="Select Venue"
                      options={venues?.map((val: any) => ({
                        value: val?._id,
                        label: val?.title,
                      }))}
                      isLoading={venuesLoading}
                      showNone={false}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="grid w-full grid-cols-1 gap-4">
                  <RHFTextField
                    name="description"
                    label="Description"
                    placeholder="Enter Description"
                    multiline
                    rows={2}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <div className="flex w-full items-center justify-center">
                  {addMenuListLoading || updateMenuListLoading ? (
                    <Button
                      type="button"
                      disabled
                      className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white"
                    >
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
