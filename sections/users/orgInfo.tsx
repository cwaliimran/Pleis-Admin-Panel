import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Ellipsis,
  MapPin,
  PartyPopper,
  Pencil,
  Shirt,
  UserPlus,
  UsersRound,
} from "lucide-react";
import FormProvider, {
  RHFCombobox,
  RHFMultiFileUpload,
  RHFSelectField,
  RHFTextField,
} from "@/components/rhf";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useRef } from "react";
import { userTags } from "./data";
import { useBoolean } from "@/hooks/useBoolean";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  defaultValues,
  schema,
} from "@/app/(organizer)/organizer/organization/page";
import { RHFMultiSelect } from "@/components/rhf/rhf-multiselect";
import { Button } from "@/components/ui/button";
import RHFTextfieldWithSelect from "@/components/rhf/rhf-text-field-with-select";

const OrgInfo = () => {
  const totalDays = 30;
  const remainingDays = 5;
  const progressPercent = ((totalDays - remainingDays) / totalDays) * 100;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openModal = useBoolean();
  const openVenueModal = useBoolean();
  const editModal = useBoolean();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const CloseModal = () => {
    methods.reset(defaultValues);
    openModal.onFalse();
  };

  const CloseVenueModal = () => {
    methods.reset(defaultValues);
    openVenueModal.onFalse();
  };

  const handleAvatarChange = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = (data: any) => {};

  return (
    <>
      <div className="w-full flex justify-end">
        <Pencil
          width={22}
          className="text-gray-500  mr-2 cursor-pointer hover:text-gray-700 transition-colors"
          onClick={openModal.onTrue}
        />
      </div>

      <div className="grid grid-cols-12 gap-4 mt-4">
        <div className=" md:col-span-5 col-span-12">
          <Card className="shadow-lg dark:bg-secondary">
            <CardHeader>
              <h1 className="text-slate-500 font-semibold">DESCRIPTION</h1>
              <p className=" mt-2">
                Peti Kupe je destinacija u kojoj se isprepliću glazba,
                umjetnosti, edukativni sadržaji i gastronomija.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className="bg-white dark:bg-black text-gray-400 border border-gray-400 rounded-full px-4 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors">
                  +18
                </Badge>

                <Badge className="bg-white dark:bg-black text-gray-400 border border-gray-400 rounded-full px-4 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors">
                  <Shirt className="mr-2 !h-5 !w-5" />
                  Casual Formal
                </Badge>

                <Badge className="bg-white dark:bg-black text-gray-400 border border-gray-400 rounded-full px-4 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors">
                  <UserPlus className="mr-2 !h-5 !w-5" />
                  500
                </Badge>
              </div>
            </CardHeader>
          </Card>
          <Card className="mt-4 shadow-lg dark:bg-secondary">
            <CardHeader>
              <div className="flex justify-between items-center">
                <h1 className="text-slate-500 font-semibold ">VENUE TYPE</h1>
                <Button
                  variant="default"
                  className="cursor-pointer rounded-full"
                  onClick={openVenueModal.onTrue}
                >
                  Add Venue
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <PartyPopper />
                <p className=" mt-2 text-lg ">Nightclub</p>
              </div>
            </CardHeader>
          </Card>
          <Card className="mt-4 shadow-lg dark:bg-secondary">
            <CardHeader>
              <h1 className="text-slate-500 font-semibold">CATEGORIES</h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {userTags.map((item, index) => (
                  <Badge
                    key={index}
                    className="bg-white dark:bg-black text-gray-400 border border-gray-400 rounded-full px-4 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </CardHeader>
          </Card>
          <Card className="mt-4 shadow-lg dark:bg-secondary">
            <CardHeader>
              <h1 className="text-slate-500 font-semibold">TAGS</h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {userTags.map((item, index) => (
                  <Badge
                    key={index}
                    className="bg-white dark:bg-black text-gray-400 border border-gray-400 rounded-full px-4 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </CardHeader>
          </Card>
          <Card className="mt-4 shadow-lg dark:bg-secondary">
            <CardHeader>
              <div className="flex justify-between item-center ">
                <Badge className="bg-gray-100 dark:bg-white text-black  rounded-full px-4 py-1 text-md font-medium">
                  Active
                </Badge>
                <Ellipsis className="cursor-pointer w-4 h-4" />
              </div>
              <div className="mt-2 flex justify-between items-start gap-4">
                {/* Left Image */}
                <img
                  src="/images/bannerImage.png"
                  alt="Promotion"
                  className="w-20 h-20 rounded-[10px] object-cover"
                />

                {/* Right Content */}
                <div className="flex-1 flex flex-col">
                  {/* Top Row: Label + Days Left */}
                  <div className="flex justify-between items-center w-full mb-1">
                    <h1 className="text-slate-500 font-semibold">PROMOTION</h1>
                    <h1 className="text-green-500 font-semibold whitespace-nowrap">
                      24 Days left
                    </h1>
                  </div>

                  {/* Title */}
                  <h1 className="text-xl font-medium">Promotion Name</h1>
                  <p className="text-slate-500 mt-1">
                    lorem ipsum dolor sit amet, consectetur ...
                  </p>
                </div>
              </div>
            </CardHeader>
            <hr />
            <CardContent>
              <div className="flex">
                <div className="flex">
                  <UsersRound className="w-5 h-5 text-slate-500" />
                  <p className="text-slate-500 ml-2 font-[400]">
                    Max Points <span className="font-[700]">632</span>
                  </p>
                </div>
                <div className="flex md:ml-7 ml-3">
                  <UsersRound className="w-5 h-5 text-slate-500" />
                  <p className="text-slate-500 ml-2 font-[400]">
                    Max Points <span className="font-[700]">632</span>
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <h1 className="text-slate-500 font-semibold">
                  REWARD AVAILABILITY
                </h1>
                <h1 className="text-slate-500 ">488/2300</h1>
              </div>
              <div className="mt-2 flex justify-between items-start gap-4">
                <div className="flex-1 flex flex-col">
                  <div className="w-full h-2 bg-gray-200 rounded-full mb-2 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-5 grid grid-cols-12 gap-4">
            <div
              className="md:col-span-6 col-span-12 shadow-lg bg-white dark:bg-black  w-full border-2 border-gray-300  rounded-full text-center
                   hover:bg-gray-100 "
            >
              <Badge className=" bg-transparent text-black dark:text-slate-500 px-4 py-1 text-md font-semibold">
                New Promotion
              </Badge>
            </div>
            <div className="md:col-span-6 col-span-12 shadow-lg bg-white dark:bg-black w-full border-2 border-gray-300  rounded-full text-center hover:bg-gray-100 ">
              <Badge className="bg-transparent text-black dark:text-slate-500  px-4 py-1 text-md font-semibold">
                New Notification
              </Badge>
            </div>
          </div>
          <div className="col-span-12 shadow-lg bg-white dark:bg-black w-full border-2 border-gray-300  rounded-full text-center mt-4 hover:bg-gray-100">
            <Badge className="bg-transparent text-black dark:text-gray-500  px-4 py-1 text-md font-semibold">
              Join Loyalty
            </Badge>
          </div>
        </div>
        <div className="md:col-span-7 col-span-12">
          <Card className="shadow-lg dark:bg-secondary">
            <CardHeader className="w-full flex flex-col gap-2">
              <h1 className="text-slate-500 font-semibold">LOCATION PIN</h1>
              <div className="flex items-center gap-2 mt-2">
                <PartyPopper className="w-4 h-4" />
                <span> Vibrant club</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <MapPin />
                <span>Trnjanska cesta 5, 10 000 Zagreb, Cro...</span>
              </div>
              <img
                src="/images/mapImage.png"
                alt=""
                className="w-full h-full mt-2"
              />
            </CardHeader>
          </Card>
          <Card className="shadow-lg mt-5 dark:bg-secondary">
            <CardHeader className="gap-4">
              <h1 className="text-slate-500 font-semibold">GALLERY</h1>
              <img
                title="Gallery Image"
                src="/images/bannerImage.png"
                className="w-full md:h-[300px] h-[200px] rounded-2xl"
              />
              <div className="w-full grid grid-cols-12 gap-2">
                {[1, 2, 3, 4].map((item, index) => (
                  <img
                    key={index}
                    src="/images/bannerImage.png"
                    className="col-span-6 md:col-span-3 w-full md:h-[140px] h-[100px] rounded-lg object-cover cursor-pointer"
                    alt={`Gallery Image ${index + 1}`}
                  />
                ))}
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* ADD OTHER DETAILS */}
      <Dialog open={openModal.value} onOpenChange={CloseModal}>
        <DialogOverlay className="fixed inset-0 bg-white bg-opacity-30">
          <DialogContent className="md:!max-w-[550px] mx-auto min-h-[86vh] max-h-[90vh] w-full overflow-y-auto flex flex-col items-center">
            <DialogHeader>
              <DialogTitle> Edit Other Details </DialogTitle>
            </DialogHeader>
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-4 mt-4 w-full">
                <RHFTextField
                  name="description"
                  label="Description"
                  placeholder="Enter Description"
                  rows={2}
                  multiline
                  className={` ${
                    methods.formState.errors.name ? "border-red-400" : ""
                  }`}
                />

                <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-4">
                  <RHFTextField
                    type="number"
                    name="minAge"
                    label="Age (optional)"
                    placeholder="Min Age 5"
                    min={5}
                  />
                </div>

                <div className="w-full grid overflow-hidden md:grid-cols-1 grid-cols-1 gap-4">
                  <RHFCombobox
                    name="tags"
                    label="Tags"
                    placeholder="Select or add tags"
                    className="w-full flex-1"
                    multiple={true}
                    allowCustom={true}
                    options={[
                      { label: "Tag 1", value: "tag1" },
                      { label: "Tag 2", value: "tag2" },
                      { label: "Tag 3", value: "tag3" },
                    ]}
                  />

                  <RHFSelectField
                    name="venue"
                    label="Venue"
                    placeholder="Select Venue"
                    className="w-full flex-1"
                    options={[
                      { label: "Venue 1", value: "venue1" },
                      { label: "Venue 2", value: "venue2" },
                      { label: "Venue 3", value: "venue3" },
                    ]}
                  />

                  <RHFMultiSelect
                    name="category"
                    label="Select Categories"
                    placeholder="Select Category"
                    options={[
                      { label: "Clubbing", value: "clubbing" },
                      { label: "Techno", value: "techno" },
                      { label: "House", value: "house" },
                    ]}
                  />
                </div>

                {/* Gallery Images Upload */}
                <div className="w-full">
                  <RHFMultiFileUpload
                    name="galleryImages"
                    label="Upload Gallery Images"
                  />
                </div>

                {/* Operating Hours Section */}
                <div className="w-full">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                    Operating Hours
                  </h3>
                  <div className="space-y-4">
                    {[
                      { day: "Monday", dayKey: "monday" },
                      { day: "Tuesday", dayKey: "tuesday" },
                      { day: "Wednesday", dayKey: "wednesday" },
                      { day: "Thursday", dayKey: "thursday" },
                      { day: "Friday", dayKey: "friday" },
                      { day: "Saturday", dayKey: "saturday" },
                      { day: "Sunday", dayKey: "sunday" },
                    ].map((dayInfo) => (
                      <div
                        key={dayInfo.dayKey}
                        className="flex items-center gap-4"
                      >
                        <span className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {dayInfo.day}
                        </span>
                        <div className="flex items-center gap-2 flex-1">
                          <RHFTextField
                            type="time"
                            name={`${dayInfo.dayKey}StartTime`}
                            placeholder="09:00"
                            className="flex-1"
                          />
                          <span className="text-xs text-gray-500">to</span>
                          <RHFTextField
                            type="time"
                            name={`${dayInfo.dayKey}EndTime`}
                            placeholder="23:00"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-2 w-full flex justify-center items-center">
                <Button
                  type="button"
                  className="bg-blue-700 text-white hover:bg-blue-800 px-7 mt-3 cursor-pointer"
                >
                  Save
                </Button>
              </div>
            </FormProvider>
          </DialogContent>
        </DialogOverlay>
      </Dialog>

      {/* VENUE MODAL */}
      <Dialog open={openVenueModal.value} onOpenChange={CloseVenueModal}>
        <DialogOverlay className="fixed inset-0 bg-white   bg-opacity-30 flex items-center justify-center md:w-lg w-full">
          <DialogContent className=" dark:bg-[#171717] overflow-y-auto mx-auto min-h-[86vh] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                {" "}
                {!editModal.value ? "Create Venue" : "Edit Venue"}{" "}
              </DialogTitle>
            </DialogHeader>
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-4 mt-4">
                {/* <RHFUploadAvatar name="image" label="Venue Image" /> */}

                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAvatarChange}
                    className="bg-white border-gray-300 text-gray-700 dark:text-gray-200 hover:bg-gray-50"
                  >
                    Upload Floor Plan
                  </Button>
                  <p className="text-gray-500 text-sm mt-2">
                    JPG or PNG. 1MB max.
                  </p>
                </div>

                <RHFTextField
                  name="name"
                  label="Venue Name"
                  placeholder="Enter Venue Name"
                  className={` ${
                    methods.formState.errors.name ? "border-red-400" : ""
                  }`}
                />

                <RHFTextfieldWithSelect
                  name="venueType"
                  label="Venue Type"
                  placeholder="Select Venue Type"
                  options={[
                    { value: "event1", label: "Event 1" },
                    { value: "event2", label: "Event 2" },
                    { value: "event3", label: "Event 3" },
                  ]}
                />
                <RHFTextfieldWithSelect
                  name="organization"
                  label="Organization"
                  placeholder="Select Organization"
                  options={[
                    { label: "Organization A", value: "org-a" },
                    { label: "Organization B", value: "org-b" },
                    { label: "Organization C", value: "org-c" },
                  ]}
                />
                <RHFTextField
                  name="location"
                  label="Location"
                  placeholder="Enter Location"
                />

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Map Preview
                  </label>
                  <div className="w-full h-[200px] rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                    <iframe
                      title="Venue Location Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d463.9634089519931!2d14.611164251664785!3d45.23098434778954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476363d3cb88c945%3A0x7b1900b8b651a903!2sObala!5e1!3m2!1sen!2s!4v1752833828572!5m2!1sen!2s"
                      className="w-full h-full border-0"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="submit"
                    className="bg-blue-700 text-white hover:bg-blue-800 cursor-pointer"
                  >
                    {!editModal.value ? "Add Venue" : "Update Venue"}
                  </Button>
                </div>
              </div>
            </FormProvider>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
    </>
  );
};

export default OrgInfo;
