'use client';

import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useGetComplianceSettingsQuery, useUpdateComplianceSettingsMutation } from '@/store/Reducer/legal';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';

const MODES = [
  {
    value: 'notice' as const,
    title: 'Notice',
    text: 'The 18+ text is shown above the pay / place-order button. Nothing to tick, nothing blocked, nothing logged.',
  },
  {
    value: 'confirmation' as const,
    title: 'Confirmation',
    text: 'The same text plus a box “I confirm I am 18 or over.” the guest must tick before the order can be placed or paid.',
  },
];

/**
 * Requirement Set #108 / P5: age_notice_mode. Read by the guest app at checkout, so changing
 * it here changes the app behaviour without a new delivery. The default must agree with
 * Sales Terms 4.5(c).
 */
export default function ComplianceSettings() {
  const { data, isLoading } = useGetComplianceSettingsQuery();
  const [update, { isLoading: saving }] = useUpdateComplianceSettingsMutation();
  const current = data?.data?.ageNoticeMode || 'notice';
  const savedTitle = data?.data?.orderingScreenTitle || 'In place Offer';
  const [title, setTitle] = useState(savedTitle);
  useEffect(() => setTitle(savedTitle), [savedTitle]);

  const saveTitle = async () => {
    const value = title.trim();
    if (!value || value.length > 40) {
      showError('Title must be 1–40 characters.');
      return;
    }
    try {
      await update({ orderingScreenTitle: value }).unwrap();
      showSuccess('Ordering screen title saved. The app shows it the next time the menu opens.');
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const onChange = async (value: string) => {
    if (value === current) return;
    try {
      await update({ ageNoticeMode: value as 'notice' | 'confirmation' }).unwrap();
      showSuccess(`18+ order notice mode set to “${value}”. The app picks it up on the next checkout.`);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-8">
      {/* Requirement Set #144 — title of the guest ordering screen, a setting not fixed in code */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold">Guest ordering screen title</h3>
          <p className="text-muted-foreground text-sm">
            Shown at the top of the venue menu in the app. Pleis presents the venue&apos;s offer, consumed in the venue — the basket (“My Order”) and
            “Add to Order” keep their names.
          </p>
        </div>
        <div className="flex max-w-xl flex-col gap-2 sm:flex-row">
          <Input value={title} maxLength={40} onChange={(e) => setTitle(e.target.value)} disabled={isLoading || saving} aria-label="Ordering screen title" />
          <Button onClick={saveTitle} disabled={isLoading || saving || title.trim() === savedTitle}>
            Save title
          </Button>
        </div>
      </div>

      <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">18+ order notice</h3>
        <p className="text-muted-foreground text-sm">
          Shown once per order above the pay / place-order button when the order contains an age-restricted item (menu item, ticket or reservation).
          The default must agree with Sales Terms 4.5(c).
        </p>
      </div>
      <RadioGroup value={current} onValueChange={onChange} disabled={isLoading || saving} className="gap-3">
        {MODES.map((m) => (
          <Label
            key={m.value}
            htmlFor={`age-mode-${m.value}`}
            className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 font-normal dark:border-gray-700 ${current === m.value ? 'border-primary' : ''}`}
          >
            <RadioGroupItem id={`age-mode-${m.value}`} value={m.value} className="mt-0.5" />
            <span>
              <span className="block font-semibold">{m.title}</span>
              <span className="text-muted-foreground block text-sm">{m.text}</span>
            </span>
          </Label>
        ))}
      </RadioGroup>
      </div>
    </div>
  );
}
