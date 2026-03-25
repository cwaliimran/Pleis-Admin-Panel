import React, { useRef, useState, useEffect } from 'react';
import { Calendar, Package, Eye, RefreshCw, X } from 'lucide-react';
import { InactiveSubscriptionData, SubscriptionConfig } from './types';
import { format } from 'date-fns';

interface CurrentSubscriptionBoxProps {
  subscription: SubscriptionConfig;
  startDate: string;
  endDate: string;
  lockedInPrice?: number; // From API if different from calculated
  calculatedPrice?: number; // Calculated from current pricing
  inactiveSubscription?: InactiveSubscriptionData | null;
}

export const CurrentSubscriptionBox: React.FC<CurrentSubscriptionBoxProps> = ({
  subscription,
  startDate,
  endDate,
  lockedInPrice,
  calculatedPrice,
  inactiveSubscription,
}) => {
  const [showNextRecurring, setShowNextRecurring] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup on outside click
  useEffect(() => {
    if (!showNextRecurring) return;
    const handleClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setShowNextRecurring(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showNextRecurring]);
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
        <div className="flex items-center gap-2">
          {inactiveSubscription && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNextRecurring(!showNextRecurring)}
                className="flex cursor-pointer items-center gap-1 rounded-full border border-purple-300 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 transition-all hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50"
              >
                <Eye className="h-3 w-3" />
                Next Recurring
              </button>

              {/* Next Recurring Popup */}
              {showNextRecurring && (
                <div
                  ref={popupRef}
                  className="absolute top-full right-0 z-50 mt-2 w-80 rounded-xl border border-purple-200 bg-white p-4 shadow-xl dark:border-purple-800 dark:bg-[#222121]"
                >
                  {/* Popup Header */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-purple-600 dark:text-purple-500" />
                      <span className="text-sm font-bold text-purple-900 dark:text-purple-100">Next Recurring</span>
                    </div>
                    <button
                      type="button"
                      title="Close"
                      onClick={() => setShowNextRecurring(false)}
                      className="cursor-pointer rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Config Summary */}
                  <div className="mb-3 grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-medium text-purple-700 dark:text-purple-400">Modules</span>
                      <div className="mt-0.5 flex flex-wrap gap-1">
                        {inactiveSubscription.subscriptionTypes
                          .filter((t) => t !== 'analytics' && t !== 'free')
                          .map((m) => (
                            <span
                              key={m}
                              className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-semibold text-purple-800 capitalize dark:bg-purple-900/50 dark:text-purple-200"
                            >
                              {m}
                            </span>
                          ))}
                        {inactiveSubscription.subscriptionTypes.includes('analytics') && (
                          <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200">
                            Analytics
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-medium text-purple-700 dark:text-purple-400">Organizations</span>
                      <p className="mt-0.5 text-sm font-bold text-purple-900 dark:text-purple-100">{inactiveSubscription.numberOfOrganizations}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-medium text-purple-700 dark:text-purple-400">Billing</span>
                      <p className="mt-0.5 text-sm font-bold text-purple-900 capitalize dark:text-purple-100">{inactiveSubscription.pricingPlan}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-medium text-purple-700 dark:text-purple-400">Starts</span>
                      <p className="mt-0.5 text-xs font-semibold text-purple-900 dark:text-purple-100">
                        {inactiveSubscription.startDate ? format(new Date(inactiveSubscription.startDate), 'MMM dd, yyyy') : 'Next cycle'}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-900/20">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-purple-800 dark:text-purple-300">
                        {inactiveSubscription.pricingPlan === 'yearly' ? 'Yearly' : 'Monthly'} Amount
                      </span>
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-500">
                        €{inactiveSubscription.totalSubscriptionAmount.toFixed(2)}
                      </span>
                    </div>
                    {inactiveSubscription.pricingPlan === 'yearly' && (
                      <p className="mt-1 text-right text-[10px] text-purple-700 dark:text-purple-400">
                        (€{(inactiveSubscription.totalSubscriptionAmount / 12).toFixed(2)}/month)
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white dark:bg-blue-700">ACTIVE</span>
        </div>
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
