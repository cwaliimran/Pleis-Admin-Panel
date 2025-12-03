'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { MODULE_NAMES } from './constants';
import { ModuleType, Subscription, SubscriptionFormData } from './types';

interface EditSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription | null;
  onSave: (data: SubscriptionFormData) => void;
}

export const EditSubscriptionModal: React.FC<EditSubscriptionModalProps> = ({ isOpen, onClose, subscription, onSave }) => {
  const [formData, setFormData] = useState<SubscriptionFormData>({
    organizer: '',
    modules: [],
    organizations: 1,
    startDate: '',
    endDate: '',
    billing: 'monthly',
    commissions: { ordering: 0, ticketing: 0, reservations: 0 },
  });

  useEffect(() => {
    if (subscription) {
      setFormData({
        organizer: subscription.organizer,
        modules: subscription.modules,
        organizations: subscription.organizations,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        billing: subscription.billing,
        commissions: subscription.commissions,
      });
    }
  }, [subscription]);

  const handleModuleToggle = (module: ModuleType) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.includes(module) ? prev.modules.filter((m) => m !== module) : [...prev.modules, module],
    }));
  };

  const handleCommissionChange = (module: keyof typeof formData.commissions, value: number) => {
    setFormData((prev) => ({
      ...prev,
      commissions: { ...prev.commissions, [module]: value },
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen || !subscription) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white dark:bg-[#222121]">
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Edit Subscription</h3>
            <button title="Close" type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 p-6">
          {/* Organizer */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Organizer</label>
            <input
              type="text"
              title="organizer"
              value={formData.organizer}
              disabled
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 dark:border-gray-600 dark:bg-[#1a1a1a] dark:text-gray-400"
            />
          </div>

          {/* Modules */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Modules</label>
            <div className="space-y-2">
              {(Object.keys(MODULE_NAMES) as ModuleType[]).map((module) => (
                <label key={module} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.modules.includes(module)}
                    onChange={() => handleModuleToggle(module)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1a1a1a]"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{MODULE_NAMES[module]}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Number of Organizations */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Number of Organizations</label>
            <input
              title="organizations"
              type="number"
              value={formData.organizations}
              onChange={(e) => setFormData({ ...formData, organizations: Number(e.target.value) })}
              min="1"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1a1a1a] dark:text-gray-100"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
              <input
                title="date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1a1a1a] dark:text-gray-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
              <input
                title="date"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1a1a1a] dark:text-gray-100"
              />
            </div>
          </div>

          {/* Commission Overrides */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Commission Overrides (%)</label>
            <div className="grid grid-cols-3 gap-4">
              {(Object.entries(formData.commissions) as [keyof typeof formData.commissions, number][]).map(([module, rate]) => (
                <div key={module}>
                  <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">{MODULE_NAMES[module]}</label>
                  <input
                    title="comission"
                    type="number"
                    value={rate}
                    onChange={(e) => handleCommissionChange(module, Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1a1a1a] dark:text-gray-100"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 p-6 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};
