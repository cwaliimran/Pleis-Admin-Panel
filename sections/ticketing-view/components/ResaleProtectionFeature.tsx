'use client';

import * as React from 'react';
import {
  FeatureSection,
  FeatureSectionHeader,
  FeatureSectionContent,
} from './FeatureSection';

interface ResaleProtectionFeatureProps {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
}

export const ResaleProtectionFeature: React.FC<
  ResaleProtectionFeatureProps
> = ({ value, onChange, isLoading }) => {
  const options = [
    { value: 'none', label: 'None' },
    { value: 'name', label: 'Name + Surname' },
    { value: 'full', label: 'Name + Surname + PID/Date of Birth' },
  ];

  return (
    <FeatureSection>
      <FeatureSectionHeader title="Resale Protection" />
      <FeatureSectionContent>
        <div className="space-y-2">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2"
            >
              <input
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                disabled={isLoading}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </FeatureSectionContent>
    </FeatureSection>
  );
};
