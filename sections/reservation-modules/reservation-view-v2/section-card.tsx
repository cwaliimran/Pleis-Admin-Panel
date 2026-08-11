'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface SectionCardProps {
  title: string;
  caption?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, caption, subtitle, headerAction, children, className, bodyClassName }) => {
  return (
    <section
      className={cn('overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#222121]', className)}
    >
      <header className="flex flex-col gap-3 px-6 pt-5 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>

        {headerAction ||
          (caption && (
            <span className="shrink-0 text-[11px] font-semibold tracking-wide text-gray-400 uppercase dark:text-gray-500">{caption}</span>
          ))}
      </header>

      <div className={cn('px-6 pb-6', bodyClassName)}>{children}</div>
    </section>
  );
};
