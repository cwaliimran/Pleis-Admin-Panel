'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import RHFUploadButton from '@/components/rhf/rhf-upload-button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useAddStatusMutation, useReOrderStatusMutation, useUpdateStatusMutation } from '@/store/Reducer/status-api';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { StatusFormValues, StatusModalProps } from './types';

const schema = Yup.object().shape({
  image: Yup.mixed().nullable().default(null),
  background: Yup.mixed().nullable().default(null),
  title: Yup.string().required('Status name is required').default(''),
  entryPoint: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? 0 : value))
    .required('Entry point is required')
    .min(0, 'Must be at least 0')
    .default(0),
  retainPoint: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? 0 : value))
    .required('Retain point is required')
    .min(0, 'Must be at least 0')
    .test('retain-less-than-entry', 'Retain point must be less than or equal to entry point', function (value) {
      const { entryPoint } = this.parent;
      return value <= entryPoint;
    })
    .default(0),
  order: Yup.string().required('Order is required').default(''),
  status: Yup.string()
    .oneOf(['active', 'inactive'] as const)
    .default('active'),
}) as Yup.ObjectSchema<StatusFormValues>;

const defaultValues: StatusFormValues = {
  image: null,
  background: null,
  title: '',
  entryPoint: 0,
  retainPoint: 0,
  order: '',
  status: 'active',
};

const StatusModal = ({ open, onClose, isEdit = false, selectedData }: StatusModalProps) => {
  const [deleting, setDeleting] = useState(false);
  const { uploadImage, uploading: imageUploading } = useImageUpload();

  const [addStatus, { isLoading: addLoading }] = useAddStatusMutation();
  const [updateStatus, { isLoading: updateLoading }] = useUpdateStatusMutation();
  const [reOrderStatus, { isLoading: reOrderLoading }] = useReOrderStatusMutation();

  const methods = useForm<StatusFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const { reset, formState } = methods;
  const isDirty = formState?.isDirty;

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  const orderOptions = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1}`,
    value: `${i + 1}`,
  }));

  useEffect(() => {
    if (open && isEdit && selectedData) {
      const mappedData: StatusFormValues = {
        image: (() => {
          const img = selectedData?.imageInfo?.url || selectedData?.image;
          if (!img || img === noImageUrl || img === noImageUrlDev || img.toLowerCase().includes('noimage.png')) {
            return null;
          }
          return img;
        })(),
        background: (() => {
          const bg = selectedData?.backgroundImageInfo?.url || selectedData?.backgroundImage;
          if (!bg || bg === noImageUrl || bg === noImageUrlDev || bg.toLowerCase().includes('noimage.png')) {
            return null;
          }
          return bg;
        })(),
        title: selectedData?.title || '',
        entryPoint: selectedData?.entryPoints || 0,
        retainPoint: selectedData?.retainPoints || 0,
        order: selectedData?.order?.toString() || '',
        status: selectedData?.status || 'active',
      };

      reset(mappedData);
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  // Handle Submit
  const handleSubmit = async (formData: StatusFormValues) => {
    let uploadedImageKey: string | null = null;
    let uploadedBackgroundKey: string | null = null;

    try {
      // Upload main image if new file selected
      if (formData.image instanceof FileList && formData.image.length > 0) {
        const file = formData.image[0];
        uploadedImageKey = await uploadImage(file);
      }

      // Upload background image if new file selected
      if (formData.background instanceof FileList && formData.background.length > 0) {
        const file = formData.background[0];
        uploadedBackgroundKey = await uploadImage(file);
      }

      // Prepare payload for add/update API
      const payload: any = {
        title: formData.title,
        entryPoints: Number(formData.entryPoint),
        retainPoints: Number(formData.retainPoint),
        order: Number(formData.order),
      };

      if (uploadedImageKey) payload.image = uploadedImageKey;
      if (uploadedBackgroundKey) payload.backgroundImage = uploadedBackgroundKey;

      // Edit mode logic
      if (isEdit && selectedData) {
        payload.status = formData.status;
        payload.id = selectedData._id;

        const previousOrder = Number(selectedData.order);
        const newOrder = Number(formData.order);

        if (previousOrder !== newOrder) {
          const reorderPayload = {
            movedId: selectedData._id,
            previousOrder: previousOrder.toString(),
            newOrder: newOrder.toString(),
          };

          try {
            const reorderRes = await reOrderStatus(reorderPayload).unwrap();
            if (!reorderRes || reorderRes.error) {
              showError(getErrorMessage(reorderRes?.error || 'Failed to reorder'));
              return;
            }
          } catch (err) {
            showError(getErrorMessage(err));
            return;
          }
        }
      }

      const response = isEdit ? await updateStatus(payload).unwrap() : await addStatus(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || (isEdit ? 'Status updated successfully' : 'Status created successfully'));
      methods.reset(defaultValues);
      onClose();
    } catch (error) {
      // Cleanup uploaded files on error
      if (uploadedImageKey || uploadedBackgroundKey) {
        setDeleting(true);
        try {
          if (uploadedImageKey) await deleteFileFromAzure(uploadedImageKey);
          if (uploadedBackgroundKey) await deleteFileFromAzure(uploadedBackgroundKey);
        } finally {
          setDeleting(false);
        }
      }

      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const isLoading = addLoading || updateLoading || reOrderLoading || imageUploading || deleting;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[35vh] w-full flex-col items-center overflow-y-auto md:max-w-[550px]!"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Status' : 'Create Status'}</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-6 flex w-full flex-col gap-4">
                {/* Image Upload */}
                <RHFUploadAvatar
                  name="image"
                  label="Status Image"
                  initialImage={(() => {
                    if (!isEdit || !selectedData) return null;
                    const img = selectedData?.imageInfo?.url || selectedData?.image;
                    if (!img || img === noImageUrl || img === noImageUrlDev || img.toLowerCase().includes('noimage.png')) {
                      return null;
                    }
                    return img;
                  })()}
                />

                {/* Background Upload */}
                <div className="flex max-w-48 items-center justify-start">
                  <RHFUploadButton
                    name="background"
                    label="Upload Background"
                    initialImage={(() => {
                      if (!isEdit || !selectedData) return null;
                      const bg = selectedData?.backgroundImageInfo?.url || selectedData?.backgroundImage;
                      if (!bg || bg === noImageUrl || bg === noImageUrlDev || bg.toLowerCase().includes('noimage.png')) {
                        return null;
                      }
                      return bg;
                    })()}
                  />
                </div>

                {/* Form Fields */}
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="col-span-2">
                    <RHFTextField name="title" label="Status Name" placeholder="Enter status name" />
                  </div>

                  <RHFTextField name="entryPoint" label="Entry Point" type="number" placeholder="Enter entry point" min="0" />

                  <RHFTextField name="retainPoint" label="Retain Point" type="number" placeholder="Enter retain point" min="0" />

                  <div className="col-span-2">
                    <RHFCustomDropdown
                      name="order"
                      label="Set Order of Appearance"
                      placeholder="Select order"
                      options={orderOptions}
                      isLoading={false}
                      showNone={false}
                    />
                  </div>

                  {isEdit && (
                    <div className="col-span-2">
                      <RHFSelectField name="status" label="Status" placeholder="Select status" options={statusOptions} />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <Button type="button" variant="outline" onClick={handleClose} className="px-6">
                  Cancel
                </Button>

                {isLoading ? (
                  <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-6 text-white">
                    <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark cursor-pointer px-6 text-white"
                    disabled={isEdit ? !isDirty : false}
                  >
                    {isEdit ? 'Update Status' : 'Create Status'}
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

export default StatusModal;
