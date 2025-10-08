'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { useImageUpload } from '@/hooks/useImageUpload';
import {
  useAddPresetMenuMutation,
  useUpdatePresetMenuMutation,
} from '@/store/Reducer/preset-menu-api';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

type PresetFormValues = {
  image?: any;
  title: string;
  description: string;
  basePrice: number;
  status: string;
};

const defaultValues: PresetFormValues = {
  image: null,
  title: '',
  description: '',
  basePrice: 0,
  status: 'active',
};

const schema = Yup.object().shape({
  image: Yup.mixed().nullable(),
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  status: Yup.string().required('Status is required'),
  basePrice: Yup.number()
    .required('Base Price is required')
    .typeError('Base Price must be a number'),
});

type PresetModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: any;
};

const PresetModal = ({
  open,
  onClose,
  isEdit = false,
  selectedData,
}: PresetModalProps) => {
  const { uploadImage, uploading: imageUploading } = useImageUpload();
  const [deleting, setDeleting] = useState(false);

  const [addPreset, { isLoading: addPresetLoading }] =
    useAddPresetMenuMutation();

  const [updatePreset, { isLoading: updatePresetLoading }] =
    useUpdatePresetMenuMutation();

  const methods = useForm<PresetFormValues>({
    resolver: yupResolver(schema as Yup.ObjectSchema<PresetFormValues>),
    defaultValues,
  });

  const { reset, formState } = methods;
  const isDirty = formState?.isDirty;

  // Helper function to prepare form data from selectedData
  const prepareFormData = (data: any): PresetFormValues => ({
    // image: data?.imageInfo?.url || null,
    image: (() => {
      const img = data?.imageInfo?.url || null;
      if (
        !img ||
        img === noImageUrl ||
        img === noImageUrlDev ||
        img.toLowerCase().includes('noimage.png')
      ) {
        return null;
      }
      return img;
    })(),
    title: data?.title || '',
    description: data?.description || '',
    basePrice: data?.basePrice || 0,
    status: data?.status || 'active',
  });

  // Prefill form when modal opens for editing
  useEffect(() => {
    if (open && isEdit && selectedData) {
      const formData = prepareFormData(selectedData);
      reset(formData);
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  // HANDLE SUBMIT
  const handleSubmit = async (formData: any) => {
    let uploadedFileKey: string | null = null;

    try {
      if (formData?.image instanceof FileList && formData?.image.length > 0) {
        const file = formData.image[0];
        uploadedFileKey = await uploadImage(file);
      }

      const payload: any = {
        title: formData.title,
        description: formData.description,
        basePrice: formData.basePrice,
      };

      if (uploadedFileKey) {
        payload.image = uploadedFileKey;
      }

      if (isEdit && selectedData) {
        payload.status = formData?.status;
        payload.id = selectedData?._id;
      }

      const response =
        isEdit && selectedData
          ? await updatePreset(payload).unwrap()
          : await addPreset(payload).unwrap();

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
      if (uploadedFileKey) {
        setDeleting(true);
        try {
          await deleteFileFromAzure(uploadedFileKey);
        } finally {
          setDeleting(false);
        }
      }

      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  // const handleSubmit = async (formData: any) => {
  //   let imageFileString: string | null = null;

  //   if (formData?.image instanceof FileList && formData?.image?.length > 0) {
  //     const file = formData.image[0];
  //     imageFileString = await uploadImage(file);
  //   }

  //   const payload: any = {
  //     title: formData.title,
  //     description: formData.description,
  //     basePrice: formData.basePrice,
  //   };

  //   if (imageFileString) payload.image = imageFileString;
  //   if (isEdit && selectedData) {
  //     payload.status = formData.status;
  //     payload.id = selectedData._id;
  //   }

  //   let uploadedFileKey: string | null = null;
  //   try {
  //     let imageFileString = undefined;

  //     if (formData?.image instanceof FileList && formData?.image?.length > 0) {
  //       const file = formData.image[0];
  //       if (file) {
  //         setImageUploading(true);
  //         try {
  //           uploadedFileKey = await uploadFileToAzure(file);
  //           imageFileString = uploadedFileKey;
  //         } finally {
  //           setImageUploading(false);
  //         }
  //       }
  //     }

  //     const payload: any = {
  //       title: formData.title,
  //       description: formData.description,
  //       basePrice: formData.basePrice,
  //     };

  //     if (imageFileString) {
  //       payload.image = imageFileString;
  //     }

  //     if (isEdit && selectedData) {
  //       payload.status = formData.status;
  //       payload.id = selectedData._id;
  //     }

  //     let response;
  //     if (isEdit && selectedData) {
  //       response = await updatePreset(payload).unwrap();
  //     } else {
  //       response = await addPreset(payload).unwrap();
  //     }

  //     if (!response) {
  //       showError('No response from server. Please try again later.');
  //     }

  //     if (response.error) {
  //       showError(getErrorMessage(response.error));
  //     }

  //     showSuccess(
  //       response?.message ||
  //         (isEdit
  //           ? 'Preset updated successfully'
  //           : 'Preset created successfully')
  //     );

  //     reset(defaultValues);
  //     onClose();
  //   } catch (error) {
  //     setImageUploading(false);
  //     const errorMessage = getErrorMessage(error);
  //     console.log('Failed to save preset:', errorMessage);
  //     showError(errorMessage);

  //     if (uploadedFileKey) {
  //       console.log('Rolling back uploaded image:', uploadedFileKey);
  //       await deleteFileFromAzure(uploadedFileKey);
  //     }
  //   }
  // };

  const handleClose = () => {
    if (isEdit && selectedData) {
      const formData = prepareFormData(selectedData);
      reset(formData);
    } else {
      reset(defaultValues);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col items-center overflow-y-auto md:!max-w-[600px]"
        >
          <DialogHeader>
            <DialogTitle>
              {isEdit ? 'Edit Preset' : 'Create Preset'}
            </DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(handleSubmit)}
            >
              <div className="mt-6 flex w-full flex-col gap-4">
                <RHFUploadAvatar
                  name="image"
                  label="Image"
                  initialImage={(() => {
                    const img = selectedData?.imageInfo?.url;
                    if (img && img !== noImageUrl && img !== noImageUrlDev) {
                      return img;
                    }
                    return null;
                  })()}
                />

                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                  <RHFTextField
                    name="title"
                    label="Item Name"
                    placeholder="Enter Item Name"
                  />

                  <RHFTextField
                    name="basePrice"
                    label="Base Price"
                    placeholder="Enter Base Price"
                    type="number"
                  />
                </div>

                {isEdit && (
                  <RHFSelectField
                    name="status"
                    label="Status"
                    placeholder="Select Status"
                    options={[
                      { label: 'Active', value: 'active' },
                      { label: 'Inactive', value: 'inactive' },
                    ]}
                  />
                )}

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

              <div className="mt-6 flex items-center justify-center">
                {addPresetLoading ||
                updatePresetLoading ||
                imageUploading ||
                deleting ? (
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
                    {isEdit ? 'Update Preset' : 'Create Preset'}
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

export default PresetModal;
