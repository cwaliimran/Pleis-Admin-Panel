"use client";
import Header from "@/app/common/header";
import FormProvider, { RHFTextField } from "@/components/rhf";
import RHFTextfieldWithSelect from "@/components/rhf/rhf-text-field-with-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBoolean } from "@/hooks/useBoolean";
import { TagsTable } from "@/sections/tags";
import { yupResolver } from "@hookform/resolvers/yup";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const defaultValues = {
  name: "",
  type: "",
};
const Page = () => {
  const openModal = useBoolean();
  const [mode, setMode] = useState<"create" | "edit">("create");

  const schema = Yup.object().shape({
    name: Yup.string().required("Tag Name is required"),
    type: Yup.string().required("Tag Type is required"),
  });
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted with data:", data);
  };

  const CloseModal = () => {
    methods.reset(defaultValues);
    openModal.onFalse();
  };

  const handleOpen = () => {
    openModal.onTrue();
    setMode("create");
  };

  const handleEdit = (id: string) => {
    console.log("id", id);
    openModal.onTrue();
    setMode("edit");
  };

  const handleDelete = (id: string) => {
    console.log("id", id);
  };

  return (
    <div>
      <Header
        links={[
          { name: "Dashboard", href: "/super-admin" },
          { name: "Tags", href: "" },
        ]}
      />
      <div>
        <div className=" w-full flex items-center justify-end">
          <Button
            className="rounded-4xl py-2 bg-primary cursor-pointer text-white hover:bg-primary"
            onClick={handleOpen}
          >
            <Plus className="" />
            Create Tag
          </Button>
        </div>
      </div>

      {/* ------------- TAGS TABLE ------------- */}
      <TagsTable handleDelete={handleDelete} handleEdit={handleEdit} />

      {/* ------------- TAGS MODAL ------------- */}
      <Dialog open={openModal.value} onOpenChange={CloseModal}>
        <DialogOverlay className="fixed inset-0 bg-white bg-opacity-30 flex items-center justify-center md:w-lg w-full">
          <DialogContent className=" dark:bg-[#171717]">
            <DialogHeader>
              <DialogTitle>
                {/* {openModal.value ? "Create Tag" : "Edit Tag"}{" "} */}
                {mode === "create" ? "Create Tag" : "Edit Tag"}
              </DialogTitle>
            </DialogHeader>
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-4 mt-4">
                <RHFTextField
                  name="name"
                  label="Tag Name"
                  placeholder="Enter Tag Name"
                  className={` ${
                    methods.formState.errors.name ? "border-red-400" : ""
                  }`}
                />
                <RHFTextfieldWithSelect
                  name="type"
                  label="Tag Type"
                  placeholder="Select a type"
                  options={[
                    { label: "Primary", value: "primary" },
                    { label: "Secondary", value: "secondary" },
                    { label: "Info", value: "info" },
                    { label: "Warning", value: "warning" },
                  ]}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="submit"
                    className="bg-primary text-white hover:bg-primary cursor-pointer"
                  >
                    {openModal.value ? "Add Tag" : "Update Tag"}
                  </Button>
                </div>
              </div>
            </FormProvider>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
    </div>
  );
};

export default Page;
