"use client";
import React, { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import FormProvider, { RHFSelectField, RHFTextField } from "@/components/rhf";
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

const AdminProfileSection = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = React.useState(false);

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

  const onSubmit = (data: AdminProfileFormData) => {
    console.log("Profile data:", data);
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

  return (
    <div className="min-h-[87vh] p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-gray-900 text-2xl font-semibold">
                Personal Information
              </CardTitle>
              <p className="text-gray-600 mt-1 text-sm">
                Use a permanent address where you can receive mail.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Label
                htmlFor="two-factor"
                className="text-gray-700 cursor-pointer"
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
                      ? "bg-blue-600 after:translate-x-full after:border-white"
                      : "bg-gray-200"
                  }`}
                  onClick={handleToggleChange}
                ></div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-8 pt-0 pb-3">
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
              <div className="flex items-center space-x-8 pb-6 border-b border-gray-200">
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
                    className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Change avatar
                  </Button>
                  <p className="text-gray-500 text-sm mt-2">
                    JPG, GIF or PNG. 1MB max.
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

                {/* <RHFSelectField
                  name="Role"
                  label="Role"
                  placeholder="Select Role"
                  options={[
                    { label: "Admin", value: "admin" },
                    { label: "Super Admin", value: "super-admin" },
                    { label: "Manager", value: "manager" },
                    { label: "User", value: "user" },
                  ]}
                /> */}

                {/* <RHFTextField
                  name="address"
                  label="Address"
                  className="col-span-2"
                  placeholder="Enter your full address"
                /> */}

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

                <RHFTextField
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                />
              </div>

              {/* Save Button */}
              <div className="pt-4 flex justify-end items-center">
                <Button
                  type="submit"
                  className="bg-blue-700 text-white hover:bg-blue-800 px-7 h-11"
                >
                  Save Changes
                </Button>
              </div>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfileSection;
