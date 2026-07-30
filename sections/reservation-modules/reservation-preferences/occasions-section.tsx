'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showError } from '@/utils/toast';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import { SettingsCard } from './settings-card';
import { Occasion } from './types';

interface OccasionsSectionProps {
  value: Occasion[];
  onChange: (next: Occasion[]) => void;
  disabled?: boolean;
}

export const OccasionsSection: React.FC<OccasionsSectionProps> = ({ value, onChange, disabled = false }) => {
  const [draft, setDraft] = useState('');

  const handleAdd = () => {
    const label = draft.trim();
    if (!label) return;

    if (value.some((occasion) => occasion.label.toLowerCase() === label.toLowerCase())) {
      showError(`"${label}" is already in the list`);
      return;
    }

    // No id yet — the API mints one on save, the same way it does for the seed list.
    onChange([...value, { id: '', label, isSystem: false }]);
    setDraft('');
  };

  const handleRemove = (target: Occasion) => {
    onChange(value.filter((occasion) => occasion !== target));
  };

  return (
    <SettingsCard title="Occasions" description={'Options shown in the reservation form’s "Occasion" field. "Other" is always available.'}>
      <div className="flex flex-wrap gap-2">
        {value.map((occasion, index) =>
          occasion.isSystem ? (
            <span
              key={`${occasion.label}-${index}`}
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-400 dark:bg-gray-800 dark:text-gray-500"
            >
              {occasion.label}
              <span className="text-[10px] font-bold tracking-wide text-gray-400 uppercase dark:text-gray-500">System</span>
            </span>
          ) : (
            <span
              key={`${occasion.label}-${index}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 py-1.5 pr-2 pl-3 text-sm font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
            >
              {occasion.label}
              <button
                type="button"
                aria-label={`Remove ${occasion.label}`}
                disabled={disabled}
                onClick={() => handleRemove(occasion)}
                className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-blue-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-blue-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )
        )}
      </div>

      <div className="mt-5 flex items-center gap-2">
        <Input
          value={draft}
          disabled={disabled}
          aria-label="New occasion"
          placeholder="Add new occasion"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return;
            // The card sits inside the page form — Enter should add, not submit.
            event.preventDefault();
            handleAdd();
          }}
          className="h-10 flex-1 bg-white dark:bg-[#1a1a1a]"
        />
        <Button type="button" onClick={handleAdd} disabled={disabled || !draft.trim()} className="h-10 shrink-0 cursor-pointer font-semibold">
          + Add
        </Button>
      </div>
    </SettingsCard>
  );
};
