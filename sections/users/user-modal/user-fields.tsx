// UserFields.tsx
'use client';

import React from 'react';
import { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFDatePickerWithDropdown from '@/components/rhf/rhf-date-custom';
import type { Option } from './types';
import { RHFCustomCombobox } from '@/components/rhf/rhf-custom-combobox';

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
      <RHFTextField name="username" label="Username" placeholder='Enter your username' />
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
      <div className="md:col-span-2">
        {/* <RHFMultiSelect
          name="organizations"
          label="Organizations"
          placeholder="Select Organizations"
          options={organizationOptions}
        /> */}

        <RHFCustomCombobox
          name="organizations"
          label="Select Organizations"
          placeholder="Select organizations"
          className="w-full flex-1"
          multiple={true}
          allowCustom={false}
          options={organizationOptions}
        />
      </div>
    </>
  );
};

export default UserFields;
