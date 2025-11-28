'use client';

import React from 'react';

interface InfoBoxProps {
  title: string;
  description: string;
  variant?: 'info' | 'warning';
}

export const InfoBox: React.FC<InfoBoxProps> = ({ title, description, variant = 'info' }) => {
  const isWarning = variant === 'warning';

  return (
    <div
      className={`mt-4 flex items-start gap-3 rounded-lg border-l-4 p-4 ${
        isWarning ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30' : 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
      }`}
    >
      <span className="flex-shrink-0 text-xl">{isWarning ? '⚠️' : 'ℹ️'}</span>
      <div className="flex-1">
        <div className={`mb-1 text-sm font-bold ${isWarning ? 'text-orange-800 dark:text-orange-300' : 'text-blue-800 dark:text-blue-300'}`}>
          {title}
        </div>
        <div className={`text-sm leading-relaxed ${isWarning ? 'text-orange-700 dark:text-orange-400' : 'text-blue-700 dark:text-blue-400'}`}>
          {description}
        </div>
      </div>
    </div>
  );
};
