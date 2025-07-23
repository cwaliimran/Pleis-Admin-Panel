import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Delete,
  Edit,
  Facebook,
  Instagram,
  Pencil,
  TicketCheckIcon,
  Trash2,
} from "lucide-react";
import React, { FC, useState } from "react";
import { tabsData, userData } from "./data";
import UserCard from "./userCard";
import UserEvents from "./userEvents";
import UserLoyalty from "./userLoyalty";
import UserNotifications from "./userNotifications";
import {
  ActivePromontion,
  BusinessInfo,
  TotalFollowers,
  UserCalender,
} from ".";
import { useBoolean } from "@/hooks/useBoolean";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormProvider, { RHFSelectField, RHFTextField } from "@/components/rhf";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RHFUploadAvatar from "@/components/rhf/rhf-upload-avatar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn } from "@/lib/utils";
import {
  defaultValues,
  schema,
  tabOptions,
} from "@/app/super-admin/(super-admin)/organization/page";
import ConfirmDialog from "@/components/comfirm-dialog/confirm-dialog";
import UserInfo from "./orgInfo";
import Useranalytics from "./organalytics";
import { useRouter } from "next/navigation";

interface OrganizationDetailPageProps {
  id: string;
}
const OrganizationDetailPage: FC<OrganizationDetailPageProps> = ({ id }) => {

  const router=useRouter();
  const openModal = useBoolean();
  const deleteModal = useBoolean();

  const [active, setActive] = useState("info");
  const [activeTab, setActiveTab] = useState("basicInfo");

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const onSubmit = (data: any) => {};
  const CloseModal = () => {
    methods.reset(defaultValues);
    openModal.onFalse();
  };
  const handleNextTab = async () => {
    if (activeTab === "basicInfo") {
      const isValid = await methods.trigger(["name", "location"]);
      if (!isValid) {
        return;
      }
      setActiveTab("socialLinks");
    } else if (activeTab === "socialLinks") {
      setActiveTab("businessDetails");
    } else if (activeTab === "businessDetails") {
      setActiveTab("bankDetails");
    }
  };

  const onDelete = () => {
    deleteModal.onFalse();
    console.log("Delete confirmed");
  };
  return (
    <div className="mt-10 h-full">
      <div className="grid grid-cols-12 gap-7">
        <div className="lg:col-span-12 xl:col-span-9 col-span-12">
          <Card className="overflow-hidden  p-4  shadow-md dark:bg-secondary md:pb-0 border-[10px] border-red-600">
            <div className="relative w-full">
              <div className="h-72   bg-[url('/images/bannerImage.png')] bg-cover bg-center rounded-lg" />
              <div className="absolute left-5 bottom-[-30]">
                <img
                  src="/images/image.png"
                  alt="User Avatar"
                  className="md:w-30 w-20  md:h-30 h-20 rounded-full  shadow-lg z-10"
                />
              </div>
            </div>
            <div className="flex justify-end  ">
              <Pencil
                className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                onClick={()=>router.push("/super-admin/organization/create-organization")}
              />
              <Trash2
                className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors ml-4"
                onClick={deleteModal.onTrue}
              />
            </div>
            <div className="flex items-center gap-2 ">
              <h1 className="md:text-3xl  text-2xl font-bold ml-2 pt-0 mt-0">
                Peti Kupe
              </h1>
              <Badge
                className={`bg-blue-100 text-black  rounded-full px-3 py-1 text-xs font-medium`}
              >
                Premium
              </Badge>
            </div>
            <Badge
              className={`bg-blue-100 text-black  rounded-full px-3 py-1 text-xs font-medium`}
            >
              12,342 Subscriptions
            </Badge>
            <div className="flex items-center gap-2 ">
              <Badge
                className={`bg-blue-100 text-black  rounded-full px-3 py-1 text-xs font-medium`}
              >
                5% Commission
              </Badge>
              <Badge
                className={`bg-blue-100 text-black  rounded-full px-3 py-1 text-xs font-medium`}
              >
                12 Boost
              </Badge>
            </div>
            <div className="flex md:items-end md:justify-between mt-4 lg:flex-row flex-col-reverse gap-4">
              <Tabs value={active} onValueChange={setActive} className="w-full">
                <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">
                  <TabsList className="inline-flex items-end  bg-transparent rounded-full ">
                    {tabsData.map((tab: any) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className={`relative px-4 py-2 font-semibold text-sm rounded-full transition-all
                                                    !shadow-none dark:!bg-transparent cursor-pointer border-none
                                                      ${
                                                        active === tab.value
                                                          ? 'after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-3/4 after:h-[4px] after:bg-[#71717A] after:rounded-full'
                                                          : "text-muted-foreground"
                                                      }`}
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </Tabs>
              <div className="flex gap-4">
                <Badge
                  className="bg-blue-200 text-blue-800 w-10 h-10 cursor-pointer rounded-full flex items-center justify-center p-0 
                                hover:bg-blue-300 transition-colors"
                >
                  <Facebook className="w-5 h-5 " />
                </Badge>

                <Badge
                  className="bg-blue-200 text-blue-800 cursor-pointer w-10 h-10 rounded-full flex items-center justify-center p-0
                                hover:bg-blue-300 transition-colors"
                >
                  <Instagram className="w-5 h-5 " />
                </Badge>

                <Badge
                  className="bg-blue-200 text-blue-800  cursor-pointer w-10 h-10 rounded-full flex items-center justify-center p-0
                                hover:bg-blue-300 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    className="w-5 h-5 "
                  >
                    <path d="M232 72v40a88 88 0 1 1-88-88h40v40a48 48 0 0 0 48 48V72a72 72 0 0 1-72-72h-40a128 128 0 1 0 128 128V72Z" />
                  </svg>
                </Badge>
              </div>
            </div>
          </Card>
          <div className=" mt-4 rounded-lg">
            {active === "info" && <UserInfo />}

            {active === "events" && <UserEvents />}

            {active === "loyalty" && <UserLoyalty />}

            {active === "analytics" && <Useranalytics />}

            {active === "notifications" && <UserNotifications />}

            {active === "calendar" && <UserCalender />}
          </div>
        </div>

        {/* Sidebar or Additional Panel */}
        <div className="lg:col-span-3 col-span-12 md:space-y-2 space-y-3">
          {userData.map((user: any) => (
            <UserCard item={user} key={user._id} />
          ))}
          <TotalFollowers />

          <ActivePromontion />

          <BusinessInfo />
        </div>
      </div>
      {/* update Organization */}
      <Dialog open={openModal.value} onOpenChange={CloseModal}>
        <DialogOverlay className="fixed inset-0 bg-white bg-opacity-30   ">
          <DialogContent className="md:!max-w-[600px]  min-h-[86vh] max-h-[90vh] w-full overflow-y-auto flex flex-col md:items-start">
            <DialogHeader>
              <DialogTitle> Edit Organization </DialogTitle>
            </DialogHeader>
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="w-full my-2 md:hidden block">
                  <Select value={activeTab} onValueChange={setActiveTab}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Tab" />
                    </SelectTrigger>
                    <SelectContent>
                      {tabOptions.map((tab, index: number) => (
                        <SelectItem key={index} value={tab.value}>
                          {tab.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="overflow-x-auto whitespace-nowrap scrollbar-hide px-1 md:block hidden">
                  <TabsList className="flex items-center gap-2 bg-[#EBEBEB] dark:bg-black dark:border-white border rounded-full p-1 min-w-max">
                    {tabOptions.map((tab, index) => (
                      <TabsTrigger
                        key={index}
                        value={tab.value}
                        className={cn(
                          "text-sm md:text-md font-semibold rounded-full px-4 py-2 transition-colors cursor-pointer"
                        )}
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </Tabs>

              {activeTab === "basicInfo" && (
                <div className="flex flex-col gap-4 mt-4">
                  <RHFUploadAvatar name="image" label="Organization Image" />
                  <RHFTextField
                    name="name"
                    label=" Organization Name"
                    placeholder="Enter Organization Name"
                    className={` ${
                      methods.formState.errors.name ? "border-red-400" : ""
                    }`}
                  />
                  <div className="w-full  grid md:grid-cols-2 grid-cols-1 gap-4">
                    <RHFTextField
                      type="email"
                      name="email"
                      label="Email (Associated with bank)"
                      placeholder="Enter Email"
                    />
                    <RHFTextField
                      name="phone"
                      label="Phone (Associated with bank)"
                      placeholder="Enter Phone No"
                    />
                    <RHFSelectField
                      name="region"
                      label="Region"
                      placeholder="Select Region"
                      options={[
                        { label: "North America", value: "north-america" },
                        { label: "Europe", value: "europe" },
                        { label: "Asia", value: "asia" },
                      ]}
                    />

                    <RHFSelectField
                      name="type"
                      label="Types"
                      placeholder=" Select Type"
                      options={[
                        { label: "Non-Profit", value: "non-profit" },
                        { label: "For-Profit", value: "for-profit" },
                        { label: "Government", value: "government" },
                      ]}
                    />
                    <RHFSelectField
                      name="category"
                      label="category"
                      placeholder=" Select Category"
                      options={[
                        { label: "Education", value: "education" },
                        { label: "Health", value: "health" },
                        { label: "Technology", value: "technology" },
                      ]}
                    />
                    <RHFTextField
                      name="location"
                      label="Location"
                      placeholder="Enter Location"
                      className={` ${
                        methods.formState.errors.location
                          ? "border-red-400"
                          : ""
                      }`}
                    />
                    <RHFSelectField
                      name="clity"
                      label="City"
                      placeholder="Select City"
                      options={[
                        { label: "New York", value: "new-york" },
                        { label: "Los Angeles", value: "los-angeles" },
                        { label: "Chicago", value: "chicago" },
                      ]}
                    />
                    <RHFTextField
                      name="country"
                      label="Country"
                      placeholder="Enter Country"
                    />
                  </div>
                  <RHFTextField
                    name="description"
                    label="Description"
                    placeholder="Enter Event Description"
                    rows={6}
                    multiline={true}
                  />
                </div>
              )}
              {activeTab === "socialLinks" && (
                <div className="flex flex-col gap-4 mt-4 ">
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
              )}
              {activeTab === "businessDetails" && (
                <div className="flex flex-col gap-4 mt-4">
                  <RHFSelectField
                    name="commission"
                    label="Commission"
                    placeholder="Select Commission"
                    options={[
                      { label: "10%", value: "10" },
                      { label: "15%", value: "15" },
                      { label: "20%", value: "20" },
                    ]}
                  />
                  <RHFTextField
                    name="businessId"
                    label="Business ID"
                    placeholder="Enter Business ID"
                  />
                </div>
              )}
              {activeTab === "bankDetails" && (
                <div className="flex flex-col gap-4 mt-4">
                  {/* company name */}
                  <RHFTextField
                    name="companyName"
                    label="Company Name"
                    placeholder="Enter Company Name"
                  />
                  {/* account name */}
                  <RHFTextField
                    name="accountName"
                    label="Account Name"
                    placeholder="Enter Account Name"
                  />
                  {/* account number */}
                  <RHFTextField
                    name="accountNumber"
                    label="Account Number"
                    placeholder="Enter Account Number"
                  />
                  {/* OIB */}
                  <RHFTextField
                    name="oib"
                    label="OIB"
                    placeholder="Enter OIB"
                  />
                  {/* address */}
                  <RHFTextField
                    name="address"
                    label="Address"
                    placeholder="Enter Address"
                  />
                  {/* postal code */}
                  <RHFTextField
                    name="postalCode"
                    label="Postal Code"
                    placeholder="Enter Postal Code"
                  />
                  {/* city */}
                  <RHFTextField
                    name="city"
                    label="City"
                    placeholder="Enter City"
                  />
                  {/* country */}
                  <RHFTextField
                    name="country"
                    label="Country"
                    placeholder="Enter Country"
                  />
                </div>
              )}
              <div className="flex justify-end mt-4 items-center gap-2">
                {activeTab !== "basicInfo" && (
                  <div className="">
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => {
                        if (activeTab === "socialLinks")
                          setActiveTab("basicInfo");
                        else if (activeTab === "businessDetails")
                          setActiveTab("socialLinks");
                        else if (activeTab === "bankDetails")
                          setActiveTab("businessDetails");
                      }}
                    >
                      Back to
                    </Button>
                  </div>
                )}
                {activeTab !== "bankDetails" && (
                  <div className="">
                    <Button
                      type="button"
                      className="bg-blue-700 text-white hover:bg-blue-800 cursor-pointer"
                      onClick={handleNextTab}
                    >
                      Next
                    </Button>
                  </div>
                )}

                {activeTab === "bankDetails" && (
                  <Button
                    type="submit"
                    className="bg-blue-700 text-white hover:bg-blue-800 cursor-pointer"
                  >
                    Update Organization
                  </Button>
                )}
              </div>
            </FormProvider>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
      {/* delete Organization */}
      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Organization"
        content="Are you sure you want to delete this?"
        onClose={deleteModal.onFalse}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default OrganizationDetailPage;
