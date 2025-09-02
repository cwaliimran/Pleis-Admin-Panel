'use client';

import FormProvider, { RHFTextField } from '@/components/rhf';
import RHFTextfieldWithSelect from '@/components/rhf/rhf-text-field-with-select';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { defaultValues, schema } from '@/lib/schemas/organization-schema';
import { showError } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Pencil } from 'lucide-react';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import AddOtherDetailsModal from '../organization-section/add-other-details-modal';

interface UserInfoProps {
  newOrganization?: any;
  setNewOrganization?: any;
}

const UserInfo = ({ newOrganization, setNewOrganization }: UserInfoProps) => {
  // const totalDays = 30;
  // const remainingDays = 5;
  // const progressPercent = ((totalDays - remainingDays) / totalDays) * 100;
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

  const onSubmit = () => {};

  const showtoast = () => {
    showError('Please create an organization first!');
  };

  return (
    <>
      <div>
        <div className="flex justify-end">
          {!newOrganization ? (
            <Pencil
              width={22}
              className="mr-2 cursor-pointer text-gray-500 transition-colors hover:text-gray-700"
              onClick={openModal.onTrue}
            />
          ) : (
            <Pencil
              width={22}
              className="mr-2 cursor-not-allowed text-gray-500 transition-colors hover:text-gray-700"
              onClick={showtoast}
            />
          )}
        </div>

        <div className="mt-4 grid grid-cols-12 gap-4">
          {/* ---------- LEFT SIDE ---------- */}
          <div className="col-span-12 lg:col-span-5">
            {/* DESCRIPTION */}
            <Card className="shadow-lg dark:bg-[#171717]">
              <CardHeader>
                <h1 className="font-semibold text-slate-500">DESCRIPTION</h1>
                <p className="mt-2">
                  {/* This is a sample description for the user profile. */}
                </p>
                {/* <div className="flex flex-wrap gap-2 mt-2">
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
                </div> */}
              </CardHeader>
            </Card>

            {/* VENU */}
            <Card className="mt-4 shadow-lg dark:bg-[#171717]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-slate-500">VENUE TYPE</h1>
                  <Button
                    variant="default"
                    className="cursor-pointer rounded-full"
                    onClick={openVenueModal.onTrue}
                  >
                    Add Venue
                  </Button>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  {/* <PartyPopper /> */}
                  <p className="mt-2 text-lg">{/* Nightclub */}</p>
                </div>
              </CardHeader>
            </Card>
            {/* CATEGORIES */}
            <Card className="mt-4 shadow-lg dark:bg-[#171717]">
              <CardHeader>
                <h1 className="font-semibold text-slate-500">CATEGORIES</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {/* {userTags.map((item, index) => (
                    <Badge
                      key={index}
                      className="bg-white dark:bg-black text-gray-400 border border-gray-400 rounded-full px-4 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors"
                    >
                      {item}
                    </Badge>
                  ))} */}
                </div>
              </CardHeader>
            </Card>

            {/* OPERATING HOURS */}
            <Card className="mt-4 shadow-lg dark:bg-[#171717]">
              <CardHeader>
                <h1 className="mb-4 font-semibold text-slate-500">
                  OPERATING HOURS
                </h1>
                <div className="space-y-3">
                  {[
                    {
                      day: 'Monday',
                      startTime: '00:00 AM',
                      endTime: '11:00 PM',
                      closed: false,
                    },
                    {
                      day: 'Tuesday',
                      startTime: '00:00 PM',
                      endTime: '11:00 PM',
                      closed: false,
                    },
                    {
                      day: 'Wednesday',
                      startTime: '00:00 PM',
                      endTime: '11:00 PM',
                      closed: false,
                    },
                    {
                      day: 'Thursday',
                      startTime: '00:00 PM',
                      endTime: '11:00 PM',
                      closed: false,
                    },
                    {
                      day: 'Friday',
                      startTime: '00:00 AM',
                      endTime: '11:00 PM',
                      closed: false,
                    },
                    {
                      day: 'Saturday',
                      startTime: '00:00 AM',
                      endTime: '11:00 AM',
                      closed: true,
                    },
                    {
                      day: 'Sunday',
                      startTime: '00:00 AM',
                      endTime: '11:00 AM',
                      closed: true,
                    },
                  ].map((schedule, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-0.5 last:border-b-0"
                    >
                      <div className="flex-1 items-center justify-between gap-4 lg:flex">
                        <span className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {schedule.day}
                        </span>

                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="w-[100%] rounded border bg-gray-50 px-2 py-1 lg:w-24 dark:bg-gray-800">
                            {schedule.startTime}
                          </span>
                          <span className="text-xs text-gray-500">to</span>
                          <span className="w-[100%] rounded border bg-gray-50 px-2 py-1 lg:w-24 dark:bg-gray-800">
                            {schedule.endTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {/* SOCIAL MEDIA */}
            {/* <Card className="mt-4 shadow-lg dark:bg-[#171717]">
              <CardHeader>
                <div className="flex justify-between item-center ">
                  <Badge className="bg-gray-100 dark:bg-white text-black  rounded-full px-4 py-1 text-md font-medium">
                    Active
                  </Badge>
                  <Ellipsis className="cursor-pointer w-4 h-4" />
                </div>
                <div className="mt-2 flex justify-between items-start gap-4">
                  <img
                    src="/images/bannerImage.png"
                    alt="Promotion"
                    className="w-20 h-20 rounded-[10px] object-cover"
                  />

                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-center w-full mb-1">
                      <h1 className="text-slate-500 font-semibold">
                        PROMOTION
                      </h1>
                      <h1 className="text-green-500 font-semibold whitespace-nowrap">
                        24 Days left
                      </h1>
                    </div>

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
                      <div className="h-full bg-blue-600 transition-all duration-500 w-5/6"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* <div className="mt-5 grid grid-cols-12 gap-4">
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
            </div> */}
          </div>

          {/* ---------- RIGHT SIDE ---------- */}
          <div className="col-span-12 lg:col-span-7">
            {/* USER INFO */}
            <Card className="shadow-lg dark:bg-[#171717]">
              <CardHeader className="flex w-full flex-col gap-2">
                <h1 className="font-semibold text-slate-500">VENUE</h1>
                <div className="mt-2 flex items-center gap-2">
                  {/* <PartyPopper className="w-4 h-4" />
                  <span> Vibrant club</span> */}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  {/* <MapPin />
                  <span>Trnjanska cesta 5, 10 000 Zagreb, Cro...</span> */}
                </div>
                {/* <img
                  src="/images/mapImage.png"
                  alt=""
                  className="w-full h-full mt-2"
                /> */}
                <div className="col-span-12 flex h-[100px] w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-100 md:col-span-12 md:h-[140px] dark:bg-gray-800">
                  <span className="text-sm text-gray-400">
                    No Venue Selected
                  </span>
                </div>
              </CardHeader>
            </Card>

            {/* USER GALLERY */}
            <Card className="dark:bg-secondary mt-5 shadow-lg">
              <CardHeader className="gap-4">
                <h1 className="font-semibold text-slate-500">GALLERY</h1>
                {/* <img
                  title="Banner Image"
                  src="/images/bannerImage.png"
                  className="w-full md:h-[300px] h-[200px] rounded-2xl"
                />
                <div className="w-full grid grid-cols-12 gap-2">
                  {[1, 2, 3, 4].map((item, index) => (
                    <img
                      key={index}
                      src="/images/bannerImage.png"
                      className="col-span-6 md:col-span-6 lg:col-span-3 w-full md:h-[140px] h-[100px] rounded-lg object-cover cursor-pointer"
                      alt={`Gallery Image ${index + 1}`}
                    />
                  ))}
                </div> */}
                {/* Placeholder image */}
                <div className="col-span-12 flex h-[100px] w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-100 md:col-span-12 md:h-[140px] dark:bg-gray-800">
                  <span className="text-sm text-gray-400">No Image</span>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>

        <AddOtherDetailsModal
          open={openModal.value}
          newOrganization={newOrganization}
          onClose={CloseModal}
          onSubmitSuccess={(data) => setNewOrganization(data)}
        />

        {/* ADD OTHER DETAILS */}
        {/* <Dialog open={openModal.value} onOpenChange={CloseModal}>
          <DialogOverlay className="bg-opacity-30 fixed inset-0" />
          <DialogContent
            aria-describedby={undefined}
            className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[50vh] w-full flex-col items-center overflow-y-auto md:!max-w-[630px]"
          >
            <DialogHeader>
              <DialogTitle> Add Other Details </DialogTitle>
            </DialogHeader>
            <div className="w-full px-4">
              <FormProvider
                methods={methods}
                onSubmit={methods.handleSubmit(onSubmit)}
              >
                <div className="mt-4 flex w-full flex-col gap-4">
                  <RHFTextField
                    name="description"
                    label="Description"
                    placeholder="Enter Description"
                    rows={2}
                    multiline
                    className={` ${
                      methods.formState.errors.name ? 'border-red-400' : ''
                    }`}
                  />

                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <RHFTextField
                      type="number"
                      name="minAge"
                      label="Age (optional)"
                      placeholder="Min Age 5"
                      min={5}
                    />
                  </div>

                  <div className="grid w-full grid-cols-1 gap-4 overflow-hidden md:grid-cols-1">
                    <RHFCombobox
                      name="tags"
                      label="Tags"
                      placeholder="Select or add tags"
                      className="w-full flex-1"
                      multiple={true}
                      allowCustom={true}
                      options={[
                        { label: 'Tag 1', value: 'tag1' },
                        { label: 'Tag 2', value: 'tag2' },
                        { label: 'Tag 3', value: 'tag3' },
                      ]}
                    />

                    <RHFSelectField
                      name="venue"
                      label="Venue"
                      placeholder="Select Venue"
                      className="w-full flex-1"
                      options={[
                        { label: 'Venue 1', value: 'venue1' },
                        { label: 'Venue 2', value: 'venue2' },
                        { label: 'Venue 3', value: 'venue3' },
                      ]}
                    />

                    <RHFMultiSelect
                      name="category"
                      label="Select Categories"
                      placeholder="Select Category"
                      options={[
                        { label: 'Clubbing', value: 'clubbing' },
                        { label: 'Techno', value: 'techno' },
                        { label: 'House', value: 'house' },
                      ]}
                    />
                  </div>

                  <div className="w-full">
                    <RHFMultiFileUpload
                      name="galleryImages"
                      label="Upload Gallery Images"
                    />
                  </div>

                  <div className="w-full">
                    <h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Operating Hours
                    </h3>
                    <div className="space-y-4">
                      {[
                        { day: 'Monday', dayKey: 'monday' },
                        { day: 'Tuesday', dayKey: 'tuesday' },
                        { day: 'Wednesday', dayKey: 'wednesday' },
                        { day: 'Thursday', dayKey: 'thursday' },
                        { day: 'Friday', dayKey: 'friday' },
                        { day: 'Saturday', dayKey: 'saturday' },
                        { day: 'Sunday', dayKey: 'sunday' },
                      ].map((dayInfo) => (
                        <div
                          key={dayInfo.dayKey}
                          className="flex items-center gap-4"
                        >
                          <span className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {dayInfo.day}
                          </span>
                          <div className="flex flex-1 items-center gap-2">
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

                <div className="mt-2 flex w-full items-center justify-center">
                  <Button
                    type="button"
                    className="mt-3 cursor-pointer bg-blue-700 px-7 text-white hover:bg-blue-800"
                  >
                    Save
                  </Button>
                </div>
              </FormProvider>
            </div>
          </DialogContent>
        </Dialog> */}

        {/* VENUE MODAL */}
        <Dialog open={openVenueModal.value} onOpenChange={CloseVenueModal}>
          <DialogOverlay className="bg-opacity-30 fixed inset-0 flex w-full items-center justify-center bg-white md:w-lg">
            <DialogContent className="mx-auto max-h-[90vh] min-h-[86vh] overflow-y-auto dark:bg-[#171717]">
              <DialogHeader>
                <DialogTitle>
                  {' '}
                  {!editModal.value ? 'Create Venue' : 'Edit Venue'}{' '}
                </DialogTitle>
              </DialogHeader>
              <FormProvider
                methods={methods}
                onSubmit={methods.handleSubmit(onSubmit)}
              >
                <div className="mt-4 flex flex-col gap-4">
                  {/* <RHFUploadAvatar name="image" label="Venue Image" /> */}

                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAvatarChange}
                      className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:text-gray-200"
                    >
                      Upload Floor Plan
                    </Button>
                    <p className="mt-2 text-sm text-gray-500">
                      JPG or PNG. 1MB max.
                    </p>
                  </div>

                  <RHFTextField
                    name="name"
                    label="Venue Name"
                    placeholder="Enter Venue Name"
                    className={` ${
                      methods.formState.errors.name ? 'border-red-400' : ''
                    }`}
                  />

                  <RHFTextfieldWithSelect
                    name="venueType"
                    label="Venue Type"
                    placeholder="Select Venue Type"
                    options={[
                      { value: 'event1', label: 'Event 1' },
                      { value: 'event2', label: 'Event 2' },
                      { value: 'event3', label: 'Event 3' },
                    ]}
                  />
                  <RHFTextfieldWithSelect
                    name="organization"
                    label="Organization"
                    placeholder="Select Organization"
                    options={[
                      { label: 'Organization A', value: 'org-a' },
                      { label: 'Organization B', value: 'org-b' },
                      { label: 'Organization C', value: 'org-c' },
                    ]}
                  />
                  <RHFTextField
                    name="location"
                    label="Location"
                    placeholder="Enter Location"
                  />

                  <div className="w-full">
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Map Preview
                    </label>
                    <div className="h-[200px] w-full overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
                      <iframe
                        title="Venue Location Map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d463.9634089519931!2d14.611164251664785!3d45.23098434778954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476363d3cb88c945%3A0x7b1900b8b651a903!2sObala!5e1!3m2!1sen!2s!4v1752833828572!5m2!1sen!2s"
                        className="h-full w-full border-0"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="submit"
                      className="cursor-pointer bg-blue-700 text-white hover:bg-blue-800"
                    >
                      {!editModal.value ? 'Add Venue' : 'Update Venue'}
                    </Button>
                  </div>
                </div>
              </FormProvider>
            </DialogContent>
          </DialogOverlay>
        </Dialog>
      </div>
    </>
  );
};

export default UserInfo;
