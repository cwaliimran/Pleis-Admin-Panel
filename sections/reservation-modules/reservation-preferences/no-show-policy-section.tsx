'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';
import { NO_SHOW_GRACE_OPTIONS, SELECT_ITEM_CLASS, SELECT_TRIGGER_CLASS } from './constants';
import { SettingRow } from './setting-row';
import { SettingsCard } from './settings-card';
import { NoShowGraceMinutes, NoShowPolicySettings } from './types';

interface NoShowPolicySectionProps {
  value: NoShowPolicySettings;
  onChange: (next: NoShowPolicySettings) => void;
  disabled?: boolean;
}

/** Requirement Set #93 · Reservations prototype v3.2 "No-show policy". */
export const NoShowPolicySection: React.FC<NoShowPolicySectionProps> = ({ value, onChange, disabled = false }) => {
  return (
    <SettingsCard
      title="No-show policy"
      description="A Confirmed reservation that hasn't checked in past this grace period may be marked No-show. For Minimum spend types the voucher is forfeited."
    >
      <SettingRow
        htmlFor="no-show-grace-period"
        title="Grace period after reservation time"
        description="How long staff should wait past the arrival time before the reservation can be marked as No-show."
      >
        <Select
          value={String(value.gracePeriodMinutes)}
          disabled={disabled}
          onValueChange={(next) => onChange({ ...value, gracePeriodMinutes: Number(next) as NoShowGraceMinutes })}
        >
          <SelectTrigger id="no-show-grace-period" className={SELECT_TRIGGER_CLASS}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NO_SHOW_GRACE_OPTIONS.map((option) => (
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
