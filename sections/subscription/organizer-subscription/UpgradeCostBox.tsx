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
  const prorationRatio = upgrade.totalDays > 0 ? Math.min(1, Math.max(0, upgrade.daysRemaining / upgrade.totalDays)) : 1;
  const compositionTotal = upgrade.moduleCost + upgrade.analyticsCost + upgrade.orgCost;
  const orgRate = upgrade.multiOrgDiscountPercent / 100;
  const baseForAddedOrgs = hasOrgs && orgRate > 0 ? upgrade.orgCost / orgRate : 0;
  const orgTierDiscountAmount = hasOrgs ? Math.max(0, baseForAddedOrgs - upgrade.orgCost) : 0;
  const perAddedOrgBase = hasOrgs && upgrade.orgsAdded > 0 ? baseForAddedOrgs / upgrade.orgsAdded : 0;
  const perAddedOrgAfterDiscount = hasOrgs && upgrade.orgsAdded > 0 ? upgrade.orgCost / upgrade.orgsAdded : 0;

  return (
    <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6 shadow-sm dark:border-blue-800 dark:bg-blue-950/20">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-500" />
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">Upgrade Cost</h3>
        </div>
        <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white dark:bg-blue-700">IMMEDIATE</span>
      </div>

      {/* 1) What Changed */}
      <div className="mb-4">
        <p className="mb-3 text-sm font-semibold text-blue-800 dark:text-blue-300">What Changed</p>
        <div className="space-y-2">
          {/* Added Modules */}
          {hasModules && (
            <div className="flex items-start gap-2 rounded-md border border-blue-200 bg-white p-3 dark:border-blue-800 dark:bg-blue-900/20">
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
            <div className="flex items-start gap-2 rounded-md border border-blue-200 bg-white p-3 dark:border-blue-800 dark:bg-blue-900/20">
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
            <div className="flex items-start gap-2 rounded-md border border-blue-200 bg-white p-3 dark:border-blue-800 dark:bg-blue-900/20">
              <Plus className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-500" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Advanced Analytics</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2) Billing Period */}
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-blue-200 bg-white p-3 dark:border-blue-800 dark:bg-blue-900/20">
        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <div className="flex-1">
          <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Remaining period: <strong>{upgrade.daysRemaining}</strong> day{upgrade.daysRemaining > 1 ? 's' : ''} of {upgrade.totalDays}
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-400">
            {format(upgrade.upgradeDate, 'MMM dd')} - {format(upgrade.subscriptionEndDate, 'MMM dd, yyyy')}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-blue-700 dark:text-blue-400">Proration</div>
          <div className="text-sm font-semibold text-blue-900 dark:text-blue-100">{(prorationRatio * 100).toFixed(2)}%</div>
        </div>
      </div>

      {/* 3) Calculation Summary */}
      <div className="mb-4 rounded-lg border border-blue-200 bg-white p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <p className="mb-3 text-xs font-semibold tracking-wide text-blue-700 uppercase dark:text-blue-400">Calculation Summary</p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Base price (added organizations)</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{hasOrgs ? `€${baseForAddedOrgs.toFixed(2)}` : 'N/A'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Discount</span>
            <span className="font-medium text-green-600 dark:text-green-400">
              {hasOrgs ? `-€${orgTierDiscountAmount.toFixed(2)}` : 'Included in plan pricing'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">After discount (added organizations)</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{hasOrgs ? `€${upgrade.orgCost.toFixed(2)}` : 'N/A'}</span>
          </div>

          {hasOrgs && (
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>Per added organization after discount ({upgrade.orgsAdded} added)</span>
              <span>
                €{perAddedOrgAfterDiscount.toFixed(2)}
                {perAddedOrgBase > 0 ? ` (from €${perAddedOrgBase.toFixed(2)} base)` : ''}
              </span>
            </div>
          )}

          {(upgrade.moduleCost > 0 || upgrade.analyticsCost > 0) && (
            <div className="flex items-center justify-between border-t border-blue-200 pt-2 text-gray-700 dark:border-blue-800 dark:text-gray-300">
              <span>Other upgrade impact (modules/analytics)</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">€{(upgrade.moduleCost + upgrade.analyticsCost).toFixed(2)}</span>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-blue-200 pt-2 text-sm dark:border-blue-800">
            <span className="text-gray-700 dark:text-gray-300">After discount (total upgrade impact)</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">€{compositionTotal.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>
              Proration ({upgrade.daysRemaining}/{upgrade.totalDays})
            </span>
            <span>{(prorationRatio * 100).toFixed(2)}%</span>
          </div>
        </div>
      </div>

      {/* 4) Final Charge */}
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

      <p className="mt-3 text-xs text-blue-800 dark:text-blue-400">
        Charge today reflects only the additional value for the remaining billing period.
      </p>
    </div>
  );
};
