import { useBoolean } from "@/hooks/useBoolean";
import { useRouter } from "next/navigation";
import { EventTable } from "../event";

const UserEvents = () => {
  const router = useRouter();
  const deleteModal = useBoolean();

  const handleEdit = (id: string) => {
    router.push("/super-admin/events/create-event");
  };

  const handleDelete = (id: string) => {
    deleteModal.onTrue();
  };
  const onDelete = () => {
    deleteModal.onFalse();
  };

  return (
    <>
      <EventTable handleDelete={handleDelete} />
    </>
  );
};

export default UserEvents;
