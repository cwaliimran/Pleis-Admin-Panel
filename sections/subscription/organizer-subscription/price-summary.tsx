import { Sparkles } from 'lucide-react';
import React from 'react';
import { BillingCycle, ModuleId, PriceCalculation, PricingConfig } from './types';

interface PriceSummaryProps {
  selectedModules: ModuleId[];
  includeAnalytics: boolean;
  organizationCount: number;
  billingCycle: BillingCycle;
  pricing: PricingConfig;
  priceInfo: PriceCalculation;
  onBillingCycleChange: (cycle: BillingCycle) => void;
  onSubscribe: () => void;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  selectedModules,
  includeAnalytics,
  organizationCount,
  billingCycle,
  pricing,
  priceInfo,
  onBillingCycleChange,
  onSubscribe,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#222121]">
      <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">Billing & Price Summary</h3>

      {/* Billing Toggle */}
      <div className="mb-6 flex items-center justify-center gap-4">
        <button
          onClick={() => onBillingCycleChange('monthly')}
          className={`rounded-lg px-6 py-3 font-semibold transition-all ${
            billingCycle === 'monthly'
              ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
              : 'bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => onBillingCycleChange('yearly')}
          className={`relative rounded-lg px-6 py-3 font-semibold transition-all ${
            billingCycle === 'yearly'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
          }`}
        >
          Yearly
          <span className="absolute -top-2 -right-2 rounded-full bg-green-500 px-2 py-0.5 text-xs font-bold text-white">
            Save {pricing.yearlyDiscount}%
          </span>
        </button>
      </div>

      {/* Price Breakdown */}
      {selectedModules.length > 0 && (
        <div className="mb-6 space-y-3">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Selected modules ({selectedModules.length})</span>
            <span className="text-gray-900 dark:text-gray-100">
              €{selectedModules.reduce((sum, id) => sum + pricing.modules[id].price, 0).toFixed(2)}
            </span>
          </div>

          {priceInfo.bundleDiscountPercent > 0 && (
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-green-600 dark:text-green-500">🎉 Bundle discount ({priceInfo.bundleDiscountPercent}% off)</span>
              <span className="font-semibold text-green-600 dark:text-green-500">-€{priceInfo.bundleDiscountAmount}</span>
            </div>
          )}

          {organizationCount > 1 && (
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>× {organizationCount} organizations</span>
              <span className="text-gray-900 dark:text-gray-100">Applied</span>
            </div>
          )}

          {includeAnalytics && (
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Advanced Analytics</span>
              <span className="text-gray-900 dark:text-gray-100">€{pricing.analytics}</span>
            </div>
          )}

          <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900 dark:text-gray-100">{billingCycle === 'monthly' ? 'Monthly Total' : 'Yearly Total'}</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">
                  €{billingCycle === 'monthly' ? priceInfo.monthlyTotal : priceInfo.yearlyTotal}
                </div>
                {billingCycle === 'yearly' && (
                  <div className="text-xs text-gray-500 dark:text-gray-500">(€{(parseFloat(priceInfo.yearlyTotal) / 12).toFixed(2)}/month)</div>
                )}
              </div>
            </div>
          </div>

          {billingCycle === 'yearly' && parseFloat(priceInfo.savingsAmount) > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800/50 dark:bg-green-950/30">
              <Sparkles className="h-5 w-5 text-green-600 dark:text-green-500" />
              <span className="text-sm font-semibold text-green-800 dark:text-green-400">
                You save €{priceInfo.savingsAmount} per year with yearly billing! 🎉
              </span>
            </div>
          )}
        </div>
      )}

      {/* CTA Button */}
      <button
        disabled={selectedModules.length === 0}
        onClick={onSubscribe}
        className={`w-full cursor-pointer rounded-lg py-4 text-lg font-bold transition-all ${
          selectedModules.length === 0
            ? 'cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
            : 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl'
        }`}
      >
        {selectedModules.length === 0 ? 'Select modules to continue' : 'Subscribe Now'}
      </button>

      {selectedModules.length > 0 && (
        <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-500">
          {billingCycle === 'yearly' ? 'Billed annually' : 'Billed monthly'} • Cancel anytime • Changes apply at renewal
        </p>
      )}
    </div>
  );
};
