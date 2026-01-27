import React from 'react';
import { Calendar, Package } from 'lucide-react';
import { SubscriptionConfig } from './types';
import { format } from 'date-fns';

interface CurrentSubscriptionBoxProps {
  subscription: SubscriptionConfig;
  startDate: string;
  endDate: string;
  lockedInPrice?: number; // From API if different from calculated
  calculatedPrice?: number; // Calculated from current pricing
}

export const CurrentSubscriptionBox: React.FC<CurrentSubscriptionBoxProps> = ({
  subscription,
  startDate,
  endDate,
  lockedInPrice,
  calculatedPrice,
}) => {
  const hasLockedInPrice = lockedInPrice !== undefined && calculatedPrice !== undefined;
  const isPriceDifferent = hasLockedInPrice && Math.abs(lockedInPrice - calculatedPrice) > 0.01;

  const displayPrice = isPriceDifferent ? lockedInPrice : calculatedPrice || lockedInPrice || 0;
  const priceLabel = subscription.billingCycle === 'yearly' ? '/year' : '/month';

  return (
    <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6 shadow-sm dark:border-blue-800 dark:bg-blue-950/30">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-blue-600 dark:text-blue-500" />
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">Current Active Subscription</h3>
        </div>
        <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white dark:bg-blue-700">ACTIVE</span>
      </div>

      {/* Subscription Details */}
      <div className="mb-4 space-y-3">
        {/* Modules */}
        <div className="flex items-start justify-between">
          <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Modules:</span>
          <div className="flex flex-wrap justify-end gap-1">
            {subscription.modules.map((module) => (
              <span
                key={module}
                className="rounded-md bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 capitalize dark:bg-blue-900/50 dark:text-blue-200"
              >
                {module}
              </span>
            ))}
            {subscription.includeAnalytics && (
              <span className="rounded-md bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800 dark:bg-purple-900/50 dark:text-purple-200">
                Analytics
              </span>
            )}
          </div>
        </div>

        {/* Organizations */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Organizations:</span>
          <span className="text-sm font-bold text-blue-900 dark:text-blue-100">{subscription.organizationCount}</span>
        </div>

        {/* Billing Cycle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Billing Cycle:</span>
          <span className="text-sm font-bold text-blue-900 capitalize dark:text-blue-100">{subscription.billingCycle}</span>
        </div>

        {/* Subscription Period */}
        <div className="flex items-center justify-between border-t border-blue-200 pt-3 dark:border-blue-800">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-500" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Period:</span>
          </div>
          <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
            {format(new Date(startDate), 'MMM dd, yyyy')} - {format(new Date(endDate), 'MMM dd, yyyy')}
          </span>
        </div>
      </div>

      {/* Price Display */}
      <div className="rounded-lg border border-blue-300 bg-white/50 p-4 dark:border-blue-700 dark:bg-blue-900/20">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Current Price:</span>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              €{displayPrice?.toFixed(2)}
              <span className="text-sm font-normal text-blue-700 dark:text-blue-500">{priceLabel}</span>
            </div>
            {subscription.billingCycle === 'yearly' && (
              <div className="text-xs text-blue-600 dark:text-blue-500">(€{subscription.monthlyEquivalent.toFixed(2)}/month)</div>
            )}
          </div>
        </div>

        {/* Locked-in Price Notice */}
        {isPriceDifferent && (
          <div className="mt-3 rounded-md border border-yellow-300 bg-yellow-50 p-2 dark:border-yellow-800 dark:bg-yellow-950/30">
            <p className="text-xs text-yellow-800 dark:text-yellow-400">
              💡 <strong>Locked-in rate:</strong> Your price is different from current pricing (€{calculatedPrice.toFixed(2)}) due to admin
              adjustments or promotional rates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
