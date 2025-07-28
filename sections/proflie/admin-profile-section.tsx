"use client";
import FormProvider, { RHFTextField } from "@/components/rhf";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface AdminProfileFormData {
  firstName: string;
  lastName: string;
  phoneNo: string;
  address: string;
  role: string;
  email: string;
  password: string;
  avatar?: string;
}

interface PasswordUpdateFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AdminProfileSection = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = React.useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const methods = useForm<AdminProfileFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNo: "",
      address: "",
      role: "Admin",
      email: "",
      password: "",
      avatar: "https://github.com/shadcn.png",
    },
  });

  const { handleSubmit, watch, setValue } = methods;

  const avatarUrl = watch("avatar");

  const onSubmit = (data: AdminProfileFormData) => {};

  const handleAvatarChange = () => {
    fileInputRef.current?.click();
  };

  const passwordMethods = useForm<PasswordUpdateFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handlePasswordModalClose = () => {
    setIsPasswordModalOpen(false);
    passwordMethods.reset();
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

  const handlePasswordModalOpen = () => {
    setIsPasswordModalOpen(true);
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

  const handleToggleChange = () => {
    setIsTwoFactorEnabled(!isTwoFactorEnabled);
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
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Enter your email address"
                />

                <RHFTextField
                  name="phoneNo"
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter your phone number"
                />
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

export default AdminProfileSection;
