'use client';
import TwoFactorAuth from '@/app/common/2fa/2fa';
import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFTextField } from '@/components/rhf';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
});

const AdminProfileSection = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.userSlice);

  const [updateUser, { isLoading: updateUserLoading }] =
    useUpdateUserMutation();

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
    },
    resolver: yupResolver(profileSchema),
  });

  const {
    handleSubmit,
    watch,
    setValue,
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

      if (dirtyFields.firstName) {
        payload.firstName = formData.firstName;
      }
      if (dirtyFields.lastName) {
        payload.lastName = formData.lastName;
      }
      if (dirtyFields.email) {
        payload.email = formData.email;
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

  return (
    <div className="mt-5 min-h-[87vh] md:mt-0 md:p-6">
      <div className="max-w-4xl md:mx-auto">
        <Card className="dark:bg-secondary border-gray-200 bg-white shadow-sm dark:border-none">
          <CardHeader className="flex flex-col-reverse items-center justify-between md:flex-row">
            <div>
              <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                Personal Information
              </CardTitle>
              <p className="mt-1 text-sm text-gray-600 dark:text-white">
                Use a permanent address where you can receive mail.
              </p>
            </div>
            <TwoFactorAuth user={user} />
          </CardHeader>

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

              {/* Avatar Section */}
              <div className="flex items-center space-x-2 border-b border-gray-200 pb-6 md:space-x-8">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl} />
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

              {/* Form Fields */}
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
                          setValue('phoneCode', `+${country?.dialCode || ''}`, {
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
              fieldState.invalid ? 'border-destructive ring-destructive/40' : ''
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
              </div>

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

export default AdminProfileSection;
