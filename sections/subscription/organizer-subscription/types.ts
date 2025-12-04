export type BillingCycle = 'monthly' | 'yearly';

export type ModuleId = 'ordering' | 'loyalty' | 'reservations';

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
}

export interface SubscriptionState {
  selectedModules: ModuleId[];
  includeAnalytics: boolean;
  organizationCount: number;
  customOrgCount: number | null;
  billingCycle: BillingCycle;
  hasActiveSubscription: boolean;
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
// }

// export interface SubscriptionState {
//   selectedModules: ModuleId[];
//   includeAnalytics: boolean;
//   organizationCount: number;
//   billingCycle: BillingCycle;
//   hasActiveSubscription: boolean;
// }
