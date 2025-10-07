'use client';

import * as React from 'react';
import { RHFSelectField } from '@/components/rhf';
import { ToggleSwitch } from './ToggleSwitch';
import { FeatureSection, FeatureSectionContent } from './FeatureSection';

interface ReservationFeatureProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
  isLoading: boolean;
}

export const ReservationFeature: React.FC<ReservationFeatureProps> = ({
  enabled,
  onChange,
  isLoading,
}) => {
  return (
    <FeatureSection>
      <ToggleSwitch
        value={enabled}
        onChange={onChange}
        label="Requires Reservation"
        disabled={isLoading}
      />
      {enabled && (
        <FeatureSectionContent>
          <RHFSelectField
            name="features.reservationType"
            label="Reservation Type"
            placeholder="Select type"
            options={[
              { label: 'Any Reservation', value: 'any' },
              { label: 'Table Only', value: 'table' },
              { label: 'VIP Only', value: 'vip' },
              { label: 'Booth Only', value: 'booth' },
            ]}
            disabled={isLoading}
          />
        </FeatureSectionContent>
      )}
    </FeatureSection>
  );
};
