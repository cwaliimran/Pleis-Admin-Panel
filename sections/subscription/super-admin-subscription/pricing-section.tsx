'use client';

import { Button } from '@/components/ui/button';
import { Calendar, Package, TrendingUp, Users } from 'lucide-react';
import React from 'react';
import { MODULE_NAMES } from './constants';
import { ModuleType, PricingConfig } from './types';

interface PricingSectionProps {
  pricing: PricingConfig;
  onPricingChange: (pricing: PricingConfig) => void;
  onSave: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ pricing, onPricingChange, onSave }) => {
  const handleModulePriceChange = (module: ModuleType, value: number) => {
    onPricingChange({
      ...pricing,
      modules: { ...pricing.modules, [module]: value },
    });
  };

  const handleCommissionChange = (module: keyof typeof pricing.commissions, value: number) => {
    onPricingChange({
      ...pricing,
      commissions: { ...pricing.commissions, [module]: value },
    });
  };

  const handleBundleDiscountChange = (key: keyof typeof pricing.bundleDiscounts, value: number) => {
    onPricingChange({
      ...pricing,
      bundleDiscounts: { ...pricing.bundleDiscounts, [key]: value },
    });
  };

  const handleMultiOrgPricingChange = (index: number, value: number) => {
    const newPricing = [...pricing.multiOrgPricing];
    newPricing[index].percentage = value;
    onPricingChange({ ...pricing, multiOrgPricing: newPricing });
  };

  return (
    <div className="space-y-6">
      {/* Module Pricing */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-[#1a1a1a]">
        <div className="mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-blue-600 dark:text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Module Pricing</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {(Object.entries(pricing.modules) as [ModuleType, number][]).map(([module, price]) => (
            <div key={module}>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {MODULE_NAMES[module]}
                {module === 'analytics' && <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">(Fixed price, no discounts)</span>}
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">€</span>
                <input
                  title="module pricing"
                  type="number"
                  value={price}
                  onChange={(e) => handleModulePriceChange(module, Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-8 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1a1a1a] dark:text-gray-100"
                />
                <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">/month</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commission Settings */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-[#1a1a1a]">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Default Commission Rates</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {(Object.entries(pricing.commissions) as [keyof typeof pricing.commissions, number][]).map(([module, rate]) => (
            <div key={module}>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{MODULE_NAMES[module]}</label>
              <div className="relative">
                <input
                  title="commission"
                  type="number"
                  value={rate}
                  onChange={(e) => handleCommissionChange(module, Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 py-2 pr-8 pl-4 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1a1a1a] dark:text-gray-100"
                />
                <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bundle Discounts */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-[#1a1a1a]">
        <div className="mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-blue-600 dark:text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Bundle Discounts</h3>
        </div>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Discounts applied when multiple modules are selected (excludes Analytics)</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">2 Modules Selected</label>
            <div className="relative">
              <input
                title="bundle discount"
                type="number"
                value={pricing.bundleDiscounts.twoModules}
                onChange={(e) => handleBundleDiscountChange('twoModules', Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 py-2 pr-8 pl-4 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1a1a1a] dark:text-gray-100"
              />
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">3 Modules Selected</label>
            <div className="relative">
              <input
                title="bundle discount"
                type="number"
                value={pricing.bundleDiscounts.threeModules}
                onChange={(e) => handleBundleDiscountChange('threeModules', Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 py-2 pr-8 pl-4 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1a1a1a] dark:text-gray-100"
              />
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Organization Pricing */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-[#1a1a1a]">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600 dark:text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Multi-Organization Pricing</h3>
        </div>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Percentage of base price per organization</p>
        <div className="space-y-3">
          {pricing.multiOrgPricing.map((tier, index) => (
            <div key={tier.orgs} className="flex items-center gap-4">
              <div className="w-32">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {tier.orgs === 6 ? '6+ Orgs' : `${tier.orgs} Org${tier.orgs > 1 ? 's' : ''}`}
                </label>
              </div>
              <div className="relative flex-1">
                <input
                  title="multi-org pricing"
                  type="number"
                  value={tier.percentage}
                  disabled={tier.orgs === 1}
                  onChange={(e) => handleMultiOrgPricingChange(index, Number(e.target.value))}
                  className={`w-full rounded-lg border border-gray-300 py-2 pr-8 pl-4 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:text-gray-100 ${
                    tier.orgs === 1 ? 'bg-gray-50 dark:bg-[#1a1a1a]' : 'dark:bg-[#1a1a1a]'
                  }`}
                />
                <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
              </div>
              <div className="w-40 text-sm text-gray-600 dark:text-gray-400">Total: {(tier.orgs * tier.percentage).toFixed(0)}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Yearly Discount */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-[#1a1a1a]">
        <div className="mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Yearly Subscription Discount</h3>
        </div>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Discount applied when paying yearly instead of monthly</p>
        <div className="max-w-xs">
          <div className="relative">
            <input
              title="module pricing"
              type="number"
              value={pricing.yearlyDiscount}
              onChange={(e) => onPricingChange({ ...pricing, yearlyDiscount: Number(e.target.value) })}
              className="w-full rounded-lg border border-gray-300 py-2 pr-8 pl-4 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1a1a1a] dark:text-gray-100"
            />
            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Formula: Yearly = 12 × Monthly × (1 - {pricing.yearlyDiscount}%)</p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={onSave} className="h-10 gap-2 font-semibold">
          Save Pricing Configuration
        </Button>
      </div>
    </div>
  );
};
