'use client';

import React from 'react';
import { ToggleSwitch } from './toggle-switch';
import { DeliveryMethod } from './types';

interface DeliveryMethodCardProps {
  method: DeliveryMethod;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const DeliveryMethodCard: React.FC<DeliveryMethodCardProps> = ({ method, enabled, onToggle }) => {
  return (
    <div
      className={`rounded-xl border-2 p-5 transition-all ${
        enabled
          ? 'border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-950/30'
          : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-[#1a1a1a]'
      }`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="mb-2 text-3xl">{method.icon}</div>
          <h3 className="mb-1.5 text-lg font-bold text-gray-900 dark:text-gray-100">{method.title}</h3>
        </div>
        <ToggleSwitch checked={enabled} onChange={onToggle} />
      </div>
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{method.description}</p>
    </div>
  );
};
