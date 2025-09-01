// UserFields.tsx
'use client';

import React from 'react';
import { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFDatePickerWithDropdown from '@/components/rhf/rhf-date-custom';
import { RHFMultiSelect } from '@/components/rhf/rhf-multiselect';
import type { Option } from './types';

interface UserFieldsProps {
  organizationOptions: Option[];
}

const genderOptions: Option[] = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

const UserFields: React.FC<UserFieldsProps> = ({ organizationOptions }) => {
  return (
    <>
      <RHFTextField name="username" label="Username" />
      <RHFDatePickerWithDropdown name="dob" label="Date of Birth" placeholder="Select your date" />
      <RHFSelectField
        name="gender"
        label="Gender"
        placeholder="Select Gender"
        options={genderOptions}
      />
      <div className="md:col-span-2">
        <RHFMultiSelect
          name="organizations"
          label="Organizations"
          placeholder="Select Organizations"
          options={organizationOptions}
        />
      </div>
    </>
  );
};

export default UserFields;