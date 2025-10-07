'use client';

import * as React from 'react';

interface FeatureSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`mb-4 overflow-hidden rounded-lg border ${className}`}>
      {children}
    </div>
  );
};

interface FeatureSectionHeaderProps {
  title: string;
}

export const FeatureSectionHeader: React.FC<FeatureSectionHeaderProps> = ({
  title,
}) => {
  return (
    <div className="dark:bg-secondary bg-gray-50 p-3">
      <span className="font-medium text-gray-700 dark:text-gray-300">
        {title}
      </span>
    </div>
  );
};

interface FeatureSectionContentProps {
  children: React.ReactNode;
}

export const FeatureSectionContent: React.FC<FeatureSectionContentProps> = ({
  children,
}) => {
  return (
    <div className="dark:bg-secondary border-t bg-white p-4">{children}</div>
  );
};
