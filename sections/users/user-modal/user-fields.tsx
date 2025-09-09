'use client';

import React from 'react';
import { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFDatePickerWithDropdown from '@/components/rhf/rhf-date-custom';
import type { Option } from './types';

interface UserFieldsProps {
  organizationOptions: Option[];
}

const genderOptions: Option[] = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

const UserFields: React.FC<UserFieldsProps> = () => {
  return (
    <>
      <RHFTextField
        name="username"
        label="Username"
        placeholder="Enter your username"
      />
      <RHFDatePickerWithDropdown
        name="dob"
        label="Date of Birth"
        placeholder="Select your date"
      />
      <RHFSelectField
        name="gender"
        label="Gender"
        placeholder="Select Gender"
        options={genderOptions}
      />
    </>
  );
};

export default UserFields;
