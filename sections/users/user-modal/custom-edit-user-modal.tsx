'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useEffect, useState } from 'react';
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
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { useGetOrganizationQuery } from '@/store/Reducer/organization';
import { useGetSuppliersQuery } from '@/store/Reducer/suppliers';
import {
  useUpdateUserForUserListMutation,
  useUpdateUserSuperAdminAndGuestMutation,
} from '@/store/Reducer/user-list';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { uploadFileToAzure } from '@/utils/fileUpload';
import { showError, showSuccess } from '@/utils/toast';
import CommonFields from './common-fields';
import { splitPhoneByDial } from './helpers';
import RoleSpecificFields from './role-specific-fields';
import { generateValidationSchema } from './validation';

type RoleKey = 'admin' | 'organizer' | 'manager' | 'staff' | 'guest' | 'user';

type Option = { value: string; label: string };

const roleOptionsFor = (parentUserType?: string): Option[] => {
  if (parentUserType === 'organizer') {
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

const defaultValues = {
  role: '' as RoleKey,
  image: null,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  phoneCode: '',
  organizationName: '',
  companyName: '',
  oib: '',
  bankAccountNumber: '',
  representativeName: '',
  location: {
    address: '',
    city: '',
    postalCode: '',
    country: '',
    coordinates: [0, 0],
  },
  suppliers: [] as string[],
  organizations: [] as string[],
  modules: [],
  username: '',
  dob: null,
  gender: '',
  status: 'active',
};

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  selectedId: string | null;
  userData?: any;
  onUpdateSuccess: (updatedUser: any) => void;
  isLoading: boolean;
  userType?: string;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  open,
  onClose,
  selectedId,
  userData,
  // onUpdateSuccess,
  isLoading,
  userType,
}) => {
  const [currentRole, setCurrentRole] = useState<RoleKey>(
    userData?.accountState?.userType || 'manager'
  );

  const [imageUploading, setImageUploading] = useState(false);

  const [updateUser, { isLoading: updateUserLoading }] = useUpdateUserForUserListMutation();
  const [updateUserSuperAdminAndGuest, { isLoading: updateUserSuperAdminAndGuestLoading }] = useUpdateUserSuperAdminAndGuestMutation();

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

  const resolver = useCallback(
    (values: any, context: any, options: any) =>
      yupResolver(generateValidationSchema(currentRole, true))(
        values,
        context,
        options
      ),
    [currentRole]
  );

  const methods = useForm<any>({
    resolver,
    defaultValues,
    mode: 'onChange',
    shouldUnregister: false,
  });

  const { handleSubmit, watch, reset } = methods;

  const watchedRole = watch('role', userData?.accountState?.userType || 'manager');

  const roleValue = roleOptionsFor(userType).some(
    (opt) => opt.value === watchedRole
  )
    ? (watchedRole as RoleKey)
    : ((userData?.accountState?.userType || 'manager') as RoleKey);

  useEffect(() => {
    if (roleValue && roleValue !== currentRole) {
      setCurrentRole(roleValue);
    }
  }, [roleValue, currentRole]);

  useEffect(() => {
    if (userData) {
      const formData = {
        role: userData?.accountState?.userType as RoleKey,
        image:
          userData?.basicInfo?.profileIcon !== noImageUrl
            ? userData?.basicInfo?.profileIcon
            : null,
        firstName: userData?.basicInfo?.firstName || '',
        lastName: userData?.basicInfo?.lastName || '',
        email: userData?.basicInfo?.email || '',
        phone: userData?.basicInfo?.phoneNumber
          ? `${userData?.basicInfo?.phoneNumber?.code}${userData?.basicInfo?.phoneNumber?.number}`
          : '',
        phoneCode: userData?.basicInfo?.phoneNumber?.code || '',
        organizationName: userData?.basicInfo?.organizationName || '',
        companyName: userData?.basicInfo?.companyDetails?.name || '',
        oib: userData?.basicInfo?.companyDetails?.oib || '',
        bankAccountNumber:
          userData?.basicInfo?.companyDetails?.bankAccountNumber || '',
        representativeName:
          userData?.basicInfo?.companyDetails?.representativeName || '',
        location: {
          address:
            userData?.basicInfo?.companyDetails?.location?.fullAddress || '',
          city: userData?.basicInfo?.companyDetails?.location?.city || '',
          postalCode:
            userData?.basicInfo?.companyDetails?.location?.postalCode || '',
          country: userData?.basicInfo?.companyDetails?.location?.country || '',
          coordinates: userData?.basicInfo?.companyDetails?.location
            ?.coordinates || [0, 0],
        },
        suppliers:
          userData?.basicInfo?.companyDetails?.suppliers?.map(
            (sup: any) => sup?._id
          ) || [],
        organizations:
          userData?.organizations?.map((org: any) => org?._id) || [],
        modules: userData?.organizations?.[0]?.staff?.[0]?.featuresAccess || [],
        username: userData?.basicInfo?.username || '',
        dob: userData?.basicInfo?.dob
          ? new Date(userData?.basicInfo?.dob)
          : null,
        gender: userData?.basicInfo?.gender || '',
        status: userData?.accountState?.status || 'active',
      };
      reset(formData);
      setCurrentRole(formData.role);
    }
  }, [userData, reset]);

  const handleClose = () => {
    // reset(defaultValues);
    // setCurrentRole('manager');
    onClose();
  };

  const submit = async (data: any) => {
    if (!selectedId) {
      showError('No user selected for update');
      return;
    }

    let uploadedFileKey: string | null = null;

    try {
      let profileIconUrl = userData?.basicInfo?.profileIcon || noImageUrl || noImageUrlDev;

      if (
        data.image === null &&
        userData?.basicInfo?.profileIcon !== noImageUrl
      ) {
        profileIconUrl = null;
      } else if (typeof data.image === 'string') {
        profileIconUrl = data.image;
      } else if (
        data.image &&
        (data.image instanceof FileList || Array.isArray(data.image))
      ) {
        const file = data.image[0];
        if (file) {
          setImageUploading(true);
          uploadedFileKey = await uploadFileToAzure(file);
          profileIconUrl = uploadedFileKey;
        }
      }

      const initialValues = userData || {};
      const payload: any = { id: selectedId };

      const compareAndAdd = (key: string, value: any, initialValue: any) => {
        if (key === 'image') {
          if (profileIconUrl !== initialValues.basicInfo?.profileIcon) {
            payload.profileIcon = profileIconUrl;
          }
        } else if (key === 'phone') {
          const phoneNumber = splitPhoneByDial(
            String(value || ''),
            String(data.phoneCode || '')
          );
          const initialPhone = initialValues.basicInfo?.phoneNumber || {};
          if (
            phoneNumber.number !== initialPhone.number ||
            phoneNumber.code !== initialPhone.code
          ) {
            payload.phoneNumber = phoneNumber;
          }
        } else if (key === 'location' && value) {
          if (
            JSON.stringify(value) !==
            JSON.stringify(initialValues.basicInfo?.companyDetails?.location)
          ) {
            payload.location = value;
          }
        } else if (Array.isArray(value)) {
          if (JSON.stringify(value) !== JSON.stringify(initialValue)) {
            payload[key] = value;
          }
        } else if (
          value !== initialValue &&
          value !== undefined &&
          value !== ''
        ) {
          payload[key] = value;
        }
      };

      // Base fields
      compareAndAdd(
        'firstName',
        data.firstName,
        initialValues.basicInfo?.firstName
      );
      compareAndAdd(
        'lastName',
        data.lastName,
        initialValues.basicInfo?.lastName
      );
      compareAndAdd('email', data.email, initialValues.basicInfo?.email);
      compareAndAdd('phone', data.phone, initialValues.basicInfo?.phoneNumber);
      compareAndAdd('image', data.image, initialValues.basicInfo?.profileIcon);
      compareAndAdd(
        'organizationName',
        data.organizationName,
        initialValues.basicInfo?.organizationName
      );
      compareAndAdd('status', data.status, initialValues.accountState?.status); // Compare status

      // Role-specific fields
      switch (currentRole) {
        case 'admin':
          payload.userType = 'admin';
          break;
        case 'organizer':
          payload.userType = 'organizer';
          compareAndAdd(
            'companyDetails',
            {
              name: data.companyName,
              oib: data.oib,
              bankAccountNumber: data.bankAccountNumber,
              representativeName: data.representativeName,
              location: {
                fullAddress: data.location.address,
                city: data.location.city,
                postalCode: data.location.postalCode,
                country: data.location.country,
                coordinates: data.location.coordinates,
              },
              suppliers: data.suppliers,
            },
            initialValues.basicInfo?.companyDetails
          );
          break;
        case 'manager':
          payload.userType = 'manager';
          compareAndAdd(
            'organizations',
            data.organizations,
            initialValues.organizations
          );
          break;
        case 'staff':
          payload.userType = 'staff';
          compareAndAdd(
            'organizations',
            data.organizations,
            initialValues.organizations
          );
          compareAndAdd('modules', data.modules, initialValues.modules);
          break;
        case 'guest':
          payload.userType = 'guest';
          break;
        case 'user':
          payload.userType = 'user';
          compareAndAdd('username', data.username, initialValues.username);
          compareAndAdd('gender', data.gender, initialValues.gender);
          compareAndAdd('dob', data.dob, initialValues.dob);
          compareAndAdd(
            'organizations',
            data.organizations,
            initialValues.organizations
          );
          break;
      }

      // Remove empty objects or arrays if no changes
      Object.keys(payload).forEach((key) => {
        if (
          typeof payload[key] === 'object' &&
          Object.keys(payload[key]).length === 0
        ) {
          delete payload[key];
        }
      });

      if (Object.keys(payload).length <= 1) {
        showError('No changes detected to update');
        return;
      }

      let response;
      if (payload.userType === 'admin' || payload.userType === 'guest') {
        response = await updateUserSuperAdminAndGuest(payload).unwrap();
      } else {
        response = await updateUser(payload).unwrap();
      }

      if (!response) {
        throw new Error('No response from server. Please try again later.');
      }

      if (response.error) {
        throw new Error(getErrorMessage(response.error));
      }

      handleClose();
      if (response?.message) {
        showSuccess(response?.message || 'Updated successfully');
      }
    } catch (error) {
      console.log('Update failed:', error);
      showError(getErrorMessage(error));

      if (uploadedFileKey) {
        await deleteFileFromAzure(uploadedFileKey);
      }
    } finally {
      setImageUploading(false);
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
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(submit)}
            className="mt-2 w-full space-y-4"
          >
            <RHFUploadAvatar
              name="image"
              label="Profile Image"
              initialImage={(() => {
                const img = userData?.basicInfo?.profileIcon;
                if (img && img !== noImageUrl) {
                  return img;
                }
                return null;
              })()}
            />

            <RHFSelectField
              name="role"
              label="Role"
              placeholder="Select Role"
              options={roleOptionsFor(userType)}
              disabled={true}
            />

            <RHFSelectField
              name="status"
              label="Status"
              placeholder="Select Status"
              options={[
                { value: 'active', label: 'Active' },
                { value: 'suspended', label: 'Suspended' },
                ...(userData?.accountState?.userType === 'organizer' && userData?.accountState?.status === 'pending'
                  ? [{ value: 'pending', label: 'Pending' }]
                  : []),
              ]}
            />

            <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
              <CommonFields mode="edit" />
              <RoleSpecificFields
                role={currentRole}
                organizationOptions={organizationOptions}
                supplierOptions={supplierOptions}
                methods={methods}
              />
            </div>

            <div className="mt-6 flex justify-center gap-2">
              {isLoading ||
              imageUploading ||
              updateUserLoading ||
              updateUserSuperAdminAndGuestLoading ? (
                <Button
                  type="button"
                  className="bg-primary/80 cursor-not-allowed text-white"
                >
                  <ButtonLoading title="Updating" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/80 text-white"
                >
                  Update
                </Button>
              )}

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

export default EditUserModal;
