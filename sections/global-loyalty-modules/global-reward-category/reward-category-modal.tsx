'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useAddRewardCategoryMutation, useUpdateRewardCategoryMutation } from '@/store/Reducer/reward-category-api';
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
  title: Yup.string().required('Reward category name is required').default(''),
  status: Yup.string()
    .oneOf(['active', 'inactive'] as const)
    .default('active'),
}) as Yup.ObjectSchema<StatusFormValues>;

const defaultValues: StatusFormValues = {
  image: null,
  title: '',
  status: 'active',
};

const RewardCategoryModal = ({ open, onClose, isEdit = false, selectedData }: StatusModalProps) => {
  const [deleting, setDeleting] = useState(false);
  const { uploadImage, uploading: imageUploading } = useImageUpload();

  const [addRewardCategory, { isLoading: addLoading }] = useAddRewardCategoryMutation();
  const [updateRewardCategory, { isLoading: updateLoading }] = useUpdateRewardCategoryMutation();

  const methods = useForm<StatusFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const { reset, formState } = methods;
  const isDirty = formState?.isDirty;
  const isValid = formState?.isValid;

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

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
        title: selectedData?.title || '',
        status: selectedData?.status || 'active',
      };
      reset(mappedData);
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  const handleSubmit = async (formData: StatusFormValues) => {
    let uploadedImageKey: string | null = null;
    try {
      if (formData.image instanceof FileList && formData.image.length > 0) {
        const file = formData.image[0];
        uploadedImageKey = await uploadImage(file);
      }

      const payload: any = {
        title: formData.title,
      };

      if (uploadedImageKey) {
        payload.image = uploadedImageKey;
      }

      if (isEdit && selectedData) {
        payload.status = formData.status;
        payload.id = selectedData._id;
      }

      const response = isEdit ? await updateRewardCategory(payload).unwrap() : await addRewardCategory(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || (isEdit ? 'Reward category updated successfully' : 'Reward category created successfully'));
      methods.reset(defaultValues);
      onClose();
    } catch (error) {
      if (uploadedImageKey) {
        setDeleting(true);
        try {
          await deleteFileFromAzure(uploadedImageKey);
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

  const isLoading = addLoading || updateLoading || imageUploading || deleting;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[35vh] w-full flex-col items-center overflow-y-auto md:max-w-[550px]!"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Reward Category' : 'Create Reward Category'}</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-6 flex w-full flex-col gap-4">
                <RHFUploadAvatar
                  name="image"
                  label="Category Image"
                  initialImage={(() => {
                    if (!isEdit || !selectedData) return null;
                    const img = selectedData?.imageInfo?.url || selectedData?.image;
                    if (!img || img === noImageUrl || img === noImageUrlDev || img.toLowerCase().includes('noimage.png')) {
                      return null;
                    }
                    return img;
                  })()}
                />
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="col-span-2">
                    <RHFTextField name="title" label="Category Name" placeholder="Enter category" />
                  </div>

                  {isEdit && (
                    <div className="col-span-2">
                      <RHFSelectField name="status" label="Status" placeholder="Select status" options={statusOptions} />
                    </div>
                  )}
                </div>
              </div>
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
                    disabled={isEdit ? !isDirty || !isValid : !isValid}
                  >
                    {isEdit ? 'Update Category' : 'Create Category'}
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

export default RewardCategoryModal;
