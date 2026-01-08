/**
 * Subscription Calculator - Pure Utility Functions
 *
 * This module contains all calculation logic for subscription pricing,
 * prorated upgrades, and next recurring charges.
 *
 * All functions are pure (no side effects) for easy testing and debugging.
 *
 * @module subscriptionCalculator
 */

import {
  DynamicPricing,
  ModuleId,
  NextRecurringCalculation,
  ProratedUpgradeCalculation,
  SubscriptionChangeAnalysis,
  SubscriptionChangeType,
  SubscriptionConfig,
  UserSubscriptionData,
} from './types';

// ============================================================================
// DATE & TIME UTILITIES
// ============================================================================

/**
 * Calculate the number of days remaining in a subscription period (inclusive)
 *
 * @param upgradeDate - The date when upgrade occurs
 * @param subscriptionEndDate - The date when current subscription ends
 * @returns Number of days remaining (including upgrade day)
 *
 * @example
 * calculateDaysRemaining('2026-01-15', '2026-01-31') // Returns 17 days
 */
export const calculateDaysRemaining = (upgradeDate: Date, subscriptionEndDate: Date): number => {
  const start = new Date(upgradeDate);
  const end = new Date(subscriptionEndDate);

  // Reset time to midnight for accurate day calculation
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Add 1 to include the upgrade day itself
  return diffDays + 1;
};

/**
 * Calculate total days in a subscription period
 *
 * @param startDate - Subscription start date
 * @param endDate - Subscription end date
 * @returns Total number of days in the period
 */
export const calculateTotalDays = (startDate: Date, endDate: Date): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Check if a year is a leap year
 *
 * @param year - Year to check
 * @returns True if leap year, false otherwise
 */
export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

/**
 * Get days in a year (365 or 366 for leap years)
 *
 * @param year - Year to check
 * @returns 365 or 366
 */
export const getDaysInYear = (year: number): number => {
  return isLeapYear(year) ? 366 : 365;
};

// ============================================================================
// DISCOUNT CALCULATIONS
// ============================================================================

/**
 * Get bundle discount percentage based on number of modules
 *
 * @param moduleCount - Number of modules selected
 * @param discounts - Bundle discount configuration
 * @returns Discount percentage (0-100)
 *
 * @example
 * getBundleDiscount(2, { 2: 10, 3: 15 }) // Returns 10
 * getBundleDiscount(3, { 2: 10, 3: 15 }) // Returns 15
 * getBundleDiscount(1, { 2: 10, 3: 15 }) // Returns 0
 */
export const getBundleDiscount = (moduleCount: number, discounts: { 2: number; 3: number }): number => {
  if (moduleCount >= 3) return discounts[3] || 0;
  if (moduleCount >= 2) return discounts[2] || 0;
  return 0;
};

/**
 * Get multi-org discount multiplier based on organization count
 *
 * @param orgCount - Number of organizations
 * @param multiOrgPricing - Multi-org pricing configuration
 * @returns Discount multiplier as percentage (e.g., 85 means 85% of full price)
 *
 * @example
 * getMultiOrgMultiplier(4, config) // Returns 85 (pay 85%, get 15% off)
 * getMultiOrgMultiplier(1, config) // Returns 100 (no discount)
 */
export const getMultiOrgMultiplier = (orgCount: number, multiOrgPricing: DynamicPricing['multiOrgPricing']): number => {
  if (orgCount >= 6) return multiOrgPricing[6] || 100;
  return multiOrgPricing[orgCount as keyof typeof multiOrgPricing] || 100;
};

/**
 * Apply bundle discount to a base price
 *
 * @param basePrice - Original price before discount
 * @param discountPercent - Discount percentage (0-100)
 * @returns Price after applying discount
 */
export const applyBundleDiscount = (basePrice: number, discountPercent: number): number => {
  return basePrice * (1 - discountPercent / 100);
};

/**
 * Apply multi-org discount to a price
 *
 * @param pricePerOrg - Price per organization
 * @param orgCount - Number of organizations
 * @param multiplier - Discount multiplier (0-100)
 * @returns Total price after applying multi-org discount
 */
export const applyMultiOrgDiscount = (pricePerOrg: number, orgCount: number, multiplier: number): number => {
  return pricePerOrg * orgCount * (multiplier / 100);
};

/**
 * Apply yearly discount to a price
 *
 * @param price - Original price
 * @param discountPercent - Yearly discount percentage (0-100)
 * @returns Price after applying yearly discount
 */
export const applyYearlyDiscount = (price: number, discountPercent: number): number => {
  return price * (1 - discountPercent / 100);
};

// ============================================================================
// MODULE & ORG DIFFERENCE CALCULATIONS
// ============================================================================

/**
 * Calculate which modules are being added
 *
 * @param oldModules - Current modules
 * @param newModules - New modules after change
 * @returns Array of modules being added
 */
export const getAddedModules = (oldModules: ModuleId[], newModules: ModuleId[]): ModuleId[] => {
  return newModules.filter((module) => !oldModules.includes(module));
};

/**
 * Calculate which modules are being removed
 *
 * @param oldModules - Current modules
 * @param newModules - New modules after change
 * @returns Array of modules being removed
 */
export const getRemovedModules = (oldModules: ModuleId[], newModules: ModuleId[]): ModuleId[] => {
  return oldModules.filter((module) => !newModules.includes(module));
};

/**
 * Calculate organization count difference
 *
 * @param oldOrgCount - Current organization count
 * @param newOrgCount - New organization count
 * @returns Positive if adding, negative if removing, 0 if no change
 */
export const getOrgDifference = (oldOrgCount: number, newOrgCount: number): number => {
  return newOrgCount - oldOrgCount;
};

// ============================================================================
// CHANGE TYPE DETERMINATION
// ============================================================================

/**
 * Determine the type of subscription change
 *
 * @param oldConfig - Current subscription configuration (null if no subscription)
 * @param newConfig - New subscription configuration from user selections
 * @returns Type of change: 'upgrade', 'downgrade', 'no_change', or 'free_plan'
 *
 * Logic:
 * - If new config has no modules and no analytics → 'free_plan'
 * - If old config is null → 'upgrade' (new subscription)
 * - If adding modules or orgs → 'upgrade'
 * - If removing modules or orgs → 'downgrade'
 * - Otherwise → 'no_change'
 */
export const determineChangeType = (
  oldConfig: SubscriptionConfig | null,
  newConfig: Omit<SubscriptionConfig, 'totalAmount' | 'monthlyEquivalent'>
): SubscriptionChangeType => {
  // Check if downgrading to free plan
  if (newConfig.modules.length === 0 && !newConfig.includeAnalytics) {
    return 'free_plan';
  }

  // If no current subscription, this is a new subscription (upgrade)
  if (!oldConfig) {
    return 'upgrade';
  }

  // Check module changes
  const modulesAdded = getAddedModules(oldConfig.modules, newConfig.modules);
  const modulesRemoved = getRemovedModules(oldConfig.modules, newConfig.modules);

  // Check analytics changes
  const analyticsAdded = !oldConfig.includeAnalytics && newConfig.includeAnalytics;
  const analyticsRemoved = oldConfig.includeAnalytics && !newConfig.includeAnalytics;

  // Check org changes
  const orgDifference = getOrgDifference(oldConfig.organizationCount, newConfig.organizationCount);

  // Determine if upgrade or downgrade
  const hasAdditions = modulesAdded.length > 0 || analyticsAdded || orgDifference > 0;
  const hasRemovals = modulesRemoved.length > 0 || analyticsRemoved || orgDifference < 0;

  if (hasAdditions && !hasRemovals) {
    return 'upgrade';
  }

  if (hasRemovals && !hasAdditions) {
    return 'downgrade';
  }

  if (hasAdditions && hasRemovals) {
    // Mixed changes - treat as upgrade if net positive value
    return 'upgrade';
  }

  // Check billing cycle change
  if (oldConfig.billingCycle !== newConfig.billingCycle) {
    return 'downgrade'; // Billing cycle changes take effect next period
  }

  return 'no_change';
};

// ============================================================================
// BASE PRICE CALCULATIONS
// ============================================================================

/**
 * Calculate base price for modules (before any discounts)
 *
 * @param modules - Array of module IDs
 * @param pricing - Dynamic pricing configuration
 * @returns Total base price for all modules
 */
export const calculateModulesBasePrice = (modules: ModuleId[], pricing: DynamicPricing): number => {
  return modules.reduce((total, moduleId) => {
    const modulePrice = pricing.modules[moduleId]?.price || 0;
    return total + modulePrice;
  }, 0);
};

/**
 * Calculate price for modules with bundle discount applied
 *
 * @param modules - Array of module IDs
 * @param pricing - Dynamic pricing configuration
 * @returns Price after bundle discount
 */
export const calculateModulesPriceWithBundleDiscount = (modules: ModuleId[], pricing: DynamicPricing): number => {
  const basePrice = calculateModulesBasePrice(modules, pricing);
  const bundleDiscountPercent = getBundleDiscount(modules.length, pricing.bundleDiscounts);
  return applyBundleDiscount(basePrice, bundleDiscountPercent);
};

// ============================================================================
// PRORATED UPGRADE CALCULATION
// ============================================================================

/**
 * Calculate prorated upgrade cost for monthly subscription
 *
 * RULES:
 * - NO bundle discount on newly added modules
 * - YES multi-org discount applies
 * - NO yearly discount (monthly plan)
 *
 * @param oldConfig - Current subscription configuration
 * @param newConfig - New subscription configuration
 * @param pricing - Dynamic pricing configuration
 * @param daysRemaining - Days remaining in current period
 * @param totalDays - Total days in current period
 * @returns Prorated upgrade calculation details
 */
export const calculateMonthlyProratedUpgrade = (
  oldConfig: SubscriptionConfig,
  newConfig: Omit<SubscriptionConfig, 'totalAmount' | 'monthlyEquivalent'>,
  pricing: DynamicPricing,
  daysRemaining: number,
  totalDays: number
): ProratedUpgradeCalculation => {
  // Identify what's being added
  const modulesAdded = getAddedModules(oldConfig.modules, newConfig.modules);
  const orgsAdded = Math.max(0, newConfig.organizationCount - oldConfig.organizationCount);
  const analyticsAdded = !oldConfig.includeAnalytics && newConfig.includeAnalytics;

  // Calculate old monthly price (with discounts already applied)
  const oldModulesWithBundle = calculateModulesPriceWithBundleDiscount(oldConfig.modules, pricing);
  const oldAnalyticsPrice = oldConfig.includeAnalytics ? pricing.analytics * oldConfig.organizationCount : 0;
  const oldSubtotal = oldModulesWithBundle + oldAnalyticsPrice;
  const oldMultiOrgMultiplier = getMultiOrgMultiplier(oldConfig.organizationCount, pricing.multiOrgPricing);
  const oldMonthlyTotal = applyMultiOrgDiscount(oldSubtotal, 1, oldMultiOrgMultiplier);

  // Calculate new monthly price
  // Rule: Keep old base with discount + add new modules WITHOUT bundle discount
  const newModulesPrice = modulesAdded.reduce((sum, moduleId) => {
    return sum + (pricing.modules[moduleId]?.price || 0);
  }, 0);

  const newModulesWithOldBase = oldModulesWithBundle + newModulesPrice;
  const newAnalyticsPrice = newConfig.includeAnalytics ? pricing.analytics * newConfig.organizationCount : 0;
  const newSubtotal = newModulesWithOldBase + newAnalyticsPrice;
  const newMultiOrgMultiplier = getMultiOrgMultiplier(newConfig.organizationCount, pricing.multiOrgPricing);
  const newMonthlyTotal = applyMultiOrgDiscount(newSubtotal, 1, newMultiOrgMultiplier);

  // Calculate difference
  const monthlyDifference = newMonthlyTotal - oldMonthlyTotal;

  // Calculate prorated amount
  const proratedAmount = monthlyDifference * (daysRemaining / totalDays);

  // Breakdown by component
  const moduleCost = newModulesPrice * (daysRemaining / totalDays);
  const analyticsCost = analyticsAdded ? pricing.analytics * newConfig.organizationCount * (daysRemaining / totalDays) : 0;
  const orgCost = proratedAmount - moduleCost - analyticsCost;

  return {
    modulesAdded,
    orgsAdded,
    analyticsAdded,
    daysRemaining,
    totalDays,
    upgradeDate: new Date(),
    subscriptionEndDate: new Date(oldConfig.totalAmount), // Placeholder
    moduleCost,
    orgCost,
    analyticsCost,
    multiOrgDiscountPercent: newMultiOrgMultiplier,
    yearlyDiscountPercent: 0,
    totalProratedAmount: proratedAmount,
  };
};

/**
 * Calculate prorated upgrade cost for yearly subscription
 *
 * RULES:
 * - NO bundle discount on newly added modules
 * - YES multi-org discount applies
 * - YES yearly discount applies
 *
 * Formula: yearlyDifference × (1 - yearlyDiscount%) × (daysRemaining / daysInYear)
 *
 * @param oldConfig - Current subscription configuration
 * @param newConfig - New subscription configuration
 * @param pricing - Dynamic pricing configuration
 * @param daysRemaining - Days remaining in current period
 * @param totalDays - Total days in year (365 or 366)
 * @returns Prorated upgrade calculation details
 */
export const calculateYearlyProratedUpgrade = (
  oldConfig: SubscriptionConfig,
  newConfig: Omit<SubscriptionConfig, 'totalAmount' | 'monthlyEquivalent'>,
  pricing: DynamicPricing,
  daysRemaining: number,
  totalDays: number
): ProratedUpgradeCalculation => {
  // Identify what's being added
  const modulesAdded = getAddedModules(oldConfig.modules, newConfig.modules);
  const orgsAdded = Math.max(0, newConfig.organizationCount - oldConfig.organizationCount);
  const analyticsAdded = !oldConfig.includeAnalytics && newConfig.includeAnalytics;

  // Calculate old monthly equivalent (with discounts)
  const oldModulesWithBundle = calculateModulesPriceWithBundleDiscount(oldConfig.modules, pricing);
  const oldAnalyticsPrice = oldConfig.includeAnalytics ? pricing.analytics * oldConfig.organizationCount : 0;
  const oldSubtotal = oldModulesWithBundle + oldAnalyticsPrice;
  const oldMultiOrgMultiplier = getMultiOrgMultiplier(oldConfig.organizationCount, pricing.multiOrgPricing);
  const oldMonthlyEquivalent = applyMultiOrgDiscount(oldSubtotal, 1, oldMultiOrgMultiplier);

  // Calculate new monthly equivalent
  const newModulesPrice = modulesAdded.reduce((sum, moduleId) => {
    return sum + (pricing.modules[moduleId]?.price || 0);
  }, 0);

  const newModulesWithOldBase = oldModulesWithBundle + newModulesPrice;
  const newAnalyticsPrice = newConfig.includeAnalytics ? pricing.analytics * newConfig.organizationCount : 0;
  const newSubtotal = newModulesWithOldBase + newAnalyticsPrice;
  const newMultiOrgMultiplier = getMultiOrgMultiplier(newConfig.organizationCount, pricing.multiOrgPricing);
  const newMonthlyEquivalent = applyMultiOrgDiscount(newSubtotal, 1, newMultiOrgMultiplier);

  // Calculate yearly difference
  const monthlyDifference = newMonthlyEquivalent - oldMonthlyEquivalent;
  const yearlyDifference = monthlyDifference * 12;

  // Apply yearly discount
  const yearlyDifferenceWithDiscount = applyYearlyDiscount(yearlyDifference, pricing.yearlyDiscount);

  // Calculate prorated amount
  const proratedAmount = yearlyDifferenceWithDiscount * (daysRemaining / totalDays);

  // Breakdown by component (approximate)
  const moduleCost = newModulesPrice * 12 * (1 - pricing.yearlyDiscount / 100) * (daysRemaining / totalDays);
  const analyticsCost = analyticsAdded
    ? pricing.analytics * newConfig.organizationCount * 12 * (1 - pricing.yearlyDiscount / 100) * (daysRemaining / totalDays)
    : 0;
  const orgCost = proratedAmount - moduleCost - analyticsCost;

  return {
    modulesAdded,
    orgsAdded,
    analyticsAdded,
    daysRemaining,
    totalDays,
    upgradeDate: new Date(),
    subscriptionEndDate: new Date(),
    moduleCost,
    orgCost,
    analyticsCost,
    multiOrgDiscountPercent: newMultiOrgMultiplier,
    yearlyDiscountPercent: pricing.yearlyDiscount,
    totalProratedAmount: proratedAmount,
  };
};

// ============================================================================
// NEXT RECURRING CALCULATION
// ============================================================================

/**
 * Calculate next recurring subscription price with ALL discounts
 *
 * This is the full price user will pay starting next billing cycle
 * with all applicable discounts (bundle, multi-org, yearly)
 *
 * @param newConfig - New subscription configuration
 * @param pricing - Dynamic pricing configuration
 * @param startDate - When next billing cycle starts
 * @returns Complete next recurring calculation
 */
export const calculateNextRecurring = (
  newConfig: Omit<SubscriptionConfig, 'totalAmount' | 'monthlyEquivalent'>,
  pricing: DynamicPricing,
  startDate: string
): NextRecurringCalculation => {
  // Calculate base modules price
  const baseModulesPrice = calculateModulesBasePrice(newConfig.modules, pricing);

  // Apply bundle discount
  const bundleDiscountPercent = getBundleDiscount(newConfig.modules.length, pricing.bundleDiscounts);
  const bundleDiscountAmount = baseModulesPrice * (bundleDiscountPercent / 100);
  const priceAfterBundleDiscount = baseModulesPrice - bundleDiscountAmount;

  // Add analytics (no bundle discount)
  const analyticsPrice = newConfig.includeAnalytics ? pricing.analytics : 0;
  const priceBeforeOrgMultiply = priceAfterBundleDiscount + analyticsPrice;

  // Apply multi-org discount
  const multiOrgMultiplier = getMultiOrgMultiplier(newConfig.organizationCount, pricing.multiOrgPricing);
  const priceAfterOrgMultiply = applyMultiOrgDiscount(priceBeforeOrgMultiply, newConfig.organizationCount, multiOrgMultiplier);

  const monthlyTotal = priceAfterOrgMultiply;

  // For yearly plans, apply yearly discount
  let yearlyTotal: number | undefined;
  let yearlyDiscountPercent: number | undefined;
  let yearlyDiscountAmount: number | undefined;
  let displayAmount: number;
  let displayPeriod: 'month' | 'year';

  if (newConfig.billingCycle === 'yearly') {
    yearlyDiscountPercent = pricing.yearlyDiscount;
    const yearlyBeforeDiscount = monthlyTotal * 12;
    yearlyDiscountAmount = yearlyBeforeDiscount * (yearlyDiscountPercent / 100);
    yearlyTotal = yearlyBeforeDiscount - yearlyDiscountAmount;
    displayAmount = yearlyTotal;
    displayPeriod = 'year';
  } else {
    displayAmount = monthlyTotal;
    displayPeriod = 'month';
  }

  return {
    modules: newConfig.modules,
    includeAnalytics: newConfig.includeAnalytics,
    organizationCount: newConfig.organizationCount,
    billingCycle: newConfig.billingCycle,
    startDate,
    baseModulesPrice,
    bundleDiscountPercent,
    bundleDiscountAmount,
    priceAfterBundleDiscount,
    analyticsPrice: analyticsPrice * newConfig.organizationCount,
    priceBeforeOrgMultiply,
    multiOrgDiscountPercent: multiOrgMultiplier,
    priceAfterOrgMultiply,
    yearlyDiscountPercent,
    yearlyDiscountAmount,
    monthlyTotal,
    yearlyTotal,
    displayAmount,
    displayPeriod,
  };
};

// ============================================================================
// COMPLETE SUBSCRIPTION ANALYSIS
// ============================================================================

/**
 * Perform complete subscription change analysis
 *
 * This is the main function that orchestrates all calculations and
 * determines what to display to the user.
 *
 * @param userSubscriptionData - Current subscription from API (null if no subscription)
 * @param newSelections - User's new selections from UI
 * @param pricing - Dynamic pricing configuration
 * @param currentDate - Current date (for testing purposes, defaults to now)
 * @returns Complete analysis of subscription changes
 */
export const analyzeSubscriptionChange = (
  userSubscriptionData: UserSubscriptionData | null,
  newSelections: {
    modules: ModuleId[];
    includeAnalytics: boolean;
    organizationCount: number;
    billingCycle: 'monthly' | 'yearly';
  },
  pricing: DynamicPricing,
  currentDate: Date = new Date()
): SubscriptionChangeAnalysis => {
  // Build new config from selections
  const newConfig: Omit<SubscriptionConfig, 'totalAmount' | 'monthlyEquivalent'> = {
    modules: newSelections.modules,
    includeAnalytics: newSelections.includeAnalytics,
    organizationCount: newSelections.organizationCount,
    billingCycle: newSelections.billingCycle,
  };

  // If no current subscription, this is a new subscription
  if (!userSubscriptionData) {
    const changeType = determineChangeType(null, newConfig);

    return {
      changeType,
      currentSubscription: null,
      newSubscription: {
        ...newConfig,
        totalAmount: 0,
        monthlyEquivalent: 0,
      },
      proratedUpgrade: null,
      nextRecurring: null,
      isSameDayEnd: false,
      isFreePlan: changeType === 'free_plan',
      hasPriceDiscrepancy: false,
    };
  }

  // Build current config from API data
  const currentModules = userSubscriptionData.subscriptionTypes.filter((type) => type !== 'analytics' && type !== 'free') as ModuleId[];

  const currentConfig: SubscriptionConfig = {
    modules: currentModules,
    includeAnalytics: userSubscriptionData.subscriptionTypes.includes('analytics'),
    organizationCount: userSubscriptionData.numberOfOrganizations,
    billingCycle: userSubscriptionData.pricingPlan,
    totalAmount: userSubscriptionData.totalSubscriptionAmount,
    monthlyEquivalent: userSubscriptionData.monthlyPrice,
  };

  // Determine change type
  const changeType = determineChangeType(currentConfig, newConfig);

  // Calculate dates
  const subscriptionEndDate = new Date(userSubscriptionData.endDate);
  const daysRemaining = calculateDaysRemaining(currentDate, subscriptionEndDate);
  const isSameDayEnd = daysRemaining === 1;

  // Calculate total days in period
  const subscriptionStartDate = new Date(userSubscriptionData.startDate);
  const totalDays = calculateTotalDays(subscriptionStartDate, subscriptionEndDate);

  // Calculate prorated upgrade (only for upgrades)
  let proratedUpgrade: ProratedUpgradeCalculation | null = null;

  if (changeType === 'upgrade') {
    if (currentConfig.billingCycle === 'yearly') {
      const startYear = subscriptionStartDate.getFullYear();
      const daysInYear = getDaysInYear(startYear);
      proratedUpgrade = calculateYearlyProratedUpgrade(currentConfig, newConfig, pricing, daysRemaining, daysInYear);
    } else {
      proratedUpgrade = calculateMonthlyProratedUpgrade(currentConfig, newConfig, pricing, daysRemaining, totalDays);
    }

    // Add actual dates
    proratedUpgrade.upgradeDate = currentDate;
    proratedUpgrade.subscriptionEndDate = subscriptionEndDate;
  }

  // Calculate next recurring (for all change types)
  const nextRecurringStartDate = new Date(subscriptionEndDate);
  nextRecurringStartDate.setDate(nextRecurringStartDate.getDate() + 1);

  const nextRecurring = calculateNextRecurring(newConfig, pricing, nextRecurringStartDate.toISOString());

  return {
    changeType,
    currentSubscription: currentConfig,
    newSubscription: {
      ...newConfig,
      totalAmount: nextRecurring.displayAmount,
      monthlyEquivalent: nextRecurring.monthlyTotal,
    },
    proratedUpgrade,
    nextRecurring,
    isSameDayEnd,
    isFreePlan: changeType === 'free_plan',
    hasPriceDiscrepancy: false, // Will be set by component comparing API vs calculated
  };
};
