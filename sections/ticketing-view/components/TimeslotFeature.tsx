'use client';

import * as React from 'react';
import { Calendar } from 'lucide-react';
import { ToggleSwitch } from './ToggleSwitch';
import { FeatureSection, FeatureSectionContent } from './FeatureSection';

interface TimeslotFeatureProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
  isLoading: boolean;
}

export const TimeslotFeature: React.FC<TimeslotFeatureProps> = ({
  enabled,
  onChange,
  isLoading,
}) => {
  return (
    <FeatureSection>
      <ToggleSwitch
        value={enabled}
        onChange={onChange}
        label="Time Slot Ticketing"
        disabled={isLoading}
      />
      {enabled && (
        <FeatureSectionContent>
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="mr-1 inline" size={14} />
            Divide event into bookable time windows. Manage via calendar view.
          </p>
          <button
            type="button"
            className="text-sm text-blue-600 hover:underline"
          >
            Configure Time Slots →
          </button>
        </FeatureSectionContent>
      )}
    </FeatureSection>
  );
};
