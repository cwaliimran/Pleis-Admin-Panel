'use client';

import { Input } from '@/components/ui/input';
import {
  useGetOrganizerOwnSubscriptionsQuery,
  useGetOrganizerSubscriptionsQuery,
  useUpdateOrganizerSubscriptionMutation,
} from '@/store/Reducer/subscriptions-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { Check, Sparkles, TrendingUp } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ConfirmationModal } from './ConfirmationModal';
import { ANALYTICS_FEATURES, FREE_PLAN_FEATURES, ORGANIZATION_COUNTS } from './constants';
import { CurrentSubscriptionBox } from './CurrentSubscriptionBox';
import { InfoBanner } from './info-banner';
import { ModuleCard } from './module-card';
import { PriceBreakdownBox } from './PriceBreakdownBox';
import { analyzeSubscriptionChange, calculatePriceBreakdown } from './subscriptionCalculator';
import { BillingCycle, DynamicPricing, ModuleConfig, ModuleId, SubscriptionChangeAnalysis, UserSubscriptionData } from './types';
import { UpgradeCostBox } from './UpgradeCostBox';

export const OrganizerSubscriptionView: React.FC = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [selectedModules, setSelectedModules] = useState<ModuleId[]>([]);
  const [includeAnalytics, setIncludeAnalytics] = useState<boolean>(false);
  const [organizationCount, setOrganizationCount] = useState<number>(1);
  const [customOrgCount, setCustomOrgCount] = useState<string>('');
  const [isCustomOrgSelected, setIsCustomOrgSelected] = useState<boolean>(false);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean>(false);
  const [isPrefilled, setIsPrefilled] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isFreePlan, setIsFreePlan] = useState<boolean>(false);

  // ============================================================================
  // API HOOKS
  // ============================================================================
  const { data: organizerOwnSubData, isLoading: isOwnSubLoading } = useGetOrganizerOwnSubscriptionsQuery({});
  const userSubscriptionData: UserSubscriptionData | null = organizerOwnSubData?.data?.[0]?.subscription || null;

  const { data: apiData, isLoading: isPricingLoading } = useGetOrganizerSubscriptionsQuery({});
  const [updateOrganizerSubscription, { isLoading: isUpdating }] = useUpdateOrganizerSubscriptionMutation();

  const pricingData = apiData?.data?.[0] || null;
  const isUserOnFreePlan = useMemo(() => {
    if (!userSubscriptionData) return false;

    return (
      userSubscriptionData.subscriptionTypes.includes('free') ||
      (userSubscriptionData.subscriptionTypes.length === 1 && userSubscriptionData.subscriptionTypes[0] === 'free')
    );
  }, [userSubscriptionData]);

  // ============================================================================
  // DYNAMIC PRICING EXTRACTION
  // ============================================================================
  const dynamicPricing = useMemo<DynamicPricing | null>(() => {
    if (!pricingData) return null;

    const modulePrice: Record<string, number> = {};
    const moduleCommission: Record<string, number> = {};

    if (pricingData.modulePricing && Array.isArray(pricingData.modulePricing)) {
      pricingData.modulePricing.forEach((item: any) => {
        if (item.module && typeof item.price === 'number') {
          modulePrice[item.module] = item.price;
        }
      });
    }

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

  // ============================================================================
  // DYNAMIC MODULES CONFIGURATION
  // ============================================================================
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

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================
  const getActualOrgCount = useCallback((): number => {
    if (isCustomOrgSelected && customOrgCount && parseInt(customOrgCount) >= 6) {
      return parseInt(customOrgCount);
    }
    return isCustomOrgSelected ? 6 : organizationCount;
  }, [isCustomOrgSelected, customOrgCount, organizationCount]);

  // ============================================================================
  // CHECK IF USER IS ON FREE PLAN
  // ============================================================================
  useEffect(() => {
    if (!userSubscriptionData) {
      setIsFreePlan(false);
      return;
    }

    setIsFreePlan(isUserOnFreePlan);

    if (isUserOnFreePlan) {
      // Reset selections for free plan users
      setSelectedModules([]);
      setIncludeAnalytics(false);
      setHasActiveSubscription(false);
      setIsPrefilled(false);
    }
  }, [userSubscriptionData, isUserOnFreePlan]);

  // ============================================================================
  // PREFILL USER SUBSCRIPTION DATA (ONLY FOR PAID USERS)
  // ============================================================================
  useEffect(() => {
    if (!userSubscriptionData || isPrefilled || isUserOnFreePlan) return;

    const modules: ModuleId[] = [];
    let hasAnalytics = false;

    userSubscriptionData.subscriptionTypes.forEach((type) => {
      if (type === 'analytics') {
        hasAnalytics = true;
      } else if (type === 'ordering' || type === 'loyalty' || type === 'reservations') {
        modules.push(type as ModuleId);
      }
    });

    setSelectedModules(modules);
    setIncludeAnalytics(hasAnalytics);

    if (userSubscriptionData.pricingPlan === 'yearly' || userSubscriptionData.pricingPlan === 'monthly') {
      setBillingCycle(userSubscriptionData.pricingPlan);
    }

    const orgCount = userSubscriptionData.numberOfOrganizations;
    if (orgCount >= 6) {
      setIsCustomOrgSelected(true);
      setCustomOrgCount(orgCount.toString());
      setOrganizationCount(6);
    } else {
      setIsCustomOrgSelected(false);
      setCustomOrgCount('');
      setOrganizationCount(orgCount);
    }

    setHasActiveSubscription(true);
    setIsPrefilled(true);
  }, [userSubscriptionData, isPrefilled, isUserOnFreePlan]);

  // ============================================================================
  // PRICE BREAKDOWN CALCULATION (ONLY FOR FREE USERS)
  // ============================================================================
  const priceBreakdown = useMemo(() => {
    if (!dynamicPricing || selectedModules.length === 0 || !isFreePlan) return null;

    return calculatePriceBreakdown(selectedModules, includeAnalytics, getActualOrgCount(), billingCycle, dynamicPricing);
  }, [selectedModules, includeAnalytics, billingCycle, dynamicPricing, isFreePlan, getActualOrgCount]);

  // ============================================================================
  // SUBSCRIPTION CHANGE ANALYSIS (FOR PAID USERS)
  // ============================================================================
  const subscriptionAnalysis = useMemo<SubscriptionChangeAnalysis | null>(() => {
    if (!dynamicPricing || isFreePlan) return null;

    const actualOrgCount = getActualOrgCount();

    const newSelections = {
      modules: selectedModules,
      includeAnalytics,
      organizationCount: actualOrgCount,
      billingCycle,
    };

    return analyzeSubscriptionChange(userSubscriptionData, newSelections, dynamicPricing);
  }, [userSubscriptionData, selectedModules, includeAnalytics, billingCycle, dynamicPricing, isFreePlan, getActualOrgCount]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
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

  // ============================================================================
  // SUBSCRIPTION UPDATE HANDLER
  // ============================================================================
  const handleSubscribeClick = (): void => {
    // Check if downgrading to free plan (only for paid users)
    if (!isFreePlan && subscriptionAnalysis?.isFreePlan) {
      setShowConfirmModal(true);
      return;
    }

    // Check if paid user is downgrading to free
    if (hasActiveSubscription && selectedModules.length === 0 && !includeAnalytics) {
      setShowConfirmModal(true);
      return;
    }

    handleSubscribe();
  };

  const handleSubscribe = async (): Promise<void> => {
    try {
      let subscriptionTypes: string[];
      let totalAmount: number;
      let finalOrgCount: number;
      let finalBillingCycle: BillingCycle;

      // Handle free plan (downgrade or staying free)
      if (selectedModules.length === 0 && !includeAnalytics) {
        subscriptionTypes = ['free'];
        totalAmount = 0;
        finalOrgCount = 1;
        finalBillingCycle = 'monthly';
      } else {
        // Paid subscription
        subscriptionTypes = includeAnalytics ? [...selectedModules, 'analytics'] : [...selectedModules];
        finalOrgCount = getActualOrgCount();
        finalBillingCycle = billingCycle;

        // Calculate total amount
        if (isFreePlan && priceBreakdown) {
          // Free user subscribing - use full calculated price
          totalAmount = priceBreakdown.finalAmount;
        } else if (subscriptionAnalysis?.changeType === 'upgrade' && subscriptionAnalysis.proratedUpgrade) {
          // Paid user upgrading - use prorated amount
          totalAmount = subscriptionAnalysis.proratedUpgrade.totalProratedAmount;
        } else if (subscriptionAnalysis?.nextRecurring) {
          // Downgrade or no change - use next recurring amount
          totalAmount = subscriptionAnalysis.nextRecurring.displayAmount;
        } else {
          totalAmount = priceBreakdown?.finalAmount || 0;
        }
      }

      const payload = {
        subscriptionTypes,
        pricingPlan: finalBillingCycle,
        numberOfOrganizations: finalOrgCount,
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
      setShowConfirmModal(false);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  // ============================================================================
  // DERIVED STATE FOR UI
  // ============================================================================
  const getButtonText = (): string => {
    if (selectedModules.length === 0 && !includeAnalytics) {
      if (hasActiveSubscription && !isFreePlan) {
        return 'Switch to Free Plan';
      }
      return 'Select modules to continue';
    }

    if (hasActiveSubscription) {
      return 'Update Subscription';
    }

    return 'Subscribe Now';
  };

  const hasUserMadeChanges = useMemo(() => {
    if (!subscriptionAnalysis) return false;
    return subscriptionAnalysis.changeType !== 'no_change';
  }, [subscriptionAnalysis]);

  const isPaidActiveUser = hasActiveSubscription && !isFreePlan;

  const shouldShowBillingCycle = !isPaidActiveUser || hasUserMadeChanges;

  const isButtonDisabled = isPaidActiveUser ? !hasUserMadeChanges : selectedModules.length === 0 && !includeAnalytics;

  const isDowngradingToFree = useMemo(() => {
    return hasActiveSubscription && selectedModules.length === 0 && !includeAnalytics && !isFreePlan;
  }, [hasActiveSubscription, selectedModules, includeAnalytics, isFreePlan]);

  // ============================================================================
  // LOADING STATE
  // ============================================================================
  if (isPricingLoading || isOwnSubLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading subscription information...</p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER
  // ============================================================================
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
      <div className="space-y-6 rounded-b-2xl px-0 py-6">
        {/* Free Plan User Banner */}
        {isFreePlan && selectedModules.length > 0 && (
          <InfoBanner
            variant="info"
            icon="ℹ️"
            title="You're on the Free Plan"
            description="Select premium modules below to upgrade your subscription and unlock advanced features."
          />
        )}

        {/* Downgrade to Free Warning Banner - Only for Paid Users */}
        {isDowngradingToFree && (
          <InfoBanner
            variant="warning"
            icon="⚠️"
            title="Switching to Free Plan"
            description={`Your subscription will end on ${userSubscriptionData?.endDate ? new Date(userSubscriptionData.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'the end of your current period'}, and you'll be moved to the Free Plan.`}
          />
        )}

        {/* No Subscription Banner (Not Free, No Paid) */}
        {!userSubscriptionData && !isOwnSubLoading && (
          <InfoBanner
            variant="warning"
            icon="⚠️"
            title="No Active Subscription"
            description="You don't have an active subscription yet. Please select modules below to get started, or contact your administrator for assistance."
          />
        )}

        {/* Downgrade Notice Banner */}
        {subscriptionAnalysis?.changeType === 'downgrade' && !isDowngradingToFree && subscriptionAnalysis.nextRecurring && (
          <InfoBanner
            variant="info"
            icon="ℹ️"
            title="Changes Will Take Effect Next Billing Cycle"
            description={`Your changes will take effect on ${new Date(subscriptionAnalysis.nextRecurring.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. Your current plan remains active until then.`}
          />
        )}

        {/* Free Tier / Current Subscription */}
        {isFreePlan ? (
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
        ) : (
          hasActiveSubscription &&
          subscriptionAnalysis?.currentSubscription &&
          userSubscriptionData && (
            <CurrentSubscriptionBox
              subscription={subscriptionAnalysis.currentSubscription}
              startDate={userSubscriptionData.startDate}
              endDate={userSubscriptionData.endDate}
              lockedInPrice={userSubscriptionData.totalSubscriptionAmount}
              calculatedPrice={subscriptionAnalysis.currentSubscription.totalAmount}
            />
          )
        )}

        {/* Module Selection */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#222121]">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">Premium Modules</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">Enhance your platform with powerful features</p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                pricing={dynamicPricing?.modules[module.id] || { price: 0, commission: 0 }}
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
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">€{dynamicPricing?.analytics}</span>
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

          {getActualOrgCount() > 1 && priceBreakdown && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/30">
              <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-400">
                <TrendingUp className="h-4 w-4" />
                <span className="font-semibold">Volume discount applied!</span>
                <span>
                  Pay only {priceBreakdown.orgPricingPercent}% of full price ({100 - priceBreakdown.orgPricingPercent}% discount)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Billing Cycle Selection */}
        {shouldShowBillingCycle && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#222121]">
            <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">Billing Cycle</h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Choose how often you&apos;d like to be billed</p>

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
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
                onClick={() => setBillingCycle('yearly')}
                className={`relative rounded-lg px-6 py-3 font-semibold transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                Yearly
                {dynamicPricing && (
                  <span className="absolute -top-2 -right-2 rounded-full bg-green-500 px-2 py-0.5 text-xs font-bold text-white">
                    Save {dynamicPricing.yearlyDiscount}%
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Price Breakdown - ONLY for Free Users */}
        {priceBreakdown && isFreePlan && selectedModules.length > 0 && <PriceBreakdownBox breakdown={priceBreakdown} />}

        {/* Prorated Upgrade - Only for Paid Users */}
        {!isFreePlan &&
          hasActiveSubscription &&
          hasUserMadeChanges &&
          subscriptionAnalysis?.changeType === 'upgrade' &&
          subscriptionAnalysis.proratedUpgrade && <UpgradeCostBox upgrade={subscriptionAnalysis.proratedUpgrade} />}

        {/* Subscribe/Update Button */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#222121]">
          <button
            type="button"
            disabled={isButtonDisabled || isUpdating}
            onClick={handleSubscribeClick}
            className={`w-full rounded-lg py-4 text-lg font-bold transition-all ${
              isButtonDisabled
                ? 'cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
                : isUpdating
                  ? 'cursor-not-allowed bg-blue-600 text-white'
                  : 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl'
            }`}
          >
            {isUpdating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Processing...
              </span>
            ) : (
              getButtonText()
            )}
          </button>

          {!isButtonDisabled && selectedModules.length > 0 && (
            <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-500">
              {billingCycle === 'yearly' ? 'Billed annually' : 'Billed monthly'} •{' '}
              {hasActiveSubscription ? 'Changes apply at renewal' : 'Cancel anytime'}
            </p>
          )}
        </div>

        {/* Free Tier Reminder */}
        {selectedModules.length === 0 && !includeAnalytics && !hasActiveSubscription && !isFreePlan && (
          <div className="py-8 text-center">
            <p className="mb-2 text-gray-600 dark:text-gray-400">Not ready to upgrade yet? No problem!</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">Continue using our Free Plan with basic ticketing and event management.</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSubscribe}
        title="Switch to Free Plan?"
        message="Are you sure you want to switch to the Free Plan? You'll lose access to premium features."
        effectiveDate={subscriptionAnalysis?.nextRecurring?.startDate || userSubscriptionData?.endDate}
        confirmButtonText="Yes, Switch to Free Plan"
        cancelButtonText="Cancel"
        isLoading={isUpdating}
      />
    </section>
  );
};
