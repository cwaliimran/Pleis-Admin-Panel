import React from 'react';
import { RefreshCw } from 'lucide-react';
import { NextRecurringCalculation } from './types';
import { format } from 'date-fns';

interface NextRecurringBoxProps {
  nextRecurring: NextRecurringCalculation;
  isFreePlan?: boolean;
}

export const NextRecurringBox: React.FC<NextRecurringBoxProps> = ({ nextRecurring, isFreePlan = false }) => {
  if (isFreePlan) {
    return (
      <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/30">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Next Recurring Plan</h3>
          </div>
          <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white dark:bg-green-700">FREE</span>
        </div>

        {/* Free Plan Message */}
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center dark:border-green-800 dark:bg-green-950/30">
          <p className="mb-2 text-lg font-bold text-green-800 dark:text-green-300">Switching to Free Plan</p>
          <p className="mb-4 text-sm text-green-700 dark:text-green-400">
            Starting from <strong>{format(new Date(nextRecurring.startDate), 'MMMM dd, yyyy')}</strong>
          </p>
          <div className="text-4xl font-bold text-green-600 dark:text-green-500">€0/month</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-6 shadow-sm dark:border-purple-800 dark:bg-purple-950/30">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-purple-600 dark:text-purple-500" />
          <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100">Next Recurring Plan</h3>
        </div>
        <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-bold text-white dark:bg-purple-700">
          FROM {format(new Date(nextRecurring.startDate), 'MMM dd')}
        </span>
      </div>

      {/* Configuration Summary */}
      <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Modules */}
        <div>
          <span className="text-xs font-medium text-purple-700 dark:text-purple-400">Modules</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {nextRecurring.modules.map((module) => (
              <span
                key={module}
                className="rounded bg-purple-100 px-1.5 py-0.5 text-xs font-semibold text-purple-800 capitalize dark:bg-purple-900/50 dark:text-purple-200"
              >
                {module}
              </span>
            ))}
            {nextRecurring.includeAnalytics && (
              <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-xs font-semibold text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200">
                Analytics
              </span>
            )}
          </div>
        </div>

        {/* Organizations */}
        <div>
          <span className="text-xs font-medium text-purple-700 dark:text-purple-400">Organizations</span>
          <p className="mt-1 text-lg font-bold text-purple-900 dark:text-purple-100">{nextRecurring.organizationCount}</p>
        </div>

        {/* Billing */}
        <div>
          <span className="text-xs font-medium text-purple-700 dark:text-purple-400">Billing</span>
          <p className="mt-1 text-lg font-bold text-purple-900 capitalize dark:text-purple-100">{nextRecurring.billingCycle}</p>
        </div>

        {/* Start Date */}
        <div>
          <span className="text-xs font-medium text-purple-700 dark:text-purple-400">Starts</span>
          <p className="mt-1 text-sm font-semibold text-purple-900 dark:text-purple-100">
            {format(new Date(nextRecurring.startDate), 'MMM dd, yyyy')}
          </p>
        </div>
      </div>

      {/* Price Display */}
      <div className="rounded-lg border border-purple-300 bg-white p-4 dark:border-purple-700 dark:bg-purple-900/30">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
              {nextRecurring.billingCycle === 'yearly' ? 'Yearly' : 'Monthly'} Amount
            </span>
            {nextRecurring.billingCycle === 'yearly' && (
              <p className="text-xs text-purple-700 dark:text-purple-400">(€{nextRecurring.monthlyTotal.toFixed(2)}/month equivalent)</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-500">€{nextRecurring.displayAmount.toFixed(2)}</div>
          </div>
        </div>

        {/* Discounts Applied */}
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {nextRecurring.bundleDiscountPercent > 0 && (
            <span className="rounded-full bg-green-100 px-2 py-1 font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
              ✓ Bundle {nextRecurring.bundleDiscountPercent}%
            </span>
          )}
          {nextRecurring.organizationCount > 1 && (
            <span className="rounded-full bg-green-100 px-2 py-1 font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
              ✓ Multi-org {100 - nextRecurring.multiOrgDiscountPercent}% off
            </span>
          )}
          {nextRecurring.yearlyDiscountPercent && (
            <span className="rounded-full bg-green-100 px-2 py-1 font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
              ✓ Yearly {nextRecurring.yearlyDiscountPercent}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
