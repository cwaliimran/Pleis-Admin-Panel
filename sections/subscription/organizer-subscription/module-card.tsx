import { Check } from 'lucide-react';
import React from 'react';
import { ModuleCardProps } from './types';

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, pricing, isSelected, onToggle }) => {
  const colorClasses = {
    blue: {
      selectedBorder: 'border-blue-500',
      selectedLightBg: 'bg-blue-50',
      selectedDarkBg: 'dark:bg-blue-950/60 dark:border-blue-500',
      iconBg: 'bg-blue-600',
      iconDarkBg: 'dark:bg-blue-600',
      iconGradient: 'dark:from-blue-950 dark:to-blue-900',
    },
    purple: {
      selectedBorder: 'border-purple-500',
      selectedLightBg: 'bg-purple-50',
      selectedDarkBg: 'dark:bg-purple-950/60 dark:border-purple-500',
      iconBg: 'bg-purple-600',
      iconDarkBg: 'dark:bg-purple-600',
      iconGradient: 'dark:from-purple-950 dark:to-purple-900',
    },
    green: {
      selectedBorder: 'border-green-500',
      selectedLightBg: 'bg-green-50',
      selectedDarkBg: 'dark:bg-green-950/60 dark:border-green-500',
      iconBg: 'bg-green-600',
      iconDarkBg: 'dark:bg-green-600',
      iconGradient: 'dark:from-green-950 dark:to-green-900',
    },
  };

  const colors = colorClasses[module.color];

  return (
    <div
      onClick={onToggle}
      className={`relative cursor-pointer rounded-xl border-2 p-5 transition-all ${
        isSelected
          ? `${colors.selectedBorder} ${colors.selectedLightBg} ${colors.selectedDarkBg} shadow-lg dark:shadow-xl`
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md dark:border-gray-600 dark:bg-gray-800/50 dark:hover:border-gray-500 dark:hover:shadow-lg'
      }`}
    >
      {/* Checkbox - Consistent Selection Indicator */}
      <div className="absolute top-3 right-3">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-md border-2 transition-all ${
            isSelected
              ? 'border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-500'
              : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
          }`}
        >
          {isSelected && <Check className="h-4 w-4 text-white" />}
        </div>
      </div>

      <div
        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-2xl shadow-sm ${
          isSelected ? `${colors.iconBg} ${colors.iconDarkBg}` : 'dark:to-gray-750 bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-700'
        }`}
      >
        <span className={isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-200'}>{module.icon}</span>
      </div>

      <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">{module.name}</h3>
      <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{module.description}</p>

      <div className="mb-4 space-y-2">
        {module.features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
            <div className="h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-gray-400"></div>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      {/* Price Section - Consistent Position */}
      <div className="mt-auto rounded-lg border border-gray-200 bg-gray-50/80 p-3 dark:border-gray-600 dark:bg-gray-700/50">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Monthly price:</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">€{pricing.price}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">Commission:</span>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{pricing.commission}%</span>
        </div>
      </div>
    </div>
  );
};
