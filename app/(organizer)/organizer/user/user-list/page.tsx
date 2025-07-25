// "use client"
// import Header from '@/app/common/header'
// import Superadminheader from '@/app/common/superadminheader'
// import { Button } from '@/components/ui/button'
// import { Plus } from 'lucide-react'
// import React from 'react'
// import FormProvider, { RHFDate, RHFSelectField, RHFTextField } from '@/components/rhf'
// import { useForm } from 'react-hook-form'
// import * as Yup from 'yup'
// import { yupResolver } from '@hookform/resolvers/yup'
// import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog'
// import { useBoolean } from '@/hooks/useBoolean'
// import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar'
// import { UserTable } from '@/sections/users'
// import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog'

// const defaultValues = {
//     image: null,
//     firstName: '',
//     lastName: '',
//     email: '',
//     role: '',
//     password: '',
//     address: '',
//     phone: ''
// }

// const Page = () => {

//     const openModal = useBoolean();
//     const showPassword = useBoolean();
//     const editModal = useBoolean();
//     const deleteModal = useBoolean();

//     const schema = Yup.object().shape({
//         image: Yup.mixed().nullable(),
//         firstName: Yup.string().required("First name is required"),
//         lastName: Yup.string().required("Last name is required"),
//         email: Yup.string().email("Invalid email").required("Email is required"),
//         role: Yup.string().required("Role is required"),
//         password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
//         address: Yup.string(),
//         phone: Yup.string(),
//     })

//     const methods = useForm({
//         resolver: yupResolver(schema),
//         defaultValues: defaultValues
//     })

//     const onSubmit = (data: any) => {
//     }
//     const CloseModal = () => {
//         methods.reset(defaultValues);
//         openModal.onFalse();
//         editModal.onFalse();
//     }
//     const handleEdit = (id: string) => {
//         openModal.onTrue();
//         editModal.onTrue();
//     }

//     const handleDelete = (id: string) => {
//         deleteModal.onTrue();
//     }
//     const onDelete = () => {
//         deleteModal.onFalse();
//     }

//     return (
//         <div>
//             <Header
//                 links={[
//                     { name: "Dashboard", href: "/organizer/dashboard" },
//                     { name: "Users", href: "" },
//                 ]}
//             />
//             <div>
//                 <div className=' w-full flex items-center justify-end md:mt-0 mt-4'>
//                     <Button className='rounded-4xl py-2 bg-primary cursor-pointer text-white hover:bg-primary' onClick={openModal.onTrue}>
//                         <Plus className='' />
//                         Create User
//                     </Button>
//                 </div>
//             </div>
//             {/* dialog for add and update the user */}
//             <Dialog open={openModal.value} onOpenChange={CloseModal}>
//                 <DialogOverlay
//                     className="fixed inset-0 bg-white bg-opacity-30 flex items-center justify-center md:w-lg w-full">
//                     <DialogContent className=' dark:bg-[#171717]'>
//                         <DialogHeader>
//                             <DialogTitle> {!editModal.value ? "Create User" : "Edit User"} </DialogTitle>
//                         </DialogHeader>
//                         <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
//                             <div className="flex flex-col gap-3 mt-4">
//                                 <RHFUploadAvatar name="image" label="Profile Image" />
//                                 <div className='grid md:grid-cols-2 grid-cols-1 gap-4 items-start'>
//                                     <RHFTextField
//                                         name='firstName'
//                                         label='First Name'
//                                         placeholder='Enter First Name'
//                                         className={` ${methods.formState.errors.firstName ? 'border-red-400' : ''}`}

//                                     />
//                                     <RHFTextField
//                                         name='lastName'
//                                         label='Last Name'
//                                         placeholder='Enter Last Name'
//                                         className={` ${methods.formState.errors.lastName ? 'border-red-400' : ''}`}
//                                     />
//                                 </div>
//                                 <RHFTextField
//                                     name='email'
//                                     label='Email'
//                                     placeholder='Enter Email'
//                                     className={` ${methods.formState.errors.email ? 'border-red-400' : ''}`}
//                                 />
//                                 <RHFTextField
//                                     name='password'
//                                     label='Password'
//                                     type='password'
//                                     placeholder='Enter Password'
//                                     showPassword={showPassword.value}
//                                     onTogglePassword={showPassword.onToggle}
//                                     className={` ${methods.formState.errors.password ? 'border-red-400' : ''}`}
//                                 />
//                                 <RHFSelectField
//                                     name='role'
//                                     label='Role'
//                                     placeholder='Select Role'
//                                     options={[
//                                         { value: "User", label: "User" },
//                                         { value: 'Admin', label: 'Admin' },
//                                         { value: 'Manager', label: 'Manager' },
//                                         { value: 'Superadmin', label: 'Superadmin' },
//                                         { value: 'Staff', label: 'Staff' }
//                                     ]}
//                                 />

//                                 <div className=' grid md:grid-cols-2 grid-cols-1 gap-4'>
//                                     <RHFTextField
//                                         name='phone'
//                                         label='Phone'
//                                         placeholder='Enter Phone Number'
//                                     />
//                                     <RHFTextField
//                                         name='address'
//                                         label='Address'
//                                         placeholder='Enter Address'
//                                     />
//                                 </div>

//                                 <div className='flex justify-end gap-2'>
//                                     <Button type='submit' className='bg-primary text-white hover:bg-primary cursor-pointer'>
//                                         {!editModal.value ? "Add User" : "Update User"}
//                                     </Button>
//                                 </div>
//                             </div>
//                         </FormProvider>

//                     </DialogContent>
//                 </DialogOverlay>
//             </Dialog>
//             {/* dialog for delete the user */}
//             <ConfirmDialog
//                 open={deleteModal.value}
//                 title="Delete User"
//                 content="Are you sure you want to delete this?"
//                 onClose={deleteModal.onFalse}
//                 onConfirm={onDelete}
//             />
//             <UserTable handleDelete={handleDelete} handleEdit={handleEdit} pendingUser={false} />
//         </div >
//     )
// }

// export default Page

"use client";
import Header from "@/app/common/header";
import ConfirmDialog from "@/components/comfirm-dialog/confirm-dialog";
import FormProvider, {
  RHFDate,
  RHFSelectField,
  RHFTextField,
} from "@/components/rhf";
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
import { UserTable } from "@/sections/users";
import { yupResolver } from "@hookform/resolvers/yup";
import { Plus } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const defaultValues = {
  image: null,
  firstName: "",
  lastName: "",
  name: "",
  surname: "",
  username: "",
  email: "",
  role: "Manager", // Default role set to Manager
  password: "",
  address: "",
  phone: "",
  companyName: "",
  oib: "",
  bankAccountNo: "",
  bankAccountName: "",
  representativeFullName: "",
  postalCode: "",
  city: "",
  country: "",
  listOfSupplier: "",
  linkedOrganization: "",
  moduleAccess: "",
  dateOfBirth: null,
  gender: "",
};

const Page = () => {
  const openModal = useBoolean();
  const showPassword = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  // Role-based field configuration
  // Super Admin: firstName, lastName, email, phone, password
  // Admin: firstName, lastName, email, password, phone, companyName, oib, bankAccountNo, bankAccountName, representativeFullName, address, postalCode, city, country, listOfSupplier
  // Manager: firstName, lastName, email, password, phone
  // Staff: name, surname, email, phone, password, image, linkedOrganization, moduleAccess
  // User: name, surname, username, email, phone, dateOfBirth, gender, password

  const roleFieldsConfig = {
    Superadmin: ["firstName", "lastName", "email", "phone", "password"],
    Admin: [
      "firstName",
      "lastName",
      "email",
      "password",
      "phone",
      "companyName",
      "oib",
      "bankAccountNo",
      "bankAccountName",
      "postalCode",
      "representativeFullName",
      "address",
      "city",
      "country",
      "listOfSupplier",
    ],
    Manager: ["firstName", "lastName", "email", "phone", "password"],
    Staff: [
      "name",
      "surname",
      "email",
      "phone",
      "password",
      "image",
      "linkedOrganization",
      "moduleAccess",
    ],
    User: [
      "name",
      "surname",
      "username",
      "email",
      "phone",
      "dateOfBirth",
      "gender",
      "password",
    ],
  };

  // Dynamic schema generation based on role
  const generateSchema = (role: string) => {
    const baseSchema: any = {};
    const fields =
      roleFieldsConfig[role as keyof typeof roleFieldsConfig] || [];

    fields.forEach((field) => {
      switch (field) {
        case "firstName":
        case "lastName":
        case "name":
        case "surname":
          baseSchema[field] = Yup.string().required(
            `${field.replace(/([A-Z])/g, " $1").toLowerCase()} is required`
          );
          break;
        case "username":
          baseSchema[field] = Yup.string().required("Username is required");
          break;
        case "email":
          baseSchema[field] = Yup.string()
            .email("Invalid email")
            .required("Email is required");
          break;
        case "password":
          baseSchema[field] = Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required");
          break;
        case "phone":
          baseSchema[field] = Yup.string().required("Phone is required");
          break;
        case "companyName":
          baseSchema[field] = Yup.string().required("Company name is required");
          break;
        case "oib":
          baseSchema[field] = Yup.string().required("OIB is required");
          break;
        case "bankAccountNo":
          baseSchema[field] = Yup.string().required(
            "Bank account number is required"
          );
          break;
        case "bankAccountName":
          baseSchema[field] = Yup.string().required(
            "Bank account name is required"
          );
          break;
        case "representativeFullName":
          baseSchema[field] = Yup.string().required(
            "Representative full name is required"
          );
          break;
        case "address":
          baseSchema[field] = Yup.string().required("Address is required");
          break;
        case "postalCode":
          baseSchema[field] = Yup.string().required("Postal code is required");
          break;
        case "city":
          baseSchema[field] = Yup.string().required("City is required");
          break;
        case "country":
          baseSchema[field] = Yup.string().required("Country is required");
          break;
        case "listOfSupplier":
          baseSchema[field] = Yup.string();
          break;
        case "linkedOrganization":
          baseSchema[field] = Yup.string().required(
            "Linked organization is required"
          );
          break;
        case "moduleAccess":
          baseSchema[field] = Yup.string().required(
            "Module access is required"
          );
          break;
        case "dateOfBirth":
          baseSchema[field] = Yup.date().required("Date of birth is required");
          break;
        case "gender":
          baseSchema[field] = Yup.string().required("Gender is required");
          break;
        case "image":
          baseSchema[field] = Yup.mixed().nullable();
          break;
        default:
          baseSchema[field] = Yup.string();
      }
    });

    baseSchema.role = Yup.string().required("Role is required");
    return Yup.object().shape(baseSchema);
  };

  const methods = useForm({
    resolver: yupResolver(generateSchema(defaultValues.role)),
    defaultValues: defaultValues,
  });

  const watchedRole = methods.watch("role");

  // Update form validation when role changes
  React.useEffect(() => {
    // const newSchema = generateSchema(watchedRole || "Manager");
    methods.clearErrors();
  }, [watchedRole, methods]);

  // Helper function to render fields based on role
  const renderFieldsByRole = (role: string) => {
    const fields =
      roleFieldsConfig[role as keyof typeof roleFieldsConfig] || [];
    const fieldComponents: React.ReactElement[] = [];

    fields.forEach((field) => {
      switch (field) {
        case "image":
          fieldComponents.push(
            <RHFUploadAvatar key={field} name="image" label="Profile Image" />
          );
          break;
        case "firstName":
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="firstName"
              label="First Name"
              placeholder="Enter First Name"
              className={`${
                methods.formState.errors.firstName ? "border-red-400" : ""
              }`}
            />
          );
          break;
        case "lastName":
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="lastName"
              label="Last Name"
              placeholder="Enter Last Name"
              className={`${
                methods.formState.errors.lastName ? "border-red-400" : ""
              }`}
            />
          );
          break;
        case "name":
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="name"
              label="Name"
              placeholder="Enter Name"
              className={`${
                methods.formState.errors.name ? "border-red-400" : ""
              }`}
            />
          );
          break;
        case "surname":
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="surname"
              label="Surname"
              placeholder="Enter Surname"
              className={`${
                methods.formState.errors.surname ? "border-red-400" : ""
              }`}
            />
          );
          break;
        case "username":
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="username"
              label="Username"
              placeholder="Enter Username"
              className={`${
                methods.formState.errors.username ? "border-red-400" : ""
              }`}
            />
          );
          break;
        case "email":
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="email"
              label="Email"
              placeholder="Enter Email"
              className={`${
                methods.formState.errors.email ? "border-red-400" : ""
              }`}
            />
          );
          break;
        case "phone":
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="phone"
              label="Phone"
              placeholder="Enter Phone Number"
              className={`${
                methods.formState.errors.phone ? "border-red-400" : ""
              }`}
            />
          );
          break;
        case "password":
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="password"
              label="Password"
              type="password"
              placeholder="Enter Password"
              showPassword={showPassword.value}
              onTogglePassword={showPassword.onToggle}
              className={`${
                methods.formState.errors.password ? "border-red-400" : ""
              }`}
            />
          );
          break;
        case "companyName":
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="companyName"
              label="Company Name"
              placeholder="Enter Company Name"
              className={`${
                methods.formState.errors.companyName ? "border-red-400" : ""
              }`}
            />
          );
          break;
        case "oib":
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="oib"
              label="OIB"
              placeholder="Enter OIB"
              className={`${
                methods.formState.errors.oib ? "border-red-400" : ""
              }`}
            />
          );
          break;
        case "bankAccountNo":
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="bankAccountNo"
              label="Bank Account No"
              placeholder="Enter Bank Account No"
              className={`${
                methods.formState.errors.bankAccountNo ? "border-red-400" : ""
              }`}
            />
          );
          break;
        case "bankAccountName":
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="bankAccountName"
              label="Bank Account Name"
              placeholder="Enter Bank Account Name"
              className={`${
                methods.formState.errors.bankAccountName ? "border-red-400" : ""
              }`}
            />
          );
          break;
        case "representativeFullName":
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="representativeFullName"
              label="Representative Full Name"
              placeholder="Enter Representative Full Name"
              className={`${
                methods.formState.errors.representativeFullName
                  ? "border-red-400"
                  : ""
              }`}
            />
          );
          break;
        case "address":
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="address"
              label="Address"
              placeholder="Enter Address"
              className={`${
                methods.formState.errors.address ? "border-red-400" : ""
              }`}
            />
          );
          break;
        case "postalCode":
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="postalCode"
              label="Postal Code"
              placeholder="Enter Postal Code"
              className={`${
                methods.formState.errors.postalCode ? "border-red-400" : ""
              }`}
            />
          );
          break;
        case "city":
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="city"
              label="City"
              placeholder="Enter City"
              className={`${
                methods.formState.errors.city ? "border-red-400" : ""
              }`}
            />
          );
          break;
        case "country":
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="country"
              label="Country"
              placeholder="Enter Country"
              className={`${
                methods.formState.errors.country ? "border-red-400" : ""
              }`}
            />
          );
          break;
        case "listOfSupplier":
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="listOfSupplier"
              label="List of Supplier"
              placeholder="Enter List of Supplier"
              rows={3}
              multiline
            />
          );
          break;
        case "linkedOrganization":
          fieldComponents.push(
            <RHFSelectField
              key={field}
              name="linkedOrganization"
              label="Linked Organization"
              placeholder="Select Organization"
              options={[
                { value: "org1", label: "Organization 1" },
                { value: "org2", label: "Organization 2" },
                { value: "org3", label: "Organization 3" },
              ]}
              className={`${
                methods.formState.errors.linkedOrganization
                  ? "border-red-400"
                  : ""
              }`}
            />
          );
          break;
        case "moduleAccess":
          fieldComponents.push(
            <RHFSelectField
              key={field}
              name="moduleAccess"
              label="Module Access"
              placeholder="Select Module Access"
              options={[
                { value: "full", label: "Full Access" },
                { value: "limited", label: "Limited Access" },
                { value: "readonly", label: "Read Only" },
              ]}
              className={`${
                methods.formState.errors.moduleAccess ? "border-red-400" : ""
              }`}
            />
          );
          break;
        case "dateOfBirth":
          fieldComponents.push(
            <RHFDate
              key={field}
              name="dateOfBirth"
              label="Date of Birth"
              className={`${
                methods.formState.errors.dateOfBirth ? "border-red-400" : ""
              }`}
            />
          );
          break;
        case "gender":
          fieldComponents.push(
            <RHFSelectField
              key={field}
              name="gender"
              label="Gender"
              placeholder="Select Gender"
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
              className={`${
                methods.formState.errors.gender ? "border-red-400" : ""
              }`}
            />
          );
          break;
        default:
          break;
      }
    });

    return fieldComponents;
  };

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
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
          { name: "Users", href: "" },
        ]}
      />
      <div>
        <div className=" w-full flex items-center justify-end">
          <Button
            className="rounded-4xl py-2 bg-blue-700 cursor-pointer text-white hover:bg-blue-800"
            onClick={openModal.onTrue}
          >
            <Plus className="" />
            Create User
          </Button>
        </div>
      </div>
      {/* dialog for add and update the user */}
      <Dialog open={openModal.value} onOpenChange={CloseModal}>
        <DialogOverlay className="fixed inset-0 bg-white bg-opacity-30">
          <DialogContent className="md:!max-w-[520px] mx-auto min-h-[50vh] max-h-[90vh] w-full overflow-y-auto flex flex-col items-center">
            <DialogHeader>
              <DialogTitle>
                {" "}
                {!editModal.value ? "Create User" : "Edit User"}{" "}
              </DialogTitle>
            </DialogHeader>
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-3 mt-4">
                <RHFUploadAvatar name="image" label="Profile Image" />

                <RHFSelectField
                  name="role"
                  label="Role"
                  placeholder="Select Role"
                  options={[
                    { value: "Superadmin", label: "Super Admin" },
                    { value: "Admin", label: "Organizer" },
                    { value: "Manager", label: "Manager" },
                    { value: "Staff", label: "Staff" },
                    { value: "User", label: "User" },
                  ]}
                />

                {/* Dynamic Fields Grid */}
                <div className="grid md:grid-cols-2 grid-cols-1 gap-4 items-start">
                  {renderFieldsByRole(watchedRole).map((field) => {
                    // Skip image field as it's handled separately above
                    if (field.key === "image") return null;

                    // Full width fields
                    const fullWidthFields = [
                      "address",
                      "listOfSupplier",
                      "representativeFullName",
                    ];
                    if (fullWidthFields.includes(field.key as string)) {
                      return (
                        <div key={field.key} className="md:col-span-2">
                          {field}
                        </div>
                      );
                    }

                    return field;
                  })}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="submit"
                    className="bg-blue-700 text-white hover:bg-blue-800 cursor-pointer"
                  >
                    {!editModal.value ? "Add User" : "Update User"}
                  </Button>
                </div>
              </div>
            </FormProvider>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
      {/* dialog for delete the user */}
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
        pendingUser={false}
      />
    </div>
  );
};

export default Page;
