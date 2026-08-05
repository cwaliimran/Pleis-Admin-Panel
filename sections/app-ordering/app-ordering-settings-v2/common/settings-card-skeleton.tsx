'use client';

import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { SettingRowSkeleton } from './setting-row-skeleton';

interface SettingsCardSkeletonProps {
  /** How many `SettingRow` placeholders to render in the body. */
  rows?: number;
  /** Cards that persist immediately (delivery options) have no footer. */
  hasFooter?: boolean;
}

/**
 * Placeholder for a whole `SettingsCard`, chrome included — used while a
 * section has no record to render its own header from.
 */
export const SettingsCardSkeleton: React.FC<SettingsCardSkeletonProps> = ({ rows = 1, hasFooter = true }) => (
  <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#222121]">
    <header className="border-b border-gray-200 px-7 py-6 dark:border-gray-800">
      <Skeleton className="mb-3 h-5 w-48" />
      <Skeleton className="h-3.5 w-80 max-w-full" />
    </header>

    {Array.from({ length: rows }).map((_, index) => (
      <SettingRowSkeleton key={index} divider={index < rows - 1} />
    ))}

    {hasFooter && (
      <footer className="flex justify-end border-t border-gray-200 bg-gray-50 px-7 py-4 dark:border-gray-800 dark:bg-[#1a1a1a]">
        <Skeleton className="h-10 w-44 rounded-md" />
      </footer>
    )}
  </section>
);
