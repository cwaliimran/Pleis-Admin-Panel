'use client';

import TwoFactorAuth from '@/app/common/2fa/2fa';
import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFTextField } from '@/components/rhf';
import { RHFCustomCombobox } from '@/components/rhf/rhf-custom-combobox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useGetSuppliersGloabalQuery } from '@/store/Reducer/suppliers';
import { useUpdateUserMutation } from '@/store/Reducer/user-list';
import { setUser } from '@/store/slice/userSlice';
import { RootState } from '@/store/store';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { uploadFileToAzure } from '@/utils/fileUpload';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import PasswordUpdateModal from './update-password-modal';

type ProfileFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCode: string;
  avatar: any;
  organizationName: string;
  companyName: string;
  oib: string;
  bankAccountNumber: string;
  representativeName: string;
  subscriptionStatus: string;
  location: {
    fullAddress: string;
    country: string;
    city: string;
    state: string;
    postalCode: string;
    coordinates?: [number, number];
  };
  suppliers: string[];
};

const profileSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .required('Phone number is required'),
  phoneCode: Yup.string(),
  avatar: Yup.string().nullable(),
  organizationName: Yup.string().required('Organization name is required'),
  companyName: Yup.string().required('Company name is required'),
  oib: Yup.string().required('OIB is required'),
  bankAccountNumber: Yup.string().required('Bank account number is required'),
  representativeName: Yup.string().required('Representative name is required'),
  subscriptionStatus: Yup.string(),
  location: Yup.object({
    fullAddress: Yup.string().required('Full address is required'),
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    postalCode: Yup.string().required('Postal code is required'),
    coordinates: Yup.array().of(Yup.number()).optional(),
  }),
  suppliers: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one supplier is required'),
});

const OrganizerProfileSection = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.userSlice);

  console.log('Current user state:', user);

  const [updateUser, { isLoading: updateUserLoading }] =
    useUpdateUserMutation();

  const { data: supplierData, isLoading: supplierLoading } =
    useGetSuppliersGloabalQuery({
      page: 0,
      search: '',
      limit: '10000',
      status: '',
    });

  const supplierOptions = React.useMemo(
    () =>
      supplierData?.data?.map((sup: any) => ({
        value: sup._id,
        label: sup?.title,
      })) || [],
    [supplierData]
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  const methods = useForm({
    defaultValues: {
      firstName: user?.basicInfo?.firstName || '',
      lastName: user?.basicInfo?.lastName || '',
      email: user?.basicInfo?.email || '',
      phone: `${user?.basicInfo?.phoneNumber?.code || ''}${user?.basicInfo?.phoneNumber?.number || ''}`,
      avatar: user?.basicInfo?.profileIcon || '',
      phoneCode: user?.basicInfo?.phoneNumber?.code || '',
      organizationName: user?.basicInfo?.organizationName || '',
      companyName: user?.basicInfo?.companyDetails?.name || '',
      oib: user?.basicInfo?.companyDetails?.oib || '',
      bankAccountNumber:
        user?.basicInfo?.companyDetails?.bankAccountNumber || '',
      representativeName:
        user?.basicInfo?.companyDetails?.representativeName || '',
      subscriptionStatus: 'Basic',
      location: {
        fullAddress:
          user?.basicInfo?.companyDetails?.location?.fullAddress || '',
        city: user?.basicInfo?.companyDetails?.location?.city || '',
        country: user?.basicInfo?.companyDetails?.location?.country || '',
        state: user?.basicInfo?.companyDetails?.location?.state || '',
        postalCode: user?.basicInfo?.companyDetails?.location?.postalCode || '',
      },
      suppliers: user?.basicInfo?.companyDetails?.suppliers || [],
    },
    resolver: yupResolver(profileSchema),
  });

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { isDirty, dirtyFields },
  } = methods;

  const avatarUrl = watch('avatar');

  const onSubmit = handleSubmit(async (formData) => {
    if (!isDirty) {
      showSuccess('No changes to save');
      return;
    }

    let uploadedFileKey: string | null = null;
    try {
      const payload: any = {};

      const companyDetailsFields: (keyof ProfileFormData)[] = [
        'companyName',
        'oib',
        'bankAccountNumber',
        'representativeName',
        'suppliers',
      ];

      companyDetailsFields.forEach((field) => {
        if (dirtyFields[field]) {
          payload.companyDetails = {
            ...(payload.companyDetails || {}),
            [field === 'companyName' ? 'name' : field]: formData[field],
          };
        }
      });

      const basicFields: (keyof ProfileFormData)[] = [
        'firstName',
        'lastName',
        'email',
        'organizationName',
        'subscriptionStatus',
      ];

      basicFields.forEach((field) => {
        if (dirtyFields[field]) {
          payload[field] = formData[field];
        }
      });

      if (dirtyFields.location) {
        payload.location = {
          fullAddress: formData.location.fullAddress,
          country: formData.location.country,
          city: formData.location.city,
          state: formData.location.state,
          postalCode: formData.location.postalCode,
          coordinates: formData.location.coordinates || [0, 0],
        };
      }

      if (dirtyFields.phone || dirtyFields.phoneCode) {
        payload.phoneNumber = {
          code: formData.phoneCode || '',
          number: formData.phone.replace(formData.phoneCode || '', ''),
        };
      }

      if (selectedFile) {
        setImageUploading(true);
        try {
          uploadedFileKey = await uploadFileToAzure(selectedFile);
          payload.profileIcon = uploadedFileKey;
        } finally {
          setImageUploading(false);
        }
      }

      console.log('payload before submission', payload);

      const response = await updateUser({
        id: user?.basicInfo?._id,
        body: payload,
      }).unwrap();

      const updatedUser = response?.data;

      if (!updatedUser) {
        showError('No updated user returned from server');
      }

      const role = updatedUser?.accountState?.userType || user?.role || '';

      const newUser = {
        ...user,
        ...updatedUser,
        role,
        key: process.env.NEXT_PUBLIC_PROJECT_KEY,
      };

      dispatch(setUser(newUser));

      // Reset form with updated values to reflect new default state
      reset({
        firstName: updatedUser?.basicInfo?.firstName || formData.firstName,
        lastName: updatedUser?.basicInfo?.lastName || formData.lastName,
        email: updatedUser?.basicInfo?.email || formData.email,
        phone: `${updatedUser?.basicInfo?.phoneNumber?.code || formData.phoneCode}${updatedUser?.basicInfo?.phoneNumber?.number || formData.phone}`,
        phoneCode:
          updatedUser?.basicInfo?.phoneNumber?.code || formData.phoneCode,
        avatar: updatedUser?.basicInfo?.profileIcon || formData.avatar,
        organizationName:
          updatedUser?.basicInfo?.organizationName || formData.organizationName,
        companyName:
          updatedUser?.basicInfo?.companyDetails?.name || formData.companyName,
        oib: updatedUser?.basicInfo?.companyDetails?.oib || formData.oib,
        bankAccountNumber:
          updatedUser?.basicInfo?.companyDetails?.bankAccountNumber ||
          formData.bankAccountNumber,
        representativeName:
          updatedUser?.basicInfo?.companyDetails?.representativeName ||
          formData.representativeName,
        subscriptionStatus: formData.subscriptionStatus,
        location: {
          fullAddress:
            updatedUser?.basicInfo?.companyDetails?.location?.fullAddress ||
            formData.location.fullAddress,
          city:
            updatedUser?.basicInfo?.companyDetails?.location?.city ||
            formData.location.city,
          country:
            updatedUser?.basicInfo?.companyDetails?.location?.country ||
            formData.location.country,
          state:
            updatedUser?.basicInfo?.companyDetails?.location?.state ||
            formData.location.state,
          postalCode:
            updatedUser?.basicInfo?.companyDetails?.location?.postalCode ||
            formData.location.postalCode,
          coordinates:
            updatedUser?.basicInfo?.companyDetails?.location?.coordinates ||
            formData.location.coordinates,
        },
        suppliers:
          updatedUser?.basicInfo?.companyDetails?.suppliers ||
          formData.suppliers,
      });

      showSuccess(response?.message || 'Profile updated successfully');
    } catch (error) {
      setImageUploading(false);
      const errorMessage = getErrorMessage(error);
      console.log('Failed to update profile:', errorMessage);
      showError(errorMessage);

      if (uploadedFileKey) {
        console.log('Rolling back uploaded image:', uploadedFileKey);
        await deleteFileFromAzure(uploadedFileKey);
      }
    }
  });

  const handleAvatarChange = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setValue('avatar', imageUrl, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  // Tab state
  const [activeTab, setActiveTab] = useState<'personal' | 'business'>(
    'personal'
  );

  return (
    <div className="mt-5 min-h-[87vh] md:mt-0 md:p-6">
      <div className="max-w-4xl md:mx-auto">
        <Card className="dark:bg-secondary border-gray-200 bg-white shadow-sm dark:border-none">
          <CardHeader className="flex flex-col-reverse items-center justify-between md:flex-row">
            <div>
              <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                Organizer Profile
              </CardTitle>
              <p className="mt-1 text-sm text-gray-600 dark:text-white">
                Manage your personal and business details.
              </p>
            </div>
            <TwoFactorAuth user={user} />
          </CardHeader>
          <div className="border-b border-gray-200 px-8 pt-2 dark:border-gray-700">
            <nav className="flex space-x-6" aria-label="Tabs">
              <button
                type="button"
                aria-current={activeTab === 'personal' ? 'page' : undefined}
                className={`focus-visible:ring-primary/60 cursor-pointer rounded-t-md border-b-2 px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 ${activeTab === 'personal' ? 'border-primary text-primary dark:bg-secondary bg-white dark:text-white' : 'hover:text-primary border-transparent bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-white'}`}
                onClick={() => setActiveTab('personal')}
              >
                <span className="inline-flex items-center gap-2">
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="inline-block"
                  >
                    <circle cx="9" cy="9" r="7" />
                    <path d="M9 11c2.5 0 4.5-1.5 4.5-3.5S11.5 4 9 4 4.5 5.5 4.5 7.5 6.5 11 9 11z" />
                  </svg>
                  Personal Info
                </span>
              </button>
              <button
                type="button"
                aria-current={activeTab === 'business' ? 'page' : undefined}
                className={`focus-visible:ring-primary/60 cursor-pointer rounded-t-md border-b-2 px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 ${activeTab === 'business' ? 'border-primary text-primary dark:bg-secondary bg-white dark:text-white' : 'hover:text-primary border-transparent bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-white'}`}
                onClick={() => setActiveTab('business')}
              >
                <span className="inline-flex items-center gap-2">
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="inline-block"
                  >
                    <rect x="3" y="6" width="12" height="8" rx="2" />
                    <path d="M6 6V4a3 3 0 0 1 6 0v2" />
                  </svg>
                  Business Details
                </span>
              </button>
            </nav>
          </div>
          <CardContent className="space-y-6 pt-0 pb-3 md:px-8">
            <FormProvider methods={methods} onSubmit={onSubmit}>
              {/* Hidden file input */}
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Tab Content */}
              {activeTab === 'personal' && (
                <>
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-2 border-b border-gray-200 pb-6 md:space-x-8">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={avatarUrl ?? undefined} />
                      <AvatarFallback className="bg-gray-100 text-gray-700">
                        <span className="text-2xl font-semibold">
                          {user?.basicInfo?.firstName[0]}
                        </span>
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAvatarChange}
                        className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:text-white"
                      >
                        Change avatar
                      </Button>
                      <p className="mt-2 text-sm text-gray-500">JPG or PNG.</p>
                    </div>
                  </div>
                  {/* Personal Info Fields */}
                  <div className="mt-6 mb-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <RHFTextField
                      name="firstName"
                      label="First Name"
                      placeholder="Enter your first name"
                    />
                    <RHFTextField
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter your last name"
                    />
                    <RHFTextField
                      name="email"
                      type="email"
                      label="Email"
                      placeholder="Enter your email address"
                    />
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field, fieldState }) => (
                        <div>
                          <p className="mb-0.5 text-sm font-medium">Phone</p>
                          <PhoneInput
                            {...field}
                            country="pk"
                            onChange={(value, country: any) => {
                              field.onChange(value);
                              setValue(
                                'phoneCode',
                                `+${country?.dialCode || ''}`,
                                {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                }
                              );
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
                            inputClass={`file:text-foreground placeholder:text-muted-foreground
              selection:bg-primary selection:text-primary-foreground
              dark:bg-input/30 border-input !border-gray-100 dark:!border-gray-500 !shadow-sm
              flex !h-[42px] !w-full min-w-0 rounded-lg
              !bg-transparent px-3 py-1 text-base
              shadow-xs transition-[color,box-shadow]
              outline-none file:inline-flex file:h-7 file:border-0
              file:bg-transparent file:text-sm file:font-medium
              disabled:pointer-events-none disabled:cursor-not-allowed
              disabled:opacity-50 md:text-sm
              focus-visible:ring-ring/50 focus-visible:ring-[3px]
              aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40
              aria-invalid:border-destructive ${
                fieldState.invalid
                  ? 'border-destructive ring-destructive/40'
                  : ''
              }`}
                          />
                          {fieldState.error && (
                            <p className="mt-1 text-xs text-red-500">
                              {fieldState.error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                    <RHFTextField
                      name="organizationName"
                      label="Organization Name"
                      placeholder="Enter organization name"
                    />
                  </div>
                </>
              )}
              {activeTab === 'business' && (
                <>
                  {/* Business Details Fields */}
                  <div className="mt-6 mb-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <RHFTextField
                      name="companyName"
                      label="Company Name"
                      placeholder="Enter company name"
                    />
                    <RHFTextField
                      name="oib"
                      label="VAT"
                      placeholder="Enter VAT number"
                    />
                    <RHFTextField
                      name="bankAccountNumber"
                      label="Bank Account Number"
                      placeholder="Enter bank account number"
                    />
                    <RHFTextField
                      name="representativeName"
                      label="Representative Full Name"
                      placeholder="Enter representative full name"
                    />
                    <RHFTextField
                      name="subscriptionStatus"
                      label="Current Subscription"
                      placeholder="Subscription status"
                      disabled
                    />
                    <div className="col-span-1 space-y-4 md:col-span-2">
                      {/* Full Address */}
                      <RHFTextField
                        name="location.fullAddress"
                        label="Full Address"
                        placeholder="Enter full address"
                      />

                      {/* Country and State */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <RHFTextField
                          name="location.country"
                          label="Country"
                          placeholder="Enter country"
                        />
                        <RHFTextField
                          name="location.state"
                          label="State"
                          placeholder="Enter state"
                        />
                      </div>

                      {/* City and Postal Code */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <RHFTextField
                          name="location.city"
                          label="City"
                          placeholder="Enter city"
                        />
                        <RHFTextField
                          name="location.postalCode"
                          label="Postal Code"
                          placeholder="Enter postal code"
                        />
                      </div>

                      {supplierLoading ? (
                        <div className="w-full">
                          <div className="animate-pulse space-y-2">
                            <div className="h-5 w-32 rounded-full bg-gray-200 dark:bg-gray-700" />
                            <div className="h-8 w-3/4 rounded-full bg-gray-200 dark:bg-gray-700" />
                          </div>
                        </div>
                      ) : (
                        <RHFCustomCombobox
                          name="suppliers"
                          placeholder="Select suppliers"
                          label="Suppliers"
                          className="w-full flex-1"
                          multiple={true}
                          allowCustom={false}
                          options={supplierOptions}
                          onChange={(value: string[]) => {
                            setValue('suppliers', value, { shouldDirty: true });
                          }}
                        />
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Save Button */}
              <div className="flex items-center justify-end gap-4 pt-4">
                <Button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="h-10 bg-gray-200 px-5 text-black hover:bg-gray-300"
                >
                  Update Password
                </Button>
                {updateUserLoading || imageUploading ? (
                  <Button
                    type="button"
                    className="bg-primary hover:bg-primary h-10 cursor-not-allowed px-7 text-white"
                  >
                    <ButtonLoading title="Saving" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={updateUserLoading || imageUploading || !isDirty}
                    className="bg-primary hover:bg-primary h-10 px-7 text-white"
                  >
                    Save Changes
                  </Button>
                )}
              </div>
            </FormProvider>
          </CardContent>
        </Card>
        {/* Password Update Modal */}
        <PasswordUpdateModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default OrganizerProfileSection;
