"use client";
import Header from "@/app/common/header";
import ConfirmDialog from "@/components/comfirm-dialog/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useBoolean } from "@/hooks/useBoolean";
import { EventTable } from "@/sections/event";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
// import * as Yup from "yup";

// const defaultValues = {
//   image: null,
//   name: "",
//   venue: [],
//   category: [],
//   tag: [],
//   organization: "",
//   fromDate: new Date(),
//   endDate: new Date(),
//   description: "",
// };

const Page = () => {
  const router = useRouter();
  // const openModal = useBoolean();
  // const editModal = useBoolean();
  const deleteModal = useBoolean();

  // const schema = Yup.object().shape({
  //   image: Yup.mixed().nullable(),
  //   name: Yup.string().required("Event name is required"),
  //   venue: Yup.array()
  //     .min(1, "At least one Venue is required")
  //     .of(Yup.string().required("Venue is required")),
  //   category: Yup.array()
  //     .min(1, "At least one Category is required")
  //     .of(Yup.string().required("Category is required")),
  //   tag: Yup.array()
  //     .min(1, "At least one Tag is required")
  //     .of(Yup.string().required("Tag is required")),
  //   organization: Yup.string().required("Organization is required"),
  //   fromDate: Yup.date().required("From Date is required"),
  //   endDate: Yup.date().required("End Date is required"),
  //   description: Yup.string().required("Description is required"),
  // });

  // const methods = useForm({
  //   resolver: yupResolver(schema),
  //   defaultValues: defaultValues,
  // });

  // const onSubmit = (data: any) => {
  //   console.log("Form submitted with data:", data);
  // };

  //   const CloseModal = () => {
  //     methods.reset(defaultValues);
  //     openModal.onFalse();
  //     editModal.onFalse();
  //   };

  const handleEdit = () => {
    // openModal.onTrue();
    // editModal.onTrue();
    router.push("/organizer/events/create-event");
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
          { name: "Dashboard", href: "/organizer/dashboard" },
          { name: "Events", href: "" },
        ]}
      />
      <div>
        <div className=" w-full flex items-center justify-end md:mt-0 mt-3">
          <Button
            className="rounded-4xl py-2 bg-primary cursor-pointer text-white hover:bg-primary"
            onClick={() => router.push("/organizer/events/create-event")}
          >
            <Plus className="" />
            Create Event
          </Button>
        </div>
      </div>
      {/* modal for add and update the event */}

      {/* modal for delete the enven */}
      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Event"
        content="Are you sure you want to delete this?"
        onClose={deleteModal.onFalse}
        onConfirm={onDelete}
      />

      <EventTable
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        userType="organizer"
      />
    </div>
  );
};

export default Page;
