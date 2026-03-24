export type BillingCycle = 'monthly' | 'yearly';

export type ModuleId = 'ordering' | 'loyalty' | 'reservations';

export type SubscriptionChangeType = 'upgrade' | 'downgrade' | 'no_change' | 'free_plan';

export interface ModuleConfig {
  id: ModuleId;
  name: string;
  description: string;
  icon: string;
  color: 'blue' | 'purple' | 'green';
  features: string[];
}

export interface ModulePricing {
  price: number;
  commission: number;
}

export interface PricingConfig {
  modules: Record<ModuleId, ModulePricing>;
  analytics: number;
  bundleDiscounts: Record<number, number>;
  multiOrgPricing: Record<number, number>;
  yearlyDiscount: number;
  ticketingCommission: number;
}

export interface PriceCalculation {
  monthlyTotal: string;
  yearlyTotal: string;
  bundleDiscountPercent: number;
  bundleDiscountAmount: string;
  yearlyDiscountPercent: number;
  savingsAmount: string;
  baseModulesPrice: string;
  priceAfterBundleDiscount: string;
  analyticsPrice: string;
  priceBeforeOrgMultiply: string;
  priceAfterOrgMultiply: string;
  multiOrgDiscountPercent: number;
}

export interface SubscriptionState {
  selectedModules: ModuleId[];
  includeAnalytics: boolean;
  organizationCount: number;
  customOrgCount: number | null;
  billingCycle: BillingCycle;
  hasActiveSubscription: boolean;
}

export interface ModuleCardProps {
  module: ModuleConfig;
  pricing: ModulePricing;
  isSelected: boolean;
  onToggle: () => void;
}

/**
 * Configuration snapshot of a subscription at a point in time
 */
export interface SubscriptionConfig {
  modules: ModuleId[];
  includeAnalytics: boolean;
  organizationCount: number;
  billingCycle: BillingCycle;
  totalAmount: number; // From API or calculated
  monthlyEquivalent: number; // For yearly plans
  basePrice?: number; // Per-org base price from API
}

/**
 * Represents the user's current active subscription from API
 */
export interface UserSubscriptionData {
  subscriptionTypes: string[];
  pricingPlan: 'monthly' | 'yearly';
  numberOfOrganizations: number;
  totalSubscriptionAmount: number;
  monthlyPrice: number;
  startDate: string;
  endDate: string;
  basePrice: number;
  orderingCommission: number;
  ticketingCommission: number;
  reservationCommission: number;
}

/**
 * Breakdown of prorated upgrade costs
 */
export interface ProratedUpgradeCalculation {
  // What's being added
  modulesAdded: ModuleId[];
  orgsAdded: number;
  analyticsAdded: boolean;

  // Time calculation
  daysRemaining: number;
  totalDays: number;
  upgradeDate: Date;
  subscriptionEndDate: Date;

  // Base price flow
  oldBasePricePerOrg: number;
  newBasePricePerOrg: number;
  oldOrganizationCount: number;
  newOrganizationCount: number;
  oldMonthlyTotal: number;
  newMonthlyTotal: number;
  monthlyDifference: number;

  // Cost breakdown
  moduleCost: number; // Cost for added modules (no bundle discount)
  orgCost: number; // Cost for added orgs (with multi-org discount)
  analyticsCost: number; // Cost for analytics (no discounts)

  // Discounts applied
  multiOrgDiscountPercent: number;
  yearlyDiscountPercent: number; // Only for yearly plans

  // Total prorated amount to charge NOW
  totalProratedAmount: number;
}

/**
 * Configuration and pricing for next billing cycle
 */
export interface NextRecurringCalculation {
  // Configuration
  modules: ModuleId[];
  includeAnalytics: boolean;
  organizationCount: number;
  billingCycle: BillingCycle;

  // Start date (day after current subscription ends)
  startDate: string;

  // Full price calculation with ALL discounts
  baseModulesPrice: number;
  bundleDiscountPercent: number;
  bundleDiscountAmount: number;
  priceAfterBundleDiscount: number;
  analyticsPrice: number;
  priceBeforeOrgMultiply: number;
  multiOrgDiscountPercent: number;
  priceAfterOrgMultiply: number;

  // For yearly plans
  yearlyDiscountPercent?: number;
  yearlyDiscountAmount?: number;

  // Final amounts
  monthlyTotal: number;
  yearlyTotal?: number; // Only for yearly billing

  // Display amount based on billing cycle
  displayAmount: number;
  displayPeriod: 'month' | 'year';
}

/**
 * Complete subscription change analysis
 */
export interface SubscriptionChangeAnalysis {
  changeType: SubscriptionChangeType;

  // Current subscription (if exists)
  currentSubscription: SubscriptionConfig | null;

  // New subscription configuration
  newSubscription: SubscriptionConfig;

  // Prorated upgrade costs (only for 'upgrade' type)
  proratedUpgrade: ProratedUpgradeCalculation | null;

  // Next recurring subscription (always present if user has active subscription)
  nextRecurring: NextRecurringCalculation | null;

  // Special flags
  isSameDayEnd: boolean; // Upgrade happening on last day of subscription
  isFreePlan: boolean; // Downgrading to free plan
  hasPriceDiscrepancy: boolean; // Calculated price differs from API price
}

/**
 * Dynamic pricing structure from API
 */
export interface DynamicPricing {
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

// export type BillingCycle = 'monthly' | 'yearly';

// export type ModuleId = 'ordering' | 'loyalty' | 'reservations';

// export interface ModuleConfig {
//   id: ModuleId;
//   name: string;
//   description: string;
//   icon: string;
//   color: 'blue' | 'purple' | 'green';
//   features: string[];
// }

// export interface ModulePricing {
//   price: number;
//   commission: number;
// }

// export interface PricingConfig {
//   modules: Record<ModuleId, ModulePricing>;
//   analytics: number;
//   bundleDiscounts: Record<number, number>;
//   multiOrgPricing: Record<number, number>;
//   yearlyDiscount: number;
//   ticketingCommission: number;
// }

// export interface PriceCalculation {
//   monthlyTotal: string;
//   yearlyTotal: string;
//   bundleDiscountPercent: number;
//   bundleDiscountAmount: string;
//   yearlyDiscountPercent: number;
//   savingsAmount: string;
//   // Detailed breakdown fields
//   baseModulesPrice: string;
//   priceAfterBundleDiscount: string;
//   analyticsPrice: string;
//   priceBeforeOrgMultiply: string;
//   priceAfterOrgMultiply: string;
//   multiOrgDiscountPercent: number;
// }

// export interface SubscriptionState {
//   selectedModules: ModuleId[];
//   includeAnalytics: boolean;
//   organizationCount: number;
//   customOrgCount: number | null;
//   billingCycle: BillingCycle;
//   hasActiveSubscription: boolean;
// }

// export interface ModuleCardProps {
//   module: ModuleConfig;
//   pricing: ModulePricing;
//   isSelected: boolean;
//   onToggle: () => void;
// }
