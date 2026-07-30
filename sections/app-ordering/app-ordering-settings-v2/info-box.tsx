'use client';

import { cn } from '@/lib/utils';
import { AlertTriangle, Info } from 'lucide-react';
import React from 'react';

interface InfoBoxProps {
  title: string;
  description: React.ReactNode;
  variant?: 'info' | 'warning';
  className?: string;
}

const VARIANTS = {
  info: {
    wrapper: 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/30',
    icon: 'bg-blue-500 text-white',
    title: 'text-blue-800 dark:text-blue-300',
    description: 'text-blue-700 dark:text-blue-400',
    Icon: Info,
  },
  warning: {
    wrapper: 'border-l-orange-500 bg-orange-50 dark:bg-orange-950/30',
    icon: 'bg-orange-500 text-white',
    title: 'text-orange-800 dark:text-orange-300',
    description: 'text-orange-700 dark:text-orange-400',
    Icon: AlertTriangle,
  },
} as const;

export const InfoBox: React.FC<InfoBoxProps> = ({ title, description, variant = 'info', className }) => {
  const styles = VARIANTS[variant];
  const { Icon } = styles;

  return (
    <div className={cn('flex items-start gap-3 rounded-lg border-l-4 p-4', styles.wrapper, className)}>
      <span className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded', styles.icon)}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="flex-1">
        <div className={cn('mb-1 text-sm font-bold', styles.title)}>{title}</div>
        <div className={cn('text-sm leading-relaxed', styles.description)}>{description}</div>
      </div>
    </div>
  );
};
