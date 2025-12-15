'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showError, showSuccess } from '@/utils/toast';
import { Check, Sparkles, TrendingUp } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { ANALYTICS_FEATURES, FREE_PLAN_FEATURES, MODULES, ORGANIZATION_COUNTS, PRICING_CONFIG } from './constants';
import { InfoBanner } from './info-banner';
import { ModuleCard } from './module-card';
import { PriceSummary } from './price-summary';
import { BillingCycle, ModuleId, PriceCalculation } from './types';

export const OrganizerSubscriptionView: React.FC = () => {
  const [selectedModules, setSelectedModules] = useState<ModuleId[]>([]);
  const [includeAnalytics, setIncludeAnalytics] = useState(false);
  const [organizationCount, setOrganizationCount] = useState(1);
  const [customOrgCount, setCustomOrgCount] = useState<string>('');
  const [isCustomOrgSelected, setIsCustomOrgSelected] = useState(false);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [hasActiveSubscription] = useState(false);

  const calculatePrice = (): PriceCalculation => {
    let basePrice = 0;

    // Add module prices
    selectedModules.forEach((moduleId) => {
      basePrice += PRICING_CONFIG.modules[moduleId].price;
    });

    // Apply bundle discount
    let bundleDiscount = 0;
    if (selectedModules.length >= 2) {
      const discountPercent = PRICING_CONFIG.bundleDiscounts[selectedModules.length] || PRICING_CONFIG.bundleDiscounts[3];
      bundleDiscount = basePrice * (discountPercent / 100);
      basePrice -= bundleDiscount;
    }

    // Determine actual organization count - minimum 1 for calculation
    let actualOrgCount = 1;
    if (isCustomOrgSelected && customOrgCount && parseInt(customOrgCount) >= 6) {
      actualOrgCount = parseInt(customOrgCount);
    } else if (!isCustomOrgSelected) {
      actualOrgCount = organizationCount;
    }

    // Apply multi-organization pricing
    const orgMultiplier = (PRICING_CONFIG.multiOrgPricing[actualOrgCount] || PRICING_CONFIG.multiOrgPricing[6]) / 100;
    const totalModulesPrice = basePrice * actualOrgCount * orgMultiplier;

    // Add analytics (flat rate, no discounts)
    const analyticsPrice = includeAnalytics ? PRICING_CONFIG.analytics : 0;

    const monthlyTotal = totalModulesPrice + analyticsPrice;

    // Calculate yearly price with discount
    const yearlyTotal = monthlyTotal * 12 * (1 - PRICING_CONFIG.yearlyDiscount / 100);

    return {
      monthlyTotal: monthlyTotal.toFixed(2),
      yearlyTotal: yearlyTotal.toFixed(2),
      bundleDiscountPercent:
        selectedModules.length >= 2 ? PRICING_CONFIG.bundleDiscounts[selectedModules.length] || PRICING_CONFIG.bundleDiscounts[3] : 0,
      bundleDiscountAmount: bundleDiscount.toFixed(2),
      yearlyDiscountPercent: PRICING_CONFIG.yearlyDiscount,
      savingsAmount: billingCycle === 'yearly' ? (monthlyTotal * 12 - yearlyTotal).toFixed(2) : '0',
    };
  };

  const priceInfo = useMemo(
    () => calculatePrice(),
    [selectedModules, includeAnalytics, organizationCount, customOrgCount, isCustomOrgSelected, billingCycle]
  );

  const toggleModule = (moduleId: ModuleId) => {
    setSelectedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]));
  };

  const handleOrganizationCountChange = (count: number) => {
    if (count === 6) {
      setIsCustomOrgSelected(true);
      setCustomOrgCount('6');
    } else {
      setIsCustomOrgSelected(false);
      setCustomOrgCount('');
      setOrganizationCount(count);
    }
  };

  const handleCustomOrgCountChange = (value: string) => {
    // Allow empty string for user to clear and type new value
    if (value === '') {
      setCustomOrgCount('');
      return;
    }

    const numValue = value.replace(/\D/g, '');

    // Allow any input while typing, but show error if over 1000
    if (numValue && parseInt(numValue) > 1000) {
      showError('Maximum 1000 organizations allowed');
      return;
    }

    setCustomOrgCount(numValue);
  };

  const getActualOrgCount = () => {
    if (isCustomOrgSelected && customOrgCount && parseInt(customOrgCount) >= 6) {
      return parseInt(customOrgCount);
    }
    return isCustomOrgSelected ? 6 : organizationCount;
  };

  const handleSubscribe = () => {
    console.log('Subscription data:', {
      selectedModules,
      includeAnalytics,
      organizationCount: getActualOrgCount(),
      billingCycle,
      priceInfo,
    });
    showSuccess('Subscription created successfully!');
  };

  const handleManageSubscription = (action: 'add' | 'remove' | 'cancel') => {
    console.log('Manage subscription:', action);
    showSuccess(`Subscription ${action} initiated`);
  };

  return (
    <section className="min-h-screen">
      {/* Header */}
      <div className="rounded-2xl border-b border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#222121]">
        <div className="px-6 py-7">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Subscription Management</h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">Choose your plan and unlock powerful features</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6 rounded-b-2xl px-0 py-8">
        {/* Active Subscription Notice */}
        {hasActiveSubscription && (
          <InfoBanner
            variant="info"
            icon="ℹ️"
            title="Active Subscription"
            description="You have an active subscription. Changes will take effect on your next renewal date. Cancellations will keep your access until the end of the current billing period."
          />
        )}
        {/* Free Tier */}
        <div className="rounded-xl border-2 border-green-300 bg-linear-to-br from-green-50 to-emerald-50 p-6 shadow-lg dark:border-green-800 dark:from-green-950/40 dark:to-emerald-950/40">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">FREE FOREVER</span>
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">Free Plan</h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">Perfect for getting started with basic event management</p>
              <div className="space-y-2">
                {FREE_PLAN_FEATURES.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-green-600 dark:text-green-500">€0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">forever</div>
            </div>
          </div>
        </div>
        {/* Module Selection */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#222121]">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">Premium Modules</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">Enhance your platform with powerful features</p>

          <div className="grid gap-4 md:grid-cols-3">
            {MODULES.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                pricing={PRICING_CONFIG.modules[module.id]}
                isSelected={selectedModules.includes(module.id)}
                onToggle={() => toggleModule(module.id)}
              />
            ))}
          </div>
        </div>

        {/* Advanced Analytics Add-on */}
        <div
          onClick={() => setIncludeAnalytics(!includeAnalytics)}
          className="rounded-xl border-2 border-indigo-200 bg-linear-to-br from-indigo-50 to-purple-50 p-6 shadow-sm dark:border-indigo-900/50 dark:from-indigo-950/40 dark:to-purple-950/40"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Advanced Analytics</h3>
                <Sparkles className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Get deep insights into your events, orders, and loyalty performance with comprehensive reporting and analytics dashboards.
              </p>
              <ul className="mb-4 grid gap-2 md:grid-cols-2">
                {ANALYTICS_FEATURES.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Checkbox - Right Side */}
            <div className="flex flex-col items-end">
              <div
                // onClick={() => setIncludeAnalytics(!includeAnalytics)}
                className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border-2 transition-all ${
                  includeAnalytics
                    ? 'border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-500'
                    : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
                }`}
              >
                {includeAnalytics && <Check className="h-4 w-4 text-white" />}
              </div>
              <span className="mt-2 text-xs font-semibold text-gray-700 dark:text-gray-300">{includeAnalytics ? 'Selected' : 'Select'}</span>
            </div>
          </div>

          {/* Price Section - Full Width at Bottom */}
          <div className="mt-4 rounded-lg border border-indigo-200 bg-white/50 p-3 dark:border-indigo-800 dark:bg-indigo-900/20">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly price:</span>
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">€{PRICING_CONFIG.analytics}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">Flat rate:</span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">No commission</span>
            </div>
          </div>
        </div>

        {/* Organization Count */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#222121]">
          <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">Number of Organizations</h3>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">How many locations or venues will you manage?</p>

          <div className="grid grid-cols-6 gap-3">
            {ORGANIZATION_COUNTS.map((count) => (
              <button
                type="button"
                key={count}
                onClick={() => handleOrganizationCountChange(count)}
                className={`rounded-lg px-4 py-3 font-semibold transition-all ${
                  (count === 6 && isCustomOrgSelected) || (count !== 6 && organizationCount === count && !isCustomOrgSelected)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {count === 6 ? '6+' : count}
              </button>
            ))}
          </div>

          {/* Custom Organization Count Input */}
          {isCustomOrgSelected && (
            <div className="mt-4 rounded-lg border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
              <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">Enter number of organizations (6-1000)</label>
              <Input
                type="text"
                value={customOrgCount}
                onChange={(e) => handleCustomOrgCountChange(e.target.value)}
                placeholder="Enter number (e.g., 10)"
                className="h-11 border-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
              />
              {customOrgCount && parseInt(customOrgCount) >= 6 && (
                <p className="mt-2 text-xs text-blue-700 dark:text-blue-400">Managing {customOrgCount} organizations</p>
              )}
              {customOrgCount && parseInt(customOrgCount) < 6 && parseInt(customOrgCount) > 0 && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">Minimum 6 organizations required for custom count</p>
              )}
            </div>
          )}

          {getActualOrgCount() > 1 && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/30">
              <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-400">
                <TrendingUp className="h-4 w-4" />
                <span className="font-semibold">Volume discount applied!</span>
                <span>
                  Each additional location is {100 - (PRICING_CONFIG.multiOrgPricing[getActualOrgCount()] || PRICING_CONFIG.multiOrgPricing[6])}% off
                </span>
              </div>
            </div>
          )}
        </div>
        {/* Price Summary */}
        <PriceSummary
          selectedModules={selectedModules}
          includeAnalytics={includeAnalytics}
          organizationCount={getActualOrgCount()}
          billingCycle={billingCycle}
          pricing={PRICING_CONFIG}
          priceInfo={priceInfo}
          onBillingCycleChange={setBillingCycle}
          onSubscribe={handleSubscribe}
        />
        {/* Subscription Management Actions */}
        {hasActiveSubscription && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#222121]">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">Manage Your Subscription</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <Button
                variant="outline"
                onClick={() => handleManageSubscription('add')}
                className="h-12 font-semibold dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Add Modules
              </Button>
              <Button
                variant="outline"
                onClick={() => handleManageSubscription('remove')}
                className="h-12 border-orange-300 font-semibold text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950/30"
              >
                Remove Modules
              </Button>
              <Button
                variant="outline"
                onClick={() => handleManageSubscription('cancel')}
                className="h-12 border-red-300 font-semibold text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                Cancel Subscription
              </Button>
            </div>
            <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-500">
              All changes take effect on your next renewal date. Cancellations maintain access until period end.
            </p>
          </div>
        )}
        {/* Free Tier Reminder */}
        {selectedModules.length === 0 && !includeAnalytics && (
          <div className="py-8 text-center">
            <p className="mb-2 text-gray-600 dark:text-gray-400">Not ready to upgrade yet? No problem!</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">Continue using our Free Plan with basic ticketing and event management.</p>
          </div>
        )}
      </div>
    </section>
  );
};
