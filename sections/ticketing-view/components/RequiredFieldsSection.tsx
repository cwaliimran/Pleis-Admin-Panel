'use client';

import * as React from 'react';
import { RHFSelectField, RHFTextField } from '@/components/rhf';
import { AlertCircle } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

interface RequiredFieldsSectionProps {
  formState: any;
  isLoading: boolean;
}

export const RequiredFieldsSection: React.FC<RequiredFieldsSectionProps> = ({
  formState,
  isLoading,
}) => {
  return (
    <div className="dark:bg-secondary mb-3 bg-blue-50">
      <SectionHeader
        title="Required Fields"
        icon={<AlertCircle className="text-blue-600" size={20} />}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <RHFTextField
          name="type"
          label="Ticket Type"
          placeholder="e.g., General Admission, VIP Pass"
          className={`${
            formState.errors.type ? 'border-red-400 focus:border-red-400' : ''
          }`}
          disabled={isLoading}
        />

        <RHFTextField
          name="quantity"
          label="Quantity"
          type="number"
          placeholder="Enter quantity"
          min="1"
          className={`${
            formState.errors.quantity
              ? 'border-red-400 focus:border-red-400'
              : ''
          }`}
          disabled={isLoading}
        />

        <RHFTextField
          name="price"
          label="Price (€)"
          type="number"
          placeholder="0.00"
          step="0.01"
          min="0"
          className={`${
            formState.errors.price ? 'border-red-400 focus:border-red-400' : ''
          }`}
          disabled={isLoading}
        />

        <RHFSelectField
          name="tax"
          label="Tax Percentage"
          placeholder="Select tax rate"
          options={[
            { label: '0%', value: '0' },
            { label: '5%', value: '5' },
            { label: '13%', value: '13' },
            { label: '25%', value: '25' },
          ]}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};
