'use client';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import { RHFMultiSelect } from '@/components/rhf/rhf-multiselect';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import PasswordUpdateModal from './update-password-modal';

interface OrganizerProfileFormData {
  firstName: string;
  lastName: string;
  orgName: string;
  phoneNo: string;
  address: string;
  role: string;
  email: string;
  password: string;
  companyName: string;
  oib: string;
  bankAccountNumber: string;
  postalCode: string;
  country: string;
  city: string;
  representativeFullName: string;
  suppliers: string[];
  avatar?: string;
}

const OrganizerProfileSection = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // const { user } = useSelector((state: RootState) => state.userSlice);

  const methods = useForm<OrganizerProfileFormData>({
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
      orgName: 'Example Organization',
      phoneNo: '+385 98 123 4567',
      address: '123 Main Street, Zagreb',
      role: 'Admin',
      email: 'john.doe@example.com',
      password: '',
      companyName: 'Example Company Ltd.',
      oib: '12345678901',
      bankAccountNumber: 'HR1234567890123456789',
      postalCode: '10000',
      country: 'cr',
      city: 'zadar',
      representativeFullName: 'John Doe',
      suppliers: ['clubbing', 'techno'],
      avatar: 'https://github.com/shadcn.png',
    },
  });

  const { handleSubmit, watch, setValue } = methods;

  const avatarUrl = watch('avatar');

  const onSubmit = (data: OrganizerProfileFormData) => {
    console.log('Profile data:', data);
  };

  const handleAvatarChange = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setValue('avatar', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleChange = () => {
    setIsTwoFactorEnabled(!isTwoFactorEnabled);
  };

  const handlePasswordModalOpen = () => {
    setIsPasswordModalOpen(true);
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
            <div className="flex items-center space-x-3">
              <Label
                htmlFor="two-factor"
                className="cursor-pointer text-gray-700 dark:text-white"
                onClick={handleToggleChange}
              >
                Enable two factor
              </Label>
              <div className="relative">
                <Input
                  id="two-factor"
                  type="checkbox"
                  checked={isTwoFactorEnabled}
                  onChange={handleToggleChange}
                  className="peer sr-only"
                />
                <div
                  className={`peer relative h-6 w-11 cursor-pointer rounded-full after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] ${
                    isTwoFactorEnabled
                      ? 'bg-primary after:translate-x-full after:border-white'
                      : 'bg-gray-200'
                  }`}
                  onClick={handleToggleChange}
                ></div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-0 pb-3 md:px-8">
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
                    AD
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
                  <p className="mt-2 text-sm text-gray-500">
                    JPG or PNG. 1MB max.
                  </p>
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
                  name="orgName"
                  label="Organization Name"
                  placeholder="Enter organization name"
                />

                <RHFTextField
                  name="phoneNo"
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter your phone number"
                />

                <RHFTextField
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Enter your email address"
                />

                <RHFTextField
                  name="companyName"
                  label="Company Name"
                  placeholder="Enter company name"
                />
                <RHFTextField
                  name="oib"
                  label="OIB"
                  placeholder="Enter OIB number"
                />
                <RHFTextField
                  name="bankAccountNumber"
                  label="Bank Account Number"
                  placeholder="Enter bank account number"
                />
                <RHFTextField
                  name="postalCode"
                  label="Postal Code"
                  placeholder="Enter postal code"
                />

                <RHFSelectField
                  name="country"
                  label="Country"
                  placeholder="Select Country"
                  className="w-full flex-1"
                  options={[{ label: 'Croatia', value: 'cr' }]}
                />

                <RHFSelectField
                  name="city"
                  label="City"
                  placeholder="Select City"
                  className="w-full flex-1"
                  options={[
                    { label: 'Zadar', value: 'zadar' },
                    { label: 'Pula', value: 'pula' },
                    { label: 'Hvar', value: 'hvar' },
                  ]}
                />

                <RHFTextField
                  name="representativeFullName"
                  label="Representative Full Name"
                  placeholder="Enter representative full name"
                />

                <RHFTextField
                  name="subscriptionStatus"
                  label="Subscription Status"
                  placeholder="Subscription status"
                  value="Basic"
                />

                <div className="col-span-2 space-y-4">
                  <RHFTextField
                    name="address"
                    label="Address"
                    placeholder="Enter your address"
                  />

                  <RHFMultiSelect
                    name="suppliers"
                    label="List of Suppliers"
                    placeholder="Select suppliers"
                    options={[
                      { label: 'Clubbing', value: 'clubbing' },
                      { label: 'Techno', value: 'techno' },
                      { label: 'House', value: 'house' },
                    ]}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-end gap-4 pt-4">
                <Button
                  type="button"
                  onClick={handlePasswordModalOpen}
                  className="h-11 bg-gray-200 px-7 text-black hover:bg-gray-300"
                >
                  Update Password
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary h-11 px-7 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </FormProvider>
          </CardContent>
        </Card>

        <PasswordUpdateModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default OrganizerProfileSection;
