'use client';

import * as React from 'react';
import { RHFTextField } from '@/components/rhf';
import { ToggleSwitch } from './ToggleSwitch';
import { FeatureSection, FeatureSectionContent } from './FeatureSection';

interface FastTrackFeatureProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
  baseQuantity: number;
  isLoading: boolean;
}

export const FastTrackFeature: React.FC<FastTrackFeatureProps> = ({
  enabled,
  onChange,
  baseQuantity,
  isLoading,
}) => {
  return (
    <FeatureSection>
      <ToggleSwitch
        value={enabled}
        onChange={onChange}
        label="Fast Track Entry"
        disabled={isLoading}
      />
      {enabled && (
        <FeatureSectionContent>
          <div className="space-y-3">
            <RHFTextField
              name="features.fasttrackQuantity"
              label={`Fast Track Quantity (≤ ${baseQuantity || 'base quantity'})`}
              type="number"
              min="1"
              max={baseQuantity || 999}
              placeholder="1"
              disabled={isLoading}
            />
            <RHFTextField
              name="features.fasttrackPrice"
              label="Extra Price (€)"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              disabled={isLoading}
            />
          </div>
        </FeatureSectionContent>
      )}
    </FeatureSection>
  );
};
