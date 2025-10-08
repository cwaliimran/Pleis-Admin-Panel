'use client';

import * as React from 'react';
import { RHFTextField } from '@/components/rhf';
import { ToggleSwitch } from './ToggleSwitch';
import { FeatureSection, FeatureSectionContent } from './FeatureSection';

interface RepeatableFeatureProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
  timeslotEnabled: boolean;
  isLoading: boolean;
}

export const RepeatableFeature: React.FC<RepeatableFeatureProps> = ({
  enabled,
  onChange,
  timeslotEnabled,
  isLoading,
}) => {
  return (
    <FeatureSection>
      <ToggleSwitch
        value={enabled}
        onChange={onChange}
        label="Repeatable Tickets"
        disabled={isLoading}
      />
      {enabled && (
        <FeatureSectionContent>
          <RHFTextField
            name="number"
            label="Number of visits per ticket"
            type="number"
            min="1"
            max="99"
            placeholder="1"
            className="w-32"
            disabled={isLoading}
          />
          {timeslotEnabled && (
            <p className="mt-2 text-xs text-amber-600">
              ⚠ With timeslots enabled, users must select multiple slots
            </p>
          )}
        </FeatureSectionContent>
      )}
    </FeatureSection>
  );
};
