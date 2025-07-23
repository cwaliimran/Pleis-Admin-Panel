"use client";

import Header from "@/app/common/header";
import { Button } from "@/components/ui/button";
import { Plus, X, CalendarIcon, Clock, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FormProvider, { RHFSelectField, RHFTextField } from "@/components/rhf";
import { Controller, useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import RHFDate from "@/components/rhf/rhf-date";
import { Input } from "@/components/ui/input";

interface EventFormValues {
  image: File | null;
  name: string;
  venue: string;
  category: string[];
  tag: string[];
  organizers: string[];
  partnerOrganizers: string[];
  fromDate: Date | null;
  fromTime: string;
  endDate: Date | null;
  endTime: string;
  description: string;
  eventType: "one-time" | "slots";
  recurring: boolean;
  recurringType: string;
  recurringInterval: number;
  recurringDays: string[];
  recurringEnd: "never" | "on-day" | "after";
  recurringEndDate: Date | null;
  recurringEndCount: number;
  categoryInput?: string;
  tagInput?: string;
  organizerInput?: string;
  partnerOrganizerInput?: string;
}

const defaultValues: EventFormValues = {
  image: null,
  name: "",
  venue: "",
  category: [],
  tag: [],
  organizers: [],
  partnerOrganizers: [],
  fromDate: new Date(),
  fromTime: "10:00",
  endDate: new Date(),
  endTime: "23:00",
  description: "",
  eventType: "one-time",
  recurring: false,
  recurringType: "weekly",
  recurringInterval: 1,
  recurringDays: [],
  recurringEnd: "never",
  recurringEndDate: null,
  recurringEndCount: 13,
  categoryInput: "",
  tagInput: "",
  organizerInput: "",
  partnerOrganizerInput: "",
};

const venueOptions = [
  { label: "Suggested Venue", value: "suggested-venue" },
  { label: "Conference Center", value: "conference-center" },
  { label: "Community Hall", value: "community-hall" },
];

const categoryOptions = [
  { label: "Music", value: "music" },
  { label: "Sports", value: "sports" },
];

const tagOptions = [
  { label: "Technology", value: "technology" },
  { label: "Business", value: "business" },
  { label: "Health", value: "health" },
  { label: "Music", value: "music" },
];

const organizerOptions = [
  { label: "Organization A", value: "orgA" },
  { label: "Organization B", value: "orgB" },
  { label: "Organization C", value: "orgC" },
];

const weekDays = [
  { label: "MON", value: "monday" },
  { label: "TUE", value: "tuesday" },
  { label: "WED", value: "wednesday" },
  { label: "THU", value: "thursday" },
  { label: "FRI", value: "friday" },
  { label: "SAT", value: "saturday" },
  { label: "SUN", value: "sunday" },
];

const Page = () => {

  const [step, setStep] = useState(1);
  const [version, setVersion] = useState(1);
  const [showPartnerOrganizer, setShowPartnerOrganizer] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const methods = useForm<EventFormValues>({ defaultValues });
  const router = useRouter();
  const { watch, setValue, getValues } = methods;

  const venue = watch("venue");
  const category = watch("category");
  const tag = watch("tag");
  const organizers = watch("organizers");
  const partnerOrganizers = watch("partnerOrganizers");
  const eventType = watch("eventType");
  const recurring = watch("recurring");
  const recurringType = watch("recurringType");
  const recurringDays = watch("recurringDays");
  const recurringEnd = watch("recurringEnd");

  const categoryInput = watch("categoryInput") || "";
  const tagInput = watch("tagInput") || "";
  const organizerInput = watch("organizerInput") || "";
  const partnerOrganizerInput = watch("partnerOrganizerInput") || "";

  const progress = step === 1 ? 50 : 100;

  const addCategory = () => {
    if (categoryInput && !category.includes(categoryInput)) {
      setValue("category", [...category, categoryInput]);
      setValue("categoryInput", "");
    }
  };

  const removeCategory = (val: string) => {
    setValue(
      "category",
      category.filter((v) => v !== val)
    );
  };

  const addTag = () => {
    if (tagInput && !tag.includes(tagInput)) {
      setValue("tag", [...tag, tagInput]);
      setValue("tagInput", "");
    }
  };

  const removeTag = (val: string) => {
    setValue(
      "tag",
      tag.filter((v) => v !== val)
    );
  };

  const addOrganizer = () => {
    if (organizerInput && !organizers.includes(organizerInput)) {
      setValue("organizers", [...organizers, organizerInput]);
      setValue("organizerInput", "");
    }
  };

  const removeOrganizer = (val: string) => {
    setValue(
      "organizers",
      organizers.filter((v) => v !== val)
    );
  };

  const addPartnerOrganizer = () => {
    if (
      partnerOrganizerInput &&
      !partnerOrganizers.includes(partnerOrganizerInput)
    ) {
      setValue("partnerOrganizers", [
        ...partnerOrganizers,
        partnerOrganizerInput,
      ]);
      setValue("partnerOrganizerInput", "");
    }
  };

  const removePartnerOrganizer = (val: string) => {
    setValue(
      "partnerOrganizers",
      partnerOrganizers.filter((v) => v !== val)
    );
  };

  const toggleRecurringDay = (day: string) => {
    const newDays = recurringDays.includes(day)
      ? recurringDays.filter((d) => d !== day)
      : [...recurringDays, day];
    setValue("recurringDays", newDays);
  };

  return (
    <div>
      <Header
        links={[
          { name: "Dashboard", href: "/super-admin" },
          { name: "New Event", href: "" },
        ]}
      />

      <div className="w-full flex flex-col items-center min-h-screen bg-[#f8f6f7] dark:bg-black py-4 font['Inter']">
        <div className="w-full flex justify-end mb-2"></div>

        <div className="w-full md:max-w-4xl md:mx-auto">
          <Card className="shadow-sm dark:bg-secondary">
            <CardContent className="md:p-8 p-2 dark:bg-secondary">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold mb-6 text-foreground">
                  Create a new event
                </h1>
                {/* Step text above progress bar */}
                <div className="w-full mb-6">
                  <div className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {step === 1
                      ? "Step 1: Basic Info"
                      : step === 2 ? "Step 2: Schedule Date and Time" : " Step 3: Add Ticketing"}
                  </div>
                  <div className="relative w-full h-2 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-700 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${step === 1 ? 33 : step === 2 ? 66 : 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <FormProvider
                methods={methods}
                onSubmit={methods.handleSubmit(() => { })}
              >
                {step === 1 && (
                  <div className="space-y-8">
                    {/* Image upload and basic info */}
                    <div className="flex flex-col lg:flex-row md:gap-8 gap-4">
                      {/* Left: Image upload */}
                      <div className="w-full lg:basis-[40%]">
                        <Controller
                          name="image"
                          control={methods.control}
                          render={({ field }) => (
                            <div className="space-y-2">
                              <label className="relative flex flex-col items-center justify-center w-full h-80 border-2 border-gray-300 dark:border-zinc-700 rounded-lg bg-[#F8F6F7] dark:bg-[#171717] cursor-pointer hover:border-gray-400 dark:hover:border-zinc-500 transition-colors overflow-hidden">
                                {preview ? (
                                  <img
                                    src={preview || "/placeholder.svg"}
                                    alt="Preview"
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <div className="flex flex-row text-gray-400">
                                    <span className="text-3xl mr-2"> + </span>
                                    <div className="flex flex-col">
                                      <span className="text-[22.9px] font-semibold">
                                        Add photo
                                      </span>
                                      <span className="text-[22.9px] font-semibold align-middle">
                                        or video
                                      </span>
                                    </div>
                                  </div>
                                )}
                                <input
                                  type="file"
                                  accept="image/*,video/*"
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        setPreview(reader.result as string);
                                      };
                                      reader.readAsDataURL(file);
                                      field.onChange(file);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          )}
                        />
                      </div>

                      {/* Right: Event name and description */}
                      <div className="w-full lg:basis-[60%] space-y-2">
                        <div className="relative">
                          <RHFTextField
                            name="name"
                            placeholder="Summer Festival"
                            className="text-lg font-medium border border-gray-200 px-4 focus:border-blue-600 bg-[#F8F6F7] rounded-4xl"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-0.5 text-gray-400 rounded-2xl cursor-pointer"
                          >
                            <X className="w-4 h-4 " />
                          </Button>
                        </div>
                        <RHFTextField
                          name="description"
                          placeholder="Type Event Description"
                          multiline
                          rows={8}
                          className="resize-none border-gray-200 focus:border-blue-600 lg:min-h-[275px] sm:min-h-[120px] bg-[#F8F6F7]"
                        />
                      </div>
                    </div>

                    {/* Form fields */}
                    <div className="flex flex-col lg:flex-row md:gap-6 gap-4">
                      {/* Venue */}
                      <div className="w-full lg:basis-[40%] space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300  uppercase tracking-wide">
                          VENUE
                        </label>
                        <RHFSelectField
                          name="venue"
                          placeholder="Suggested Venue"
                          options={venueOptions}
                          value={venue}
                          onChange={(e: any) =>
                            setValue("venue", e.target.value)
                          }
                          className="text-md border-gray-200 focus:border-blue-600 rounded-4xl cursor-pointer font-bold mt-2 py-5 px-5"
                        />
                      </div>

                      {/* Category */}
                      <div className="w-full lg:basis-[60%] space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300  uppercase tracking-wide">
                          CATEGORY
                        </label>
                        <div className="md:flex gap-2">
                          <RHFSelectField
                            name="categoryInput"
                            placeholder="Choose Category"
                            options={categoryOptions}
                            value={categoryInput}
                            onChange={(e: any) =>
                              setValue("categoryInput", e.target.value)
                            }
                            className="text-md flex-1 border-gray-200 focus:border-blue-600 lg:min-w-[340px] sm:min-w-[120px] rounded-4xl cursor-pointer mt-2 py-5 px-5"
                          />
                          <Button
                            type="button"
                            onClick={addCategory}
                            className="w-22 bg-blue-600 hover:bg-blue-700 text-white rounded-4xl cursor-pointer mt-2 md:py-6 md:px-6 px-3 py-3"
                          >
                            Add
                          </Button>
                        </div>

                        {category.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2 rounded-2xl">
                            {category.map((c: string) => (
                              <Badge
                                key={c}
                                className="flex items-center bg-secondary dark:bg-white text-white dark:text-black gap-1 text-sm"
                              >
                                {categoryOptions.find((opt) => opt.value === c)
                                  ?.label || c}
                                <button
                                  type="button"
                                  onClick={() => removeCategory(c)}
                                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                                >
                                  <X className="w-3 h-3 cursor-pointer" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide ">
                        TAGS
                      </label>
                      <div className="md:flex gap-2 w-full md:w-[70%] mt-2">

                        <input
                          type="text"
                          placeholder="Search for tag"
                          value={tagInput}
                          onChange={(e) => setValue("tagInput", e.target.value)}
                          className="w-full max-w-md border border-gray-200 focus:border-blue-600 focus:outline-none rounded-4xl cursor-pointer px-5 py-[8px] md:py-3"
                        />

                        <Button
                          type="button"
                          onClick={addTag}
                          className="w-22 md:mt-0 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-4xl cursor-pointer md:py-6 md:px-6 px-3  py-2"
                        >
                          Add
                        </Button>
                      </div>
                      {tag.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {tag.map((t: string) => (
                            <Badge
                              key={t}
                              className="flex bg-secondary dark:bg-white text-white dark:text-black items-center gap-1 text-sm"
                            >
                              {tagOptions.find((opt) => opt.value === t)
                                ?.label || t}
                              <button
                                type="button"
                                onClick={() => removeTag(t)}
                                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                              >
                                <X className="w-3 h-3 cursor-pointer" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Organizer */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300  uppercase tracking-wide">
                        ORGANIZER
                      </label>
                      <div className="md:flex gap-2 w-full  md:w-[70%] mt-2">
                        <input
                          type="text"
                          placeholder="Search for organizer"
                          value={organizerInput}
                          onChange={(e) => setValue("organizerInput", e.target.value)}
                          // className="border focus:border-blue-600 rounded-4xl cursor-pointer md:py-3 py-[8px] px-5 border-gray-200 focus:outline-none"
                            className="w-full max-w-md border border-gray-200 focus:border-blue-600 focus:outline-none rounded-4xl cursor-pointer px-5 py-[8px] md:py-3"
                        />
                        <Button
                          type="button"
                          onClick={addTag}
                          className="w-22 md:mt-0 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-4xl cursor-pointer md:py-6 py-2  md:px-6 px-5"
                        >
                          Add
                        </Button>
                      </div>
                      {organizers.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {organizers.map((o: string) => (
                            <Badge
                              key={o}
                              className="flex bg-secondary dark:bg-white text-white dark:text-black items-center gap-1 text-sm"
                            >
                              {organizerOptions.find((opt) => opt.value === o)
                                ?.label || o}
                              <button
                                type="button"
                                onClick={() => removeOrganizer(o)}
                                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                              >
                                <X className="w-3 h-3 cursor-pointer" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Partner Organizer */}
                    <div className="mt-4">
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 rounded-2xl cursor-pointer"
                        onClick={() => setShowPartnerOrganizer((v) => !v)}
                      >
                        <Plus className="w-4 h-4" />
                        Add Partner Organizer
                      </button>

                      {/* Partner organizer input (visible only when toggled) */}
                      {showPartnerOrganizer && (
                        <div className="flex gap-2 w-[70%] mt-2">
                          <input
                            type="text"
                            placeholder="Search for partner organizer"
                            value={tagInput}
                            onChange={(e) =>
                              setValue("tagInput", e.target.value)
                            }
                            className="bg-[#F8F6F7] dark:bg-transparent flex-1 px-3 border border-gray-200 focus:outline-none focus:border-blue-600 rounded-4xl cursor-pointer mt-3"
                          />
                          <Button
                            type="button"
                            onClick={addTag}
                            className="w-22 bg-blue-600 hover:bg-blue-700 text-white rounded-4xl cursor-pointer mt-2 md:py-6 py-3  md:px-18 px-5"
                          >
                            Add
                          </Button>
                        </div>
                      )}
                      {partnerOrganizers.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {partnerOrganizers.map((po: string) => (
                            <Badge
                              key={po}
                              className="flex bg-secondary dark:bg-white text-white dark:text-black items-center gap-1 text-sm"
                            >
                              {organizerOptions.find(
                                (opt) => opt.value === po
                              )?.label || po}
                              <button
                                type="button"
                                onClick={() => removePartnerOrganizer(po)}
                                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                              >
                                <X className="w-3 h-3 cursor-pointer" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* </div> */}

                    {/* Navigation buttons */}
                    <div className="flex justify-end flex-wrap mt-22 items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-22 rounded-4xl cursor-pointer mt-2 md:py-6 py-3  md:px-18 px-5"
                        onClick={() => router.back()}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setStep(2)}
                        className="w-22 bg-blue-600 hover:bg-blue-700 text-white rounded-4xl cursor-pointer mt-2 md:py-6 py-3  md:px-18 px-5"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    {/* Event type selection */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Choose event type</h3>
                      <div className="flex gap-4 flex-wrap">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setValue("eventType", "one-time")}
                          className={`border-2 ${eventType === "one-time"
                            ? "border-blue-700 text-blue-700"
                            : "border-gray-300 dark:border-zinc-700"
                            } rounded-2xl px-6 py-2 font-semibold bg-transparent cursor-pointer`}
                        >
                          One time
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setValue("eventType", "slots")}
                          className={`border-2 ${eventType === "slots"
                            ? "border-blue-700 text-blue-700"
                            : "border-gray-300 dark:border-zinc-700"
                            } rounded-2xl px-6 py-2 font-semibold bg-transparent cursor-pointer`}
                        >
                          Slots
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Date and time */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium ">
                        Set up your event date and time
                      </h3>

                      {/* Start Date and Time row */}
                      <div className="w-full md:w-[60%]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2 w-full">
                            <label className="text-sm font-medium text-gray-700  dark:text-white flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4" />
                              START DATE
                            </label>
                            <RHFDate
                              name="fromDate"
                              className="rounded-4xl border-gray-200 focus:border-blue-600  w-full cursor-pointer"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-white  flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              START TIME
                            </label>
                            <input
                              type="time"
                              step="1800"
                              value={watch("fromTime")}
                              onChange={(e) =>
                                setValue("fromTime", e.target.value)
                              }
                              className="rounded-4xl bg-[#F8F6F7] dark:bg-transparent dark:border-zinc-700 border border-gray-200 focus:border-blue-600 w-25 px-3 py-2 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                      {/* End Date and Time row */}
                      <div className="w-full md:w-[60%]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-white flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4" />
                              END DATE
                            </label>
                            <RHFDate
                              name="endDate"
                              className="rounded-4xl border-gray-200 focus:border-blue-600 w-full cursor-pointer"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-white flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              END TIME
                            </label>
                            <input
                              type="time"
                              step="1800"
                              value={watch("endTime")}
                              onChange={(e) =>
                                setValue("endTime", e.target.value)
                              }
                              className="rounded-4xl bg-[#F8F6F7] dark:bg-transparent dark:border-zinc-700 border border-gray-200 focus:border-blue-600 w-25 px-3 py-2 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Recurring event */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium">Recurring event</h3>

                      <div className="flex gap-4">
                        <RHFSelectField
                          name="recurringType"
                          placeholder="Select Recurrence"
                          options={[
                            { label: "Weekly", value: "weekly" },
                            { label: "Monthly", value: "monthly" },
                            { label: "Daily", value: "daily" },
                          ]}
                          value={recurringType}
                          onChange={(e: any) =>
                            setValue("recurringType", e.target.value)
                          }
                          className="w-32 border-gray-200 focus:border-blue-600 rounded-2xl cursor-pointer"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:flex items-center  gap-2 justify-start">
                          <label className="text-sm font-medium text-gray-700 dark:text-white uppercase tracking-wide">
                            RECURRING INTERVAL
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={watch("recurringInterval")}
                              onChange={(e) =>
                                setValue(
                                  "recurringInterval",
                                  Number.parseInt(e.target.value)
                                )
                              }
                              className="w-16 px-3 py-2 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600"
                              min="1"
                            />
                            <span className="text-sm text-gray-600 dark:text-white">
                              Weekly
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-white uppercase tracking-wide">
                          RECURRING DAY
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {weekDays.map((day) => (
                            <Button
                              key={day.value}
                              type="button"
                              variant={
                                recurringDays.includes(day.value)
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => toggleRecurringDay(day.value)}
                              className={`w-12 h-8 text-xs cursor-pointer ${recurringDays.includes(day.value)
                                ? "bg-blue-600 text-white"
                                : "text-gray-600 dark:text-white"
                                }`}
                            >
                              {day.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-700 dark:text-white uppercase tracking-wide">
                          RECURRING ENDS
                        </label>
                        <div className=" mt-2 flex flex-col gap-3">
                          {/* Never */}
                          <div className="flex items-center gap-3 w-full">
                            <label className="flex items-center gap-3 py-2 px-3 border-2 border-gray-200 dark:border-zinc-700 rounded-2xl bg-white dark:bg-[#23272f] text-gray-700 dark:text-gray-200 w-full md:w-[60%]">
                              <input
                                type="radio"
                                name="recurringEnd"
                                value="never"
                                checked={recurringEnd === "never"}
                                onChange={(e) =>
                                  setValue(
                                    "recurringEnd",
                                    e.target.value as any
                                  )
                                }
                                className="w-4 h-4 text-blue-600 rounded-2xl cursor-pointer"
                              />
                              <span className="text-sm">Never</span>
                            </label>
                          </div>
                          {/* On Day */}
                          <div className="md:flex items-center gap-3 w-full">
                            <label className="flex items-center gap-3 py-2 px-3 border-2 border-gray-200 dark:border-zinc-700 rounded-2xl bg-white dark:bg-[#23272f] text-gray-700 dark:text-gray-200 w-full md:w-[60%]">
                              <input
                                type="radio"
                                name="recurringEnd"
                                value="on-day"
                                checked={recurringEnd === "on-day"}
                                onChange={(e) =>
                                  setValue(
                                    "recurringEnd",
                                    e.target.value as any
                                  )
                                }
                                className="w-4 h-4 text-blue-600 rounded-2xl cursor-pointer"
                              />
                              <span className="text-sm">On Day</span>
                            </label>
                            {recurringEnd === "on-day" && (
                              <div className="md:w-[30%] w-full md:mt-0 mt-3 bg-white dark:bg-[#23272f]">
                                <RHFDate
                                  name="recurringEndDate"
                                  className="w-full border-gray-200 focus:border-blue-600 rounded-2xl cursor-pointer"
                                />
                              </div>
                            )}
                          </div>
                          {/* After */}
                          <div className="md:flex items-center gap-3 w-full">
                            <label className="flex items-center gap-3 py-2 px-3 border-2 border-gray-200 dark:border-zinc-700 rounded-2xl bg-white dark:bg-[#23272f] text-gray-700 dark:text-gray-200  w-full md:w-[60%]">
                              <input
                                type="radio"
                                name="recurringEnd"
                                value="after"
                                checked={recurringEnd === "after"}
                                onChange={(e) =>
                                  setValue(
                                    "recurringEnd",
                                    e.target.value as any
                                  )
                                }
                                className="w-4 h-4 text-blue-600 rounded-2xl cursor-pointer"
                              />
                              <span className="text-sm">After</span>
                            </label>
                            {recurringEnd === "after" && (
                              <div className="md:w-[30%] w-full border border-gray-200 dark:border-zinc-700 rounded-2xl px-4 py-2 bg-white dark:bg-[#23272f] flex items-center gap-2 md:mt-0 mt-3">
                                <input
                                  type="number"
                                  value={watch("recurringEndCount")}
                                  onChange={(e) =>
                                    setValue(
                                      "recurringEndCount",
                                      Number.parseInt(e.target.value)
                                    )
                                  }
                                  className="w-10   focus:outline-none focus:border-blue-600"
                                  min="1"
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                  recurrings
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex justify-end flex-wrap mt-22 items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="w-22 rounded-4xl cursor-pointer mt-2 md:py-6 py-3  md:px-18 px-5"
                      >
                        Back
                      </Button>
                      <Button
                        // type="submit"
                        onClick={() => setStep(3)}
                        className="w-22 bg-blue-600 hover:bg-blue-700 text-white rounded-4xl cursor-pointer mt-2 md:py-6 py-3  md:px-18 px-5"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
                {
                  step === 3 && (
                    <div>
                      <div className="w-full md:flex justify-start items-center">
                        <div className="flex flex-wrap gap-4">
                          {['Resend to Unopened Users', 'Include Names on Tickets'].map((item, index) => (
                            <div key={index} className="flex items-center gap-2 w-full sm:w-auto">
                              <Input type="checkbox" className="h-4 w-4 cursor-pointer" />
                              <span className="text-sm text-foreground">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <h1 className="text-[16px] font-medium leading-5 my-5">General Information</h1>
                      <div className="flex flex-wrap items-center md:gap-4 gap-2">
                        {['Paid', 'Free', 'Donation'].map((item, index) => (
                          <div key={index} className="flex items-center gap-2 w-full sm:w-auto">
                            <Button variant={"outline"} onClick={() => setVersion(index + 1)} className={`cursor-pointer
                               md:max-w-[140px] md:min-w-[140px] px-10 py-5 transition-all ${version === index + 1 ?
                                'border border-primary  dark:border-primary ' : ''}`}>{item}</Button>
                          </div>
                        ))}
                      </div>
                      <div className="relative mt-5 md:w-[66%] w-full">
                        <RHFTextField
                          name="name"
                          placeholder="General Admission"
                          className="text-sm  font-medium border border-gray-200 px-4 bg-[#F8F6F7] rounded-4xl"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-0.5 text-gray-400 rounded-2xl cursor-pointer"
                        >
                          <X className="w-4 h-4 " />
                        </Button>
                      </div>
                      <div className="w-full grid grid-cols-12 mt-4 gap-4">
                        <div className="col-span-12 md:col-span-8">
                          <RHFTextField
                            name="description"
                            multiline
                            rows={4}
                            placeholder="Type Ticket Description"
                            className="text-sm md:min-h-[132px] font-medium border border-gray-200 px-4 bg-[#F8F6F7] "
                          />
                        </div>
                        <div className="col-span-12 md:col-span-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-500 dark:text-white flex items-center gap-2">
                              AVAILABLE QUANTITY
                            </label>
                            <RHFTextField
                              name="quantity"
                              placeholder="100"
                              type="number"
                              className="text-sm font-medium border border-gray-200 px-4 bg-[#F8F6F7] rounded-4xl"
                            />
                          </div>
                          <div className="flex items-end gap-4 mt-3">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-500 dark:text-white flex items-center gap-2">
                                PRICE
                              </label>
                              <RHFTextField
                                name="price"
                                placeholder="0.00"
                                type="number"
                                className="text-sm font-medium border border-gray-200 px-4 bg-[#F8F6F7] rounded-4xl"
                              />

                            </div>
                            <RHFSelectField
                              name="currency"
                              placeholder="USD"
                              defaultValue={"EURO"}
                              options={[
                                { label: "USD", value: "USD" },
                                { label: "EURO", value: "EUR" },
                                { label: "GBP", value: "GBP" },
                              ]}
                              className="text-sm font-medium border border-gray-200 px-4 bg-[#F8F6F7] rounded-4xl cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                      <Separator className="md:my-8 my-4" />
                      <h1 className="text-[16px] font-medium leading-5 my-5">Set up sale start date and time</h1>
                      <div className="w-full md:w-[60%]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-500 dark:text-white flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4" />
                              START DATE
                            </label>
                            <RHFDate
                              name="fromDate"
                              className="rounded-4xl border-gray-200 focus:border-blue-600 w-full cursor-pointer"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-500 dark:text-white  flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              START TIME
                            </label>
                            <input
                              type="time"
                              step="1800"
                              value={watch("fromTime")}
                              onChange={(e) =>
                                setValue("fromTime", e.target.value)
                              }
                              className="rounded-4xl bg-[#F8F6F7] dark:bg-transparent dark:border-zinc-700 border border-gray-200 focus:border-blue-600 w-25 px-3 py-2 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                      {/* End Date and Time row */}
                      <div className="w-full md:w-[60%] md:mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-y-4 ">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-white flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4" />
                              END DATE
                            </label>
                            <RHFDate
                              name="endDate"
                              className="rounded-4xl border-gray-200 focus:border-blue-600 w-full cursor-pointer"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-500 dark:text-white flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              END TIME
                            </label>
                            <input
                              type="time"
                              step="1800"
                              value={watch("endTime")}
                              onChange={(e) =>
                                setValue("endTime", e.target.value)
                              }
                              className="rounded-4xl bg-[#F8F6F7] dark:bg-transparent dark:border-zinc-700 border border-gray-200 focus:border-blue-600 w-25 px-3 py-2 cursor-pointer"
                            />
                          </div>
                        </div>
                        <div className="space-y-2 mt-6 md:w-[60%] w-full">
                          <label className="text-sm font-medium text-slate-500 dark:text-white  flex items-center gap-2">
                            TICKET OPTIONS
                          </label>
                          <RHFSelectField
                            name="ticketOptions"
                            defaultValue="early-bird"
                            placeholder="Select Ticket Options"
                            options={[
                              { label: "General Admission", value: "general" },
                              { label: "VIP", value: "vip" },
                              { label: "Early Bird - 5$", value: "early-bird" },
                            ]}
                            className="w-full border-gray-200 rounded-4xl cursor-pointer"
                          />
                        </div>
                      </div>
                      <Separator className="md:my-8 my-4" />
                      <Button
                        type="button"
                        className=" bg-blue-600 hover:bg-blue-700 text-white rounded-4xl cursor-pointer md:py-6 py-3  md:px-18 px-5">
                        <Plus className="w-4 h-4 " />
                        Add Date
                      </Button>

                      <h1 className="text-[14px] font-medium leading-5 my-5 text-foreground">
                        <span className="text-primary cursor-pointer">+ Create a section</span> if you want to sell multiple ticket types that share the same inventory.
                      </h1>
                      <div className="space-y-2 mt-6 md:w-[60%] w-full">
                        <label className="text-sm font-medium text-slate-500 dark:text-white  flex items-center gap-2">
                          CHOOSE A SECTION
                        </label>
                        <RHFSelectField
                          name="time"
                          options={[
                            { label: "10:00AM", value: "10:00AM" },
                            { label: "11:00AM", value: "11:00AM" },
                            { label: "12:00PM", value: "12:00PM" },
                            { label: "1:00PM", value: "1:00PM" },
                            { label: "2:00PM", value: "2:00PM" },
                            { label: "3:00PM", value: "3:00PM" },
                          ]}
                          className="w-full border-gray-200 rounded-4xl cursor-pointer"
                        />
                      </div>
                      <Separator className="md:my-8 my-4" />
                      <div className="my-6 flex items-center-safe gap-2">
                        <h1 className="text-[16px] font-medium leading-5 my-5 flex-wrap">Advanced settings
                        </h1>
                        <ChevronDown className="w-4 h-4 cursor-pointer" />
                      </div>
                      <div className="space-y-2 mt-6 md:w-[60%] w-full">
                        <label className="text-sm font-medium text-slate-500 dark:text-white flex items-center gap-2">
                          TICKETS PER ORDER
                        </label>
                        <div className="md:flex items-center gap-3">
                          <RHFTextField
                            name="minQuantity"
                            placeholder="Minimum quantity"
                            type="number"
                            className="text-sm font-medium border border-gray-200 px-4 bg-[#F8F6F7] rounded-4xl"
                          /><RHFTextField
                            name="maxQuantity"
                            placeholder="Maximum quantity"
                            type="number"
                            className="text-sm font-medium border border-gray-200 px-4 bg-[#F8F6F7] rounded-4xl md:mt-0 mt-3"
                          />
                        </div>
                        <label className="text-sm font-medium text-slate-500 dark:text-white flex items-center gap-2">
                          SALES CHANNEL
                        </label>
                        <RHFSelectField
                          name="salesChannel"
                          placeholder="Select Sales Channel"
                          options={[
                            { label: "Online", value: "online" },
                            { label: "In-person", value: "in-person" },
                            { label: "Phone", value: "phone" },
                          ]}
                          className="w-full border-gray-200 rounded-4xl cursor-pointer"
                        />
                      </div>
                      <Separator className="md:my-8 my-4" />
                      <div className="flex flex-wrap gap-3">
                        <Button
                          type="button"
                          className=" bg-blue-600 hover:bg-blue-700 text-white rounded-4xl cursor-pointer md:py-6 py-3  md:px-18 px-5">
                          <Plus className="w-4 h-4 " />
                          Add tickets
                        </Button>
                        <Button
                          type="button"
                          className=" bg-blue-600 hover:bg-blue-700 text-white rounded-4xl cursor-pointer md:py-6 py-3  md:px-18 px-5">
                          <Plus className="w-4 h-4 " />
                          Import Tickets
                        </Button>
                      </div>
                      <Separator className="md:my-8 my-4" />
                      <h1 className="text-[16px] font-medium leading-5 my-5 flex-wrap text-primary cursor-pointer">+ Add package</h1>

                      <div className="flex justify-end flex-wrap mt-22 items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(2)}
                          className="w-22 rounded-4xl cursor-pointer mt-2 md:py-6 py-3  md:px-18 px-5"
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-22 rounded-4xl cursor-pointer mt-2 md:py-6 py-3  md:px-18 px-5"
                        >
                          Skip
                        </Button>
                        <Button
                          type="submit"
                          className="w-22 bg-blue-600 hover:bg-blue-700 text-white rounded-4xl cursor-pointer mt-2 md:py-6 py-3  md:px-18 px-5"
                        >
                          Publish
                        </Button>
                      </div>

                    </div>

                  )
                }
              </FormProvider>
            </CardContent>
          </Card>
        </div>
      </div>
    </div >
  );
};

export default Page;
