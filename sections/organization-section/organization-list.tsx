"use client";

import ConfirmDialog from "@/components/comfirm-dialog/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useBoolean } from "@/hooks/useBoolean";
import OrganizationTable from "@/sections/organization/organizationTable";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

type OrganizationListProps = {
  userType?: "organizer" | "super-admin";
};

const OrganizationList = ({ userType }: OrganizationListProps) => {
  const router = useRouter();
  const deleteModal = useBoolean();

  const handleDelete = (id: string) => {
    console.log("id", id);
    deleteModal.onTrue();
  };

  const onDelete = () => {
    deleteModal.onFalse();
  };

  const handleNavigateToCreate = () => {
    if (userType === "super-admin") {
      router.push("/super-admin/organization/create-organization");
    } else {
      router.push("/organizer/organization/create-organization");
    }
  };

  return (
    <div>
      <div className=" w-full flex items-center justify-end">
        <Button
          className="rounded-4xl py-2 bg-primary cursor-pointer hover:bg-primary/80 md:mt-0 mt-4 text-white"
          onClick={handleNavigateToCreate}
        >
          <Plus />
          Create Organization
        </Button>
      </div>

      {/* -------------- OrganizationTable -------------- */}
      <OrganizationTable handleDelete={handleDelete} userType={userType} />

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Organization"
        content="Are you sure you want to delete this?"
        onClose={deleteModal.onFalse}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default OrganizationList;
