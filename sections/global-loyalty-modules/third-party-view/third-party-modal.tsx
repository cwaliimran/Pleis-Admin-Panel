'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import FieldSkeleton from '@/components/ui/field-skeleton';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useGetLevelStatusQuery } from '@/store/Reducer/level-status-api';
import { useAddThirdPartyMutation, useUpdateThirdPartyMutation } from '@/store/Reducer/third-party-api';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

type ThirdPartyFormValues = {
  image: FileList | string | null;
  title: string;
  description: string;
  pointCost: number;
  claimLimit: number | null;
  rewardSourceLink: string;
  publicKeyForPartner: string;
  statusLevel?: any;
  status: 'active' | 'inactive';
};

type ThirdPartyModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: any;
};

const schema = Yup.object().shape({
  image: Yup.mixed().nullable().default(null),
  title: Yup.string().required('Title is required').default(''),
  description: Yup.string().default(''),
  pointCost: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Point cost is required')
    .min(1, 'Must be at least 1')
    .default(0),
  claimLimit: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .min(1, 'Must be at least 1')
    .nullable()
    .default(null),
  rewardSourceLink: Yup.string().required('Reward source link is required').url('Must be a valid URL').default(''),
  publicKeyForPartner: Yup.string().required('Public key for partner is required').default(''),
  statusLevel: Yup.string().required('Status level is required'),
  status: Yup.string()
    .oneOf(['active', 'inactive'] as const)
    .default('active'),
}) as Yup.ObjectSchema<ThirdPartyFormValues>;

const defaultValues: ThirdPartyFormValues = {
  image: null,
  title: '',
  description: '',
  pointCost: '' as any,
  claimLimit: '' as any,
  rewardSourceLink: '',
  publicKeyForPartner: '',
  statusLevel: '',
  status: 'active',
};

const ThirdPartyModal = ({ open, onClose, isEdit = false, selectedData }: ThirdPartyModalProps) => {
  const [deleting, setDeleting] = useState(false);
  const { uploadImage, uploading: imageUploading } = useImageUpload();

  const [addThirdParty, { isLoading: addLoading }] = useAddThirdPartyMutation();
  const [updateThirdParty, { isLoading: updateLoading }] = useUpdateThirdPartyMutation();

  const { data: levelStatus, isLoading: levelStatusLoading } = useGetLevelStatusQuery({
    page: 0,
    search: '',
    limit: '10000',
    status: '',
    date: undefined,
  });

  const levelStatusOptions =
    levelStatus?.data?.map((status: any) => ({
      label: status?.title,
      value: status?._id,
    })) || [];

  const methods = useForm<ThirdPartyFormValues>({
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

  useEffect(() => {
    if (open && isEdit && selectedData) {
      const mappedData: ThirdPartyFormValues = {
        image: (() => {
          const img = selectedData?.image;
          if (!img || img === noImageUrl || img === noImageUrlDev || img.toLowerCase().includes('noimage.png')) {
            return null;
          }
          return img;
        })(),
        title: selectedData?.title || '',
        description: selectedData?.description || '',
        pointCost: selectedData?.pointCost || ('' as any),
        claimLimit: selectedData?.claimLimit || ('' as any),
        rewardSourceLink: selectedData?.rewardSourceLink || '',
        publicKeyForPartner: selectedData?.publicKeyForPartner || '',
        statusLevel: selectedData?.statusLevel?._id || '',
        status: selectedData?.status || 'active',
      };

      reset(mappedData);
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [open, isEdit, selectedData, reset]);

  const handleSubmit = async (formData: ThirdPartyFormValues) => {
    let uploadedImageKey: string | null = null;

    try {
      if (formData.image instanceof FileList && formData.image.length > 0) {
        const file = formData.image[0];
        uploadedImageKey = await uploadImage(file);
      }

      const payload: any = {
        title: formData.title,
        description: formData.description,
        pointCost: Number(formData.pointCost),
        rewardSourceLink: formData.rewardSourceLink,
        publicKeyForPartner: formData.publicKeyForPartner,
        statusLevel: formData.statusLevel,
        status: formData.status,
      };

      if (uploadedImageKey) {
        payload.image = uploadedImageKey;
      }

      if (formData.claimLimit && Number(formData.claimLimit) > 0) {
        payload.claimLimit = Number(formData.claimLimit);
      }

      if (isEdit && selectedData) {
        payload.id = selectedData._id;
      }

      console.log('Third Party Payload:', payload);

      const response = isEdit ? await updateThirdParty(payload).unwrap() : await addThirdParty(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || (isEdit ? 'Third party reward updated successfully' : 'Third party reward created successfully'));

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
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[45vh] w-full flex-col items-center overflow-y-auto md:max-w-[600px]!"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Third Party Integration' : 'Create Third Party Integration'}</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-6 flex w-full flex-col gap-4">
                <RHFUploadAvatar
                  name="image"
                  label="Image"
                  initialImage={(() => {
                    if (!isEdit || !selectedData) return null;
                    const img = selectedData?.image;
                    if (!img || img === noImageUrl || img === noImageUrlDev || img.toLowerCase().includes('noimage.png')) {
                      return null;
                    }
                    return img;
                  })()}
                />

                <RHFTextField name="title" label="Title" placeholder="Enter title" />

                <RHFTextField name="description" label="Description (Optional)" placeholder="Enter description" multiline rows={2} />

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFTextField name="pointCost" label="Point Cost" type="number" placeholder="e.g., 1200" min="1" />

                  <RHFTextField name="claimLimit" label="Claim Limit (Optional)" type="number" placeholder="e.g., 5" min="1" />
                </div>

                <RHFTextField name="rewardSourceLink" label="Reward Source Link" placeholder="Enter reward source URL" type="url" />

                <RHFTextField name="publicKeyForPartner" label="Public Key For Partner" placeholder="Enter public key" />

                {levelStatusLoading ? (
                  <FieldSkeleton />
                ) : (
                  <RHFCustomDropdown
                    name="statusLevel"
                    label="Status Level"
                    placeholder="Select Status Level"
                    options={levelStatusOptions}
                    isLoading={levelStatusLoading}
                    showNone={false}
                  />
                )}

                {isEdit && <RHFSelectField name="status" label="Status" placeholder="Select Status" options={statusOptions} />}
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
                    disabled={isEdit ? !isDirty : false}
                  >
                    {isEdit ? 'Update' : 'Save'}
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

export default ThirdPartyModal;
