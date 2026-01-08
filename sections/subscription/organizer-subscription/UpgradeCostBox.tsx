import React from 'react';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { ProratedUpgradeCalculation } from './types';
import { format } from 'date-fns';

interface UpgradeCostBoxProps {
  upgrade: ProratedUpgradeCalculation;
}

export const UpgradeCostBox: React.FC<UpgradeCostBoxProps> = ({ upgrade }) => {
  const hasModules = upgrade.modulesAdded.length > 0;
  const hasOrgs = upgrade.orgsAdded > 0;
  const hasAnalytics = upgrade.analyticsAdded;

  return (
    <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6 shadow-sm dark:border-green-800 dark:bg-green-950/30">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-500" />
          <h3 className="text-lg font-bold text-green-900 dark:text-green-100">Upgrade Cost (Prorated)</h3>
        </div>
        <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white dark:bg-green-700">IMMEDIATE</span>
      </div>

      {/* What's Being Added */}
      <div className="mb-4 space-y-3">
        <p className="text-sm font-medium text-green-800 dark:text-green-300">You&apos;re adding:</p>

        {/* Added Modules */}
        {hasModules && (
          <div className="flex items-start gap-2">
            <span className="text-xs text-green-700 dark:text-green-400">•</span>
            <div className="flex-1">
              <span className="text-sm text-green-800 dark:text-green-300">
                <strong>{upgrade.modulesAdded.length}</strong> module{upgrade.modulesAdded.length > 1 ? 's' : ''}:{' '}
              </span>
              <div className="mt-1 flex flex-wrap gap-1">
                {upgrade.modulesAdded.map((module) => (
                  <span
                    key={module}
                    className="rounded-md bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 capitalize dark:bg-green-900/50 dark:text-green-200"
                  >
                    {module}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Added Organizations */}
        {hasOrgs && (
          <div className="flex items-start gap-2">
            <span className="text-xs text-green-700 dark:text-green-400">•</span>
            <span className="text-sm text-green-800 dark:text-green-300">
              <strong>+{upgrade.orgsAdded}</strong> organization{upgrade.orgsAdded > 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Added Analytics */}
        {hasAnalytics && (
          <div className="flex items-start gap-2">
            <span className="text-xs text-green-700 dark:text-green-400">•</span>
            <span className="text-sm text-green-800 dark:text-green-300">
              <strong>Advanced Analytics</strong>
            </span>
          </div>
        )}
      </div>

      {/* Time Period */}
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-300 bg-white/50 p-3 dark:border-green-700 dark:bg-green-900/20">
        <Calendar className="h-4 w-4 text-green-600 dark:text-green-500" />
        <div className="flex-1">
          <div className="text-sm font-medium text-green-800 dark:text-green-300">
            For remaining <strong>{upgrade.daysRemaining}</strong> day{upgrade.daysRemaining > 1 ? 's' : ''} of {upgrade.totalDays}
          </div>
          <div className="text-xs text-green-700 dark:text-green-400">
            {format(upgrade.upgradeDate, 'MMM dd')} - {format(upgrade.subscriptionEndDate, 'MMM dd, yyyy')}
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="mb-4 space-y-2">
        <p className="text-xs font-semibold tracking-wide text-green-700 uppercase dark:text-green-400">Cost Breakdown</p>

        {/* Module Cost */}
        {upgrade.moduleCost > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-700 dark:text-green-400">Module{upgrade.modulesAdded.length > 1 ? 's' : ''} (no bundle discount)</span>
            <span className="font-semibold text-green-900 dark:text-green-100">€{upgrade.moduleCost.toFixed(2)}</span>
          </div>
        )}

        {/* Org Cost */}
        {upgrade.orgCost > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-700 dark:text-green-400">
              Organization{upgrade.orgsAdded > 1 ? 's' : ''} (with {upgrade.multiOrgDiscountPercent}% rate)
            </span>
            <span className="font-semibold text-green-900 dark:text-green-100">€{upgrade.orgCost.toFixed(2)}</span>
          </div>
        )}

        {/* Analytics Cost */}
        {upgrade.analyticsCost > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-700 dark:text-green-400">Analytics (no discounts)</span>
            <span className="font-semibold text-green-900 dark:text-green-100">€{upgrade.analyticsCost.toFixed(2)}</span>
          </div>
        )}

        {/* Yearly Discount Applied */}
        {upgrade.yearlyDiscountPercent > 0 && (
          <div className="flex items-center justify-between rounded-md bg-green-100 p-2 text-sm dark:bg-green-900/40">
            <span className="text-green-800 dark:text-green-300">✓ Yearly discount ({upgrade.yearlyDiscountPercent}%) applied</span>
          </div>
        )}
      </div>

      {/* Total Amount */}
      <div className="rounded-lg border-2 border-green-300 bg-white p-4 dark:border-green-700 dark:bg-green-900/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-500" />
            <span className="text-sm font-bold text-green-800 dark:text-green-300">Charge Today:</span>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600 dark:text-green-500">€{upgrade.totalProratedAmount.toFixed(2)}</div>
            <div className="text-xs text-green-700 dark:text-green-400">One-time prorated charge</div>
          </div>
        </div>
      </div>

      {/* Important Note */}
      <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/30">
        <p className="text-xs text-blue-800 dark:text-blue-400">
          💡 <strong>Note:</strong> This is a one-time charge for the remaining {upgrade.daysRemaining} day{upgrade.daysRemaining > 1 ? 's' : ''} of
          your current subscription period. Your next regular billing will reflect the full new configuration with all applicable discounts.
        </p>
      </div>
    </div>
  );
};
