"use client";
import Header from "@/app/common/header";
import ConfirmDialog from "@/components/comfirm-dialog/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useBoolean } from "@/hooks/useBoolean";
import OrganizationTable from "@/sections/organization/organizationTable";
// import { yupResolver } from "@hookform/resolvers/yup";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import * as Yup from "yup";

// const defaultValues = {
//   image: null,
//   name: "",
//   email: "",
//   phone: "",
//   region: "",
//   type: "",
//   category: "",
//   location: "",
//   city: "",
//   country: "",
//   description: "",
//   instagram: "",
//   facebook: "",
//   youtube: "",
//   linkedin: "",
//   commission: "",
//   businessId: "",
//   companyName: "",
//   accountName: "",
//   accountNumber: "",
//   oib: "",
//   address: "",
//   postalCode: "",
//   bankCity: "",
//   bankCountry: "",
// };

// const tabOptions = [
//   { label: "Basic Info", value: "basicInfo" },
//   { label: "Social Links", value: "socialLinks" },
//   { label: "Business Details", value: "businessDetails" },
//   { label: "Bank Details", value: "bankDetails" },
// ];

// const schema = Yup.object().shape({
//   //  Basic Info
//   image: Yup.mixed().nullable(),
//   name: Yup.string().required("Organization name is required"),
//   email: Yup.string().email("Invalid email"),
//   phone: Yup.string(),
//   region: Yup.string(),
//   type: Yup.string(),
//   category: Yup.string(),
//   location: Yup.string().required("Location is required"),
//   city: Yup.string(),
//   country: Yup.string(),
//   description: Yup.string(),

//   // Social Links
//   instagram: Yup.string().url("Invalid Instagram URL").nullable().notRequired(),
//   facebook: Yup.string().url("Invalid Facebook URL").nullable().notRequired(),
//   youtube: Yup.string().url("Invalid YouTube URL").nullable().notRequired(),
//   linkedin: Yup.string().url("Invalid LinkedIn URL").nullable().notRequired(),

//   //  Business Details
//   commission: Yup.string(),
//   businessId: Yup.string(),

//   //  Bank Details
//   companyName: Yup.string(),
//   accountName: Yup.string(),
//   accountNumber: Yup.string(),
//   oib: Yup.string(),
//   address: Yup.string(),
//   postalCode: Yup.string(),
//   bankCity: Yup.string(),
//   bankCountry: Yup.string(),
// });

const Page = () => {
  const router = useRouter();
  //   const openModal = useBoolean();
  //   const editModal = useBoolean();
  const deleteModal = useBoolean();
  //   const [activeTab, setActiveTab] = useState("basicInfo");

  //   const methods = useForm({
  //     resolver: yupResolver(schema),
  //     defaultValues: defaultValues,
  //   });

  //   const onSubmit = (data: any) => {
  //     console.log("data", data);
  //   };

  //   const CloseModal = () => {
  //     methods.reset(defaultValues);
  //     openModal.onFalse();
  //     editModal.onFalse();
  //   };

  //   const handleNextTab = async () => {
  //     if (activeTab === "basicInfo") {
  //       const isValid = await methods.trigger(["name", "location"]);
  //       if (!isValid) {
  //         return;
  //       }
  //       setActiveTab("socialLinks");
  //     } else if (activeTab === "socialLinks") {
  //       setActiveTab("businessDetails");
  //     } else if (activeTab === "businessDetails") {
  //       setActiveTab("bankDetails");
  //     }
  //   };

  const handleEdit = (id: string) => {
    console.log("id", id);
    router.push("/super-admin/organization/create-organization");
    // openModal.onTrue();
    // editModal.onTrue();
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
          { name: "Organizations", href: "" },
        ]}
      />
      <div>
        <div className=" w-full flex items-center justify-end md:mt-0 mt-3">
          <Button
            className="rounded-4xl py-2 bg-primary cursor-pointer hover:bg-primary/80 text-white"
            onClick={() =>
              router.push("/organizer/organization/create-organization")
            }
          >
            <Plus className="" />
            Create Organization
          </Button>
        </div>
      </div>

      {/* dialog for delete the organization */}
      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Organization"
        content="Are you sure you want to delete this?"
        onClose={deleteModal.onFalse}
        onConfirm={onDelete}
      />
      
      <OrganizationTable
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        userType="organizer"
      />
    </div>
  );
};

export default Page;
