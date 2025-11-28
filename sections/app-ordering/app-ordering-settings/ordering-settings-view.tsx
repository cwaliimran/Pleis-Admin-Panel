'use client';

import { Button } from '@/components/ui/button';
import { showError, showSuccess } from '@/utils/toast';
import { RotateCcw, Save } from 'lucide-react';
import React, { useState } from 'react';
import { DEFAULT_SETTINGS, DELIVERY_METHODS, ORDER_FLOW_WITH_ACCEPTANCE, ORDER_FLOW_WITHOUT_ACCEPTANCE, PAYMENT_TIMING_OPTIONS } from './constants';
import { DeliveryMethodCard } from './delivery-method-card';
import { InfoBox } from './info-box';
import { RadioOption } from './radio-option';
import { SettingItem } from './setting-item';
import { StatusFlow } from './status-flow';
import { DeliveryMethodType, OrderingSettings, PaymentTimingType } from './types';

export const OrderingSettingsView: React.FC = () => {
  const [settings, setSettings] = useState<OrderingSettings>(DEFAULT_SETTINGS);

  const handlePaymentMethodChange = (method: keyof OrderingSettings['payment'], value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        [method]: value,
      },
    }));
  };

  const handleAcceptanceEnabledChange = (enabled: boolean) => {
    setSettings((prev) => ({
      ...prev,
      acceptance: {
        ...prev.acceptance,
        enabled,
      },
    }));
  };

  const handlePaymentTimingChange = (timing: PaymentTimingType) => {
    setSettings((prev) => ({
      ...prev,
      acceptance: {
        ...prev.acceptance,
        paymentTiming: timing,
      },
    }));
  };

  const handleDeliveryMethodChange = (method: DeliveryMethodType, value: boolean) => {
    // Check if at least one delivery method will remain enabled
    const newDeliverySettings = {
      ...settings.delivery,
      [method]: value,
    };

    const anyEnabled = Object.values(newDeliverySettings).some((v) => v);

    if (!anyEnabled) {
      showError('At least one delivery method must be enabled. Ordering will be unavailable if all methods are disabled.');
      return;
    }

    setSettings((prev) => ({
      ...prev,
      delivery: newDeliverySettings,
    }));
  };

  const handleSave = () => {
    // In real app: save to backend
    console.log('Saving settings:', settings);
    showSuccess('Settings saved successfully!');
  };

  const handleReset = () => {
    // if (window.confirm('Reset all ordering settings to default values?')) {
    setSettings(DEFAULT_SETTINGS);
    showSuccess('Settings reset to default');
    // }
  };

  return (
    <>
      <section className="min-h-screen">
        <div className="mx-auto max-w-full rounded-2xl dark:bg-[#1a1a1a]">
          {/* Payment Methods Section */}
          <div className="mb-6 rounded-2xl bg-white px-7 py-7 shadow-sm dark:bg-[#222121]">
            <div className="mb-6 flex items-center gap-4 border-b-2 border-gray-100 pb-5 dark:border-gray-800">
              {/* <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2A7B9B] to-[#1300FF] text-4xl">💳</div> */}
              <div className="flex-1">
                <h2 className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">Payment Methods</h2>
                <p className="text-[15px] leading-relaxed text-gray-500 dark:text-gray-500">
                  Choose which payment options are available to customers when placing orders
                </p>
              </div>
            </div>

            {/* Instant Payment */}
            <SettingItem
              title="Instant Payment"
              description="Customers pay immediately when placing their order. Payment is captured before the order is sent to staff."
              checked={settings.payment.instant}
              onChange={(value) => handlePaymentMethodChange('instant', value)}
            >
              <InfoBox
                variant="info"
                title="Recommended for most venues"
                description="Instant payment reduces no-shows and ensures guaranteed revenue. Payment is processed securely before order preparation begins."
              />
            </SettingItem>

            {/* Pay Later */}
            <SettingItem
              title="Pay Later"
              description="Allow customers to order now and pay after the order is prepared or delivered. Payment is captured at a later stage in the order workflow."
              checked={settings.payment.payLater}
              onChange={(value) => handlePaymentMethodChange('payLater', value)}
            >
              {settings.payment.payLater && (
                <div className="mt-5">
                  <div className="rounded-xl bg-gray-50 p-5 dark:bg-[#1a1a1a]">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1 pr-5">
                        <h4 className="mb-1.5 text-base font-bold text-gray-900 dark:text-gray-100">Enable Order Acceptance</h4>
                        <p className="text-[13px] leading-relaxed text-gray-600 dark:text-gray-400">
                          Staff must accept orders before preparation begins. Enables "Sent" → "Accepted" workflow.
                        </p>
                      </div>
                      <label className="relative inline-block h-8 w-14 flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={settings.acceptance.enabled}
                          onChange={(e) => handleAcceptanceEnabledChange(e.target.checked)}
                          className="h-0 w-0 opacity-0"
                        />
                        <span
                          className={`absolute inset-0 cursor-pointer rounded-full transition-all duration-300 ${
                            settings.acceptance.enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`absolute bottom-[3px] left-[3px] h-[26px] w-[26px] rounded-full bg-white shadow-md transition-transform duration-300 ${
                              settings.acceptance.enabled ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </span>
                      </label>
                    </div>

                    {settings.acceptance.enabled && (
                      <div className="mt-4 flex flex-col gap-3">
                        {PAYMENT_TIMING_OPTIONS.map((option) => (
                          <RadioOption
                            key={option.value}
                            value={option.value}
                            label={option.label}
                            description={option.description}
                            selected={settings.acceptance.paymentTiming === option.value}
                            onSelect={() => handlePaymentTimingChange(option.value)}
                          />
                        ))}
                      </div>
                    )}

                    <StatusFlow
                      title={settings.acceptance.enabled ? 'Order Status Flow with Acceptance:' : 'Order Status Flow without Acceptance:'}
                      steps={settings.acceptance.enabled ? ORDER_FLOW_WITH_ACCEPTANCE : ORDER_FLOW_WITHOUT_ACCEPTANCE}
                    />
                  </div>
                </div>
              )}

              <InfoBox
                variant="warning"
                title="Important"
                description="Pay later orders may have a higher cancellation rate. Consider enabling order acceptance to confirm availability before preparation."
              />
            </SettingItem>

            {/* Cash Payment */}
            <SettingItem
              title="Cash Payment"
              description="Allow customers to pay with cash upon pickup or delivery. Staff marks the order as paid after receiving payment."
              checked={settings.payment.cash}
              onChange={(value) => handlePaymentMethodChange('cash', value)}
              isLast
            >
              <InfoBox
                variant="info"
                title="Cash handling workflow"
                description='Orders are marked as "Waiting for Payment" after delivery. Staff confirms payment receipt in the app to complete the order.'
              />
            </SettingItem>

            {/* Save Button */}
            <div className="mt-6 flex justify-end border-t border-gray-100 pt-6 dark:border-gray-800">
              <Button onClick={handleSave} className="h-10 gap-2 font-semibold">
                {/* <Save className="h-4 w-4" /> */}
                Save Payment Settings
              </Button>
            </div>
          </div>

          {/* Delivery Methods Section */}
          <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-[#222121]">
            <div className="mb-6 flex items-center justify-between gap-4 border-b-2 border-gray-100 pb-5 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h2 className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">Delivery Methods</h2>
                  <p className="text-[15px] leading-relaxed text-gray-500 dark:text-gray-500">
                    Select which delivery options customers can choose when placing orders
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={handleReset} className="gap-2 font-semibold">
                <RotateCcw className="h-4 w-4" />
                Reset to Default
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {DELIVERY_METHODS.map((method) => (
                <DeliveryMethodCard
                  key={method.id}
                  method={method}
                  enabled={settings.delivery[method.id]}
                  onToggle={(value) => handleDeliveryMethodChange(method.id, value)}
                />
              ))}
            </div>

            <InfoBox
              variant="warning"
              title="At least one delivery method required"
              description="You must enable at least one delivery method for customers to place orders. If all methods are disabled, ordering will be unavailable."
            />

            {/* Save Button */}
            <div className="mt-6 flex justify-end border-t border-gray-100 pt-6 dark:border-gray-800">
              <Button onClick={handleSave} className="h-10 gap-2 font-semibold">
                {/* <Save className="h-4 w-4" /> */}
                Save Delivery Settings
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
