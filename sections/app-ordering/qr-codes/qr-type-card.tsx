'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface QRTypeCardProps {
  icon: string;
  title: string;
  description: string;
  features: string[];
  onClick: () => void;
}

export const QRTypeCard: React.FC<QRTypeCardProps> = ({ icon, title, description, features, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-2xl border-2 border-transparent bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg dark:bg-[#222121]"
    >
      <div className="mb-4 text-5xl">{icon}</div>
      <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="mb-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{description}</p>

      <ul className="mb-5 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
            <span className="text-base font-bold text-green-600">✓</span>
            {feature}
          </li>
        ))}
      </ul>

      <Button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="h-11 w-full font-semibold"
      >
        Generate QR Code
      </Button>
    </div>
  );
};
