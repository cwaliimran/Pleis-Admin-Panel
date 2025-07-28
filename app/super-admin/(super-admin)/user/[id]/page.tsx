"use client";

import Header from "@/app/common/header";
import ConfirmDialog from "@/components/comfirm-dialog/confirm-dialog";
import FilterDropdown from "@/components/filter-dropdown/FilterDropdown";
import FormProvider, { RHFTextField } from "@/components/rhf";
import RHFUploadAvatar from "@/components/rhf/rhf-upload-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBoolean } from "@/hooks/useBoolean";
import { cn } from "@/lib/utils";
import { TransactionHistory } from "@/sections/invoices";
import BookingHistory from "@/sections/users/bookingHistory";
import { organizerCardData } from "@/sections/users/data";
import LoyaltyAndOrderTransaction from "@/sections/users/loyaltyAndOrderTransaction";
import UserCard from "@/sections/users/userCard";
import UserOverView from "@/sections/users/userOverview";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

const Page = () => {
  // const { id } = useParams();
  const deleteModal = useBoolean();
  const openModal = useBoolean();
  const data = useSearchParams();
  const userType = data.get("userType");

  const [active, setActive] = React.useState("overview");
  const [activeTransactionTab, setActiveTransactionTab] = React.useState("all");
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

  const methods = useForm();

  const tabData = [
    { value: "overview", label: "Overview" },
    { value: "transactions", label: "Transactions" },
    { value: "booking&loyalty", label: "Booking & Loyalty" },
  ];

  const user = {
    id: "1",
    fullName: "John Doe",
    surname: "Doe",
    email: "john.doe@example.com",
    createdAt: "2025-03-23T13:00:00Z",
    phoneNumber: "+1234567890",
    gender: "Male",
    dateOfBirth: "1990-01-01",
    region: "North America",
    dateOfAccountCreation: "2025-01-01",
    lastActivity: "2025-03-01",
    image: "https://github.com/shadcn.png",
    linkedOrganization: "Doe Events Ltd.",
    businessDetails: {
      name: "Doe Events",
      description: "Organizing events since 2020",
      website: "https://doeevents.com",
      socialLinks: {
        facebook: "https://facebook.com/doeevents",
        instagram: "https://instagram.com/doeevents",
        twitter: "https://twitter.com/doeevents",
      },
    },

    bankDetails: {
      oib: "12345678901",
      bankAccountNumber: "HR1234567890123456789",
      bankAccountName: "Doe Events Ltd.",
      representativeFullName: "John Doe",
      address: "123 Event St, City, Country",
      postalCode: "10000",
      city: "City",
      country: "Country",
    },
  };

  const onDelete = () => {
    deleteModal.onFalse();
  };

  return (
    <div>
      <div className="space-y-6 pb-12">
        <Header
          links={[
            { name: "Dashboard", href: "/super-admin" },
            { name: "User", href: "/super-admin/user/user-list" },
            { name: "User Detail", href: "" },
          ]}
        />
        <div className="mt-10 h-full">
          <div className="grid grid-cols-12 md:gap-7">
            <div className="xl:col-span-9 lg:col-span-8 col-span-12">
              <Card className="dark:bg-secondary bg-white shadow-lg rounded-xl overflow-hidden transition-all pb-0">
                <CardContent>
                  <div>
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Profile Image */}
                      <div className="w-full lg:w-1/3">
                        <Image
                          src={user.image}
                          alt={user.fullName}
                          className="rounded-lg w-full h-56 sm:h-auto object-cover shadow"
                          width={200}
                          height={200}
                        />
                      </div>
                      {/* Right Content */}
                      <div className="w-full lg:w-2/3 flex flex-col gap-4">
                        {/* Actions and Role Info */}
                        <div className="flex items-start justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs font-medium">
                              {userType &&
                                userType?.slice(0, 1).toUpperCase() +
                                  userType?.slice(1)}
                            </span>
                            <span>
                              Joined:{" "}
                              {new Date(
                                user.dateOfAccountCreation
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex gap-3">
                            <Pencil
                              className="w-5 h-5 cursor-pointer text-gray-500 hover:text-primary transition"
                              onClick={openModal.onTrue}
                            />
                            <Trash2
                              className="w-5 h-5 cursor-pointer text-gray-500 hover:text-red-500 transition"
                              onClick={deleteModal.onTrue}
                            />
                          </div>
                        </div>

                        {/* User Name */}
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-snug">
                          {user.fullName}
                        </h2>
                        {userType === "staff" && (
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-snug">
                            {user.surname}
                          </h2>
                        )}
                        {userType === "staff" && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Linked Organization: {user.linkedOrganization}
                          </p>
                        )}

                        {/* More Info */}
                        <div className="mt-4">
                          <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wide">
                            USER INFO
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-2 text-sm text-gray-800 dark:text-white">
                            <p>
                              <span className="font-medium">Email:</span>{" "}
                              {user.email}
                            </p>
                            <p>
                              <span className="font-medium">Phone:</span>{" "}
                              {user.phoneNumber}
                            </p>
                            {userType === "user" && (
                              <>
                                <p>
                                  <span className="font-medium">Gender:</span>{" "}
                                  {user.gender}
                                </p>
                                <p>
                                  <span className="font-medium">DOB:</span>{" "}
                                  {new Date(
                                    user.dateOfBirth
                                  ).toLocaleDateString()}
                                </p>
                                <p>
                                  <span className="font-medium">Region:</span>{" "}
                                  {user.region}
                                </p>
                              </>
                            )}
                            {userType === "staff" && (
                              <p>
                                <span className="font-medium">Surname:</span>{" "}
                                {user.surname}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:px-0 px-2 mt-3">
                      {/* Small screen dropdown */}
                      <div className="block sm:hidden mb-4">
                        <Select
                          value={activeTransactionTab}
                          onValueChange={setActive}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select tab" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-secondary">
                            {tabData.map((tab: any) => (
                              <SelectItem key={tab.value} value={tab.value}>
                                {tab.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {/* Tabs for larger screens */}
                      <Tabs
                        value={active}
                        onValueChange={setActive}
                        className="hidden sm:block w-full"
                      >
                        <TabsList className="inline-flex items-center gap-2 bg-transparent p-1">
                          <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">
                            {tabData.map((tab: any) => (
                              <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className={`relative px-4 py-2 font-semibold text-sm rounded-full transition-all
                                                                                                            !shadow-none dark:!bg-transparent cursor-pointer border-none
                                                                                                          ${
                                                                                                            active ===
                                                                                                            tab.value
                                                                                                              ? 'after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-3/4 after:h-[4px] after:bg-[#71717A] after:rounded-full'
                                                                                                              : "text-muted-foreground"
                                                                                                          }`}
                              >
                                {tab.label}
                              </TabsTrigger>
                            ))}
                          </div>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="  rounded-lg">
                {active === "overview" && (
                  <UserOverView userType={userType} user={user} />
                )}

                {active === "transactions" && (
                  <Card className=" shadow-lg  dark:bg-secondary mt-4">
                    <CardHeader>
                      <div className="flex md:justify-between lg:items-center flex-col lg:flex-row gap-4">
                        <h3 className="text-xl font-semibold">
                          Transaction History
                        </h3>
                        <div>
                          <div className="w-full">
                            {/* Show select on small screens */}
                            <div className="block sm:hidden">
                              <Select
                                value={activeTransactionTab}
                                onValueChange={setActiveTransactionTab}
                              >
                                <SelectTrigger className="w-full bg-[#EBEBEB] dark:bg-black dark:text-white">
                                  <SelectValue placeholder="Select tab" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-secondary">
                                  <SelectItem value="all">All</SelectItem>
                                  <SelectItem value="transactions">
                                    Transactions
                                  </SelectItem>
                                  <SelectItem value="refunds">
                                    Refunds
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Show tabs on medium and larger screens */}
                            <div className="hidden sm:block">
                              <Tabs
                                value={activeTransactionTab}
                                onValueChange={setActiveTransactionTab}
                                defaultValue="all"
                                className="w-full"
                              >
                                <TabsList className="flex items-center gap-2 bg-[#EBEBEB] dark:bg-black dark:border-white border rounded-full p-1">
                                  <TabsTrigger
                                    value="all"
                                    className={cn(
                                      "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer"
                                    )}
                                  >
                                    All
                                  </TabsTrigger>
                                  <TabsTrigger
                                    value="transactions"
                                    className={cn(
                                      "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer"
                                    )}
                                  >
                                    Transactions
                                  </TabsTrigger>
                                  <TabsTrigger
                                    value="refunds"
                                    className={cn(
                                      "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer"
                                    )}
                                  >
                                    Refunds
                                  </TabsTrigger>
                                </TabsList>
                              </Tabs>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col lg:items-center items-end">
                          <FilterDropdown
                            selectedOptions={selectedOptions}
                            onSelectOption={setSelectedOptions}
                            options={[
                              { id: "user", label: "User" },
                              { id: "contact", label: "Contact" },
                              { id: "invoice", label: "Invoice" },
                              { id: "organizer", label: "Organizer " },
                              { id: "date", label: "Date" },
                              { id: "total", label: "Total" },
                              {
                                id: "transactionType",
                                label: "Transaction Type",
                              },
                              { id: "status", label: "Status" },
                            ]}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <TransactionHistory />
                  </Card>
                )}
                {active === "booking&loyalty" && (
                  <>
                    <Card className="col-span-12 shadow-lg mt-4 dark:bg-secondary">
                      <CardHeader>
                        <CardTitle>Booking History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="border rounded-lg">
                          <BookingHistory />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="dark:bg-secondary shadow-lg mt-4">
                      <CardHeader>
                        <CardTitle>Loyalty & Ordering Transactions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="border rounded-lg">
                          <LoyaltyAndOrderTransaction />
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>

            <div className="xl:col-span-3 lg:col-span-4 col-span-12 md:space-y-2 space-y-3 md:mt-0 mt-3">
              {organizerCardData.map((user: any) => (
                <UserCard item={user} key={user._id} />
              ))}

              <Card className="col-span-12 shadow-lg  dark:bg-[#171717]">
                <CardContent>
                  <div className="w-full md:flex  justify-between items-start flex-wrap gap-y-6 md:px-0 px-2">
                    {/* START DATE */}
                    <div className="flex flex-col gap-1 min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-600 dark:text-white" />
                        <p className="text-xs text-gray-600 dark:text-white font-semibold">
                          START DATE
                        </p>
                      </div>
                      <p className="text-sm text-black dark:text-white font-medium">
                        March 23, 25, 13:00
                      </p>
                    </div>

                    {/* END DATE */}
                    <div className="flex flex-col gap-1 min-w-[140px] md:mt-0 mt-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-600 dark:text-white" />
                        <p className="text-xs text-gray-600 dark:text-white font-semibold">
                          Last Activity
                        </p>
                      </div>
                      <p className="text-sm text-black dark:text-white font-medium">
                        March 23, 25, 13:00
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={openModal.value} onOpenChange={openModal.onFalse}>
        <DialogOverlay className="fixed inset-0 bg-white bg-opacity-30">
          <DialogContent className="md:!max-w-[520px] mx-auto min-h-[50vh] max-h-[90vh] w-full overflow-y-auto flex flex-col items-center dark:bg-secondary">
            <DialogHeader>
              <DialogTitle>Update User Information</DialogTitle>
            </DialogHeader>
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(() => {})}
            >
              <DialogContent className="flex flex-col gap-4">
                <RHFUploadAvatar name="avatar" label="Profile Picture" />
                <RHFTextField
                  name="name"
                  label="Name"
                  placeholder="Enter your name"
                />
                <RHFTextField
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                />
                <RHFTextField
                  name="role"
                  label="Role"
                  placeholder="Enter your role"
                />
              </DialogContent>
              <Button type="submit">Update</Button>
            </FormProvider>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
      <ConfirmDialog
        open={deleteModal.value}
        title="Delete User"
        content="Are you sure you want to delete this?"
        onClose={deleteModal.onFalse}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default Page;
