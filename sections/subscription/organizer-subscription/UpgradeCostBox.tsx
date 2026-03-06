import React from 'react';
import { TrendingUp, Calendar, DollarSign, Plus } from 'lucide-react';
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
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#222121]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Upgrade Cost</h3>
        </div>
        <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">IMMEDIATE</span>
      </div>

      {/* What's Being Added */}
      <div className="mb-4">
        <p className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">You&apos;re adding:</p>
        <div className="space-y-2">
          {/* Added Modules */}
          {hasModules && (
            <div className="flex items-start gap-2 rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/40">
              <Plus className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-500" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {upgrade.modulesAdded.length} Module{upgrade.modulesAdded.length > 1 ? 's' : ''}
                </span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {upgrade.modulesAdded.map((module) => (
                    <span
                      key={module}
                      className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700 capitalize dark:bg-gray-700 dark:text-gray-200"
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
            <div className="flex items-start gap-2 rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/40">
              <Plus className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-500" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {upgrade.orgsAdded} Organization{upgrade.orgsAdded > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}

          {/* Added Analytics */}
          {hasAnalytics && (
            <div className="flex items-start gap-2 rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/40">
              <Plus className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-500" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Advanced Analytics</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Time Period */}
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/40">
        <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            For remaining <strong>{upgrade.daysRemaining}</strong> day{upgrade.daysRemaining > 1 ? 's' : ''} of {upgrade.totalDays}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {format(upgrade.upgradeDate, 'MMM dd')} - {format(upgrade.subscriptionEndDate, 'MMM dd, yyyy')}
          </div>
        </div>
      </div>

      {/* Detailed Cost Breakdown */}
      <div className="mb-4 space-y-2 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/40">
        <p className="mb-3 text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-400">Cost Breakdown</p>

        {/* Module Cost */}
        {upgrade.moduleCost > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700 dark:text-gray-300">Added Module{upgrade.modulesAdded.length > 1 ? 's' : ''}:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">€{upgrade.moduleCost.toFixed(2)}</span>
            </div>
            <div className="ml-4 text-xs text-gray-500 dark:text-gray-400">(No bundle discount on upgrades)</div>
          </div>
        )}

        {/* Org Cost */}
        {upgrade.orgCost > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700 dark:text-gray-300">Added Organization{upgrade.orgsAdded > 1 ? 's' : ''}:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">€{upgrade.orgCost.toFixed(2)}</span>
            </div>
            <div className="ml-4 text-xs text-gray-500 dark:text-gray-400">(With {upgrade.multiOrgDiscountPercent}% rate applied)</div>
          </div>
        )}

        {/* Analytics Cost */}
        {upgrade.analyticsCost > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700 dark:text-gray-300">Analytics:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">€{upgrade.analyticsCost.toFixed(2)}</span>
            </div>
            <div className="ml-4 text-xs text-gray-500 dark:text-gray-400">(No discounts apply)</div>
          </div>
        )}

        {/* Yearly Discount Applied */}
        {upgrade.yearlyDiscountPercent > 0 && (
          <div className="mt-2 rounded-md border border-blue-200 bg-blue-50 p-2 text-xs dark:border-blue-800 dark:bg-blue-950/30">
            <span className="font-semibold text-blue-700 dark:text-blue-400">
              ✓ Yearly discount ({upgrade.yearlyDiscountPercent}%) applied to upgrade cost
            </span>
          </div>
        )}
      </div>

      {/* Total Amount */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            <span className="text-sm font-bold text-blue-800 dark:text-blue-300">Charge Today:</span>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-500">€{upgrade.totalProratedAmount.toFixed(2)}</div>
            <div className="text-xs text-blue-700 dark:text-blue-400">One-time prorated charge</div>
          </div>
        </div>
      </div>

      {/* Important Note */}
      <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/30">
        <p className="text-xs text-blue-800 dark:text-blue-400">
          💡 <strong>Note:</strong> This charge covers the remaining {upgrade.daysRemaining} day{upgrade.daysRemaining > 1 ? 's' : ''} of your current
          billing period. Your next regular bill will reflect the full new configuration with all discounts applied.
        </p>
      </div>
    </div>
  );
};
