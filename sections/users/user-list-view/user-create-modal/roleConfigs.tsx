'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import ButtonLoading from '@/components/common/button-loading';
import { RHFSelectField, RHFTextField } from '@/components/rhf';
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
import { getErrorMessage } from '@/utils/api';
import { uploadFileToAzure } from '@/utils/fileUpload';
import { showError } from '@/utils/toast';
import PhoneInput from 'react-phone-input-2';
import { formatDobDMY, splitPhoneByDial } from './helpers';
import RHFDatePickerWithDropdown from '@/components/rhf/rhf-date-custom';
import { useGetOrganizationQuery } from '@/store/Reducer/organization';
import { useGetSuppliersQuery } from '@/store/Reducer/suppliers';

/* ---------------------------------- TYPES --------------------------------- */

type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'phone'
  | 'date'
  | 'select'
  | 'multi-select'
  | 'upload';

type RoleKey = 'admin' | 'organizer' | 'manager' | 'staff' | 'guest' | 'user';

type Option = { value: string; label: string };

type FieldConfig = {
  type: FieldType;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: Option[];
  fullWidth?: boolean;
};

type FieldsConfig = Record<string, FieldConfig>;

type RoleDef = {
  label: string;
  fields: FieldsConfig;
};

type RoleConfigMap = Record<RoleKey, RoleDef>;

/* ------------------------------ ROLE CONFIGS ------------------------------- */
/** Keep values aligned with backend expectations. */
const roleConfigs: RoleConfigMap = {
  admin: {
    label: 'Super Admin',
    fields: {
      profileIcon: { type: 'upload', label: 'Profile Image' },
      firstName: { type: 'text', label: 'First Name', required: true },
      lastName: { type: 'text', label: 'Last Name', required: true },
      email: { type: 'email', label: 'Email', required: true },
      phone: { type: 'phone', label: 'Phone', required: true },
      password: {
        type: 'password',
        label: 'Password',
        required: true,
        placeholder: 'Min 6 characters',
      },
    },
  },
  organizer: {
    label: 'Organizer',
    fields: {
      profileIcon: { type: 'upload', label: 'Profile Image' },
      firstName: { type: 'text', label: 'First Name', required: true },
      lastName: { type: 'text', label: 'Last Name', required: true },
      organizationName: {
        type: 'text',
        label: 'Organization Name',
        required: true,
      },
      email: { type: 'email', label: 'Email', required: true },
      phone: { type: 'phone', label: 'Phone', required: true },
      password: { type: 'password', label: 'Password', required: true },
      companyName: {
        type: 'text',
        label: 'Company Name',
        required: true,
        fullWidth: true,
      },
      oib: { type: 'text', label: 'OIB', required: true },
      bankAccountNumber: {
        type: 'text',
        label: 'Bank Account Number',
        required: true,
        fullWidth: true,
      },
      representativeName: {
        type: 'text',
        label: 'Representative Name',
        required: true,
        fullWidth: true,
      },
      fullAddress: {
        type: 'text',
        label: 'Full Address',
        required: true,
        fullWidth: true,
      },
      country: { type: 'text', label: 'Country', required: true },
      city: { type: 'text', label: 'City', required: true },
      state: { type: 'text', label: 'State', required: true },
      postalCode: { type: 'text', label: 'Postal Code', required: true },
      lat: { type: 'text', label: 'Lat', required: true },
      lng: { type: 'text', label: 'Lng', required: true },
      suppliers: {
        type: 'multi-select',
        label: 'Suppliers',
        required: true,
        options: [],
        fullWidth: true,
      },
    },
  },
  manager: {
    label: 'Manager',
    fields: {
      profileIcon: { type: 'upload', label: 'Profile Image' },
      firstName: { type: 'text', label: 'First Name', required: true },
      lastName: { type: 'text', label: 'Last Name', required: true },
      email: { type: 'email', label: 'Email', required: true },
      phone: { type: 'phone', label: 'Phone', required: true },
      password: { type: 'password', label: 'Password', required: true },
      organizations: {
        type: 'multi-select',
        label: 'Organizations',
        required: true,
        options: [],
        fullWidth: true,
      },
    },
  },
  staff: {
    label: 'Staff',
    fields: {
      profileIcon: { type: 'upload', label: 'Profile Image' },
      firstName: { type: 'text', label: 'First Name', required: true },
      lastName: { type: 'text', label: 'Last Name', required: true },
      email: { type: 'email', label: 'Email', required: true },
      phone: { type: 'phone', label: 'Phone', required: true },
      password: { type: 'password', label: 'Password', required: true },
      organizations: {
        type: 'multi-select',
        label: 'Organizations',
        required: true,
        options: [],
        fullWidth: true,
      },
      modules: {
        type: 'multi-select',
        label: 'Module Access',
        required: true,
        options: [
          { value: 'inAppOrdering', label: 'In-App Ordering' },
          { value: 'reservationManagement', label: 'Reservation Management' },
          { value: 'loyaltyScanning', label: 'Loyalty Scanning' },
          { value: 'ticketing', label: 'Ticketing' },
        ],
        fullWidth: true,
      },
    },
  },
  guest: {
    label: 'Guest',
    fields: {
      profileIcon: { type: 'upload', label: 'Profile Image' },
      firstName: { type: 'text', label: 'First Name', required: true },
      lastName: { type: 'text', label: 'Last Name', required: true },
      email: { type: 'email', label: 'Email', required: true },
      phone: { type: 'phone', label: 'Phone', required: true },
      password: { type: 'password', label: 'Password', required: true },
    },
  },
  user: {
    label: 'User',
    fields: {
      profileIcon: { type: 'upload', label: 'Profile Image' },
      firstName: { type: 'text', label: 'First Name', required: true },
      lastName: { type: 'text', label: 'Last Name', required: true },
      username: { type: 'text', label: 'Username', required: true },
      email: { type: 'email', label: 'Email', required: true },
      phone: { type: 'phone', label: 'Phone', required: true },
      dob: { type: 'date', label: 'Date of Birth', required: true },
      gender: {
        type: 'select',
        label: 'Gender',
        required: true,
        options: [
          { value: 'Male', label: 'Male' },
          { value: 'Female', label: 'Female' },
          { value: 'Other', label: 'Other' },
        ],
      },
      password: { type: 'password', label: 'Password', required: true },
      organizations: {
        type: 'multi-select',
        label: 'Organizations',
        options: [],
        fullWidth: true,
      },
    },
  },
} as const;

/* ----------------------- VALIDATION (dynamic by role) ---------------------- */

const schemaForField = (name: string, cfg: FieldConfig) => {
  const label = cfg.label || name;
  switch (cfg.type) {
    case 'email':
      return cfg.required
        ? Yup.string().email('Invalid email').required(`${label} is required`)
        : Yup.string().email('Invalid email').nullable();
    case 'date':
      return cfg.required
        ? Yup.date().typeError('Invalid date').required(`${label} is required`)
        : Yup.date().nullable();
    case 'multi-select':
      return cfg.required
        ? Yup.array().of(Yup.string()).min(1, `${label} is required`)
        : Yup.array().of(Yup.string()).nullable();
    case 'select':
    case 'text':
    case 'password':
    case 'phone':
    case 'upload':
    default:
      return cfg.required
        ? Yup.string().required(`${label} is required`)
        : Yup.string().nullable();
  }
};

const generateValidationSchema = (role: RoleKey) => {
  const fields = roleConfigs[role].fields;
  const shape: Record<string, any> = {};
  Object.entries(fields).forEach(([key, cfg]) => {
    shape[key] = schemaForField(key, cfg);
  });
  // phone also needs phoneCode when phone required
  if (fields.phone?.required) {
    shape.phoneCode = Yup.string().required('Phone country code is required');
  }
  // simple password min rule
  if (fields.password?.required) {
    shape.password = Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required');
  }
  return Yup.object().shape(shape);
};

/* ---------------------------- PAYLOAD MAPPING ------------------------------ */

const mapFormToPayload = (role: RoleKey, data: any) => {
  const { phone, phoneCode } = data || {};
  const phoneNumber = splitPhoneByDial(
    String(phone || ''),
    String(phoneCode || '')
  );

  const base = {
    profileIcon: data.profileIcon || data.image || '', // support either name
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phoneNumber: {
      code: phoneNumber.code || '+92',
      number: phoneNumber.number || '',
    },
    password: data.password,
  };

  switch (role) {
    case 'admin':
      return { ...base, userType: 'admin' as const };

    case 'organizer':
      return {
        ...base,
        organizationName: data.organizationName,
        userType: 'organizer' as const,
        companyDetails: {
          name: data.companyName,
          oib: data.oib,
          bankAccountNumber: data.bankAccountNumber,
          representativeName: data.representativeName,
          location: {
            coordinates: [Number(data.lat) || 0, Number(data.lng) || 0],
            fullAddress: data.fullAddress,
            country: data.country,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
          },
          suppliers: Array.isArray(data.suppliers) ? data.suppliers : [],
        },
      };

    case 'manager':
      return {
        ...base,
        userType: 'manager' as const,
        organizations: data.organizations || [],
      };

    case 'staff':
      return {
        ...base,
        userType: 'staff' as const,
        organizations: data.organizations || [],
        modules: data.modules || [],
      };

    case 'guest':
      return { ...base, userType: 'guest' as const };

    case 'user':
    default:
      return {
        ...base,
        username: data.username,
        gender: data.gender,
        dob: data.dob ? formatDobDMY(new Date(data.dob)) : '',
        userType: 'user' as const,
        organizations: data.organizations || [],
      };
  }
};

/* ----------------------------- HELPERS (UI) -------------------------------- */

const getDefaultRole = (userType?: string): RoleKey =>
  userType === 'organizer' ? 'staff' : 'manager';

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

const fullWidthByName = new Set([
  'fullAddress',
  'bankAccountNumber',
  'representativeName',
  'companyName',
  'modules',
  'organizations',
  'suppliers',
]);

/* ------------------------------- COMPONENT --------------------------------- */

interface UserModalProps {
  open: boolean;
  isEdit: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => void; // send mapped payload
  userType?: string; // e.g., 'organizer' or 'super-admin'
}

const defaultValues: Record<string, any> = {
  role: '',
  profileIcon: '',
  firstName: '',
  lastName: '',
  organizationName: '',
  email: '',
  phone: '',
  phoneCode: '', // hidden helper to keep country dial code
  password: '',
  // organizer extras
  companyName: '',
  oib: '',
  bankAccountNumber: '',
  representativeName: '',
  fullAddress: '',
  city: '',
  country: '',
  state: '',
  postalCode: '',
  lat: '',
  lng: '',
  suppliers: [],
  // lists
  organizations: [],
  modules: [],
  // user extras
  username: '',
  dob: null,
  gender: '',
};

const CustomUserModal: React.FC<UserModalProps> = ({
  open,
  isEdit,
  isLoading,
  onClose,
  onSubmit,
  userType,
}) => {
  const showPassword = useBoolean();
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

  // Map API data to dropdown options with useMemo
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

  // Dynamic resolver that always uses the latest schema
  const resolver = React.useCallback(
    (values: any, context: any, options: any) =>
      yupResolver(generateValidationSchema(currentRole))(
        values,
        context,
        options
      ),
    [currentRole]
  );

  const methods = useForm({
    resolver,
    defaultValues: { ...defaultValues, role: currentRole },
    mode: 'onBlur',
    shouldUnregister: true,
  });

  const { handleSubmit, watch, setValue, formState } = methods;

  // keep form role in sync with state
  const watchedRoleValue = watch('role') as RoleKey | undefined;
  React.useEffect(() => {
    if (watchedRoleValue && watchedRoleValue !== currentRole) {
      setCurrentRole(watchedRoleValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedRoleValue]);

  const handleClose = () => {
    methods.reset({ ...defaultValues, role: getDefaultRole(userType) });
    setCurrentRole(getDefaultRole(userType));
    onClose();
  };

  const submit = async (data: any) => {
    try {
      let profileIconUrl: string | undefined;

      // Handle file upload here
      if (data.image) {
        let file: File | undefined;

        if (data.image instanceof FileList && data.image.length > 0) {
          file = data.image[0];
        } else if (Array.isArray(data.image) && data.image.length > 0) {
          file = data.image[0];
        } else if (data.image instanceof File) {
          file = data.image;
        }

        if (file) {
          profileIconUrl = await uploadFileToAzure(file);
        }
      }

      // Replace raw image with URL string
      const payload = mapFormToPayload(currentRole, {
        ...data,
        profileIcon: profileIconUrl || data.profileIcon || '',
      });

      onSubmit(payload);
    } catch (err) {
      console.log('Image upload failed:', err);
      showError(getErrorMessage(err));
    }
  };

  // const fields = roleConfigs[currentRole].fields;
  const fields = React.useMemo(() => {
    const roleFields = { ...roleConfigs[currentRole].fields };

    if (roleFields.suppliers) {
      roleFields.suppliers = {
        ...roleFields.suppliers,
        options: supplierOptions,
      };
    }

    if (roleFields.organizations) {
      roleFields.organizations = {
        ...roleFields.organizations,
        options: organizationOptions,
      };
    }

    return roleFields;
  }, [currentRole, organizationOptions, supplierOptions]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0" />
      <DialogContent
        aria-describedby={undefined}
        className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[50vh] w-full flex-col items-center overflow-y-auto md:!max-w-[640px]"
      >
        <DialogHeader>
          <DialogTitle>{!isEdit ? 'Create User' : 'Edit User'}</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(submit)}
            className="mt-2 w-full space-y-4"
          >
            {/* Profile Image - render if present in role */}
            {fields.profileIcon && (
              <RHFUploadAvatar
                name="image"
                label="Profile Image"
                initialImage={(() => {
                  if (!isEdit) return null;
                  const img = methods.getValues('image');
                  if (
                    !img ||
                    img ===
                      'https://pleisstorage.blob.core.windows.net/pleisappcontainer/noimage.png'
                  ) {
                    return null;
                  }
                  return typeof img === 'string' ? img : null;
                })()}
              />
            )}

            {/* Role Select */}
            <RHFSelectField
              name="role"
              label="Role"
              placeholder="Select Role"
              options={roleOptionsFor(userType)}
              onChange={(e) => setValue('role', e.target.value as RoleKey)}
            />

            {/* Dynamic Fields */}
            <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
              {Object.entries(fields).map(([name, cfg]) => {
                if (name === 'profileIcon') return null;

                const node =
                  cfg.type === 'text' ||
                  cfg.type === 'email' ||
                  cfg.type === 'password' ? (
                    <RHFTextField
                      key={name}
                      name={name}
                      type={cfg.type}
                      label={cfg.label}
                      placeholder={cfg.placeholder}
                      showPassword={
                        cfg.type === 'password' ? showPassword.value : undefined
                      }
                      onTogglePassword={
                        cfg.type === 'password'
                          ? showPassword.onToggle
                          : undefined
                      }
                      className={`${formState.errors[name] ? 'border-red-400' : ''}`}
                    />
                  ) : cfg.type === 'date' ? (
                    // <RHFDate
                    //   key={name}
                    //   name={name}
                    //   label={cfg.label}
                    //   className={`${formState.errors[name] ? 'border-red-400' : ''}`}
                    // />
                    <RHFDatePickerWithDropdown
                      key={name}
                      name="dob"
                      label="Date of Birth"
                      placeholder="Select your date"
                    />
                  ) : cfg.type === 'select' ? (
                    <RHFSelectField
                      key={name}
                      name={name}
                      label={cfg.label}
                      placeholder={`Select ${cfg.label}`}
                      options={cfg.options || []}
                      className={`${formState.errors[name] ? 'border-red-400' : ''}`}
                    />
                  ) : cfg.type === 'multi-select' ? (
                    <RHFMultiSelect
                      key={name}
                      name={name}
                      label={cfg.label}
                      placeholder={`Select ${cfg.label}`}
                      options={cfg.options || []}
                    />
                  ) : cfg.type === 'phone' ? (
                    <div key={name}>
                      <p className="mb-0.5 text-sm font-medium">{cfg.label}</p>
                      <Controller
                        name="phone"
                        render={({ field, fieldState }) => (
                          <div className="w-full">
                            <PhoneInput
                              {...field}
                              country="hr"
                              onChange={(value, country: any) => {
                                field.onChange(value);
                                // keep dial code in hidden field for mapping
                                methods.setValue(
                                  'phoneCode',
                                  `+${country?.dialCode || ''}`,
                                  {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                  }
                                );
                              }}
                              placeholder="Phone Number"
                              inputProps={{
                                required: !!cfg.required,
                                'aria-invalid': fieldState.invalid,
                              }}
                              containerClass="w-full"
                              dropdownStyle={{
                                zIndex: 9999,
                                position: 'fixed',
                                width: '16rem',
                              }}
                              buttonClass="!bg-transparent !border-none !shadow-none px-2 text-gray-800"
                              inputClass={`file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input !border-gray-100 !shadow-sm flex !h-[34px] !w-full min-w-0 rounded-md !bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ${
                                fieldState.invalid
                                  ? 'border-destructive ring-destructive/40'
                                  : ''
                              }`}
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
                  ) : null;

                if (!node) return null;

                // full-width items
                if (cfg.fullWidth || fullWidthByName.has(name)) {
                  return (
                    <div key={name} className="md:col-span-2">
                      {node}
                    </div>
                  );
                }
                return node;
              })}
            </div>

            {/* submit */}
            <div className="mt-1 flex justify-center gap-2">
              {isLoading ? (
                <Button
                  type="button"
                  disabled
                  className="bg-primary hover:bg-primary/80 cursor-not-allowed text-white"
                >
                  <ButtonLoading title={isEdit ? 'Updating' : 'Creating'} />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/80 cursor-pointer text-white"
                >
                  {!isEdit
                    ? `Add ${methods.getValues('role')}`
                    : `Update ${methods.getValues('role')}`}
                </Button>
              )}

              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>

            {/* hidden phone code store */}
            <input type="hidden" {...methods.register('phoneCode')} />
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CustomUserModal;
