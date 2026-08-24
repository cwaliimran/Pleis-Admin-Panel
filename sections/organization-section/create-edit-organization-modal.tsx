'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFAsyncCombobox, RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { useAddOrganizationMutation, useUpdateOrganizationMutation } from '@/store/Reducer/organization';
import { useGetUserListQuery } from '@/store/Reducer/user-list';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { uploadFileToAzure } from '@/utils/fileUpload';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import * as Yup from 'yup';

import { STATUS_OPTIONS } from './constants';

interface OrganizationModalProps {
  open: boolean;
  onClose: () => void;
  organization?: any;
  userType?: string;
  onSuccess: (org: any) => void;
}

type OrganizationFormValues = {
  image: any;
  name: string;
  companyName?: string;
  user?: string;
  status: string;
  phone: string;
  phoneCode: string;
  website: string;
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
};

// ============================================================
// CONSTANTS
// ============================================================

const URL_REGEX = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

const COMPANY_QUERY_ARGS = { userType: 'organizer', sortBy: 'companyName', sortOrder: 'asc' };

// ============================================================
// VALIDATION SCHEMA
// ============================================================

const createValidationSchema = (userType?: string, isEdit?: boolean) => {
  const baseSchema = {
    image: Yup.mixed().nullable().optional(),
    name: Yup.string().required('Organization Name is required').trim().min(2, 'Organization Name must be at least 2 characters'),
    companyName: Yup.string().optional(),
    status: Yup.string().required('Status is required').oneOf(['active', 'inactive'], 'Invalid status'),
    phone: Yup.string().matches(PHONE_REGEX, 'Invalid phone number').required('Phone number is required'),
    phoneCode: Yup.string().default(''),
    website: Yup.string().nullable().optional().matches(URL_REGEX, {
      message: 'Website link must be a valid URL',
      excludeEmptyString: true,
    }),
    instagram: Yup.string().nullable().optional().matches(URL_REGEX, {
      message: 'Instagram link must be a valid URL',
      excludeEmptyString: true,
    }),
    facebook: Yup.string().nullable().optional().matches(URL_REGEX, {
      message: 'Facebook link must be a valid URL',
      excludeEmptyString: true,
    }),
    youtube: Yup.string().nullable().optional().matches(URL_REGEX, {
      message: 'YouTube link must be a valid URL',
      excludeEmptyString: true,
    }),
    tiktok: Yup.string().nullable().optional().matches(URL_REGEX, {
      message: 'Tiktok link must be a valid URL',
      excludeEmptyString: true,
    }),
  };

  // Add user field validation only for non-organizer user types AND only in create mode
  if (userType !== 'organizer' && !isEdit) {
    return Yup.object().shape({
      ...baseSchema,
      user: Yup.string().required('User is required').trim().min(2, 'User must be at least 2 characters'),
    });
  }

  // For edit mode or organizer user type, user field is optional
  if (userType !== 'organizer') {
    return Yup.object().shape({
      ...baseSchema,
      user: Yup.string().optional(),
    });
  }

  return Yup.object().shape(baseSchema);
};

const getInitialImage = (organization?: any): string | null => {
  const img = organization?.basicInfo?.media?.logo;
  if (img && img !== noImageUrl && img !== noImageUrlDev) {
    return img;
  }
  return null;
};

const getCompanyName = (item?: any): string => {
  return (
    item?.companyDetails?.name ||
    item?.basicInfo?.companyDetails?.name ||
    item?.organizationDetails?.companyDetails?.name ||
    item?.organizationDetails?.basicInfo?.companyDetails?.name ||
    item?.creator?.companyDetails?.name ||
    item?.creator?.basicInfo?.companyDetails?.name ||
    ''
  );
};

const getSelectedUserId = (organization?: any): string => {
  const companyCreator = organization?.companyDetail?.creator || organization?.companyDetails?.creator;
  const user = organization?.basicInfo?.user;

  if (typeof companyCreator === 'string') return companyCreator;
  if (companyCreator?._id) return companyCreator._id;
  if (typeof user === 'string') return user;
  if (user?._id) return user._id;
  if (organization?.creator?._id) return organization.creator._id;
  if (typeof organization?.creator === 'string') return organization.creator;

  return '';
};

const buildCreatePayload = (formData: OrganizationFormValues, logoKey: string | null, userType?: string): any => {
  const payload: any = {
    status: formData.status,
    basicInfo: {
      name: formData.name,
      website: formData.website || '',
      phoneNumber: {
        code: formData.phoneCode || '',
        number: formData.phone || '',
      },
      socialLinks: {
        youtube: formData.youtube || '',
        facebook: formData.facebook || '',
        instagram: formData.instagram || '',
        tiktok: formData.tiktok || '',
      },
    },
  };

  if (userType !== 'organizer' && formData.user) {
    payload.basicInfo.user = formData.user;
  }

  if (logoKey) {
    payload.basicInfo.media = { logo: logoKey };
  }

  return payload;
};

const buildUpdatePayload = (formData: OrganizationFormValues, logoKey: string | null, userType?: string): any => {
  const isSuperAdmin = userType === 'super-admin';

  const payload: any = {
    status: formData.status,
    basicInfo: {
      name: formData.name,
      website: formData.website || '',
      phoneNumber: {
        code: formData.phoneCode || '',
        number: formData.phone || '',
      },
      socialLinks: {
        youtube: formData.youtube || '',
        facebook: formData.facebook || '',
        instagram: formData.instagram || '',
        tiktok: formData.tiktok || '',
      },
    },
  };

  if (!isSuperAdmin && formData.companyName?.trim()) {
    payload.companyDetails = {
      name: formData.companyName.trim(),
    };
  }

  if (isSuperAdmin && formData.user) {
    payload.companyDetails = {
      creator: formData.user,
    };
  } else if (userType !== 'organizer' && formData.user) {
    payload.basicInfo.user = formData.user;
  }

  if (logoKey) {
    payload.basicInfo.media = { logo: logoKey };
  }

  return payload;
};

const OrganizationModal = ({ open, onClose, organization, userType, onSuccess }: OrganizationModalProps) => {
  const isEdit = !!organization;
  const isSuperAdmin = userType === 'super-admin';

  const router = useRouter();

  const [imageUploading, setImageUploading] = useState(false);
  const [addOrganization, { isLoading: isAdding }] = useAddOrganizationMutation();
  const [updateOrganization, { isLoading: isUpdating }] = useUpdateOrganizationMutation();

  const selectedCompanyLabel = getCompanyName(organization) || 'Current Company';

  const isLoading = isAdding || isUpdating;

  const schema = useMemo(() => createValidationSchema(userType, isEdit), [userType, isEdit]);

  const defaultValues = useMemo<OrganizationFormValues>(
    () => ({
      image: null,
      name: organization?.basicInfo?.name || '',
      companyName: getCompanyName(organization) || '',
      ...(userType !== 'organizer' && {
        user: getSelectedUserId(organization),
      }),
      status: organization?.status || 'active',
      phone: organization?.basicInfo?.phoneNumber?.number || '',
      phoneCode: organization?.basicInfo?.phoneNumber?.code || '',
      website: organization?.basicInfo?.website || '',
      instagram: organization?.basicInfo?.socialLinks?.instagram || '',
      facebook: organization?.basicInfo?.socialLinks?.facebook || '',
      youtube: organization?.basicInfo?.socialLinks?.youtube || '',
      tiktok: organization?.basicInfo?.socialLinks?.tiktok || '',
    }),
    [organization, userType]
  );

  const methods = useForm<OrganizationFormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { isDirty },
  } = methods;

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const handleImageUpload = async (image: any, existingLogoKey: string | null): Promise<string | null> => {
    if (!image) return existingLogoKey;

    const file = image instanceof FileList ? image[0] : Array.isArray(image) ? image[0] : null;

    if (!file) return existingLogoKey;

    setImageUploading(true);
    try {
      return await uploadFileToAzure(file);
    } finally {
      setImageUploading(false);
    }
  };

  const onSubmit = handleSubmit(async (formData) => {
    let uploadedFileKey: string | null = null;

    try {
      const existingLogoKey = isEdit ? organization?.basicInfo?.media?.logo || null : null;
      const logoKey = await handleImageUpload(formData.image, existingLogoKey);

      if (formData.image && logoKey !== existingLogoKey) {
        uploadedFileKey = logoKey;
      }

      let response;

      if (isEdit) {
        const payload = buildUpdatePayload(formData, logoKey || existingLogoKey, userType);
        response = await updateOrganization({ id: organization._id, ...payload }).unwrap();
      } else {
        const payload = buildCreatePayload(formData, logoKey, userType);
        response = await addOrganization(payload).unwrap();
      }

      if (response.error) {
        throw new Error(getErrorMessage(response.error));
      }

      if (response?.data) {
        onSuccess(response.data);
      }

      showSuccess(response?.message || `Organization ${isEdit ? 'updated' : 'created'} successfully`);

      handleClose();

      router.push(`/${userType}/organization/${response?.data?._id}`);
    } catch (error) {
      setImageUploading(false);
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);

      // Rollback uploaded image on error
      if (uploadedFileKey) {
        await deleteFileFromAzure(uploadedFileKey);
      }
    }
  });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0 flex w-full items-center justify-center">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[50vh] w-full flex-col items-center overflow-y-auto md:max-w-[630px]!"
        >
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">{isEdit ? 'Edit Organization' : 'Create Organization'}</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={onSubmit}>
              <div className="mt-4 flex w-full flex-col gap-4">
                <div className="space-y-2">
                  <RHFUploadAvatar name="image" label="Organization Icon" initialImage={getInitialImage(organization)} />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {isEdit ? (
                    <>
                      {!isSuperAdmin && (
                        <div className="col-span-2">
                          <RHFTextField name="companyName" label="Company Name" placeholder="Enter Company Name" />
                        </div>
                      )}
                      <div className={isSuperAdmin ? '' : 'col-span-2'}>
                        <RHFTextField name="name" label="Organization Name" placeholder="Enter Organization Name" />
                      </div>
                      {isSuperAdmin && (
                        <RHFAsyncCombobox
                          name="user"
                          label="Company Name"
                          placeholder="Select Company"
                          searchPlaceholder="Search companies..."
                          selectedLabel={selectedCompanyLabel}
                          useOptionsQuery={useGetUserListQuery}
                          queryArgs={COMPANY_QUERY_ARGS}
                          getOptionValue={(user: any) => user?._id || user?.basicInfo?._id}
                          getOptionLabel={(user: any) => getCompanyName(user)}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <RHFTextField name="name" label="Organization Name" placeholder="Enter Organization Name" />

                      {userType !== 'organizer' && (
                        <RHFAsyncCombobox
                          name="user"
                          label="Company Name"
                          placeholder="Select Company"
                          searchPlaceholder="Search companies..."
                          selectedLabel={selectedCompanyLabel}
                          useOptionsQuery={useGetUserListQuery}
                          queryArgs={COMPANY_QUERY_ARGS}
                          getOptionValue={(user: any) => user?._id || user?.basicInfo?._id}
                          getOptionLabel={(user: any) => getCompanyName(user)}
                        />
                      )}
                    </>
                  )}

                  <Controller
                    name="phone"
                    control={control}
                    render={({ field, fieldState }) => {
                      const phoneCodeValue = methods.getValues('phoneCode') || '';
                      const displayValue = field.value && phoneCodeValue ? `${phoneCodeValue}${field.value}` : field.value || '';

                      return (
                        <div>
                          <p className="mb-0.5 text-sm font-medium">Phone</p>
                          <PhoneInput
                            value={displayValue}
                            country="hr"
                            onChange={(value, country: any) => {
                              const phoneCode = `+${country?.dialCode || ''}`;
                              const phoneNumber = value.replace(country?.dialCode || '', '');
                              field.onChange(phoneNumber);
                              setValue('phoneCode', phoneCode, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            }}
                            placeholder="Phone Number"
                            inputProps={{
                              required: true,
                              'aria-invalid': fieldState.invalid,
                            }}
                            containerClass="w-full"
                            dropdownStyle={{
                              zIndex: 9999,
                              position: 'fixed',
                              width: '16rem',
                            }}
                            buttonClass="!bg-transparent !border-none !shadow-none px-2 text-gray-800"
                            inputClass={`file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input !border-gray-100 dark:!border-gray-500 !shadow-sm flex !h-[42px] !w-full min-w-0 rounded-lg !bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ${fieldState.invalid ? 'border-destructive ring-destructive/40' : ''}`}
                          />
                          {fieldState.error && <p className="mt-1 text-xs text-red-500">{fieldState.error.message}</p>}
                        </div>
                      );
                    }}
                  />

                  <RHFTextField name="website" label="Website Link" placeholder="Enter Website Link" />

                  {isEdit && <RHFSelectField name="status" label="Status" placeholder="Select Status" className="w-full" options={STATUS_OPTIONS} />}

                  <div className="col-span-2 space-y-4">
                    <RHFTextField name="instagram" label="Instagram Link" placeholder="Enter Instagram Link" />

                    <RHFTextField name="facebook" label="Facebook Link" placeholder="Enter Facebook Link" />

                    <RHFTextField name="youtube" label="YouTube Link" placeholder="Enter YouTube Link" />

                    <RHFTextField name="tiktok" label="Tiktok Link" placeholder="Enter Tiktok Link" />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading || imageUploading} className="px-4 py-2">
                    Cancel
                  </Button>

                  {isLoading || imageUploading ? (
                    <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white">
                      <ButtonLoading title="Saving" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary-dark cursor-pointer px-7 py-2 text-white"
                      disabled={isEdit ? !isDirty : false}
                    >
                      Save
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

export default OrganizationModal;
