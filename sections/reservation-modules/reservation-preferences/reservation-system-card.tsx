'use client';

import CustomBadge from '@/components/ui/custom-badge';
import { CalendarCheck } from 'lucide-react';
import React from 'react';
import { ToggleSwitch } from './toggle-switch';

interface ReservationSystemCardProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

export const ReservationSystemCard: React.FC<ReservationSystemCardProps> = ({ enabled, onChange, disabled = false }) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-gray-800 dark:bg-[#222121]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
            <CalendarCheck className="h-5 w-5" />
          </span>

          <div className="min-w-0">
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Reservation system</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              The reservation section is{' '}
              <span className="font-semibold text-gray-700 dark:text-gray-200">{enabled ? 'visible in the user app' : 'hidden in the user app'}</span>.
              Guests can browse and submit reservation requests. Requires at least one active reservation type.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:pl-4">
          <CustomBadge variant={enabled ? 'success' : 'default'} className="pointer-events-none gap-1.5">
            <span className={enabled ? 'h-1.5 w-1.5 rounded-full bg-green-600' : 'h-1.5 w-1.5 rounded-full bg-gray-500'} />
            {enabled ? 'Active' : 'Inactive'}
          </CustomBadge>

          <ToggleSwitch ariaLabel="Reservation system" checked={enabled} disabled={disabled} onChange={onChange} />
        </div>
      </div>
    </section>
  );
};
