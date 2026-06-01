'use client';

import { useGetOrganizerOwnSubscriptionsQuery } from '@/store/Reducer/subscriptions-api';
import { Check, Lock } from 'lucide-react';
import React, { useMemo } from 'react';
import { CurrentSubscriptionBox } from './CurrentSubscriptionBox';
import { FREE_PLAN_FEATURES } from './constants';
import { InactiveSubscriptionData, ModuleId, SubscriptionConfig, UserSubscriptionData } from './types';

export const OrganizerSubscriptionViewOnly: React.FC = () => {
  const { data: organizerOwnSubData, isLoading: isOwnSubLoading } = useGetOrganizerOwnSubscriptionsQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  const userSubscriptionData: UserSubscriptionData | null = organizerOwnSubData?.data?.[0]?.subscription || null;
  const inactiveSubscription: InactiveSubscriptionData | null = organizerOwnSubData?.data?.[0]?.inactiveSubscription || null;

  const isUserOnFreePlan = useMemo(() => {
    if (!userSubscriptionData) return true;

    return (
      userSubscriptionData.subscriptionTypes.includes('free') ||
      (userSubscriptionData.subscriptionTypes.length === 1 && userSubscriptionData.subscriptionTypes[0] === 'free')
    );
  }, [userSubscriptionData]);

  const currentSubscription = useMemo<SubscriptionConfig | null>(() => {
    if (!userSubscriptionData || isUserOnFreePlan) return null;

    const modules = userSubscriptionData.subscriptionTypes.filter(
      (type) => type === 'ordering' || type === 'loyalty' || type === 'reservations'
    ) as ModuleId[];

    const includeAnalytics = userSubscriptionData.subscriptionTypes.includes('analytics');

    return {
      modules,
      includeAnalytics,
      organizationCount: userSubscriptionData.numberOfOrganizations,
      billingCycle: userSubscriptionData.pricingPlan,
      totalAmount: userSubscriptionData.totalSubscriptionAmount,
      monthlyEquivalent:
        userSubscriptionData.pricingPlan === 'yearly'
          ? userSubscriptionData.totalSubscriptionAmount / 12
          : userSubscriptionData.totalSubscriptionAmount,
      basePrice: userSubscriptionData.basePrice,
    };
  }, [userSubscriptionData, isUserOnFreePlan]);

  if (isOwnSubLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading subscription information...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen">
      <div className="rounded-2xl border-b border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#222121]">
        <div className="px-6 py-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Subscription Management</h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">View your current subscription and available plans</p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
              <Lock className="h-3.5 w-3.5" />
              View only for manager
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded-b-2xl px-0 py-6">
        {isUserOnFreePlan ? (
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
          currentSubscription &&
          userSubscriptionData && (
            <CurrentSubscriptionBox
              subscription={currentSubscription}
              startDate={userSubscriptionData.startDate}
              endDate={userSubscriptionData.endDate}
              lockedInPrice={userSubscriptionData.totalSubscriptionAmount}
              calculatedPrice={currentSubscription.totalAmount}
              inactiveSubscription={inactiveSubscription}
            />
          )
        )}
        {/* <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/60 dark:bg-amber-950/20">
          <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
            Subscription changes are disabled for manager accounts. Contact the account owner or admin to update plan settings.
          </p>
        </div> */}
      </div>
    </section>
  );
};
