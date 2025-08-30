// refactored-user-modal-and-list.tsx
// Clean, TypeScript-ready refactor of UserModal and UserListView
// Notes: Keep your existing RHF components and UI components. This file expects
// - FormProvider, RHFTextField, RHFSelectField, RHFDate, RHFMultiSelect, RHFUploadAvatar
// - Button, Dialog components
// - useGetUserListQuery, formatDate, useBoolean hook

'use client';

import React from 'react';
import { Controller, useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import PhoneInput from 'react-phone-input-2';

import FormProvider, {
  RHFDate,
  RHFSelectField,
  RHFTextField,
} from '@/components/rhf';
import { RHFMultiSelect } from '@/components/rhf/rhf-multiselect';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { Plus } from 'lucide-react';
import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { formatDate } from '@/utils/format-time';
import { useGetUserListQuery } from '@/store/Reducer/user-list';

// ---------------------- Types ----------------------
export type RoleValue =
  | 'superadmin'
  | 'admin'
  | 'manager'
  | 'staff'
  | 'user'
  | 'guest'
  | 'organizer';

interface CompanyDetails {
  name?: string;
  oib?: string;
  bankAccountNumber?: string;
  representativeName?: string;
  location?: any;
  suppliers?: string[];
}

export interface UserFormValues {
  image?: File | null;
  firstName?: string;
  lastName?: string;
  name?: string;
  surname?: string;
  username?: string;
  email?: string;
  role: RoleValue;
  password?: string;
  address?: string;
  phone?: string;
  companyName?: string;
  oib?: string;
  bankAccountNo?: string;
  bankAccountName?: string;
  representativeFullName?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  listOfSupplier?: string;
  linkedOrganization?: string;
  moduleAccess?: string[];
  dateOfBirth?: Date | null;
  gender?: string;
  organizations?: string[];
  userType?: string; // incoming userType from props (organizer, admin etc.)
  companyDetails?: CompanyDetails;
}

interface UserModalProps {
  open: boolean;
  isEdit: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormValues) => void;
  userType?: string; // e.g., 'organizer' or 'admin' (used to limit role options)
}

// ---------------------- Role field configuration ----------------------
const ROLE_FIELD_CONFIG: Record<RoleValue, (keyof UserFormValues)[]> = {
  superadmin: ['firstName', 'lastName', 'email', 'phone', 'password'],
  admin: [
    'firstName',
    'lastName',
    'email',
    'password',
    'phone',
    'companyName',
    'oib',
    'bankAccountNo',
    'bankAccountName',
    'postalCode',
    'representativeFullName',
    'address',
    'city',
    'country',
    'listOfSupplier',
  ],
  manager: ['firstName', 'lastName', 'email', 'phone', 'password', 'linkedOrganization'],
  staff: [
    'name',
    'surname',
    'email',
    'phone',
    'password',
    'image',
    'linkedOrganization',
    'moduleAccess',
  ],
  user: [
    'name',
    'surname',
    'username',
    'email',
    'phone',
    'dateOfBirth',
    'gender',
    'password',
  ],
  guest: ['name', 'surname', 'email', 'phone'],
  organizer: [
    'firstName',
    'lastName',
    'organizationName' as keyof UserFormValues, // keep optional typing
    'email',
    'phone',
    'password',
    'companyName',
    'companyDetails' as keyof UserFormValues,
  ],
};

// ---------------------- Utilities ----------------------
const labelFromKey = (key: string) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase());

const defaultValues: UserFormValues = {
  image: null,
  firstName: '',
  lastName: '',
  name: '',
  surname: '',
  username: '',
  email: '',
  role: 'manager',
  password: '',
  address: '',
  phone: '',
  companyName: '',
  oib: '',
  bankAccountNo: '',
  bankAccountName: '',
  representativeFullName: '',
  postalCode: '',
  city: '',
  country: '',
  listOfSupplier: '',
  linkedOrganization: '',
  moduleAccess: [],
  dateOfBirth: null,
  gender: '',
};

// Build Yup schema dynamically for a role
const buildSchemaForRole = (role: RoleValue) => {
  const fields = ROLE_FIELD_CONFIG[role] ?? [];
  const shape: Record<string, any> = {};

  fields.forEach((field) => {
    switch (field) {
      case 'firstName':
      case 'lastName':
      case 'name':
      case 'surname':
        shape[field] = Yup.string().required(`${labelFromKey(field)} is required`);
        break;
      case 'username':
        shape[field] = Yup.string().required('Username is required');
        break;
      case 'email':
        shape[field] = Yup.string().email('Invalid email').required('Email is required');
        break;
      case 'password':
        shape[field] = Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required');
        break;
      case 'phone':
        shape[field] = Yup.string().required('Phone is required');
        break;
      case 'companyName':
        shape[field] = Yup.string().required('Company name is required');
        break;
      case 'oib':
        shape[field] = Yup.string().required('OIB is required');
        break;
      case 'bankAccountNo':
      case 'bankAccountName':
        shape[field] = Yup.string().required(`${labelFromKey(field)} is required`);
        break;
      case 'representativeFullName':
        shape[field] = Yup.string().required('Representative full name is required');
        break;
      case 'address':
        shape[field] = Yup.string().required('Address is required');
        break;
      case 'postalCode':
        shape[field] = Yup.string().required('Postal code is required');
        break;
      case 'city':
        shape[field] = Yup.string().required('City is required');
        break;
      case 'country':
        shape[field] = Yup.string().required('Country is required');
        break;
      case 'linkedOrganization':
        shape[field] = Yup.string().required('Linked organization is required');
        break;
      case 'moduleAccess':
        shape[field] = Yup.array().min(1, 'At least one module must be selected');
        break;
      case 'dateOfBirth':
        shape[field] = Yup.date().required('Date of birth is required').nullable();
        break;
      case 'gender':
        shape[field] = Yup.string().required('Gender is required');
        break;
      case 'image':
        shape[field] = Yup.mixed().nullable();
        break;
      default:
        shape[field] = Yup.mixed().notRequired();
    }
  });

  shape.role = Yup.string().required('Role is required');

  return Yup.object().shape(shape);
};

// ---------------------- UserModal ----------------------
export const UserModal: React.FC<UserModalProps> = ({
  open,
  isEdit,
  onClose,
  onSubmit,
  userType,
}) => {
  const showPassword = useBoolean();

  // choose default role from incoming userType
  const getDefaultRole = (): RoleValue => {
    if (userType === 'organizer') return 'staff';
    if (userType === 'admin') return 'admin';
    return 'manager';
  };

  const methods = useForm<UserFormValues>({
    resolver: yupResolver(buildSchemaForRole(getDefaultRole())),
    defaultValues: { ...defaultValues, role: getDefaultRole() },
    mode: 'onTouched',
  });

  const watchedRole = methods.watch('role');

  // update schema when role changes
  React.useEffect(() => {
    // update resolver dynamically
    methods.reset({ ...methods.getValues(), role: watchedRole });
    methods.clearErrors();
    // @ts-ignore - replace resolver dynamically
    methods._options.resolver = yupResolver(buildSchemaForRole(watchedRole as RoleValue));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedRole]);

  const renderField = (field: keyof UserFormValues) => {
    const errors = methods.formState.errors as any;
    switch (field) {
      case 'image':
        return <RHFUploadAvatar key={String(field)} name="image" label="Profile Image" />;
      case 'firstName':
        return (
          <RHFTextField key="firstName" name="firstName" label="First Name" placeholder="Enter First Name" />
        );
      case 'lastName':
        return (
          <RHFTextField key="lastName" name="lastName" label="Last Name" placeholder="Enter Last Name" />
        );
      case 'name':
        return <RHFTextField key="name" name="name" label="Name" placeholder="Enter Name" />;
      case 'surname':
        return <RHFTextField key="surname" name="surname" label="Surname" placeholder="Enter Surname" />;
      case 'username':
        return <RHFTextField key="username" name="username" label="Username" placeholder="Enter Username" />;
      case 'email':
        return <RHFTextField key="email" name="email" label="Email" placeholder="Enter Email" />;
      case 'phone':
        return (
          <div key="phone">
            <p className="mb-0.5 text-sm font-medium">Phone</p>
            <Controller
              name={'phone'}
              control={methods.control}
              render={({ field, fieldState }) => (
                <div className="w-full">
                  <PhoneInput
                    {...field}
                    country="pk"
                    onChange={(value: string) => field.onChange(value)}
                    placeholder={'Phone Number'}
                    inputProps={{ required: true, 'aria-invalid': fieldState.invalid }}
                    containerClass="w-full"
                    dropdownStyle={{ zIndex: 9999, position: 'fixed', width: '16rem' }}
                    buttonClass="!bg-transparent !border-none !shadow-none px-2 text-gray-800"
                    inputClass={`file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input !border-gray-100 !shadow-sm flex !h-[34px] !w-full min-w-0 rounded-md !bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none`}
                  />
                  {fieldState.error && (
                    <p className="mt-1 text-xs text-red-500">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        );
      case 'password':
        return (
          <RHFTextField
            key="password"
            name="password"
            label="Password"
            type={showPassword.value ? 'text' : 'password'}
            placeholder="Enter Password"
            showPassword={showPassword.value}
            onTogglePassword={showPassword.onToggle}
          />
        );
      case 'companyName':
        return <RHFTextField key="companyName" name="companyName" label="Company Name" placeholder="Enter Company Name" />;
      case 'oib':
        return <RHFTextField key="oib" name="oib" label="OIB" placeholder="Enter OIB" />;
      case 'bankAccountNo':
        return <RHFTextField key="bankAccountNo" name="bankAccountNo" label="Bank Account No" placeholder="Enter Bank Account No" />;
      case 'bankAccountName':
        return <RHFTextField key="bankAccountName" name="bankAccountName" label="Bank Account Name" placeholder="Enter Bank Account Name" />;
      case 'representativeFullName':
        return <RHFTextField key="representativeFullName" name="representativeFullName" label="Representative Full Name" placeholder="Enter Representative Full Name" />;
      case 'address':
        return <RHFTextField key="address" name="address" label="Address" placeholder="Enter Address" />;
      case 'postalCode':
        return <RHFTextField key="postalCode" name="postalCode" label="Postal Code" placeholder="Enter Postal Code" />;
      case 'city':
        return <RHFTextField key="city" name="city" label="City" placeholder="Enter City" />;
      case 'country':
        return <RHFTextField key="country" name="country" label="Country" placeholder="Enter Country" />;
      case 'listOfSupplier':
        return <RHFTextField key="listOfSupplier" name="listOfSupplier" label="List of Supplier" placeholder="Enter List of Supplier" rows={3} multiline />;
      case 'linkedOrganization':
        return (
          <RHFSelectField
            key="linkedOrganization"
            name="linkedOrganization"
            label="Linked Organization"
            placeholder="Select Organization"
            options={[{ value: 'org1', label: 'Organization 1' }, { value: 'org2', label: 'Organization 2' }]}
          />
        );
      case 'moduleAccess':
        return (
          <RHFMultiSelect
            key="moduleAccess"
            name="moduleAccess"
            label="Module Access"
            placeholder="Select Module Access"
            options={[
              { label: 'Ticketing', value: 'ticketing' },
              { label: 'Reservation Management', value: 'reservation' },
              { label: 'Loyalty Scanning', value: 'loyalty' },
              { label: 'In App Ordering', value: 'ordering' },
            ]}
          />
        );
      case 'dateOfBirth':
        return <RHFDate key="dateOfBirth" name="dateOfBirth" label="Date of Birth" />;
      case 'gender':
        return (
          <RHFSelectField key="gender" name="gender" label="Gender" placeholder="Select Gender" options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }]} />
        );
      default:
        return null;
    }
  };

  const roleOptions = React.useMemo(() => {
    if (userType === 'organizer') {
      return [
        { value: 'staff', label: 'Staff' },
        { value: 'user', label: 'User' },
      ];
    }
    return [
      { value: 'superadmin', label: 'Super Admin' },
      { value: 'admin', label: 'Organizer' },
      { value: 'manager', label: 'Manager' },
      { value: 'staff', label: 'Staff' },
      { value: 'user', label: 'User' },
      { value: 'guest', label: 'Guest' },
    ];
  }, [userType]);

  const onFormSubmit = (data: UserFormValues) => {
    onSubmit(data);
  };

  const handleClose = () => {
    methods.reset({ ...defaultValues, role: getDefaultRole() });
    onClose();
  };

  const fieldsToRender = ROLE_FIELD_CONFIG[watchedRole as RoleValue] ?? [];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[50vh] w-full flex-col items-center overflow-y-auto md:!max-w-[580px]">
          <DialogHeader>
            <DialogTitle>{!isEdit ? 'Create User' : 'Edit User'}</DialogTitle>
          </DialogHeader>

          <FormProvider methods={methods} onSubmit={methods.handleSubmit(onFormSubmit)}>
            <div className="mt-4 flex flex-col gap-3 w-full">
              {/* Avatar shown separately but also may be part of role fields */}
              {fieldsToRender.includes('image') ? <RHFUploadAvatar name="image" label="Profile Image" /> : null}

              <RHFSelectField name="role" label="Role" placeholder="Select Role" options={roleOptions} />

              <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 w-full">
                {fieldsToRender.map((f) => {
                  const key = String(f);

                  if (key === 'image') return null; // already rendered above

                  const fullWidth = ['address', 'listOfSupplier', 'representativeFullName', 'moduleAccess', 'companyDetails'].includes(key);

                  return (
                    <div key={key} className={fullWidth ? 'md:col-span-2' : undefined}>
                      {renderField(f)}
                    </div>
                  );
                })}
              </div>

              <div className="mt-1 flex justify-center gap-2">
                <Button type="submit" className="cursor-pointer bg-blue-700 text-white hover:bg-blue-800">
                  {!isEdit ? 'Add User' : 'Update User'}
                </Button>
              </div>
            </div>
          </FormProvider>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};
