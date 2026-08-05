'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { Loader2, X } from 'lucide-react';
import React, { useState } from 'react';
import { SettingsCard } from '../settings-card';
import { OccasionChipsSkeleton } from './occasion-chips-skeleton';
import { Occasion } from './types';
import { useOccasions } from './use-occasions';

interface OccasionsSectionProps {
  /** The section loads and writes its own data; this is all it needs from the page. */
  organizationId?: string;
}

export const OccasionsSection: React.FC<OccasionsSectionProps> = ({ organizationId }) => {
  const { occasions, isLoading, isMutating, isCreating, pendingDeleteId, createOccasion, deleteOccasion } = useOccasions(organizationId);

  const [draft, setDraft] = useState('');

  const isBusy = isMutating || !organizationId;

  const handleAdd = async () => {
    const label = draft.trim();
    if (!label) return;

    if (occasions.some((occasion) => occasion.label.toLowerCase() === label.toLowerCase())) {
      showError(`"${label}" is already in the list`);
      return;
    }

    try {
      const message = await createOccasion(label);
      // Cleared only once the write lands, so a failed add keeps what was typed.
      setDraft('');
      showSuccess(message || `"${label}" added`);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleRemove = async (occasion: Occasion) => {
    try {
      const message = await deleteOccasion(occasion.id);
      showSuccess(message || `"${occasion.label}" removed`);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  return (
    <SettingsCard title="Occasions" description={'Options shown in the reservation form’s "Occasion" field.'}>
      {isLoading ? (
        <OccasionChipsSkeleton />
      ) : (
        <div className="flex flex-wrap gap-2">
          {occasions.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">No occasions yet — add the first one below.</p>}

          {occasions.map((occasion) => (
            <span
              key={occasion.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 py-1.5 pr-2 pl-3 text-sm font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
            >
              {occasion.label}
              <button
                type="button"
                aria-label={`Remove ${occasion.label}`}
                disabled={isBusy}
                onClick={() => handleRemove(occasion)}
                className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-blue-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-blue-900"
              >
                {/* Only the chip being deleted spins; the rest just disable. */}
                {pendingDeleteId === occasion.id ? (
                  <span className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-current border-t-transparent" />
                ) : (
                  <X className="h-3 w-3" />
                )}
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center gap-2">
        <Input
          value={draft}
          disabled={isBusy || isLoading}
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
        {/* Fixed width so swapping the label for the spinner does not resize the button. */}
        <Button
          type="button"
          onClick={handleAdd}
          disabled={isBusy || isLoading || !draft.trim()}
          className="h-10 w-24 shrink-0 cursor-pointer font-semibold disabled:cursor-not-allowed"
        >
          {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : '+ Add'}
        </Button>
      </div>
    </SettingsCard>
  );
};
