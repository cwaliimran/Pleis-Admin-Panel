'use client';

import ButtonLoading from '@/components/common/button-loading';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React from 'react';

interface SettingsCardProps {
  title: string;
  description: string;
  /** Rendered on the right of the card header — e.g. the "+ Add DO" button. */
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  /** Omit both save props for cards that persist immediately (delivery options). */
  saveLabel?: string;
  onSave?: () => void;
  isSaving?: boolean;
  canSave?: boolean;
  bodyClassName?: string;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  description,
  headerAction,
  children,
  saveLabel,
  onSave,
  isSaving = false,
  canSave = true,
  bodyClassName,
}) => {
  const hasFooter = Boolean(saveLabel && onSave);

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#222121]">
      <header className="flex items-start justify-between gap-4 border-b border-gray-200 px-7 py-6 dark:border-gray-800">
        <div className="flex-1">
          <h2 className="mb-1 text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        {headerAction}
      </header>

      <div className={cn(bodyClassName)}>{children}</div>

      {hasFooter && (
        <footer className="flex justify-end border-t border-gray-200 bg-gray-50 px-7 py-4 dark:border-gray-800 dark:bg-[#1a1a1a]">
          {isSaving ? (
            <Button type="button" disabled className="h-10 cursor-not-allowed gap-2 font-semibold">
              <ButtonLoading title="Saving" />
            </Button>
          ) : (
            <Button type="button" onClick={onSave} disabled={!canSave} className="h-10 gap-2 font-semibold">
              {saveLabel}
            </Button>
          )}
        </footer>
      )}
    </section>
  );
};
