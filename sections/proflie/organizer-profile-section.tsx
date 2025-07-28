"use client";
import FormProvider, { RHFSelectField, RHFTextField } from "@/components/rhf";
import { RHFMultiSelect } from "@/components/rhf/rhf-multiselect";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";

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

interface PasswordUpdateFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const OrganizerProfileSection = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const methods = useForm<OrganizerProfileFormData>({
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
      orgName: "Example Organization",
      phoneNo: "+385 98 123 4567",
      address: "123 Main Street, Zagreb",
      role: "Admin",
      email: "john.doe@example.com",
      password: "",
      companyName: "Example Company Ltd.",
      oib: "12345678901",
      bankAccountNumber: "HR1234567890123456789",
      postalCode: "10000",
      country: "cr",
      city: "zadar",
      representativeFullName: "John Doe",
      suppliers: ["clubbing", "techno"],
      avatar: "https://github.com/shadcn.png",
    },
  });

  const { handleSubmit, watch, setValue } = methods;

  const passwordMethods = useForm<PasswordUpdateFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const avatarUrl = watch("avatar");

  const onSubmit = (data: OrganizerProfileFormData) => {
    console.log("Profile data:", data);
  };

  const onPasswordSubmit = (data: PasswordUpdateFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    console.log("Password update data:", data);
    // Here you would typically call your API to update the password
    setIsPasswordModalOpen(false);
    passwordMethods.reset();
    alert("Password updated successfully!");
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
        setValue("avatar", imageUrl);
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

  const handlePasswordModalClose = () => {
    setIsPasswordModalOpen(false);
    passwordMethods.reset();
  };

  return (
    <div className="min-h-[87vh] md:p-6 md:mt-0 mt-5">
      <div className="max-w-4xl md:mx-auto">
        <Card className="bg-white dark:bg-secondary border-gray-200 dark:border-none shadow-sm">
          <CardHeader className="flex md:flex-row flex-col-reverse items-center justify-between">
            <div>
              <CardTitle className="text-gray-900 dark:text-white text-2xl font-semibold">
                Personal Information
              </CardTitle>
              <p className="text-gray-600 dark:text-white mt-1 text-sm">
                Use a permanent address where you can receive mail.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Label
                htmlFor="two-factor"
                className="text-gray-700 dark:text-white cursor-pointer"
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
                  className="sr-only peer"
                />
                <div
                  className={`relative w-11 h-6 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all cursor-pointer ${
                    isTwoFactorEnabled
                      ? "bg-primary after:translate-x-full after:border-white"
                      : "bg-gray-200 "
                  }`}
                  onClick={handleToggleChange}
                ></div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 md:px-8 pt-0 pb-3">
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
              <div className="flex items-center md:space-x-8 space-x-2 pb-6 border-b border-gray-200">
                <Avatar className="w-24 h-24">
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
                    className="bg-white border-gray-300 text-gray-700 dark:text-white hover:bg-gray-50"
                  >
                    Change avatar
                  </Button>
                  <p className="text-gray-500 text-sm mt-2">
                    JPG or PNG. 1MB max.
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="w-full mt-6 mb-4 grid md:grid-cols-2 grid-cols-1 gap-4">
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
                  options={[{ label: "Croatia", value: "cr" }]}
                />

                <RHFSelectField
                  name="city"
                  label="City"
                  placeholder="Select City"
                  className="w-full flex-1"
                  options={[
                    { label: "Zadar", value: "zadar" },
                    { label: "Pula", value: "pula" },
                    { label: "Hvar", value: "hvar" },
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
                      { label: "Clubbing", value: "clubbing" },
                      { label: "Techno", value: "techno" },
                      { label: "House", value: "house" },
                    ]}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 flex justify-end gap-4 items-center">
                <Button
                  type="button"
                  onClick={handlePasswordModalOpen}
                  className="bg-gray-200 text-black hover:bg-gray-300 px-7 h-11"
                >
                  Update Password
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-white hover:bg-primary px-7 h-11"
                >
                  Save Changes
                </Button>
              </div>
            </FormProvider>
          </CardContent>
        </Card>

        {/* Password Update Modal */}
        <Dialog
          open={isPasswordModalOpen}
          onOpenChange={setIsPasswordModalOpen}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Password</DialogTitle>
              <DialogDescription>
                Enter your current password and choose a new password.
              </DialogDescription>
            </DialogHeader>

            <FormProvider
              methods={passwordMethods}
              onSubmit={passwordMethods.handleSubmit(onPasswordSubmit)}
            >
              <div className="space-y-4">
                <RHFTextField
                  name="currentPassword"
                  type="password"
                  label="Current Password"
                  placeholder="Enter your current password"
                />

                <RHFTextField
                  name="newPassword"
                  type="password"
                  label="New Password"
                  placeholder="Enter your new password"
                />

                <RHFTextField
                  name="confirmPassword"
                  type="password"
                  label="Confirm New Password"
                  placeholder="Confirm your new password"
                />
              </div>

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePasswordModalClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-white hover:bg-primary"
                >
                  Update Password
                </Button>
              </DialogFooter>
            </FormProvider>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default OrganizerProfileSection;
