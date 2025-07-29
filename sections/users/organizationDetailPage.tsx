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
  // tabOptions,
} from "@/lib/schemas/organization-schema";
import ConfirmDialog from "@/components/comfirm-dialog/confirm-dialog";
import UserInfo from "./orgInfo";
import Useranalytics from "./organalytics";
import { useRouter } from "next/navigation";

interface OrganizationDetailPageProps {
  id: string;
}
const OrganizationDetailPage: FC<OrganizationDetailPageProps> = ({ id }) => {
  const router = useRouter();
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
    <div className="mt-10 h-full pb-12">
      <div className="grid grid-cols-12 gap-7">
        <div className="lg:col-span-12 xl:col-span-9 col-span-12">
          <Card className="overflow-hidden  p-4  shadow-md dark:bg-secondary md:pb-0 ">
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
                onClick={openModal.onTrue}
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
            <div className="flex items-center gap-2 ">
              <Badge
                className={`bg-blue-100 text-black  rounded-full px-3 py-1 text-xs font-medium`}
              >
                12,342 Subscriptions
              </Badge>
              <Badge
                className={`bg-blue-100 text-black  rounded-full px-3 py-1 text-xs font-medium`}
              >
                Hide
              </Badge>
            </div>
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
              <div className="flex gap-2 mb-3">
                <div className="bg-blue-200 text-blue-800 w-8 h-8 cursor-pointer rounded-full flex items-center justify-center p-0 hover:bg-blue-300 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M17 2h-3a5 5 0 0 0-5 5v3H6v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                    />
                  </svg>
                </div>
                <div className="bg-blue-200 text-blue-800 w-8 h-8 cursor-pointer rounded-full flex items-center justify-center p-0 hover:bg-blue-300 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    >
                      <path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12" />
                      <path d="M16.5 12a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m1.008-5.5h-.01" />
                    </g>
                  </svg>
                </div>
                <div className="bg-blue-200 text-blue-800 w-8 h-8 cursor-pointer rounded-full flex items-center justify-center p-0 hover:bg-blue-300 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M5 1.25a2.75 2.75 0 1 0 0 5.5a2.75 2.75 0 0 0 0-5.5M3.75 4a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0m-1.5 4A.75.75 0 0 1 3 7.25h4a.75.75 0 0 1 .75.75v13a.75.75 0 0 1-.75.75H3a.75.75 0 0 1-.75-.75zm1.5.75v11.5h2.5V8.75zM9.25 8a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 .75.75v.434l.435-.187a7.8 7.8 0 0 1 2.358-.595C20.318 7.4 22.75 9.58 22.75 12.38V21a.75.75 0 0 1-.75.75h-4a.75.75 0 0 1-.75-.75v-7a1.25 1.25 0 0 0-2.5 0v7a.75.75 0 0 1-.75.75h-4a.75.75 0 0 1-.75-.75zm1.5.75v11.5h2.5V14a2.75 2.75 0 1 1 5.5 0v6.25h2.5v-7.87c0-1.904-1.661-3.408-3.57-3.234a6.3 6.3 0 0 0-1.904.48l-1.48.635a.75.75 0 0 1-1.046-.69V8.75z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="bg-blue-200 text-blue-800 w-8 h-8 cursor-pointer rounded-full flex items-center justify-center p-0 hover:bg-blue-300 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <g fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path
                        fill="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14 12l-3.5 2v-4z"
                      />
                      <path d="M2 12.708v-1.416c0-2.895 0-4.343.905-5.274c.906-.932 2.332-.972 5.183-1.053C9.438 4.927 10.818 4.9 12 4.9s2.561.027 3.912.065c2.851.081 4.277.121 5.182 1.053S22 8.398 22 11.292v1.415c0 2.896 0 4.343-.905 5.275c-.906.931-2.331.972-5.183 1.052c-1.35.039-2.73.066-3.912.066s-2.561-.027-3.912-.066c-2.851-.08-4.277-.12-5.183-1.052S2 15.602 2 12.708Z" />
                    </g>
                  </svg>
                </div>

                {/* <Badge
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
                </Badge> */}
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
        <DialogOverlay className="fixed inset-0 bg-white bg-opacity-30">
          <DialogContent className="md:!max-w-[550px] mx-auto min-h-[65vh] max-h-[90vh] w-full overflow-y-auto flex flex-col items-center dark:bg-secondary">
            <DialogHeader>
              <DialogTitle> Edit Organization </DialogTitle>
            </DialogHeader>
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-4 mt-4 w-full">
                <RHFUploadAvatar name="image" label="Organization Image" />

                <div className="mb-1 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hideOnApp"
                    className="form-checkbox h-5 w-5 text-primary  cursor-pointer"
                  />
                  <label
                    htmlFor="hideOnApp"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Hide it on app
                  </label>
                </div>

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
              </div>

              <div className="flex justify-end mt-4 items-center gap-2">
                <div className="w-full flex justify-center items-center">
                  <Button
                    type="button"
                    className="bg-primary text-white hover:bg-primary px-7 mt-3 cursor-pointer"
                    onClick={handleNextTab}
                  >
                    Save
                  </Button>
                </div>
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
