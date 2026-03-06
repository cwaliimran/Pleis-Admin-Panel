import { Sparkles } from 'lucide-react';
import React from 'react';
import { BillingCycle, ModuleId, PriceCalculation } from './types';

interface ButtonLoadingProps {
  title: string;
}

const ButtonLoading: React.FC<ButtonLoadingProps> = ({ title }) => (
  <span className="flex items-center gap-2">
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
    {title}
  </span>
);

interface DynamicPricing {
  modules: {
    ordering: { price: number; commission: number };
    loyalty: { price: number; commission: number };
    reservations: { price: number; commission: number };
  };
  analytics: number;
  bundleDiscounts: {
    2: number;
    3: number;
  };
  multiOrgPricing: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
  };
  yearlyDiscount: number;
  ticketingCommission: number;
}

interface UserSubscriptionData {
  subscriptionTypes: string[];
  pricingPlan: 'monthly' | 'yearly';
  numberOfOrganizations: number;
  totalSubscriptionAmount: number;
  monthlyPrice: number;
  startDate: string;
  endDate: string;
  orderingCommission: number;
  ticketingCommission: number;
  reservationCommission: number;
}

interface PriceSummaryProps {
  selectedModules: ModuleId[];
  includeAnalytics: boolean;
  organizationCount: number;
  billingCycle: BillingCycle;
  pricing: DynamicPricing;
  priceInfo: PriceCalculation;
  userSubscriptionData: UserSubscriptionData | null;
  hasActiveSubscription: boolean;
  onBillingCycleChange: (cycle: BillingCycle) => void;
  onSubscribe: () => void;
  isLoading?: boolean;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  selectedModules,
  includeAnalytics,
  organizationCount,
  billingCycle,
  pricing,
  priceInfo,
  userSubscriptionData,
  hasActiveSubscription,
  onBillingCycleChange,
  onSubscribe,
  isLoading = false,
}) => {
  // Determine if we should use API price
  const getDisplayPrice = (): { calculated: string; api: string | null; isDifferent: boolean } => {
    if (!userSubscriptionData) {
      return {
        calculated: billingCycle === 'monthly' ? priceInfo.monthlyTotal : priceInfo.yearlyTotal,
        api: null,
        isDifferent: false,
      };
    }

    // Get API price based on billing cycle
    const apiPrice =
      billingCycle === 'yearly' ? userSubscriptionData.totalSubscriptionAmount.toFixed(2) : userSubscriptionData.monthlyPrice.toFixed(2);

    const calculatedPrice = billingCycle === 'monthly' ? priceInfo.monthlyTotal : priceInfo.yearlyTotal;

    // Check if prices are different (accounting for floating point precision)
    const isDifferent = Math.abs(parseFloat(calculatedPrice) - parseFloat(apiPrice)) > 0.01;

    return {
      calculated: calculatedPrice,
      api: apiPrice,
      isDifferent,
    };
  };

  const displayPrice = getDisplayPrice();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#222121]">
      <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">Billing & Price Summary</h3>

      {/* Billing Toggle */}
      <div className="mb-6 flex items-center justify-center gap-4">
        <button
          type="button"
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
          type="button"
          onClick={() => onBillingCycleChange('yearly')}
          className={`relative rounded-lg px-6 py-3 font-semibold transition-all ${
            billingCycle === 'yearly'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
          }`}
        >
          Yearly
          <span className="absolute -top-2 -right-2 rounded-full bg-green-500 px-2 py-0.5 text-xs font-bold text-white">
            Save {pricing?.yearlyDiscount}%
          </span>
        </button>
      </div>

      {/* Price Breakdown */}
      {selectedModules.length > 0 && (
        <div className="mb-6 space-y-3">
          {/* Step 1: Base modules price */}
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Selected modules ({selectedModules.length})</span>
            <span className="text-gray-900 dark:text-gray-100">€{priceInfo.baseModulesPrice}</span>
          </div>

          {/* Step 2: Bundle discount */}
          {priceInfo.bundleDiscountPercent > 0 && (
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-green-600 dark:text-green-500">🎉 Bundle discount ({priceInfo.bundleDiscountPercent}% off)</span>
              <span className="font-semibold text-green-600 dark:text-green-500">-€{priceInfo.bundleDiscountAmount}</span>
            </div>
          )}

          {/* Price after bundle discount */}
          {priceInfo.bundleDiscountPercent > 0 && (
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>After bundle discount</span>
              <span className="text-gray-900 dark:text-gray-100">€{priceInfo.priceAfterBundleDiscount}</span>
            </div>
          )}

          {/* Step 3: Analytics (no discount) */}
          {includeAnalytics && (
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>+ Advanced Analytics (no bundle discount)</span>
              <span className="text-gray-900 dark:text-gray-100">€{priceInfo.analyticsPrice}</span>
            </div>
          )}

          {/* Subtotal before org multiply */}
          {(priceInfo.bundleDiscountPercent > 0 || includeAnalytics) && (
            <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
              <span>Subtotal per organization</span>
              <span>€{priceInfo.priceBeforeOrgMultiply}</span>
            </div>
          )}

          {/* Step 4: Multiply by organizations */}
          {organizationCount > 1 && (
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>× {organizationCount} organizations</span>
              <span className="text-gray-900 dark:text-gray-100">€{priceInfo.priceAfterOrgMultiply}</span>
            </div>
          )}

          {/* Step 5: Multi-org discount */}
          {organizationCount > 1 && (
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-green-600 dark:text-green-500">
                Volume discount ({100 - priceInfo.multiOrgDiscountPercent}% off - pay {priceInfo.multiOrgDiscountPercent}%)
              </span>
              <span className="font-semibold text-green-600 dark:text-green-500">
                -€{(parseFloat(priceInfo.priceAfterOrgMultiply) - parseFloat(priceInfo.monthlyTotal)).toFixed(2)}
              </span>
            </div>
          )}

          {/* Calculated Monthly/Yearly total */}
          <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {billingCycle === 'monthly' ? 'Calculated Monthly Total' : 'Calculated Yearly Total'}
              </span>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">€{displayPrice.calculated}</div>
                {billingCycle === 'yearly' && (
                  <div className="text-xs text-gray-500 dark:text-gray-500">(€{(parseFloat(displayPrice.calculated) / 12).toFixed(2)}/month)</div>
                )}
              </div>
            </div>
          </div>

          {/* API Price (if different from calculated) */}
          {displayPrice.isDifferent && displayPrice.api && (
            <>
              <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800/50 dark:bg-yellow-950/30">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                  <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-400">Your Locked-In Price</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-yellow-700 dark:text-yellow-400">Your current subscription rate (set by admin)</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">€{displayPrice.api}</div>
                    {billingCycle === 'yearly' && (
                      <div className="text-xs text-yellow-600 dark:text-yellow-500">(€{userSubscriptionData?.monthlyPrice.toFixed(2)}/month)</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800/50 dark:bg-blue-950/30">
                <span className="text-sm text-blue-800 dark:text-blue-400">
                  💡 Price difference may occur due to admin adjustments or promotional rates
                </span>
              </div>
            </>
          )}

          {/* Yearly calculation (only if prices are same) */}
          {billingCycle === 'yearly' && !displayPrice.isDifferent && (
            <>
              <div className="flex justify-between border-t border-gray-200 pt-2 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
                <span>Monthly × 12 months</span>
                <span className="text-gray-900 dark:text-gray-100">€{(parseFloat(priceInfo.monthlyTotal) * 12).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-semibold text-green-600 dark:text-green-500">Yearly discount ({priceInfo.yearlyDiscountPercent}% off)</span>
                <span className="font-semibold text-green-600 dark:text-green-500">-€{priceInfo.savingsAmount}</span>
              </div>
            </>
          )}

          {billingCycle === 'yearly' && parseFloat(priceInfo.savingsAmount) > 0 && !displayPrice.isDifferent && (
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
      {isLoading ? (
        <button
          title="button"
          type="button"
          disabled
          className="w-full cursor-not-allowed rounded-lg bg-blue-600 py-4 text-lg font-bold text-white hover:bg-blue-700"
        >
          <ButtonLoading title="Processing" />
        </button>
      ) : (
        <button
          title="button"
          type="button"
          disabled={selectedModules.length === 0}
          onClick={onSubscribe}
          className={`w-full rounded-lg py-4 text-lg font-bold transition-all ${
            selectedModules.length === 0
              ? 'cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
              : 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl'
          }`}
        >
          {selectedModules.length === 0 ? 'Select modules to continue' : hasActiveSubscription ? 'Update Subscription' : 'Subscribe Now'}
        </button>
      )}

      {selectedModules.length > 0 && (
        <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-500">
          {billingCycle === 'yearly' ? 'Billed annually' : 'Billed monthly'} • {hasActiveSubscription ? 'Changes apply at renewal' : 'Cancel anytime'}
        </p>
      )}
    </div>
  );
};
