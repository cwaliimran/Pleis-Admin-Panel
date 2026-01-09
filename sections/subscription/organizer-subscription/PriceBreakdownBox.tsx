import React from 'react';
import { Calculator } from 'lucide-react';

interface PriceBreakdownData {
  baseModulePrice: number;
  selectedModulesCount: number;
  nonAnalyticsCount: number;
  bundleDiscountPercent: number;
  bundleDiscountAmount: number;
  priceAfterBundleDiscount: number;
  analyticsPrice: number;
  subtotalBeforeOrgs: number;
  orgPricingPercent: number;
  pricePerOrg: number;
  numberOfOrganizations: number;
  totalMultiOrgPrice: number;
  billingCycle: 'monthly' | 'yearly';
  monthlyTimesWelve: number;
  yearlyDiscountPercent: number;
  yearlyDiscountAmount: number;
  finalAmount: number;
}

interface PriceBreakdownBoxProps {
  breakdown: PriceBreakdownData;
}

export const PriceBreakdownBox: React.FC<PriceBreakdownBoxProps> = ({ breakdown }) => {
  return (
    <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm dark:border-blue-800 dark:from-blue-950/40 dark:to-indigo-950/40">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-500" />
        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">Pricing Breakdown</h3>
      </div>

      {/* Breakdown Lines */}
      <div className="space-y-3">
        {/* Base Module Price */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Base Module Price ({breakdown.selectedModulesCount} module{breakdown.selectedModulesCount > 1 ? 's' : ''}):
          </span>
          <span className="text-base font-medium text-gray-900 dark:text-gray-100">€{breakdown.baseModulePrice.toFixed(2)}</span>
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
          <div className="flex items-center justify-between border-t border-blue-200 pt-3 dark:border-blue-800">
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
            <div className="flex items-center justify-between border-t border-blue-200 pt-3 dark:border-blue-800">
              <span className="text-sm text-gray-700 dark:text-gray-300">Subtotal before orgs:</span>
              <span className="text-base font-medium text-gray-900 dark:text-gray-100">€{breakdown.subtotalBeforeOrgs.toFixed(2)}</span>
            </div>
          </>
        )}

        {/* Price per Org */}
        <div className="flex items-center justify-between border-t border-blue-200 pt-3 dark:border-blue-800">
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
            <div className="flex items-center justify-between border-t border-blue-200 pt-3 dark:border-blue-800">
              <span className="text-sm text-gray-700 dark:text-gray-300">Monthly × 12:</span>
              <span className="text-base font-medium text-gray-900 dark:text-gray-100">€{breakdown.monthlyTimesWelve.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-green-600 dark:text-green-500">Yearly Discount ({breakdown.yearlyDiscountPercent}%):</span>
              <span className="text-base font-semibold text-green-600 dark:text-green-500">-€{breakdown.yearlyDiscountAmount.toFixed(2)}</span>
            </div>
          </>
        )}

        {/* Final Total */}
        <div className="flex items-center justify-between border-t-2 border-blue-400 pt-3 dark:border-blue-600">
          <span className="text-base font-bold text-blue-900 dark:text-blue-300">
            Total {breakdown.billingCycle === 'yearly' ? 'Yearly' : 'Monthly'} Amount:
          </span>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-500">€{breakdown.finalAmount.toFixed(2)}</span>
        </div>

        {/* Monthly Equivalent for Yearly */}
        {breakdown.billingCycle === 'yearly' && (
          <div className="text-right">
            <span className="text-xs text-gray-600 dark:text-gray-400">(€{(breakdown.finalAmount / 12).toFixed(2)}/month equivalent)</span>
          </div>
        )}
      </div>
    </div>
  );
};
