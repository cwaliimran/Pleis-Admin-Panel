import { format } from 'date-fns';
import { ArrowRight, Calendar, RefreshCw } from 'lucide-react';
import React from 'react';
import { BillingCycleChangeCalculation } from './types';

interface BillingCycleChangeBoxProps {
  change: BillingCycleChangeCalculation;
}

export const BillingCycleChangeBox: React.FC<BillingCycleChangeBoxProps> = ({ change }) => {
  const { breakdown } = change;

  return (
    <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6 shadow-sm dark:border-amber-800 dark:bg-amber-950/20">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-amber-600 dark:text-amber-500" />
          <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100">Billing Cycle Change</h3>
        </div>
        <span className="rounded-full bg-amber-600 px-3 py-1 text-xs font-bold text-white dark:bg-amber-700">NEXT RECURRING</span>
      </div>

      {/* Billing Cycle Transition */}
      <div className="mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-white p-3 dark:border-amber-800 dark:bg-amber-900/20">
        <div className="rounded-md bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-800 capitalize dark:bg-amber-900/40 dark:text-amber-200">
          {change.oldBillingCycle}
        </div>
        <ArrowRight className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <div className="rounded-md bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white capitalize dark:bg-amber-700">
          {change.newBillingCycle}
        </div>
      </div>

      {/* Full Pricing Breakdown (fresh calculation, same as free-to-paid) */}
      <div className="mb-4 rounded-lg border border-amber-200 bg-white p-4 dark:border-amber-800 dark:bg-amber-900/20">
        <p className="mb-3 text-xs font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-400">Pricing Breakdown</p>

        <div className="space-y-3">
          {/* Base Module Price (excluding analytics) */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Selected Modules Price ({breakdown.nonAnalyticsCount} module{breakdown.nonAnalyticsCount > 1 ? 's' : ''}, excluding analytics):
            </span>
            <span className="text-base font-medium text-gray-900 dark:text-gray-100">€{breakdown.nonAnalyticsPrice.toFixed(2)}</span>
          </div>

          {/* Bundle Discount */}
          {breakdown.bundleDiscountPercent > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-green-600 dark:text-green-500">
                Bundle Discount ({breakdown.nonAnalyticsCount} non-analytics modules - {breakdown.bundleDiscountPercent}%):
              </span>
              <span className="text-base font-semibold text-green-600 dark:text-green-500">-€{breakdown.bundleDiscountAmount.toFixed(2)}</span>
            </div>
          )}

          {/* After Bundle Discount */}
          {breakdown.bundleDiscountPercent > 0 && (
            <div className="flex items-center justify-between border-t border-amber-200 pt-3 dark:border-amber-800">
              <span className="text-sm text-gray-700 dark:text-gray-300">After Bundle Discount:</span>
              <span className="text-base font-medium text-gray-900 dark:text-gray-100">€{breakdown.priceAfterBundleDiscount.toFixed(2)}</span>
            </div>
          )}

          {/* Analytics (if included) */}
          {breakdown.analyticsPrice > 0 && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">+ Analytics (no bundle discount):</span>
                <span className="text-base font-medium text-gray-900 dark:text-gray-100">€{breakdown.analyticsPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-amber-200 pt-3 dark:border-amber-800">
                <span className="text-sm text-gray-700 dark:text-gray-300">Subtotal before orgs:</span>
                <span className="text-base font-medium text-gray-900 dark:text-gray-100">€{breakdown.subtotalBeforeOrgs.toFixed(2)}</span>
              </div>
            </>
          )}

          {/* Price per Org */}
          <div className="flex items-center justify-between border-t border-amber-200 pt-3 dark:border-amber-800">
            <span className="text-sm text-gray-700 dark:text-gray-300">Price per Org (at {breakdown.orgPricingPercent}%):</span>
            <span className="text-base font-medium text-gray-900 dark:text-gray-100">€{breakdown.pricePerOrg.toFixed(2)}</span>
          </div>

          {/* Organizations Multiplier */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              × {breakdown.numberOfOrganizations} Organization{breakdown.numberOfOrganizations > 1 ? 's' : ''}:
            </span>
            <span className="text-base font-medium text-gray-900 dark:text-gray-100">€{breakdown.totalMultiOrgPrice.toFixed(2)}</span>
          </div>

          {/* Yearly Calculations */}
          {breakdown.billingCycle === 'yearly' && (
            <>
              <div className="flex items-center justify-between border-t border-amber-200 pt-3 dark:border-amber-800">
                <span className="text-sm text-gray-700 dark:text-gray-300">Monthly × 12:</span>
                <span className="text-base font-medium text-gray-900 dark:text-gray-100">€{breakdown.monthlyTimesWelve.toFixed(2)}</span>
              </div>

              {breakdown.yearlyDiscountPercent > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-green-600 dark:text-green-500">
                    Yearly Discount ({breakdown.yearlyDiscountPercent}%):
                  </span>
                  <span className="text-base font-semibold text-green-600 dark:text-green-500">-€{breakdown.yearlyDiscountAmount.toFixed(2)}</span>
                </div>
              )}
            </>
          )}

          {/* Final Total */}
          <div className="flex items-center justify-between border-t-2 border-amber-400 pt-3 dark:border-amber-600">
            <span className="text-base font-bold text-amber-900 dark:text-amber-300">
              Total {breakdown.billingCycle === 'yearly' ? 'Yearly' : 'Monthly'} Amount:
            </span>
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-500">€{breakdown.finalAmount.toFixed(2)}</span>
          </div>

          {/* Monthly Equivalent for Yearly */}
          {breakdown.billingCycle === 'yearly' && (
            <div className="text-right">
              <span className="text-xs text-gray-600 dark:text-gray-400">(€{(breakdown.finalAmount / 12).toFixed(2)}/month equivalent)</span>
            </div>
          )}
        </div>
      </div>

      {/* Effective date notice */}
      <div className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-400">
        <Calendar className="h-3.5 w-3.5" />
        <span>
          This change takes effect on <strong>{format(new Date(change.effectiveDate), 'MMMM dd, yyyy')}</strong> (next billing cycle). No charges will
          be applied today.
        </span>
      </div>
    </div>
  );
};
