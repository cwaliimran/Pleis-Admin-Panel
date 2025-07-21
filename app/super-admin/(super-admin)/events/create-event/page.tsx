"use client";

import Header from "@/app/common/header";
import { Button } from "@/components/ui/button";
import { Plus, X, CalendarIcon, Clock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FormProvider, { RHFSelectField, RHFTextField } from "@/components/rhf";
import { Controller, useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import RHFDate from "@/components/rhf/rhf-date";

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

        <div className="w-full max-w-4xl mx-auto">
          <Card className="shadow-sm dark:bg-[#171717]">
            <CardContent className="p-8 dark:bg-[#171717]">
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
                      : "Step 2: Schedule Date and Time"}
                  </div>
                  <div className="relative w-full h-2 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-700 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${step === 1 ? 50 : 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <FormProvider
                methods={methods}
                onSubmit={methods.handleSubmit(() => {})}
              >
                {step === 1 && (
                  <div className="space-y-8">
                    {/* Image upload and basic info */}
                    <div className="flex flex-col lg:flex-row gap-8">
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
                                      <span className="text-3xl font-medium">
                                        Add photo
                                      </span>
                                      <span className="text-3xl font-medium align-middle">
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
                            className="absolute right-1 top-0.5 text-gray-400 rounded-2xl"
                          >
                            <X className="w-4 h-4" />
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
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Venue */}
                      <div className="w-full lg:basis-[40%] space-y-2">
                        <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
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
                        <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                          CATEGORY
                        </label>
                        <div className="flex gap-2">
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
                            className="w-22 bg-blue-600 hover:bg-blue-700 text-white rounded-4xl cursor-pointer mt-2 py-6 px-6"
                          >
                            Add
                          </Button>
                        </div>

                        {category.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2 rounded-2xl">
                            {category.map((c: string) => (
                              <Badge
                                key={c}
                                variant="secondary"
                                className="flex items-center gap-1 text-sm"
                              >
                                {categoryOptions.find((opt) => opt.value === c)
                                  ?.label || c}
                                <button
                                  type="button"
                                  onClick={() => removeCategory(c)}
                                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 uppercase tracking-wide ">
                        TAGS
                      </label>
                      <div className="flex gap-2 w-[70%] mt-2">
                        <input
                          type="text"
                          placeholder="Search for tag"
                          value={tagInput}
                          onChange={(e) => setValue("tagInput", e.target.value)}
                          className="bg-[#F8F6F7] flex-1 px-3 border border-gray-200 focus:outline-none focus:border-blue-600 rounded-4xl cursor-pointer"
                        />
                        <Button
                          type="button"
                          onClick={addTag}
                          className="w-22 bg-blue-600 hover:bg-blue-700 text-white rounded-4xl cursor-pointer py-6 px-6"
                        >
                          Add
                        </Button>
                      </div>
                      {tag.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {tag.map((t: string) => (
                            <Badge
                              key={t}
                              variant="secondary"
                              className="flex items-center gap-1 text-sm"
                            >
                              {tagOptions.find((opt) => opt.value === t)
                                ?.label || t}
                              <button
                                type="button"
                                onClick={() => removeTag(t)}
                                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Organizer */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                        ORGANIZER
                      </label>
                      <div className="flex gap-2 w-[70%] mt-2">
                        <input
                          type="text"
                          placeholder="Search for organizer"
                          value={tagInput}
                          onChange={(e) => setValue("tagInput", e.target.value)}
                          className="bg-[#F8F6F7] flex-1 px-3 border border-gray-200 focus:outline-none focus:border-blue-600 rounded-4xl cursor-pointer"
                        />
                        <Button
                          type="button"
                          onClick={addTag}
                          className="w-22 bg-blue-600 hover:bg-blue-700 text-white rounded-4xl cursor-pointer py-6 px-6"
                        >
                          Add
                        </Button>
                      </div>
                      {organizers.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {organizers.map((o: string) => (
                            <Badge
                              key={o}
                              variant="secondary"
                              className="flex items-center gap-1 text-sm"
                            >
                              {organizerOptions.find((opt) => opt.value === o)
                                ?.label || o}
                              <button
                                type="button"
                                onClick={() => removeOrganizer(o)}
                                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}

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
                              className="bg-[#F8F6F7] flex-1 px-3 border border-gray-200 focus:outline-none focus:border-blue-600 rounded-4xl cursor-pointer mt-3"
                            />
                            <Button
                              type="button"
                              onClick={addTag}
                              className="w-22 bg-blue-600 hover:bg-blue-700 text-white rounded-4xl cursor-pointer mt-2 py-6 px-6"
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
                                variant="secondary"
                                className="flex items-center gap-1 text-sm"
                              >
                                {organizerOptions.find(
                                  (opt) => opt.value === po
                                )?.label || po}
                                <button
                                  type="button"
                                  onClick={() => removePartnerOrganizer(po)}
                                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex justify-end mt-22 items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-22 rounded-4xl cursor-pointer mt-2 py-6 px-18"
                        onClick={() => router.back()}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setStep(2)}
                        className="w-22 bg-blue-600 hover:bg-blue-700 text-white rounded-4xl cursor-pointer mt-2 py-6 px-18"
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
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setValue("eventType", "one-time")}
                          className={`border-2 ${
                            eventType === "one-time"
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
                          className={`border-2 ${
                            eventType === "slots"
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
                      <h3 className="text-lg font-medium">
                        Set up your event date and time
                      </h3>

                      {/* Start Date and Time row */}
                      <div className="w-full md:w-[60%]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4" />
                              START DATE
                            </label>
                            <RHFDate
                              name="fromDate"
                              className="rounded-4xl border-gray-200 focus:border-blue-600 w-full cursor-pointer"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
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
                              className="rounded-4xl bg-[#F8F6F7] border-gray-200 focus:border-blue-600 w-25 px-3 py-2 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                      {/* End Date and Time row */}
                      <div className="w-full md:w-[60%]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4" />
                              END DATE
                            </label>
                            <RHFDate
                              name="endDate"
                              className="rounded-4xl border-gray-200 focus:border-blue-600 w-full cursor-pointer"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
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
                              className="rounded-4xl bg-[#F8F6F7] border-gray-200 focus:border-blue-600 w-25 px-3 py-2 cursor-pointer"
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
                        <div className="flex items-center gap-2 justify-start">
                          <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
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
                            <span className="text-sm text-gray-600">
                              Weekly
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                          RECURRING DAY
                        </label>
                        <div className="flex gap-2">
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
                              className={`w-12 h-8 text-xs cursor-pointer ${
                                recurringDays.includes(day.value)
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-600"
                              }`}
                            >
                              {day.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                          RECURRING ENDS
                        </label>
                        <div className=" mt-2 flex flex-col gap-3">
                          {/* Never */}
                          <div className="flex items-center gap-3 w-full">
                            <label className="flex items-center gap-3 py-2 px-3 border-2 border-gray-200 dark:border-zinc-700 rounded-2xl bg-white dark:bg-[#23272f] text-gray-700 dark:text-gray-200 w-[60%]">
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
                          <div className="flex items-center gap-3 w-full">
                            <label className="flex items-center gap-3 py-2 px-3 border-2 border-gray-200 dark:border-zinc-700 rounded-2xl bg-white dark:bg-[#23272f] text-gray-700 dark:text-gray-200 w-[60%]">
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
                              <div className="w-[30%] bg-white dark:bg-[#23272f]">
                                <RHFDate
                                  name="recurringEndDate"
                                  className="w-full border-gray-200 focus:border-blue-600 rounded-2xl cursor-pointer"
                                />
                              </div>
                            )}
                          </div>
                          {/* After */}
                          <div className="flex items-center gap-3 w-full">
                            <label className="flex items-center gap-3 py-2 px-3 border-2 border-gray-200 dark:border-zinc-700 rounded-2xl bg-white dark:bg-[#23272f] text-gray-700 dark:text-gray-200 w-[60%]">
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
                              <div className="w-[30%] border border-gray-200 dark:border-zinc-700 rounded-2xl px-4 py-2 bg-white dark:bg-[#23272f] flex items-center gap-2">
                                <input
                                  type="number"
                                  value={watch("recurringEndCount")}
                                  onChange={(e) =>
                                    setValue(
                                      "recurringEndCount",
                                      Number.parseInt(e.target.value)
                                    )
                                  }
                                  className="w-10 focus:outline-none focus:border-blue-600"
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
                    <div className="flex justify-end mt-22 items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="w-22 rounded-4xl cursor-pointer mt-2 py-6 px-18"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="w-22 bg-blue-600 hover:bg-blue-700 text-white rounded-4xl cursor-pointer mt-2 py-6 px-18"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </FormProvider>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
