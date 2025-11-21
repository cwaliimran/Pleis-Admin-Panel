'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { useAddTierMutation, useUpdateTierMutation } from '@/store/Reducer/tiers-api';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { uploadFileToAzure } from '@/utils/fileUpload';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

type TierStatus = 'active' | 'inactive';

type TierFormValues = {
  image: FileList | string;
  title: string;
  bonusPointsPerEuro: number;
  essential: { entryPoints: number; retainPoints: number };
  preferred: { entryPoints: number; retainPoints: number };
  premier: { entryPoints: number; retainPoints: number };
  status: TierStatus;
};

const defaultValues: TierFormValues = {
  image: '',
  title: '',
  bonusPointsPerEuro: 0,
  essential: { entryPoints: 0, retainPoints: 0 },
  preferred: { entryPoints: 0, retainPoints: 0 },
  premier: { entryPoints: 0, retainPoints: 0 },
  status: 'active',
};

const schema = Yup.object({
  image: Yup.mixed().nullable(),
  title: Yup.string().required('Title is required'),
  bonusPointsPerEuro: Yup.number().required().min(0),
  essential: Yup.object({
    entryPoints: Yup.number().required().min(0),
    retainPoints: Yup.number()
      .required()
      .min(0)
      .test('retain-less', 'Retain points must be <= entry points', function (value) {
        return value <= this.parent.entryPoints;
      }),
  }),
  preferred: Yup.object({
    entryPoints: Yup.number().required().min(0),
    retainPoints: Yup.number()
      .required()
      .min(0)
      .test('retain-less', 'Retain points must be <= entry points', function (value) {
        return value <= this.parent.entryPoints;
      }),
  }),
  premier: Yup.object({
    entryPoints: Yup.number().required().min(0),
    retainPoints: Yup.number()
      .required()
      .min(0)
      .test('retain-less', 'Retain points must be <= entry points', function (value) {
        return value <= this.parent.entryPoints;
      }),
  }),
  status: Yup.mixed<TierStatus>().oneOf(['active', 'inactive']).default('active'),
});

type TierModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: TierFormValues) => void;
  isEdit?: boolean;
  selectedData?: any;
};

const TiersModal = ({ open, onClose, isEdit = false, selectedData }: TierModalProps) => {
  const [deleting, setDeleting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [addTier, { isLoading: addTierLoading }] = useAddTierMutation();
  const [updateTier, { isLoading: updateTierLoading }] = useUpdateTierMutation();

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: selectedData || defaultValues,
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (isEdit && selectedData) reset(selectedData);
  }, [isEdit, selectedData, reset]);

  const handleFormSubmit = async (formData: any) => {
    let uploadedFileKey: string | null = null;

    try {
      let imageFileString = undefined;

      if (formData.image && (formData.image instanceof FileList || Array.isArray(formData.image))) {
        const file = formData.image[0];
        if (file) {
          setImageUploading(true);
          try {
            uploadedFileKey = await uploadFileToAzure(file);
            imageFileString = uploadedFileKey;
          } finally {
            setImageUploading(false);
          }
        }
      }

      const payload = {
        image: imageFileString,
        title: formData.title,
        bonusPointsPerEuro: Number(formData.bonusPointsPerEuro),
        essential: formData.essential,
        preferred: formData.preferred,
        premier: formData.premier,
        status: formData.status,
      };

      // 🔹 Log the data before submit
      console.log('Final Tier Payload:', payload);

      // 🔹 Submit to API
      const response = isEdit ? await updateTier({ ...payload, id: selectedData?._id }).unwrap() : await addTier(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || (isEdit ? 'Tier updated successfully' : 'Tier created successfully'));
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
      showError(getErrorMessage(error));
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0" />
      <DialogContent
        aria-describedby={undefined}
        className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[35vh] w-full flex-col items-center overflow-y-auto md:max-w-[650px]!"
      >
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Tier' : 'Create Tier'}</DialogTitle>
        </DialogHeader>

        <div className="w-full">
          <FormProvider methods={methods} onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="mt-6 flex w-full flex-col gap-4">
              <RHFUploadAvatar
                name="image"
                label="Tier Icon"
                initialImage={
                  isEdit && selectedData?.image && selectedData.image !== noImageUrl && selectedData.image !== noImageUrlDev
                    ? selectedData.image
                    : null
                }
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <RHFTextField name="title" label="Tier Title" placeholder="Enter tier title" />
                <RHFTextField name="bonusPointsPerEuro" label="Bonus Points per Euro" placeholder="1.0" type="number" step="0.1" min="0" />
              </div>

              {/* ESSENTIAL SECTION */}
              <div className="mt-2">
                <h3 className="mb-2 text-base font-semibold">Essential</h3>
                <div className="grid grid-cols-2 gap-3">
                  <RHFTextField name="essential.entryPoints" label="Entry Points" type="number" min="0" />
                  <RHFTextField name="essential.retainPoints" label="Retain Points" type="number" min="0" />
                </div>
              </div>

              {/* PREFERRED SECTION */}
              <div className="mt-2">
                <h3 className="mb-2 text-base font-semibold">Preferred</h3>
                <div className="grid grid-cols-2 gap-3">
                  <RHFTextField name="preferred.entryPoints" label="Entry Points" type="number" min="0" />
                  <RHFTextField name="preferred.retainPoints" label="Retain Points" type="number" min="0" />
                </div>
              </div>

              {/* PREMIER SECTION */}
              <div className="mt-2">
                <h3 className="mb-2 text-base font-semibold">Premier</h3>
                <div className="grid grid-cols-2 gap-3">
                  <RHFTextField name="premier.entryPoints" label="Entry Points" type="number" min="0" />
                  <RHFTextField name="premier.retainPoints" label="Retain Points" type="number" min="0" />
                </div>
              </div>

              {isEdit && (
                <div className="mt-4">
                  <RHFSelectField name="status" label="Status" placeholder="Select status" options={statusOptions} />
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <Button type="button" variant="outline" onClick={handleClose} className="px-6">
                Cancel
              </Button>

              {/* <Button type="submit" className="bg-primary hover:bg-primary/90 px-6 text-white">
                {isEdit ? 'Update Tier' : 'Create Tier'}
              </Button> */}

              {addTierLoading || updateTierLoading || imageUploading || deleting ? (
                <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white">
                  <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark cursor-pointer px-4 py-2 text-white"
                  // disabled={isEdit ? !isDirty : false}
                >
                  {isEdit ? 'Update Tier' : 'Create Tier'}
                </Button>
              )}
            </div>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TiersModal;
