'use client';

import { Input } from '@/components/ui/input';
import React from 'react';
import { SettingRow } from './setting-row';
import { SettingsCard } from './settings-card';
import { ToggleSwitch } from './toggle-switch';
import { AutomaticResponseSettings } from './types';

interface AutomaticResponseSectionProps {
  value: AutomaticResponseSettings;
  onChange: (next: AutomaticResponseSettings) => void;
  disabled?: boolean;
}

export const AutomaticResponseSection: React.FC<AutomaticResponseSectionProps> = ({ value, onChange, disabled = false }) => {
  const patch = (partial: Partial<AutomaticResponseSettings>) => onChange({ ...value, ...partial });

  return (
    <SettingsCard title="Automatic response" description="Rules for auto-confirming or auto-rejecting incoming requests.">
      <SettingRow
        title="Auto-confirm if reservation type has capacity"
        description="Confirmed automatically when occupancy is below 90%."
        control={
          <ToggleSwitch
            ariaLabel="Auto-confirm when capacity is available"
            checked={value.autoConfirmWhenCapacity}
            disabled={disabled}
            onChange={(next) => patch({ autoConfirmWhenCapacity: next })}
          />
        }
      />

      <SettingRow
        divider
        htmlFor="max-guests-auto-confirm"
        title="Max guests per reservation for auto-confirm"
        description="Requests above this party size require manual review."
      >
        <Input
          id="max-guests-auto-confirm"
          type="number"
          min={1}
          value={value.maxGuestsForAutoConfirm}
          disabled={disabled || !value.autoConfirmWhenCapacity}
          onChange={(event) => patch({ maxGuestsForAutoConfirm: Number(event.target.value) })}
          className="h-10 w-full bg-white dark:bg-[#1a1a1a]"
        />
      </SettingRow>

      <SettingRow
        title="Auto-reject if reservation type has no capacity"
        description="Request is rejected automatically when the type is fully booked."
        control={
          <ToggleSwitch
            ariaLabel="Auto-reject when no capacity is left"
            checked={value.autoRejectWhenNoCapacity}
            disabled={disabled}
            onChange={(next) => patch({ autoRejectWhenNoCapacity: next })}
          />
        }
      />
    </SettingsCard>
  );
};
