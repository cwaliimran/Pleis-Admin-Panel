'use client';

import * as React from 'react';

interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon,
}) => {
  return (
    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-gray-200">
      {icon}
      {title}
    </h3>
  );
};