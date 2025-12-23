'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useAddLevelStatusMutation, useUpdateLevelStatusMutation } from '@/store/Reducer/level-status-api';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { StatusFormValues, StatusModalProps } from './types';
import RHFUploadButton from '@/components/rhf/rhf-upload-button';

const schema = Yup.object().shape({
  image: Yup.mixed().nullable().default(null),
  background: Yup.mixed().nullable().default(null),
  title: Yup.string().required('Status name is required').default(''),
  type: Yup.string().required('Type is required').default(''),
  bonusPointsPerEuro: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Bonus points per euro is required')
    .typeError('Bonus points per euro must be a number')
    .min(0, 'Must be at least 0')
    .test('is-valid-number', 'Bonus points per euro is required', function (value) {
      return value !== undefined && value !== null && !isNaN(value);
    }),
  entryPoint: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Entry point is required')
    .typeError('Entry point must be a number')
    .min(0, 'Must be at least 0')
    .test('is-valid-number', 'Entry point is required', function (value) {
      return value !== undefined && value !== null && !isNaN(value);
    }),
  retainPoint: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Retain point is required')
    .typeError('Retain point must be a number')
    .min(0, 'Must be at least 0')
    .test('is-valid-number', 'Retain point is required', function (value) {
      return value !== undefined && value !== null && !isNaN(value);
    })
    .test('retain-less-than-entry', 'Retain point must be less than or equal to entry point', function (value) {
      const { entryPoint } = this.parent;
      if (value === undefined || entryPoint === undefined) return true;
      return value <= entryPoint;
    }),
  status: Yup.string()
    .oneOf(['active', 'inactive'] as const)
    .default('active'),
}) as Yup.ObjectSchema<StatusFormValues>;

const defaultValues: StatusFormValues = {
  image: null,
  background: null,
  title: '',
  type: '',
  bonusPointsPerEuro: '' as any,
  entryPoint: '' as any,
  retainPoint: '' as any,
  status: 'active',
};

const StatusModal = ({ open, onClose, isEdit = false, selectedData }: StatusModalProps) => {
  const [deleting, setDeleting] = useState(false);
  const { uploadImage, uploading: imageUploading } = useImageUpload();
  const [addStatus, { isLoading: addLoading }] = useAddLevelStatusMutation();
  const [updateStatus, { isLoading: updateLoading }] = useUpdateLevelStatusMutation();

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

  const typeOptions = [
    { label: 'Blue', value: 'blue' },
    { label: 'Silver', value: 'silver' },
    { label: 'Gold', value: 'gold' },
    { label: 'Platinum', value: 'platinum' },
    { label: 'Black', value: 'black' },
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
        background: (() => {
          const bg = selectedData?.backgroundImageInfo?.url || selectedData?.backgroundImage;
          if (!bg || bg === noImageUrl || bg === noImageUrlDev || bg.toLowerCase().includes('noimage.png')) {
            return null;
          }
          return bg;
        })(),
        title: selectedData?.title || '',
        type: selectedData?.type || '',
        bonusPointsPerEuro: selectedData?.bonusPointsPerEuro ?? ('' as any),
        entryPoint: selectedData?.entryPoints ?? ('' as any),
        retainPoint: selectedData?.retainPoints ?? ('' as any),
        status: selectedData?.status || 'active',
      };
      reset(mappedData);
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  // Validation helper function
  const validateNumericFields = (formData: StatusFormValues): { isValid: boolean; errorMessage?: string } => {
    const fields = [
      { value: formData.bonusPointsPerEuro, name: 'Bonus points per euro' },
      { value: formData.entryPoint, name: 'Entry points' },
      { value: formData.retainPoint, name: 'Retain points' },
    ];

    for (const field of fields) {
      const numValue = Number(field.value);

      // Check if value is missing, null, undefined, or not a valid number
      if (field.value === null || field.value === undefined || isNaN(numValue)) {
        return {
          isValid: false,
          errorMessage: `Please enter ${field.name.toLowerCase()}`,
        };
      }
    }

    return { isValid: true };
  };

  const handleSubmit = async (formData: StatusFormValues) => {
    // Validate numeric fields before submission
    const validation = validateNumericFields(formData);
    if (!validation.isValid) {
      showError(validation.errorMessage!);
      return;
    }

    let uploadedImageKey: string | null = null;
    let uploadedBackgroundKey: string | null = null;

    try {
      if (formData.image instanceof FileList && formData.image.length > 0) {
        const file = formData.image[0];
        uploadedImageKey = await uploadImage(file);
      }

      // Upload background image if new file selected
      if (formData.background instanceof FileList && formData.background.length > 0) {
        const file = formData.background[0];
        uploadedBackgroundKey = await uploadImage(file);
      }

      const payload: any = {
        title: formData.title,
        type: formData.type,
        bonusPointsPerEuro: Number(formData.bonusPointsPerEuro),
        entryPoints: Number(formData.entryPoint),
        retainPoints: Number(formData.retainPoint),
      };

      if (uploadedImageKey) {
        payload.image = uploadedImageKey;
      }

      if (uploadedBackgroundKey) {
        payload.backgroundImage = uploadedBackgroundKey;
      }

      if (isEdit && selectedData) {
        payload.status = formData.status;
        payload.id = selectedData._id;
      }

      console.log('Final Payload', payload);

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
            <DialogTitle>{isEdit ? 'Edit Level Status' : 'Create Level Status'}</DialogTitle>
          </DialogHeader>
          
          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-6 flex w-full flex-col gap-4">
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

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="col-span-2">
                    <RHFTextField name="title" label="Status Name" placeholder="Enter status name (e.g., Black)" />
                  </div>

                  <RHFSelectField name="type" label="Type" placeholder="Enter type" options={typeOptions} />

                  <RHFTextField
                    name="bonusPointsPerEuro"
                    label="Bonus Points per Euro"
                    placeholder="Enter bonus points (e.g., 5)"
                    type="number"
                    min="0"
                    step="0.1"
                  />

                  <RHFTextField name="entryPoint" label="Entry Points" type="number" placeholder="e.g., 1500" min="0" />

                  <RHFTextField name="retainPoint" label="Retain Points" type="number" placeholder="e.g., 1200" min="0" />

                  {isEdit && (
                    <div className="col-span-2">
                      <RHFSelectField name="status" label="Status" placeholder="Select status" options={statusOptions} />
                    </div>
                  )}
                </div>
                <div className="rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-900/20">
                  <p className="font-medium text-blue-900 dark:text-blue-300">💡 Tip:</p>
                  <p className="mt-1 text-xs text-blue-800 dark:text-blue-400">
                    Retain points should be lower than entry points to encourage members to maintain their status level.
                  </p>
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
