"use client";

import Header from "@/app/common/header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import FormProvider, {
  RHFSelectField,
  RHFTextField,
  RHFUploadVideo,
} from "@/components/rhf";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBoolean } from "@/hooks/useBoolean";
import RHFUploadAvatar from "@/components/rhf/rhf-upload-avatar";
import HighlightTable from "@/sections/highlight/hightlightTable";
import ConfirmDialog from "@/components/comfirm-dialog/confirm-dialog";
import RHFTextfieldWithSelect from "@/components/rhf/rhf-text-field-with-select";

type HighlightFormValues = {
  video: File | null;
  title: string;
  event: string;
  status: string;
  organization: string;
};

const defaultValues: HighlightFormValues = {
  video: null,
  title: "",
  event: "",
  status: "",
  organization: "",
};

const schema = Yup.object({
  video: Yup.mixed()
    .required("Video is required"),
  title: Yup.string().required("Title is required"),
  event: Yup.string().required("Event is required"),
  status: Yup.string().required("Status is required"),
  organization: Yup.string().required("Organization is required"),
});

const Page = () => {

  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  const methods = useForm<HighlightFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { watch, reset, handleSubmit } = methods;
  const video = watch("video");

  const videoPreviewUrl = useMemo(() => {
    return video instanceof File ? URL.createObjectURL(video) : null;
  }, [video]);

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  const onSubmit = (data: any) => {
    // You can upload form here
  };

  const closeModal = () => {
    reset(defaultValues);
    openModal.onFalse();
    editModal.onFalse();
  };
  const handleEdit = (id: string) => {
    openModal.onTrue();
    editModal.onTrue();
  }

  const handleDelete = (id: string) => {
    deleteModal.onTrue();
  }
  const onDelete = () => {
    deleteModal.onFalse();
  }


  return (
    <div>
      <Header
        links={[
          { name: "Dashboard", href: "/super-admin" },
          { name: "Highlights", href: "" },
        ]}
      />

      <div className="w-full flex items-center justify-end  md:mt-0 mt-3">
        <Button
          className="rounded-4xl py-2 bg-primary text-white hover:bg-primary cursor-pointer"
          onClick={openModal.onTrue}
        >
          <Plus className="mr-1" />
          Create Highlight
        </Button>
      </div>
      {/* dialog for add and update the highlight  */}
      <Dialog open={openModal.value} onOpenChange={closeModal}>
        <DialogOverlay className="fixed inset-0 bg-white bg-opacity-30" />
        <DialogContent className="w-full md:!max-w-screen-md  dark:bg-[#171717]">
          <DialogHeader>
            <DialogTitle>
              {!editModal.value ? "Create Highlight" : "Edit Highlight"}
            </DialogTitle>
          </DialogHeader>

          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 gap-4 mt-4">
              <div className="col-span-12 md:col-span-4">
                <RHFUploadVideo name="video" label="Highlight Video" />

              </div>

              <div className="col-span-12 md:col-span-8 flex flex-col gap-4">
                <RHFTextField
                  name="title"
                  label="Highlight Title"
                  placeholder="Enter Highlight Title"
                  className={`${methods.formState.errors.title ? "border-red-400" : ""
                    }`}
                />
               
                <RHFTextfieldWithSelect
                  name="event"
                  placeholder="Select Event"
                  options={[
                    { value: "event1", label: "Event 1" },
                    { value: "event2", label: "Event 2" },
                    { value: "event3", label: "Event 3" },
                  ]}
                  />
                
                <RHFTextfieldWithSelect
                  name="organization"
                  placeholder="Select Organization"
                  options={[
                    { label: "Organization 1", value: "org1" },
                    { label: "Organization 2", value: "org2" },
                    { label: "Organization 3", value: "org3" },
                  ]}
                />
                <RHFSelectField
                  name="status"
                  label="Status"
                  placeholder="Select Status"
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Inactive", value: "inactive" },
                  ]}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                className="bg-primary text-white hover:bg-primary cursor-pointer"
              >
                {!editModal.value ? "Add Highlight" : "Update Highlight"}
              </Button>
            </div>
          </FormProvider>
        </DialogContent>
      </Dialog>
      {/* dialog for delete the highlight */}
      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Highlight"
        content="Are you sure you want to delete this?"
        onClose={deleteModal.onFalse}
        onConfirm={onDelete}
      />
      <HighlightTable handleDelete={handleDelete} handleEdit={handleEdit} />
    </div>
  );
};

export default Page;
