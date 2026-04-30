'use client';

import { RHFTextField } from '@/components/rhf';
import { RHFCustomCombobox } from '@/components/rhf/rhf-custom-combobox';
import RHFIBANField from '@/components/rhf/rhf-iban-field';
import React from 'react';
import type { Option } from './types';

interface OrganizerFieldsProps {
  supplierOptions: Option[];
  supplierLoading: boolean;
  methods: any;
}

const OrganizerFields: React.FC<OrganizerFieldsProps> = ({
  supplierOptions,
  supplierLoading,
}) => {
  return (
    <>
      <RHFTextField
        name="organizationName"
        label="Organization Name"
        placeholder="Enter organization name"
      />

      <div className="md:col-span-2">
        <RHFTextField
          name="companyName"
          label="Company Name"
          placeholder="Enter company name"
        />
      </div>

      <RHFTextField name="oib" label="VAT" placeholder="Enter VAT" />

      <div className="md:col-span-2">
        <RHFIBANField name="bankAccountNumber" label="Bank Account Number" />
      </div>

      <div className="md:col-span-2">
        <RHFTextField
          name="representativeName"
          label="Representative Name"
          placeholder="Enter representative name"
        />
      </div>

      <div className="md:col-span-2">
        <RHFTextField
          name="location.fullAddress"
          label="Full Address"
          placeholder="Enter full address"
        />
      </div>

      <RHFTextField
        name="location.country"
        label="Country"
        placeholder="Enter country"
      />

      <RHFTextField
        name="location.state"
        label="State"
        placeholder="Enter state"
      />

      <RHFTextField
        name="location.city"
        label="City"
        placeholder="Enter city"
      />

      <RHFTextField
        name="location.postalCode"
        label="Postal Code"
        placeholder="Enter postal code"
      />

      <div className="md:col-span-2">
        {supplierLoading ? (
          <div className="w-full">
            <div className="animate-pulse space-y-2">
              <div className="h-5 w-32 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-8 w-full rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        ) : (
          <RHFCustomCombobox
            name="suppliers"
            label="Select Suppliers"
            placeholder="Select Suppliers"
            className="w-full flex-1"
            multiple={true}
            allowCustom={false}
            options={supplierOptions}
          />
        )}
      </div>
    </>
  );
};

export default OrganizerFields;
