'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
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
import {
  useAddOrganizationMutation,
  useUpdateOrganizationMutation,
} from '@/store/Reducer/organization';
import { useGetUserListQuery } from '@/store/Reducer/user-list';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { uploadFileToAzure } from '@/utils/fileUpload';
import { showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

interface OrganizationModalProps {
  open: boolean;
  onClose: () => void;
  organization?: any;
  onSuccess: (org: any) => void;
}

const OrganizationModal = ({
  open,
  onClose,
  organization,
  onSuccess,
}: OrganizationModalProps) => {
  const isEdit = !!organization;
  const [imageUploading, setImageUploading] = useState(false);

  const [addOrganization, { isLoading: isAdding }] =
    useAddOrganizationMutation();

  const [updateOrganization, { isLoading: isUpdating }] =
    useUpdateOrganizationMutation();

  const { data: apiData, isLoading: isUserLoading } = useGetUserListQuery({
    page: 0,
    search: '',
    limit: 10000,
    userType: undefined,
    status: undefined,
    date: undefined,
  });

  const userOptions =
    apiData?.data?.map((user: any) => ({
      label:
        `${user?.basicInfo?.firstName || ''} ${user?.basicInfo?.lastName || ''}`.trim(),
      value: user?.basicInfo?._id,
    })) || [];

  console.log('apiData', apiData);

  const isLoading = isAdding || isUpdating;

  // Define Yup schema with minimal typing
  const urlRegex =
    /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

  const schema = Yup.object().shape({
    image: Yup.mixed().nullable().optional(),
    name: Yup.string()
      .required('Organization Name is required')
      .trim()
      .min(2, 'Organization Name must be at least 2 characters'),
    user: Yup.string()
      .required('User is required')
      .trim()
      .min(2, 'User must be at least 2 characters'),
    instagram: Yup.string().nullable().optional().matches(urlRegex, {
      message: 'Instagram link must be a valid URL',
      excludeEmptyString: true,
    }),
    facebook: Yup.string().nullable().optional().matches(urlRegex, {
      message: 'Facebook link must be a valid URL',
      excludeEmptyString: true,
    }),
    youtube: Yup.string().nullable().optional().matches(urlRegex, {
      message: 'YouTube link must be a valid URL',
      excludeEmptyString: true,
    }),
    linkedin: Yup.string().nullable().optional().matches(urlRegex, {
      message: 'LinkedIn link must be a valid URL',
      excludeEmptyString: true,
    }),
  });

  // Define default values
  const defaultValues = {
    image: null,
    name: organization?.basicInfo?.name || '',
    user: organization?.basicInfo?.user || '',
    instagram: organization?.basicInfo?.socialLinks?.instagram || '',
    facebook: organization?.basicInfo?.socialLinks?.facebook || '',
    youtube: organization?.basicInfo?.socialLinks?.youtube || '',
    linkedin: organization?.basicInfo?.socialLinks?.linkedin || '',
  };

  // Use `any` to bypass TypeScript strict checking
  const methods = useForm<any>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [organization, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = handleSubmit(async (formData) => {
    let uploadedFileKey: string | null = null;
    try {
      let logoKey = isEdit
        ? organization?.basicInfo?.media?.logo || null
        : null;

      // Handle image upload (checking for FileList or array)
      if (
        formData.image &&
        (formData.image instanceof FileList || Array.isArray(formData.image))
      ) {
        const file = formData.image[0];
        if (file) {
          setImageUploading(true);
          try {
            uploadedFileKey = await uploadFileToAzure(file);
            logoKey = uploadedFileKey;
          } finally {
            setImageUploading(false);
          }
        }
      }

      // Prepare payload with only changed fields for update
      const payload: any = {
        basicInfo: {},
      };

      // Add fields to payload only if they have changed
      if (formData.name !== organization?.basicInfo?.name) {
        payload.basicInfo.name = formData.name;
      }

      // Check and add social links only if they have changed
      const socialLinks: any = {};
      if (
        formData.youtube !==
        (organization?.basicInfo?.socialLinks?.youtube || '')
      ) {
        socialLinks.youtube = formData.youtube || '';
      }
      if (
        formData.facebook !==
        (organization?.basicInfo?.socialLinks?.facebook || '')
      ) {
        socialLinks.facebook = formData.facebook || '';
      }
      if (
        formData.instagram !==
        (organization?.basicInfo?.socialLinks?.instagram || '')
      ) {
        socialLinks.instagram = formData.instagram || '';
      }
      if (
        formData.linkedin !==
        (organization?.basicInfo?.socialLinks?.linkedin || '')
      ) {
        socialLinks.linkedin = formData.linkedin || '';
      }
      if (Object.keys(socialLinks).length > 0) {
        payload.basicInfo.socialLinks = socialLinks;
      }

      // Only include media if a new logo was uploaded
      if (uploadedFileKey && logoKey !== organization?.basicInfo?.media?.logo) {
        payload.basicInfo.media = { logo: logoKey };
      }

      // If no fields have changed for update, skip the API call
      if (isEdit && Object.keys(payload.basicInfo).length === 0) {
        handleClose();
        return;
      }

      let response;
      if (isEdit) {
        response = await updateOrganization({
          id: organization._id,
          ...payload,
        }).unwrap();
      } else {
        // For create, include all fields
        payload.basicInfo = {
          name: formData.name,
          user: formData.user,
          socialLinks: {
            youtube: formData.youtube || '',
            facebook: formData.facebook || '',
            instagram: formData.instagram || '',
            linkedin: formData.linkedin || '',
          },
        };
        if (logoKey) {
          payload.basicInfo.media = { logo: logoKey };
        }
        response = await addOrganization(payload).unwrap();
      }

      if (!response) {
        throw new Error('No response from server. Please try again later.');
      }

      if (response.error) {
        throw new Error(getErrorMessage(response.error));
      }

      if (response?.data) {
        onSuccess(response.data);
      }

      if (response?.message) {
        showSuccess(
          response?.message ||
            `${isEdit ? 'Organization updated' : 'Organization created'} successfully`
        );
      }

      handleClose();
    } catch (error) {
      setImageUploading(false);
      const errorMessage = getErrorMessage(error);
      console.log(
        `Failed to ${isEdit ? 'update' : 'create'} organization:`,
        errorMessage
      );
      if (uploadedFileKey) {
        console.log('Rolling back uploaded image:', uploadedFileKey);
        await deleteFileFromAzure(uploadedFileKey);
      }
    }
  });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0 flex w-full items-center justify-center">
        <DialogContent
          aria-describedby={undefined}
          className="mx-4 w-full max-w-md dark:bg-[#171717]"
        >
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              {isEdit ? 'Edit Organization' : 'Create Organization'}
            </DialogTitle>
          </DialogHeader>

          <FormProvider methods={methods} onSubmit={onSubmit}>
            <div className="mt-4 flex flex-col gap-4">
              <div className="space-y-2">
                <RHFUploadAvatar
                  name="image"
                  label="Organization Icon"
                  initialImage={(() => {
                    const img = organization?.basicInfo?.mediaInfo?.logo?.url;
                    if (img && img !== noImageUrl && img !== noImageUrlDev) {
                      return img;
                    }
                    return null;
                  })()}
                />
              </div>

              <div className="space-y-5">
                <RHFTextField
                  name="name"
                  label="Organization Name"
                  placeholder="Enter Organization Name"
                />

                <RHFCustomDropdown
                  name="user"
                  label="Assigneed User"
                  placeholder="Select User"
                  options={userOptions}
                  isLoading={isUserLoading}
                  showNone={false}
                />

                <RHFTextField
                  name="instagram"
                  label="Instagram Link"
                  placeholder="Enter Instagram Link"
                />

                <RHFTextField
                  name="facebook"
                  label="Facebook Link"
                  placeholder="Enter Facebook Link"
                />

                <RHFTextField
                  name="youtube"
                  label="You Tube Link"
                  placeholder="Enter You Tube Link"
                />

                <RHFTextField
                  name="linkedin"
                  label="LinkedIn Link"
                  placeholder="Enter LinkedIn Link"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading || imageUploading}
                  className="px-4 py-2"
                >
                  Cancel
                </Button>

                {isLoading || imageUploading ? (
                  <Button
                    type="button"
                    disabled
                    className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white"
                  >
                    <ButtonLoading title="Saving" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark cursor-pointer px-4 py-2 text-white"
                  >
                    Save
                  </Button>
                )}
              </div>
            </div>
          </FormProvider>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default OrganizationModal;
