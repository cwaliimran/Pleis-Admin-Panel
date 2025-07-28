"use client";
import Header from "@/app/common/header";
import ConfirmDialog from "@/components/comfirm-dialog/confirm-dialog";
import FormProvider, { RHFTextField } from "@/components/rhf";
import RHFUploadAvatar from "@/components/rhf/rhf-upload-avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBoolean } from "@/hooks/useBoolean";
import { VenueTypeTable } from "@/sections/venueType";
import { yupResolver } from "@hookform/resolvers/yup";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const defaultValues = {
  icon: null,
  name: "",
  type: "",
};

const Page = () => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  const schema = Yup.object().shape({
    icon: Yup.mixed().nullable(),
    name: Yup.string().required("Venue Type Name is required"),
    // type: Yup.string().required("Category Type is required"),
  });
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
  };

  const CloseModal = () => {
    methods.reset(defaultValues);
    openModal.onFalse();
    editModal.onFalse();
  };

  const handleEdit = (id: string) => {
    console.log("id", id);
    openModal.onTrue();
    editModal.onTrue();
  };

  const handleDelete = (id: string) => {
    console.log("id", id);
    deleteModal.onTrue();
  };
  const onDelete = () => {
    deleteModal.onFalse();
  };

  return (
    <div>
      <Header
        links={[
          { name: "Dashboard", href: "/super-admin" },
          { name: "Venues Type", href: "" },
        ]}
      />
      <div>
        <div className=" w-full flex items-center justify-end md:mt-0 mt-3">
          <Button
            className="rounded-4xl py-2 bg-primary cursor-pointer text-white hover:bg-primary"
            onClick={openModal.onTrue}
          >
            <Plus className="" />
            Create Venue Type
          </Button>
        </div>
      </div>
      {/* dialog for add and update the venue type */}
      <Dialog open={openModal.value} onOpenChange={CloseModal}>
        <DialogOverlay className="fixed inset-0 bg-white bg-opacity-30 flex items-center justify-center md:w-lg w-full">
          <DialogContent className=" dark:bg-[#171717]">
            <DialogHeader>
              <DialogTitle>
                {" "}
                {!editModal.value
                  ? "Create Venue Type"
                  : "Edit Venue Type"}{" "}
              </DialogTitle>
            </DialogHeader>
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-4 mt-4">
                <RHFUploadAvatar name="icon" label="Venue Type Icon" />
                <RHFTextField
                  name="name"
                  label="Venue Type Name"
                  placeholder="Enter Venue Type Name"
                  className={` ${
                    methods.formState.errors.name ? "border-red-400" : ""
                  }`}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="submit"
                    className="bg-primary text-white hover:bg-primary cursor-pointer"
                  >
                    {!editModal.value ? "Add Venue Type" : "Update Venue Type"}
                  </Button>
                </div>
              </div>
            </FormProvider>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
      {/* delete modal */}
      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Venue Type"
        content="Are you sure you want to delete this?"
        onClose={deleteModal.onFalse}
        onConfirm={onDelete}
      />

      <VenueTypeTable handleDelete={handleDelete} handleEdit={handleEdit} />
    </div>
  );
};

export default Page;
