"use client";
import ConfirmDialog from "@/components/comfirm-dialog/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useBoolean } from "@/hooks/useBoolean";
import { EventTable } from "@/sections/event";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const EventList = () => {
  const router = useRouter();
  const deleteModal = useBoolean();

  const handleEdit = (id: string) => {
    console.log("id", id);
    router.push("/super-admin/events/create-event");
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
      <div className=" w-full flex items-center justify-end md:mt-0 mt-3">
        <Button
          className="rounded-4xl py-2 bg-primary cursor-pointer text-white hover:bg-primary/80"
          onClick={() => router.push("/super-admin/events/create-event")}
        >
          <Plus className="" />
          Create Event
        </Button>
      </div>

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Event"
        content="Are you sure you want to delete this event?"
        onClose={deleteModal.onFalse}
        onConfirm={onDelete}
      />

      {/* ------------- EVENT TABLE ------------- */}
      <EventTable handleDelete={handleDelete} handleEdit={handleEdit} />
    </div>
  );
};

export default EventList;
