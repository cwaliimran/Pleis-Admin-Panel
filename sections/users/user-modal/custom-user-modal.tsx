'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import ButtonLoading from '@/components/common/button-loading';
import { RHFSelectField } from '@/components/rhf';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGetOrganizationQuery } from '@/store/Reducer/organization';
import { useGetSuppliersQuery } from '@/store/Reducer/suppliers';
import { getErrorMessage } from '@/utils/api';
import { showError } from '@/utils/toast';
import CommonFields from './common-fields';
import { formatDobDMY, splitPhoneByDial } from './helpers';
import RoleSpecificFields from './role-specific-fields';
import { generateValidationSchema } from './validation';

type RoleKey = 'admin' | 'organizer' | 'manager' | 'staff' | 'guest' | 'user';

type Option = { value: string; label: string };

const roleOptionsFor = (userType?: string): Option[] => {
  if (userType === 'organizer') {
    return [
      { value: 'staff', label: 'Staff' },
      { value: 'user', label: 'User' },
    ];
  }
  return [
    { value: 'admin', label: 'Super Admin' },
    { value: 'organizer', label: 'Organizer' },
    { value: 'manager', label: 'Manager' },
    { value: 'staff', label: 'Staff' },
    { value: 'guest', label: 'Guest' },
    { value: 'user', label: 'User' },
  ];
};

const getDefaultRole = (userType?: string): RoleKey =>
  userType === 'organizer' ? 'staff' : 'manager';

const defaultValues = {
  role: '' as RoleKey,
  image: null,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  phoneCode: '',
  password: '',
  organizationName: '',
  companyName: '',
  oib: '',
  bankAccountNumber: '',
  representativeName: '',
  location: undefined,
  suppliers: [],
  organizations: [],
  modules: [],
  username: '',
  dob: null,
  gender: '',
};

interface UserModalProps {
  open: boolean;
  isEdit: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => void;
  userType?: string;
  initialData?: any; // Not used for create
}

const CustomUserModal: React.FC<UserModalProps> = ({
  open,
  isEdit,
  isLoading,
  onClose,
  onSubmit,
  userType,
}) => {
  const [currentRole, setCurrentRole] = React.useState<RoleKey>(
    getDefaultRole(userType)
  );

  const { data: orgData } = useGetOrganizationQuery({
    page: 0,
    search: '',
    limit: '10000',
    status: '',
  });

  const { data: supplierData } = useGetSuppliersQuery({
    page: 0,
    search: '',
    limit: '10000',
    status: '',
  });

  const organizationOptions = React.useMemo(
    () =>
      orgData?.data?.map((org: any) => ({
        value: org._id,
        label: org?.basicInfo?.name,
      })) || [],
    [orgData]
  );

  const supplierOptions = React.useMemo(
    () =>
      supplierData?.data?.map((sup: any) => ({
        value: sup._id,
        label: sup?.title,
      })) || [],
    [supplierData]
  );

  const resolver = React.useCallback(
    (values: any, context: any, options: any) =>
      yupResolver(generateValidationSchema(currentRole, isEdit))(
        values,
        context,
        options
      ),
    [currentRole, isEdit]
  );

  const methods = useForm({
    resolver,
    defaultValues: { ...defaultValues, role: currentRole },
    mode: 'onBlur',
    shouldUnregister: true,
  });

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = methods;
  console.log('formState', errors);

  const watchedRole = watch('role') as RoleKey;

  useEffect(() => {
    if (watchedRole && watchedRole !== currentRole) {
      setCurrentRole(watchedRole);
    }
  }, [watchedRole, currentRole]);

  useEffect(() => {
    reset({
      ...defaultValues,
      role: getDefaultRole(userType),
      location: undefined,
    });
    setCurrentRole(getDefaultRole(userType));
  }, [reset, userType]);

  const handleClose = () => {
    reset({ ...defaultValues, role: getDefaultRole(userType) });
    setCurrentRole(getDefaultRole(userType));
    onClose();
  };

  const submit = async (data: any) => {
    try {
      const { phone, phoneCode } = data;
      const phoneNumber = splitPhoneByDial(
        String(phone || ''),
        String(phoneCode || '')
      );

      let profileIcon = data.image;
      if (data.image instanceof FileList && data.image.length > 0) {
        profileIcon = data.image[0];
      } else if (
        Array.isArray(data.image) &&
        data.image.length > 0 &&
        data.image[0] instanceof File
      ) {
        profileIcon = data.image[0];
      }

      const base = {
        profileIcon: profileIcon || '',
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: {
          code: phoneNumber.code || '+92',
          number: phoneNumber.number || '',
        },
        ...(data.password && { password: data.password }),
      };

      let payload: any;

      switch (currentRole) {
        case 'admin':
          payload = { ...base, userType: 'admin' };
          break;
        case 'organizer':
          payload = {
            ...base,
            organizationName: data.organizationName,
            userType: 'organizer',
            companyDetails: {
              name: data.companyName,
              oib: data.oib,
              bankAccountNumber: data.bankAccountNumber,
              representativeName: data.representativeName,
              location: data.location || {
                coordinates: [0, 0],
                fullAddress: '',
                country: '',
                city: '',
                state: '',
                postalCode: '',
              },
              suppliers: data.suppliers || [],
            },
          };
          break;
        case 'manager':
          payload = {
            ...base,
            userType: 'manager',
            organizations: data.organizations || [],
          };
          break;
        case 'staff':
          payload = {
            ...base,
            userType: 'staff',
            organizations: data.organizations || [],
            modules: data.modules || [],
          };
          break;
        case 'guest':
          payload = { ...base, userType: 'guest' };
          break;
        case 'user':
          payload = {
            ...base,
            username: data.username,
            gender: data.gender,
            dob: data.dob ? formatDobDMY(new Date(data.dob)) : '',
            userType: 'user',
            organizations: data.organizations || [],
          };
          break;
      }

      // If payload has companyDetails and location, rename address to fullAddress
      if (
        payload?.companyDetails?.location &&
        payload.companyDetails.location.address
      ) {
        payload.companyDetails.location.fullAddress =
          payload.companyDetails.location.address;
        delete payload.companyDetails.location.address;
      }

      console.log('Submitted data from modal:', payload);
      onSubmit(payload);
    } catch (err) {
      console.log('Submission failed:', err);
      showError(getErrorMessage(err));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0" />
      <DialogContent
        aria-describedby={undefined}
        className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[50vh] w-full flex-col items-center overflow-y-auto md:!max-w-[640px]"
      >
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(submit)}
            className="mt-2 w-full space-y-4"
          >
            <RHFUploadAvatar
              name="image"
              label="Profile Image"
              initialImage={null}
            />

            <RHFSelectField
              name="role"
              label="Role"
              placeholder="Select Role"
              options={roleOptionsFor(userType)}
              onChange={(e) => setValue('role', e.target.value as RoleKey)}
            />

            <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
              <CommonFields mode="create" />
              <RoleSpecificFields
                role={currentRole}
                organizationOptions={organizationOptions}
                supplierOptions={supplierOptions}
                methods={methods}
              />
            </div>

            <div className="mt-1 flex justify-center gap-2">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/80 text-white"
                // disabled={!formState.isValid || isLoading}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ButtonLoading title="Creating" />
                ) : (
                  `Add ${currentRole}`
                )}
              </Button>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>

            <input type="hidden" {...methods.register('phoneCode')} />
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CustomUserModal;

// 'use client';

// import { yupResolver } from '@hookform/resolvers/yup';
// import React from 'react';
// import { FormProvider, useForm } from 'react-hook-form';

// import ButtonLoading from '@/components/common/button-loading';
// import { RHFSelectField } from '@/components/rhf';
// import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
// import { Button } from '@/components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogOverlay,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { useGetOrganizationQuery } from '@/store/Reducer/organization';
// import { useGetSuppliersQuery } from '@/store/Reducer/suppliers';
// import { getErrorMessage } from '@/utils/api';
// import { showError } from '@/utils/toast';
// import CommonFields from './common-fields'; // assume path
// import { formatDobDMY, splitPhoneByDial } from './helpers'; // assume path
// import RoleSpecificFields from './role-specific-fields'; // assume path
// import { generateValidationSchema } from './validation'; // assume path

// type RoleKey = 'admin' | 'organizer' | 'manager' | 'staff' | 'guest' | 'user';

// type Option = { value: string; label: string };

// const roleOptionsFor = (userType?: string): Option[] => {
//   if (userType === 'organizer') {
//     return [
//       { value: 'staff', label: 'Staff' },
//       { value: 'user', label: 'User' },
//     ];
//   }
//   return [
//     { value: 'admin', label: 'Super Admin' },
//     { value: 'organizer', label: 'Organizer' },
//     { value: 'manager', label: 'Manager' },
//     { value: 'staff', label: 'Staff' },
//     { value: 'guest', label: 'Guest' },
//     { value: 'user', label: 'User' },
//   ];
// };

// const getDefaultRole = (userType?: string): RoleKey =>
//   userType === 'organizer' ? 'staff' : 'manager';

// const defaultValues = {
//   role: '' as RoleKey,
//   image: null,
//   firstName: '',
//   lastName: '',
//   email: '',
//   phone: '',
//   phoneCode: '',
//   password: '',
//   organizationName: '',
//   companyName: '',
//   oib: '',
//   bankAccountNumber: '',
//   representativeName: '',
//   location: undefined,
//   suppliers: [],
//   organizations: [],
//   modules: [],
//   username: '',
//   dob: null,
//   gender: '',
// };

// interface UserModalProps {
//   open: boolean;
//   isEdit: boolean;
//   isLoading: boolean;
//   onClose: () => void;
//   onSubmit: (payload: any) => void;
//   userType?: string;
//   initialData?: any; // optional for edit mode
// }

// const CustomUserModal: React.FC<UserModalProps> = ({
//   open,
//   isEdit,
//   isLoading,
//   onClose,
//   onSubmit,
//   userType,
//   initialData,
// }) => {
//   const [currentRole, setCurrentRole] = React.useState<RoleKey>(
//     getDefaultRole(userType)
//   );

//   console.log("initialData", initialData);

//   const { data: orgData } = useGetOrganizationQuery({
//     page: 0,
//     search: '',
//     limit: '10000',
//     status: '',
//   });

//   const { data: supplierData } = useGetSuppliersQuery({
//     page: 0,
//     search: '',
//     limit: '10000',
//     status: '',
//   });

//   const organizationOptions = React.useMemo(
//     () =>
//       orgData?.data?.map((org: any) => ({
//         value: org._id,
//         label: org?.basicInfo?.name,
//       })) || [],
//     [orgData]
//   );

//   const supplierOptions = React.useMemo(
//     () =>
//       supplierData?.data?.map((sup: any) => ({
//         value: sup._id,
//         label: sup?.title,
//       })) || [],
//     [supplierData]
//   );

//   const resolver = React.useCallback(
//     (values: any, context: any, options: any) =>
//       yupResolver(generateValidationSchema(currentRole, isEdit))(
//         values,
//         context,
//         options
//       ),
//     [currentRole, isEdit]
//   );

//   const methods = useForm({
//     resolver,
//     defaultValues: { ...defaultValues, role: currentRole },
//     mode: 'onBlur',
//     shouldUnregister: true,
//   });

//   const { handleSubmit, watch, setValue, reset, formState } = methods;

//   const watchedRole = watch('role') as RoleKey;

//   React.useEffect(() => {
//     if (watchedRole && watchedRole !== currentRole) {
//       setCurrentRole(watchedRole);
//     }
//   }, [watchedRole, currentRole]);

//   React.useEffect(() => {
//     if (initialData) {
//       const formData = {
//         role: initialData.userType as RoleKey,
//         image: initialData.profileIcon || null,
//         firstName: initialData.firstName || '',
//         lastName: initialData.lastName || '',
//         email: initialData.email || '',
//         phone: initialData.phoneNumber
//           ? `${initialData.phoneNumber.code}${initialData.phoneNumber.number}`
//           : '',
//         phoneCode: initialData.phoneNumber?.code || '',
//         password: '', // don't prefill
//         organizationName: initialData.organizationName || '',
//         companyName: initialData.companyDetails?.name || '',
//         oib: initialData.companyDetails?.oib || '',
//         bankAccountNumber: initialData.companyDetails?.bankAccountNumber || '',
//         representativeName:
//           initialData.companyDetails?.representativeName || '',
//         location: initialData.companyDetails?.location
//           ? {
//               fullAddress:
//                 initialData.companyDetails.location.fullAddress || '',
//               state: initialData.companyDetails.location.state || '',
//               city: initialData.companyDetails.location.city || '',
//               postalCode: initialData.companyDetails.location.postalCode || '',
//               country: initialData.companyDetails.location.country || '',
//               coordinates: initialData.companyDetails.location.coordinates || [
//                 0, 0,
//               ],
//             }
//           : undefined,
//         suppliers: initialData.companyDetails?.suppliers || [],
//         organizations: initialData.organizations || [],
//         modules: initialData.modules || [],
//         username: initialData.username || '',
//         dob: initialData.dob ? new Date(initialData.dob) : null,
//         gender: initialData.gender || '',
//       };
//       reset(formData);
//       setCurrentRole(formData.role);
//     } else {
//       reset({
//         ...defaultValues,
//         role: getDefaultRole(userType),
//         location: undefined,
//       });
//       setCurrentRole(getDefaultRole(userType));
//     }
//   }, [initialData, reset, userType]);

//   const handleClose = () => {
//     reset({ ...defaultValues, role: getDefaultRole(userType) });
//     setCurrentRole(getDefaultRole(userType));
//     onClose();
//   };

//   const submit = async (data: any) => {
//     try {
//       const { phone, phoneCode } = data;
//       const phoneNumber = splitPhoneByDial(
//         String(phone || ''),
//         String(phoneCode || '')
//       );

//       // Extract the file from the image field if it's a FileList
//       let profileIcon = data.image;
//       if (data.image instanceof FileList && data.image.length > 0) {
//         profileIcon = data.image[0]; // Extract the first File object
//       } else if (
//         Array.isArray(data.image) &&
//         data.image.length > 0 &&
//         data.image[0] instanceof File
//       ) {
//         profileIcon = data.image[0]; // Extract the first File object from array
//       }

//       const base = {
//         profileIcon: profileIcon || '', // Pass the File object or existing URL
//         firstName: data.firstName,
//         lastName: data.lastName,
//         email: data.email,
//         phoneNumber: {
//           code: phoneNumber.code || '+92',
//           number: phoneNumber.number || '',
//         },
//         ...(data.password && { password: data.password }),
//       };

//       let payload: any;

//       switch (currentRole) {
//         case 'admin':
//           payload = { ...base, userType: 'admin' };
//           break;
//         case 'organizer':
//           payload = {
//             ...base,
//             organizationName: data.organizationName,
//             userType: 'organizer',
//             companyDetails: {
//               name: data.companyName,
//               oib: data.oib,
//               bankAccountNumber: data.bankAccountNumber,
//               representativeName: data.representativeName,
//               location: data.location || {
//                 coordinates: [0, 0],
//                 fullAddress: '',
//                 country: '',
//                 city: '',
//                 state: '',
//                 postalCode: '',
//               },
//               suppliers: data.suppliers || [],
//             },
//           };
//           break;
//         case 'manager':
//           payload = {
//             ...base,
//             userType: 'manager',
//             organizations: data.organizations || [],
//           };
//           break;
//         case 'staff':
//           payload = {
//             ...base,
//             userType: 'staff',
//             organizations: data.organizations || [],
//             modules: data.modules || [],
//           };
//           break;
//         case 'guest':
//           payload = { ...base, userType: 'guest' };
//           break;
//         case 'user':
//           payload = {
//             ...base,
//             username: data.username,
//             gender: data.gender,
//             dob: data.dob ? formatDobDMY(new Date(data.dob)) : '',
//             userType: 'user',
//             organizations: data.organizations || [],
//           };
//           break;
//       }

//       console.log('Submitted data from modal:', payload); // Debug the data being sent
//       onSubmit(payload);
//     } catch (err) {
//       console.log('Submission failed:', err);
//       showError(getErrorMessage(err));
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={handleClose}>
//       <DialogOverlay className="bg-opacity-30 fixed inset-0" />
//       <DialogContent
//         aria-describedby={undefined}
//         className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[50vh] w-full flex-col items-center overflow-y-auto md:!max-w-[640px]"
//       >
//         <DialogHeader>
//           <DialogTitle>{!isEdit ? 'Create User' : 'Edit User'}</DialogTitle>
//         </DialogHeader>

//         <FormProvider {...methods}>
//           <form
//             onSubmit={handleSubmit(submit)}
//             className="mt-2 w-full space-y-4"
//           >
//             {/* <RHFUploadAvatar
//                             name="image"
//                             label="Profile Image"
//                             initialImage={
//                                 isEdit && typeof methods.getValues('image') === 'string' && methods.getValues('image') !== 'https://pleisstorage.blob.core.windows.net/pleisappcontainer/noimage.png'
//                                     ? methods.getValues('image')
//                                     : null
//                             }
//                         /> */}

//             <RHFUploadAvatar
//               name="image"
//               label="Profile Image"
//               initialImage={(() => {
//                 if (!isEdit) return null;
//                 const img =
//                   methods.getValues('image') &&
//                   typeof methods.getValues('image') === 'string'
//                     ? methods.getValues('image')
//                     : initialData?.profileIcon;
//                 if (
//                   !img ||
//                   img ===
//                     'https://pleisstorage.blob.core.windows.net/pleisappcontainer/noimage.png'
//                 ) {
//                   return null;
//                 }
//                 return img;
//               })()}
//             />

//             {/* <RHFUploadAvatar
//                             name="image"
//                             label="Profile Image"
//                             initialImage={
//                                 isEdit && typeof methods.getValues('image') === 'string' && methods.getValues('image') !== 'https://pleisstorage.blob.core.windows.net/pleisappcontainer/noimage.png'
//                                     ? methods.getValues('image')
//                                     : null
//                             }
//                         /> */}

//             <RHFSelectField
//               name="role"
//               label="Role"
//               placeholder="Select Role"
//               options={roleOptionsFor(userType)}
//               onChange={(e) => setValue('role', e.target.value as RoleKey)}
//             />

//             <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
//               <CommonFields />
//               <RoleSpecificFields
//                 role={currentRole}
//                 organizationOptions={organizationOptions}
//                 supplierOptions={supplierOptions}
//                 methods={methods}
//               />
//             </div>

//             <div className="mt-1 flex justify-center gap-2">
//               <Button
//                 type="submit"
//                 className="bg-primary hover:bg-primary/80 text-white"
//                 disabled={!formState.isValid || isLoading}
//               >
//                 {isLoading ? (
//                   <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
//                 ) : !isEdit ? (
//                   `Add ${currentRole}`
//                 ) : (
//                   `Update ${currentRole}`
//                 )}
//               </Button>
//               <Button type="button" variant="outline" onClick={handleClose}>
//                 Cancel
//               </Button>
//             </div>

//             <input type="hidden" {...methods.register('phoneCode')} />
//           </form>
//         </FormProvider>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CustomUserModal;
