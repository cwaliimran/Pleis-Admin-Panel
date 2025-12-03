export type ModuleType = 'ordering' | 'ticketing' | 'reservations' | 'analytics';

export type BillingCycle = 'monthly' | 'yearly';

export type SubscriptionStatus = 'active' | 'inactive' | 'expired' | 'canceled';

export type TabType = 'subscriptions' | 'pricing';

export interface Subscription {
  id: string;
  organizer: string;
  modules: ModuleType[];
  organizations: number;
  billing: BillingCycle;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  monthlyPrice: number;
  commissions: CommissionRates;
}

export interface CommissionRates {
  ordering: number;
  ticketing: number;
  reservations: number;
}

export interface ModulePricing {
  ordering: number;
  ticketing: number;
  reservations: number;
  analytics: number;
}

export interface BundleDiscounts {
  twoModules: number;
  threeModules: number;
}

export interface MultiOrgPricingTier {
  orgs: number;
  percentage: number;
}

export interface PricingConfig {
  modules: ModulePricing;
  commissions: CommissionRates;
  bundleDiscounts: BundleDiscounts;
  multiOrgPricing: MultiOrgPricingTier[];
  yearlyDiscount: number;
}

export interface SubscriptionFormData {
  organizer: string;
  modules: ModuleType[];
  organizations: number;
  startDate: string;
  endDate: string;
  billing: BillingCycle;
  commissions: CommissionRates;
}
