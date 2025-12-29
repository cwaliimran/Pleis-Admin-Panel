'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useGetOrganizerOwnSubscriptionsQuery,
  useGetOrganizerSubscriptionsQuery,
  useUpdateOrganizerSubscriptionMutation,
} from '@/store/Reducer/subscriptions-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { Check, Sparkles, TrendingUp } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { ANALYTICS_FEATURES, FREE_PLAN_FEATURES, ORGANIZATION_COUNTS } from './constants';
import { InfoBanner } from './info-banner';
import { ModuleCard } from './module-card';
import { PriceSummary } from './price-summary';
import { BillingCycle, ModuleConfig, ModuleId, PriceCalculation } from './types';

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

export const OrganizerSubscriptionView: React.FC = () => {
  const [selectedModules, setSelectedModules] = useState<ModuleId[]>([]);
  const [includeAnalytics, setIncludeAnalytics] = useState<boolean>(false);
  const [organizationCount, setOrganizationCount] = useState<number>(1);
  const [customOrgCount, setCustomOrgCount] = useState<string>('');
  const [isCustomOrgSelected, setIsCustomOrgSelected] = useState<boolean>(false);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [hasActiveSubscription] = useState<boolean>(false);

  const { data: organizerOwnSubData, isLoading: isOwnSubLoading } = useGetOrganizerOwnSubscriptionsQuery({});
  const userSubscriptionData = organizerOwnSubData?.data?.[0] || null;

  console.log('isOwnSubLoading', isOwnSubLoading);

  console.log('userSubscriptionData', userSubscriptionData);

  const { data: apiData, isLoading: isPricingLoading } = useGetOrganizerSubscriptionsQuery({});
  const [updateOrganizerSubscription, { isLoading: isUpdating }] = useUpdateOrganizerSubscriptionMutation();

  const pricingData = apiData?.data?.[0] || null;

  // Extract dynamic pricing from API
  const dynamicPricing = useMemo<DynamicPricing | null>(() => {
    if (!pricingData) return null;

    const modulePrice: Record<string, number> = {};
    const moduleCommission: Record<string, number> = {};

    // Map module pricing
    if (pricingData.modulePricing && Array.isArray(pricingData.modulePricing)) {
      pricingData.modulePricing.forEach((item: any) => {
        if (item.module && typeof item.price === 'number') {
          modulePrice[item.module] = item.price;
        }
      });
    }

    // Map commissions
    const commissions = pricingData.commissions || {};
    moduleCommission['ordering'] = typeof commissions.orderingCommission === 'number' ? commissions.orderingCommission : 0;
    moduleCommission['loyalty'] = typeof commissions.ticketingCommission === 'number' ? commissions.ticketingCommission : 0;
    moduleCommission['reservations'] = typeof commissions.reservationCommission === 'number' ? commissions.reservationCommission : 0;

    return {
      modules: {
        ordering: {
          price: modulePrice['ordering'] || 0,
          commission: moduleCommission['ordering'] || 0,
        },
        loyalty: {
          price: modulePrice['loyalty'] || 0,
          commission: moduleCommission['loyalty'] || 0,
        },
        reservations: {
          price: modulePrice['reservations'] || 0,
          commission: moduleCommission['reservations'] || 0,
        },
      },
      analytics: modulePrice['analytics'] || 0,
      bundleDiscounts: {
        2: pricingData.bundleDiscounts?.twoModules || 0,
        3: pricingData.bundleDiscounts?.threeModules || 0,
      },
      multiOrgPricing: {
        1: pricingData.multiOrgPricing?.oneOrg || 100,
        2: pricingData.multiOrgPricing?.twoOrgs || 95,
        3: pricingData.multiOrgPricing?.threeOrgs || 90,
        4: pricingData.multiOrgPricing?.fourOrgs || 85,
        5: pricingData.multiOrgPricing?.fiveOrgs || 80,
        6: pricingData.multiOrgPricing?.sixPlusOrgs || 75,
      },
      yearlyDiscount: pricingData.yearlyDiscount?.discountPercent || 0,
      ticketingCommission: commissions.ticketingCommission || 8,
    };
  }, [pricingData]);

  // Dynamic modules configuration
  const MODULES: ModuleConfig[] = useMemo(() => {
    if (!dynamicPricing) return [];

    return [
      {
        id: 'ordering' as ModuleId,
        name: 'Ordering',
        description: 'Enable food & drink ordering and package preorders within the app',
        icon: '🛍️',
        color: 'blue' as const,
        features: ['In-app ordering', 'Menu management', 'Package preorders', 'Order tracking'],
      },
      {
        id: 'loyalty' as ModuleId,
        name: 'Loyalty',
        description: 'Unlock loyalty programs, points tracking, and reward management',
        icon: '🎁',
        color: 'purple' as const,
        features: ['Points tracking', 'Reward management', 'Customer retention', 'Loyalty analytics'],
      },
      {
        id: 'reservations' as ModuleId,
        name: 'Reservations',
        description: 'Enable in-app reservations and table management features with ease',
        icon: '📅',
        color: 'green' as const,
        features: ['Table reservations', 'Booking management', 'Capacity control', 'Guest notifications'],
      },
    ];
  }, [dynamicPricing]);

  const getActualOrgCount = (): number => {
    if (isCustomOrgSelected && customOrgCount && parseInt(customOrgCount) >= 6) {
      return parseInt(customOrgCount);
    }
    return isCustomOrgSelected ? 6 : organizationCount;
  };

  const calculatePrice = (): PriceCalculation => {
    if (!dynamicPricing) {
      return {
        monthlyTotal: '0.00',
        yearlyTotal: '0.00',
        bundleDiscountPercent: 0,
        bundleDiscountAmount: '0.00',
        yearlyDiscountPercent: 0,
        savingsAmount: '0.00',
        baseModulesPrice: '0.00',
        priceAfterBundleDiscount: '0.00',
        analyticsPrice: '0.00',
        priceBeforeOrgMultiply: '0.00',
        priceAfterOrgMultiply: '0.00',
        multiOrgDiscountPercent: 0,
      };
    }

    // Step 1: Calculate base price from selected modules (excluding analytics)
    let baseModulesPrice = 0;
    selectedModules.forEach((moduleId) => {
      const modulePrice = dynamicPricing.modules[moduleId]?.price;
      if (typeof modulePrice === 'number') {
        baseModulesPrice += modulePrice;
      }
    });

    // Step 2: Apply bundle discount (only on modules, not analytics)
    let bundleDiscount = 0;
    let bundleDiscountPercent = 0;
    let priceAfterBundleDiscount = baseModulesPrice;

    if (selectedModules.length >= 2) {
      bundleDiscountPercent = selectedModules.length >= 3 ? dynamicPricing.bundleDiscounts[3] || 0 : dynamicPricing.bundleDiscounts[2] || 0;

      bundleDiscount = baseModulesPrice * (bundleDiscountPercent / 100);
      priceAfterBundleDiscount = baseModulesPrice - bundleDiscount;
    }

    // Step 3: Add analytics (no bundle discount applies to analytics)
    const analyticsPrice = includeAnalytics ? dynamicPricing.analytics : 0;
    const priceBeforeOrgMultiply = priceAfterBundleDiscount + analyticsPrice;

    // Step 4: Multiply by organization count
    const actualOrgCount = getActualOrgCount();
    const priceAfterOrgMultiply = priceBeforeOrgMultiply * actualOrgCount;

    // Step 5: Apply multi-org discount to everything
    const multiOrgDiscountPercent =
      actualOrgCount >= 6
        ? dynamicPricing.multiOrgPricing[6] || 100
        : dynamicPricing.multiOrgPricing[actualOrgCount as keyof typeof dynamicPricing.multiOrgPricing] || 100;

    const monthlyTotal = priceAfterOrgMultiply * (multiOrgDiscountPercent / 100);

    // Step 6: Calculate yearly price with yearly discount
    const yearlyTotal = monthlyTotal * 12 * (1 - dynamicPricing.yearlyDiscount / 100);
    const savingsAmount = monthlyTotal * 12 - yearlyTotal;

    return {
      monthlyTotal: monthlyTotal.toFixed(2),
      yearlyTotal: yearlyTotal.toFixed(2),
      bundleDiscountPercent,
      bundleDiscountAmount: bundleDiscount.toFixed(2),
      yearlyDiscountPercent: dynamicPricing.yearlyDiscount,
      savingsAmount: savingsAmount.toFixed(2),
      baseModulesPrice: baseModulesPrice.toFixed(2),
      priceAfterBundleDiscount: priceAfterBundleDiscount.toFixed(2),
      analyticsPrice: analyticsPrice.toFixed(2),
      priceBeforeOrgMultiply: priceBeforeOrgMultiply.toFixed(2),
      priceAfterOrgMultiply: priceAfterOrgMultiply.toFixed(2),
      multiOrgDiscountPercent,
    };
  };

  const priceInfo = useMemo(
    () => calculatePrice(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedModules, includeAnalytics, organizationCount, customOrgCount, isCustomOrgSelected, billingCycle, dynamicPricing]
  );

  const toggleModule = (moduleId: ModuleId): void => {
    setSelectedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]));
  };

  const handleOrganizationCountChange = (count: number): void => {
    if (count === 6) {
      setIsCustomOrgSelected(true);
      setCustomOrgCount('6');
    } else {
      setIsCustomOrgSelected(false);
      setCustomOrgCount('');
      setOrganizationCount(count);
    }
  };

  const handleCustomOrgCountChange = (value: string): void => {
    if (value === '') {
      setCustomOrgCount('');
      return;
    }

    const numValue = value.replace(/\D/g, '');

    if (numValue && parseInt(numValue) > 1000) {
      showError('Maximum 1000 organizations allowed');
      return;
    }

    setCustomOrgCount(numValue);
  };

  const handleSubscribe = async (): Promise<void> => {
    try {
      if (selectedModules.length === 0) {
        showError('Please select at least one module');
        return;
      }

      const subscriptionTypes: string[] = includeAnalytics ? [...selectedModules, 'analytics'] : [...selectedModules];

      const totalAmount = parseFloat(billingCycle === 'monthly' ? priceInfo.monthlyTotal : priceInfo.yearlyTotal);

      const payload = {
        subscriptionTypes,
        pricingPlan: billingCycle,
        numberOfOrganizations: getActualOrgCount(),
        totalSubscriptionAmount: totalAmount,
      };

      const response = await updateOrganizerSubscription(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'Subscription updated successfully!');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  const handleManageSubscription = (action: 'add' | 'remove' | 'cancel'): void => {
    console.log('Manage subscription:', action);
    showSuccess(`Subscription ${action} initiated`);
  };

  if (isPricingLoading || !dynamicPricing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading pricing information...</p>
        </div>
      </div>
    );
  }

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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                pricing={dynamicPricing.modules[module.id]}
                isSelected={selectedModules.includes(module.id)}
                onToggle={() => toggleModule(module.id)}
              />
            ))}
          </div>
        </div>

        {/* Advanced Analytics Add-on */}
        <div
          onClick={() => setIncludeAnalytics(!includeAnalytics)}
          className="cursor-pointer rounded-xl border-2 border-indigo-200 bg-linear-to-br from-indigo-50 to-purple-50 p-6 shadow-sm transition-all hover:shadow-md dark:border-indigo-900/50 dark:from-indigo-950/40 dark:to-purple-950/40"
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

            <div className="flex flex-col items-end">
              <div
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

          <div className="mt-4 rounded-lg border border-indigo-200 bg-white/50 p-3 dark:border-indigo-800 dark:bg-indigo-900/20">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly price:</span>
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">€{dynamicPricing.analytics}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">Note:</span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">No bundle discount</span>
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
                  Pay only {priceInfo.multiOrgDiscountPercent}% of full price ({100 - priceInfo.multiOrgDiscountPercent}% discount)
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
          pricing={dynamicPricing}
          priceInfo={priceInfo}
          onBillingCycleChange={setBillingCycle}
          onSubscribe={handleSubscribe}
          isLoading={isUpdating}
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
