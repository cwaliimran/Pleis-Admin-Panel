// ManagerFields.tsx
'use client';

import React from 'react';
import type { Option } from './types';
import { RHFCustomCombobox } from '@/components/rhf/rhf-custom-combobox';

interface ManagerFieldsProps {
  organizationOptions: Option[];
}

const ManagerFields: React.FC<ManagerFieldsProps> = ({
  organizationOptions,
}) => {
  return (
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
  );
};

export default ManagerFields;
