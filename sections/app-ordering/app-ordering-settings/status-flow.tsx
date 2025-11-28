'use client';

import React from 'react';

interface FlowStep {
  label: string;
  key: string;
}

interface StatusFlowProps {
  title: string;
  steps: FlowStep[];
}

export const StatusFlow: React.FC<StatusFlowProps> = ({ title, steps }) => {
  return (
    <div className="mt-4 rounded-xl bg-gray-50 p-6 dark:bg-[#1a1a1a]">
      <div className="mb-4 text-sm font-bold text-gray-900 dark:text-gray-100">{title}</div>
      <div className="flex items-center gap-3 overflow-x-auto py-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.key}>
            <div className="rounded-lg bg-white px-5 py-3 text-sm font-semibold whitespace-nowrap text-gray-900 shadow-sm dark:bg-[#222121] dark:text-gray-100">
              {step.label}
            </div>
            {index < steps.length - 1 && <div className="flex-shrink-0 text-lg text-gray-400 dark:text-gray-600">→</div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
