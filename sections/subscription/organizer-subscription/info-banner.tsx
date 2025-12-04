import React from 'react';

interface InfoBannerProps {
  variant: 'info' | 'success' | 'warning';
  icon: string;
  title: string;
  description: string;
}

export const InfoBanner: React.FC<InfoBannerProps> = ({ variant, icon, title, description }) => {
  const variantClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    warning: 'bg-orange-50 border-orange-200 text-orange-900',
  };

  const descriptionClasses = {
    info: 'text-blue-700',
    success: 'text-green-700',
    warning: 'text-orange-700',
  };

  return (
    <div className={`flex items-start gap-3 rounded-lg border p-4 ${variantClasses[variant]}`}>
      <div className="text-2xl">{icon}</div>
      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        <p className={`mt-1 text-sm ${descriptionClasses[variant]}`}>{description}</p>
      </div>
    </div>
  );
};
