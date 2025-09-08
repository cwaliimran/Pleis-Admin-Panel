'use client';

import React from 'react';
import { RHFMultiSelect } from '@/components/rhf/rhf-multiselect';
import type { Option } from './types';
import { RHFCustomCombobox } from '@/components/rhf/rhf-custom-combobox';

interface StaffFieldsProps {
  organizationOptions: Option[];
}

const moduleOptions: Option[] = [
  { value: 'inAppOrdering', label: 'In-App Ordering' },
  { value: 'reservationManagement', label: 'Reservation Management' },
  { value: 'loyaltyScanning', label: 'Loyalty Scanning' },
  { value: 'ticketing', label: 'Ticketing' },
];

const StaffFields: React.FC<StaffFieldsProps> = ({ organizationOptions }) => {
  return (
    <>
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

      <div className="md:col-span-2">
        <RHFMultiSelect
          name="modules"
          label="Module Access"
          placeholder="Select Modules"
          options={moduleOptions}
        />
      </div>
    </>
  );
};

export default StaffFields;
