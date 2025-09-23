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
      { value: 'manager', label: 'Manager' },
      { value: 'staff', label: 'Staff' },
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
  location: {
    fullAddress: '',
    country: '',
    city: '',
    state: '',
    postalCode: '',
  },
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

  const { data: supplierData, isLoading: supplierLoading } = useGetSuppliersQuery({
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

  const { handleSubmit, watch, setValue, reset } = methods;

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
              location: {
                coordinates: [0, 0], // Default coordinates since we're not using Google Places
                fullAddress: data.location?.fullAddress || '',
                country: data.location?.country || '',
                city: data.location?.city || '',
                state: data.location?.state || '',
                postalCode: data.location?.postalCode || '',
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

      onSubmit(payload);
    } catch (err) {
      console.log('Submission failed:', err);
      showError(getErrorMessage(err));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0" />
      {/* <DialogContent
        aria-describedby={undefined}
        className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[50vh] w-full flex-col items-center overflow-y-auto md:!max-w-[640px]"
      > */}
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
                supplierLoading={supplierLoading}
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
                  <ButtonLoading title="Adding" />
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
