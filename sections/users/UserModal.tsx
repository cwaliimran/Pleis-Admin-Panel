'use client';

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
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import * as Yup from 'yup';

const defaultValues = {
  image: null,
  firstName: '',
  lastName: '',
  name: '',
  surname: '',
  username: '',
  email: '',
  role: 'Manager', // Default role set to Manager
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
  moduleAccess: '',
  dateOfBirth: null,
  gender: '',
};

interface UserModalProps {
  open: boolean;
  isEdit: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  userType: any;
}

const UserModal: React.FC<UserModalProps> = ({
  open,
  isEdit,
  onClose,
  onSubmit,
  userType,
}) => {
  const showPassword = useBoolean();

  // Get default role based on userType
  const getDefaultRole = () => {
    if (userType === 'organizer') {
      return 'Staff';
    }
    return 'Manager'; // Default for super-admin and other user types
  };

  // Dynamic default values based on userType
  const getDynamicDefaultValues = () => ({
    ...defaultValues,
    role: getDefaultRole(),
  });

  // Role-based field configuration
  const roleFieldsConfig = {
    Superadmin: ['firstName', 'lastName', 'email', 'phone', 'password'],
    Admin: [
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
    Manager: ['firstName', 'lastName', 'email', 'phone', 'password'],
    Staff: [
      'name',
      'surname',
      'email',
      'phone',
      'password',
      'image',
      'linkedOrganization',
      'moduleAccess',
    ],
    User: [
      'name',
      'surname',
      'username',
      'email',
      'phone',
      'dateOfBirth',
      'gender',
      'password',
    ],
  };

  // Dynamic schema generation based on role
  const generateSchema = (role: string) => {
    const baseSchema: any = {};
    const fields =
      roleFieldsConfig[role as keyof typeof roleFieldsConfig] || [];

    fields.forEach((field) => {
      switch (field) {
        case 'firstName':
        case 'lastName':
        case 'name':
        case 'surname':
          baseSchema[field] = Yup.string().required(
            `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`
          );
          break;
        case 'username':
          baseSchema[field] = Yup.string().required('Username is required');
          break;
        case 'email':
          baseSchema[field] = Yup.string()
            .email('Invalid email')
            .required('Email is required');
          break;
        case 'password':
          baseSchema[field] = Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required');
          break;
        case 'phone':
          baseSchema[field] = Yup.string().required('Phone is required');
          break;
        case 'companyName':
          baseSchema[field] = Yup.string().required('Company name is required');
          break;
        case 'oib':
          baseSchema[field] = Yup.string().required('OIB is required');
          break;
        case 'bankAccountNo':
          baseSchema[field] = Yup.string().required(
            'Bank account number is required'
          );
          break;
        case 'bankAccountName':
          baseSchema[field] = Yup.string().required(
            'Bank account name is required'
          );
          break;
        case 'representativeFullName':
          baseSchema[field] = Yup.string().required(
            'Representative full name is required'
          );
          break;
        case 'address':
          baseSchema[field] = Yup.string().required('Address is required');
          break;
        case 'postalCode':
          baseSchema[field] = Yup.string().required('Postal code is required');
          break;
        case 'city':
          baseSchema[field] = Yup.string().required('City is required');
          break;
        case 'country':
          baseSchema[field] = Yup.string().required('Country is required');
          break;
        case 'listOfSupplier':
          baseSchema[field] = Yup.string();
          break;
        case 'linkedOrganization':
          baseSchema[field] = Yup.string().required(
            'Linked organization is required'
          );
          break;
        case 'moduleAccess':
          baseSchema[field] = Yup.string().required(
            'Module access is required'
          );
          break;
        case 'dateOfBirth':
          baseSchema[field] = Yup.date().required('Date of birth is required');
          break;
        case 'gender':
          baseSchema[field] = Yup.string().required('Gender is required');
          break;
        case 'image':
          baseSchema[field] = Yup.mixed().nullable();
          break;
        default:
          baseSchema[field] = Yup.string();
      }
    });

    baseSchema.role = Yup.string().required('Role is required');
    return Yup.object().shape(baseSchema);
  };

  const methods = useForm({
    resolver: yupResolver(generateSchema(getDefaultRole())),
    defaultValues: getDynamicDefaultValues(),
  });

  const watchedRole = methods.watch('role');

  // Update form validation when role changes
  React.useEffect(() => {
    methods.clearErrors();
  }, [watchedRole, methods]);

  // Helper function to render fields based on role
  const renderFieldsByRole = (role: string) => {
    const fields =
      roleFieldsConfig[role as keyof typeof roleFieldsConfig] || [];
    const fieldComponents: React.ReactElement[] = [];

    fields.forEach((field) => {
      switch (field) {
        case 'image':
          fieldComponents.push(
            <RHFUploadAvatar key={field} name="image" label="Profile Image" />
          );
          break;
        case 'firstName':
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="firstName"
              label="First Name"
              placeholder="Enter First Name"
              className={`${
                methods.formState.errors.firstName ? 'border-red-400' : ''
              }`}
            />
          );
          break;
        case 'lastName':
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="lastName"
              label="Last Name"
              placeholder="Enter Last Name"
              className={`${
                methods.formState.errors.lastName ? 'border-red-400' : ''
              }`}
            />
          );
          break;
        case 'name':
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="name"
              label="Name"
              placeholder="Enter Name"
              className={`${
                methods.formState.errors.name ? 'border-red-400' : ''
              }`}
            />
          );
          break;
        case 'surname':
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="surname"
              label="Surname"
              placeholder="Enter Surname"
              className={`${
                methods.formState.errors.surname ? 'border-red-400' : ''
              }`}
            />
          );
          break;
        case 'username':
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="username"
              label="Username"
              placeholder="Enter Username"
              className={`${
                methods.formState.errors.username ? 'border-red-400' : ''
              }`}
            />
          );
          break;
        case 'email':
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="email"
              label="Email"
              placeholder="Enter Email"
              className={`${
                methods.formState.errors.email ? 'border-red-400' : ''
              }`}
            />
          );
          break;
        case 'phone':
          fieldComponents.push(
            <div key={field}>
              <p className="mb-0.5 text-sm font-medium">Phone</p>
              <Controller
                name={'phone'}
                control={methods.control}
                render={({ field, fieldState }) => (
                  <div className="w-full">
                    <PhoneInput
                      {...field}
                      country="pk"
                      onChange={(value) => field.onChange(value)}
                      placeholder={'Phone Number'}
                      specialLabel="Phone"
                      inputProps={{
                        required: true,
                        'aria-invalid': fieldState.invalid,
                      }}
                      containerClass="w-full"
                      dropdownStyle={{
                        zIndex: 9999,
                        position: 'fixed',
                        width: '16rem',
                      }}
                      buttonClass="!bg-transparent !border-none !shadow-none px-2 text-gray-800"
                      inputClass={`file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input !border-gray-100 !shadow-sm flex !h-[34px] !w-full min-w-0 rounded-md !bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive
                    ${
                      fieldState.invalid
                        ? 'border-destructive ring-destructive/40'
                        : ''
                    }
                  `}
                    />
                    {fieldState.error && (
                      <p className="mt-1 text-xs text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          );
          break;
        case 'password':
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
                methods.formState.errors.password ? 'border-red-400' : ''
              }`}
            />
          );
          break;
        case 'companyName':
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="companyName"
              label="Company Name"
              placeholder="Enter Company Name"
              className={`${
                methods.formState.errors.companyName ? 'border-red-400' : ''
              }`}
            />
          );
          break;
        case 'oib':
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="oib"
              label="OIB"
              placeholder="Enter OIB"
              className={`${
                methods.formState.errors.oib ? 'border-red-400' : ''
              }`}
            />
          );
          break;
        case 'bankAccountNo':
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="bankAccountNo"
              label="Bank Account No"
              placeholder="Enter Bank Account No"
              className={`${
                methods.formState.errors.bankAccountNo ? 'border-red-400' : ''
              }`}
            />
          );
          break;
        case 'bankAccountName':
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="bankAccountName"
              label="Bank Account Name"
              placeholder="Enter Bank Account Name"
              className={`${
                methods.formState.errors.bankAccountName ? 'border-red-400' : ''
              }`}
            />
          );
          break;
        case 'representativeFullName':
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="representativeFullName"
              label="Representative Full Name"
              placeholder="Enter Representative Full Name"
              className={`${
                methods.formState.errors.representativeFullName
                  ? 'border-red-400'
                  : ''
              }`}
            />
          );
          break;
        case 'address':
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="address"
              label="Address"
              placeholder="Enter Address"
              className={`${
                methods.formState.errors.address ? 'border-red-400' : ''
              }`}
            />
          );
          break;
        case 'postalCode':
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="postalCode"
              label="Postal Code"
              placeholder="Enter Postal Code"
              className={`${
                methods.formState.errors.postalCode ? 'border-red-400' : ''
              }`}
            />
          );
          break;
        case 'city':
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="city"
              label="City"
              placeholder="Enter City"
              className={`${
                methods.formState.errors.city ? 'border-red-400' : ''
              }`}
            />
          );
          break;
        case 'country':
          fieldComponents.push(
            <RHFTextField
              key={field}
              name="country"
              label="Country"
              placeholder="Enter Country"
              className={`${
                methods.formState.errors.country ? 'border-red-400' : ''
              }`}
            />
          );
          break;
        case 'listOfSupplier':
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
        case 'linkedOrganization':
          fieldComponents.push(
            <RHFSelectField
              key={field}
              name="linkedOrganization"
              label="Linked Organization"
              placeholder="Select Organization"
              options={[
                { value: 'org1', label: 'Organization 1' },
                { value: 'org2', label: 'Organization 2' },
                { value: 'org3', label: 'Organization 3' },
              ]}
              className={`${
                methods.formState.errors.linkedOrganization
                  ? 'border-red-400'
                  : ''
              }`}
            />
          );
          break;
        case 'moduleAccess':
          fieldComponents.push(
            <RHFMultiSelect
              key={field}
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
          break;
        case 'dateOfBirth':
          fieldComponents.push(
            <RHFDate
              key={field}
              name="dateOfBirth"
              label="Date of Birth"
              className={`${
                methods.formState.errors.dateOfBirth ? 'border-red-400' : ''
              }`}
            />
          );
          break;
        case 'gender':
          fieldComponents.push(
            <RHFSelectField
              key={field}
              name="gender"
              label="Gender"
              placeholder="Select Gender"
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]}
              className={`${
                methods.formState.errors.gender ? 'border-red-400' : ''
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

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  const handleClose = () => {
    methods.reset(getDynamicDefaultValues());
    onClose();
  };

  // Get role options based on userType
  const getRoleOptions = () => {
    if (userType === 'organizer') {
      return [
        { value: 'Staff', label: 'Staff' },
        { value: 'User', label: 'User' },
      ];
    }

    // Default options for super-admin and other user types
    return [
      { value: 'Superadmin', label: 'Super Admin' },
      { value: 'Admin', label: 'Organizer' },
      { value: 'Manager', label: 'Manager' },
      { value: 'Staff', label: 'Staff' },
      { value: 'User', label: 'User' },
    ];
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[50vh] w-full flex-col items-center overflow-y-auto md:!max-w-[580px]">
          <DialogHeader>
            <DialogTitle>{!isEdit ? 'Create User' : 'Edit User'}</DialogTitle>
          </DialogHeader>
          <FormProvider
            methods={methods}
            onSubmit={methods.handleSubmit(handleSubmit)}
          >
            <div className="mt-4 flex flex-col gap-3">
              <RHFUploadAvatar name="image" label="Profile Image" />

              <RHFSelectField
                name="role"
                label="Role"
                placeholder="Select Role"
                options={getRoleOptions()}
              />

              {/* Dynamic Fields Grid */}
              <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                {renderFieldsByRole(watchedRole).map((field) => {
                  // Skip image field as it's handled separately above
                  if (field.key === 'image') return null;

                  // Full width fields
                  const fullWidthFields = [
                    'address',
                    'listOfSupplier',
                    'representativeFullName',
                    'moduleAccess',
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
                  className="cursor-pointer bg-blue-700 text-white hover:bg-blue-800"
                >
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

export default UserModal;
