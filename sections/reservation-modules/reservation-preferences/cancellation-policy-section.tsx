'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';
import { CANCELLATION_WINDOW_OPTIONS, SELECT_ITEM_CLASS, SELECT_TRIGGER_CLASS } from './constants';
import { SettingRow } from './setting-row';
import { SettingsCard } from './settings-card';
import { CancellationPolicySettings, CancellationWindowHours } from './types';

interface CancellationPolicySectionProps {
  value: CancellationPolicySettings;
  onChange: (next: CancellationPolicySettings) => void;
  disabled?: boolean;
}

export const CancellationPolicySection: React.FC<CancellationPolicySectionProps> = ({ value, onChange, disabled = false }) => {
  return (
    <SettingsCard
      title="Cancellation policy"
      description={'Applies to every reservation at this organization. Shown in the guest’s Reservation detail under "Important information".'}
    >
      <SettingRow
        htmlFor="free-cancellation-window"
        title="Free cancellation up to"
        description="How long before the reservation the guest can cancel without penalty."
      >
        <Select
          value={String(value.freeCancellationHours)}
          disabled={disabled}
          onValueChange={(next) => onChange({ ...value, freeCancellationHours: Number(next) as CancellationWindowHours })}
        >
          <SelectTrigger id="free-cancellation-window" className={SELECT_TRIGGER_CLASS}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CANCELLATION_WINDOW_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={String(option.value)} className={SELECT_ITEM_CLASS}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingRow>
    </SettingsCard>
  );
};
