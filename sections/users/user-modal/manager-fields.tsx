// ManagerFields.tsx
'use client';

import React from 'react';
import { RHFMultiSelect } from '@/components/rhf/rhf-multiselect';
import type { Option } from './types';

interface ManagerFieldsProps {
  organizationOptions: Option[];
}

const ManagerFields: React.FC<ManagerFieldsProps> = ({ organizationOptions }) => {
  return (
    <div className="md:col-span-2">
      <RHFMultiSelect
        name="organizations"
        label="Organizations"
        placeholder="Select Organizations"
        options={organizationOptions}
      />
    </div>
  );
};

export default ManagerFields;