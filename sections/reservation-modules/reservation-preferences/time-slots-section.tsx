'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';
import { OFFSET_OPTIONS, SELECT_ITEM_CLASS, SELECT_TRIGGER_CLASS, SLOT_DURATION_OPTIONS } from './constants';
import { SettingRow } from './setting-row';
import { SettingsCard } from './settings-card';
import { ToggleSwitch } from './toggle-switch';
import { OffsetMinutes, SlotDurationMinutes, TimeSlotSettings } from './types';

interface TimeSlotsSectionProps {
  value: TimeSlotSettings;
  onChange: (next: TimeSlotSettings) => void;
  disabled?: boolean;
}

export const TimeSlotsSection: React.FC<TimeSlotsSectionProps> = ({ value, onChange, disabled = false }) => {
  // The master toggle gates the three fields below it.
  const fieldsDisabled = disabled || !value.useTimeSlots;

  const patch = (partial: Partial<TimeSlotSettings>) => onChange({ ...value, ...partial });

  return (
    <SettingsCard title="Time slots setup" description="The master toggle unlocks the fields below.">
      <SettingRow
        divider
        title="Use time slots?"
        description="Bar / club without fixed slots — turn off. Restaurant — turn on."
        control={
          <ToggleSwitch
            ariaLabel="Use time slots"
            checked={value.useTimeSlots}
            disabled={disabled}
            onChange={(next) => patch({ useTimeSlots: next })}
          />
        }
      />

      <SettingRow htmlFor="average-slot-duration" title="Average slot duration" description="Expected table occupancy time per reservation.">
        <Select
          value={String(value.averageSlotDurationMinutes)}
          disabled={fieldsDisabled}
          onValueChange={(next) => patch({ averageSlotDurationMinutes: Number(next) as SlotDurationMinutes })}
        >
          <SelectTrigger id="average-slot-duration" className={SELECT_TRIGGER_CLASS}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SLOT_DURATION_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={String(option.value)} className={SELECT_ITEM_CLASS}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingRow>

      {/* `py-0` on both: SettingRow's own `first:pt-0 last:pb-0` is meant for a
          vertical stack, and side by side it would offset the columns from
          each other. The grid's own `pt-4` keeps the rhythm with the row above. */}
      <div className="grid gap-5 pt-4 sm:grid-cols-2">
        <SettingRow
          className="py-0"
          htmlFor="reservation-start-offset"
          title="Reservation start time"
          description="Offset from opening time when the first time slot starts."
        >
          <Select
            value={String(value.reservationStartOffsetMinutes)}
            disabled={fieldsDisabled}
            onValueChange={(next) => patch({ reservationStartOffsetMinutes: Number(next) as OffsetMinutes })}
          >
            <SelectTrigger id="reservation-start-offset" className={SELECT_TRIGGER_CLASS}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OFFSET_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={String(option.value)} className={SELECT_ITEM_CLASS}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingRow>

        <SettingRow
          className="py-0"
          htmlFor="reservation-end-offset"
          title="Reservation end time"
          description="Offset before closing time when the last time slot ends."
        >
          <Select
            value={String(value.reservationEndOffsetMinutes)}
            disabled={fieldsDisabled}
            onValueChange={(next) => patch({ reservationEndOffsetMinutes: Number(next) as OffsetMinutes })}
          >
            <SelectTrigger id="reservation-end-offset" className={SELECT_TRIGGER_CLASS}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OFFSET_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={String(option.value)} className={SELECT_ITEM_CLASS}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingRow>
      </div>
    </SettingsCard>
  );
};
