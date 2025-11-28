'use client';

import React from 'react';
import { ToggleSwitch } from './toggle-switch';

interface SettingItemProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children?: React.ReactNode;
  isLast?: boolean;
}

export const SettingItem: React.FC<SettingItemProps> = ({ title, description, checked, onChange, children, isLast = false }) => {
  return (
    <div className={`py-6 ${!isLast ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}>
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1 pr-5">
          <h3 className="mb-1.5 text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h3>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{description}</p>
        </div>
        <ToggleSwitch checked={checked} onChange={onChange} />
      </div>
      {children}
    </div>
  );
};
