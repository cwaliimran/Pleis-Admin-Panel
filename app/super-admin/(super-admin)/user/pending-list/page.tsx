"use client";
import Header from "@/app/common/header";
import ConfirmDialog from "@/components/comfirm-dialog/confirm-dialog";
import QueryDialog from "@/components/comfirm-dialog/query-dialog";
import { useBoolean } from "@/hooks/useBoolean";
import { UserTable } from "@/sections/users";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useForm } from "react-hook-form";
// import * as Yup from "yup";

// const defaultValues = {
//   image: null,
//   firstName: "",
//   lastName: "",
//   email: "",
//   role: "",
//   password: "",
//   address: "",
//   phone: "",
// };

const Page = () => {
  const openModal = useBoolean();
  //   const showPassword = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();
  const pendingModal = useBoolean();

  // const schema = Yup.object().shape({
  //   image: Yup.mixed().nullable(),
  //   firstName: Yup.string().required("First name is required"),
  //   lastName: Yup.string().required("Last name is required"),
  //   email: Yup.string().email("Invalid email").required("Email is required"),
  //   role: Yup.string().required("Role is required"),
  //   password: Yup.string()
  //     .min(6, "Password must be at least 6 characters")
  //     .required("Password is required"),
  //   address: Yup.string(),
  //   phone: Yup.string(),
  // });

  // const methods = useForm({
  //   resolver: yupResolver(schema),
  //   defaultValues: defaultValues,
  // });

  // const onSubmit = (data: any) => {};

  // const CloseModal = () => {
  //   methods.reset(defaultValues);
  //   openModal.onFalse();
  //   editModal.onFalse();
  // };

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

  const handlePending = (id: string) => {
    console.log("id", id);
    pendingModal.onTrue();
  };

  const onPending = () => {
    pendingModal.onFalse();
  };

  return (
    <div>
      <Header
        links={[
          { name: "Dashboard", href: "/super-admin" },
          { name: "Pending Users List", href: "" },
        ]}
      />
      <div></div>

      <QueryDialog
        open={pendingModal.value}
        title="Active User"
        content="Are you sure you want to active this user?"
        onClose={pendingModal.onFalse}
        onConfirm={onPending}
      />

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete User"
        content="Are you sure you want to delete this?"
        onClose={deleteModal.onFalse}
        onConfirm={onDelete}
      />

      <UserTable
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        pendingUser={true}
        handlePending={handlePending}
      />
    </div>
  );
};

export default Page;
