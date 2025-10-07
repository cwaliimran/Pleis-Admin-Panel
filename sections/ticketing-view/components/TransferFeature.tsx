'use client';

import * as React from 'react';
import { RHFTextField } from '@/components/rhf';
import { ToggleSwitch } from './ToggleSwitch';
import { FeatureSection, FeatureSectionContent } from './FeatureSection';

interface ReservationFeatureProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
  isLoading: boolean;
}

export const TransferFeature: React.FC<ReservationFeatureProps> = ({
  enabled,
  onChange,
  isLoading,
}) => {
  return (
    <FeatureSection>
      <ToggleSwitch
        value={enabled}
        onChange={onChange}
        label="Transfer Fee"
        disabled={isLoading}
      />
      {enabled && (
        <FeatureSectionContent>
          <RHFTextField
            name="price"
            // label="Transfer Fee"
            type="number"
            placeholder="Enter Transfer Fee"
            step="0.01"
            min="0"
            disabled={isLoading}
          />
        </FeatureSectionContent>
      )}
    </FeatureSection>
  );
};
