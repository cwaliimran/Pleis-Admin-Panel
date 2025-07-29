import ConfirmDialog from "@/components/comfirm-dialog/confirm-dialog";
import FormProvider, { RHFTextField } from "@/components/rhf";
import RHFUploadAvatar from "@/components/rhf/rhf-upload-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBoolean } from "@/hooks/useBoolean";
import { defaultValues, schema } from "@/lib/schemas/organization-schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Camera, Pencil, Trash2 } from "lucide-react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { UserInfo } from "../users";

interface UserDetailPageProps {
  id: string;
}

const CreateOrganizationPage: FC<UserDetailPageProps> = () => {
  const openModal = useBoolean();
  const deleteModal = useBoolean();

  const [active] = useState("info");
  const [activeTab, setActiveTab] = useState("basicInfo");

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const onSubmit = () => {};

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
  };

  return (
    <div className="md:mt-10 mt-5 h-full">
      <div className="grid grid-cols-12 ">
        {/* --------------- UPPER SECTION --------------- */}
        <div className="lg:col-span-12 col-span-12">
          <Card className="overflow-hidden p-4  shadow-md dark:bg-secondary">
            <div className="relative w-full">
              <div className="h-72 bg-[url('/images/blank-img.png')] bg-cover bg-center rounded-lg" />
              <label
                htmlFor="banner-upload"
                className="absolute right-4 top-4 bg-white rounded-full cursor-pointer shadow-lg p-2 flex items-center justify-center hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Edit cover image"
              >
                <Camera className="text-gray-500 hover:text-blue-700 w-5 h-5" />
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                    }
                  }}
                />
              </label>
              <div className="absolute left-5 bottom-[-30]">
                <img
                  src="/images/blank-profile2.png"
                  alt="User Avatar"
                  className="md:w-30 w-20  md:h-30 h-20 rounded-full bg-white shadow-lg z-10"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Pencil
                width={22}
                className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                onClick={openModal.onTrue}
              />
              <Trash2
                width={22}
                className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors ml-4"
                onClick={deleteModal.onTrue}
              />
            </div>

            <div className="md:flex items-center gap-2  pt-0 md:mt-0 mt-2">
              <h1 className="md:text-3xl text-2xl font-bold md:ml-2 pt-0 mt-0">
                Organization Name
              </h1>
              <Badge
                className={`bg-blue-100 text-black  rounded-full px-3 py-1 text-xs font-medium md:mt-0 mt-2`}
              >
                Basic
              </Badge>
            </div>

            <Badge
              className={`bg-blue-100 text-black  rounded-full px-3 py-1 text-xs font-medium`}
            >
              0 Subscriptions
            </Badge>

            <div className="flex items-center gap-2 ">
              <Badge
                className={`bg-blue-100 text-black  rounded-full px-3 py-1 text-xs font-medium`}
              >
                0% Commission
              </Badge>
              <Badge
                className={`bg-blue-100 text-black  rounded-full px-3 py-1 text-xs font-medium`}
              >
                0 Boost
              </Badge>
            </div>
            <div className="-mb-3 flex md:items-center md:justify-end mt-4 md:flex-row flex-col gap-4"></div>
          </Card>

          <div className=" mt-4 rounded-lg">
            {active === "info" && <UserInfo />}
          </div>
        </div>
      </div>

      {/* update Organization */}
      <Dialog open={openModal.value} onOpenChange={CloseModal}>
        <DialogOverlay className="fixed inset-0 bg-white bg-opacity-30">
          <DialogContent className="md:!max-w-[550px] mx-auto min-h-[65vh] max-h-[90vh] w-full overflow-y-auto flex flex-col items-center dark:bg-secondary">
            <DialogHeader>
              <DialogTitle> Create Organization </DialogTitle>
            </DialogHeader>
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-4 mt-4 w-full">
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

export default CreateOrganizationPage;
