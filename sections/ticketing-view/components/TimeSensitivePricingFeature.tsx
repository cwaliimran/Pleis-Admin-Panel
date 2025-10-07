'use client';

import * as React from 'react';
import { RHFTextField } from '@/components/rhf';
import {
  FeatureSection,
  FeatureSectionHeader,
  FeatureSectionContent,
} from './FeatureSection';

interface TimeSensitivePricingFeatureProps {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
}

export const TimeSensitivePricingFeature: React.FC<
  TimeSensitivePricingFeatureProps
> = ({ value, onChange, isLoading }) => {
  return (
    <FeatureSection>
      <FeatureSectionHeader title="Time Sensitive Pricing" />
      <FeatureSectionContent>
        <div className="space-y-3">
          {/* None Option */}
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              value="none"
              checked={value === 'none'}
              onChange={(e) => onChange(e.target.value)}
              disabled={isLoading}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm">None</span>
          </label>

          {/* Early Bird Option */}
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              value="earlybird"
              checked={value === 'earlybird'}
              onChange={(e) => onChange(e.target.value)}
              disabled={isLoading}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm">Early Bird</span>
          </label>

          {value === 'earlybird' && (
            <div className="ml-6 grid gap-3 md:grid-cols-2">
              <RHFTextField
                name="features.earlyBirdDate"
                label="End Date/Time"
                type="datetime-local"
                disabled={isLoading}
              />
              <RHFTextField
                name="features.earlyBirdPrice"
                label="Discounted Price (€)"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>
          )}

          {/* Last Minute Option */}
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              value="lastminute"
              checked={value === 'lastminute'}
              onChange={(e) => onChange(e.target.value)}
              disabled={isLoading}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm">Last Minute</span>
          </label>

          {value === 'lastminute' && (
            <div className="ml-6 grid gap-3 md:grid-cols-2">
              <RHFTextField
                name="features.lastMinuteDate"
                label="Start Date/Time"
                type="datetime-local"
                disabled={isLoading}
              />
              <RHFTextField
                name="features.lastMinutePrice"
                label="Discounted Price (€)"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>
          )}
        </div>
      </FeatureSectionContent>
    </FeatureSection>
  );
};
