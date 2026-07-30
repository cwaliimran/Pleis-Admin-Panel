'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface SettingsCardProps {
  title: string;
  description?: React.ReactNode;
  /** Rendered on the right of the card header — e.g. "+ Create reservation type". */
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  /** Pinned to the bottom of the card, e.g. the total-capacity summary. */
  footer?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

/**
 * Card shell for this module. There is no per-card save footer — everything
 * on this page is persisted by the page-level "Save settings" button.
 */
export const SettingsCard: React.FC<SettingsCardProps> = ({ title, description, headerAction, children, footer, className, bodyClassName }) => {
  return (
    <section
      className={cn(
        'flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#222121]',
        className
      )}
    >
      <header className="flex items-start justify-between gap-4 px-6 pt-6 pb-5">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          {description && <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
        {headerAction}
      </header>

      <div className={cn('flex-1 px-6 pb-6', bodyClassName)}>{children}</div>

      {footer && <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">{footer}</div>}
    </section>
  );
};
