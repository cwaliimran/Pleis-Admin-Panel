import { Check } from 'lucide-react';
import React from 'react';
import { ModuleConfig, ModulePricing } from './types';

interface ModuleCardProps {
  module: ModuleConfig;
  pricing: ModulePricing;
  isSelected: boolean;
  onToggle: () => void;
}

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
      {isSelected && (
        <div className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 shadow-md dark:bg-blue-500">
          <Check className="h-4 w-4 text-white" />
        </div>
      )}

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

      <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50/80 p-3 dark:border-gray-600 dark:bg-gray-700/50">
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
// import { Check } from 'lucide-react';
// import React from 'react';
// import { ModuleConfig, ModulePricing } from './types';

// interface ModuleCardProps {
//   module: ModuleConfig;
//   pricing: ModulePricing;
//   isSelected: boolean;
//   onToggle: () => void;
// }

// export const ModuleCard: React.FC<ModuleCardProps> = ({ module, pricing, isSelected, onToggle }) => {
//   const colorClasses = {
//     blue: {
//       selectedBorder: 'border-blue-500',
//       selectedLightBg: 'bg-blue-50',
//       selectedDarkBg: 'dark:bg-gradient-to-br dark:from-blue-950/40 dark:to-blue-900/20',
//       selectedDarkBorder: 'dark:border-blue-600',
//       iconBg: 'bg-blue-600',
//       iconDarkBg: 'dark:bg-blue-600',
//     },
//     purple: {
//       selectedBorder: 'border-purple-500',
//       selectedLightBg: 'bg-purple-50',
//       selectedDarkBg: 'dark:bg-gradient-to-br dark:from-purple-950/40 dark:to-purple-900/20',
//       selectedDarkBorder: 'dark:border-purple-600',
//       iconBg: 'bg-purple-600',
//       iconDarkBg: 'dark:bg-purple-600',
//     },
//     green: {
//       selectedBorder: 'border-green-500',
//       selectedLightBg: 'bg-green-50',
//       selectedDarkBg: 'dark:bg-gradient-to-br dark:from-green-950/40 dark:to-green-900/20',
//       selectedDarkBorder: 'dark:border-green-600',
//       iconBg: 'bg-green-600',
//       iconDarkBg: 'dark:bg-green-600',
//     },
//   };

//   const colors = colorClasses[module.color];

//   return (
//     <div
//       onClick={onToggle}
//       className={`relative cursor-pointer rounded-xl border-2 p-5 transition-all ${
//         isSelected
//           ? `${colors.selectedBorder} ${colors.selectedLightBg} ${colors.selectedDarkBg} ${colors.selectedDarkBorder} shadow-lg dark:shadow-xl`
//           : 'dark:to-gray-850 border-gray-200 bg-white hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gradient-to-br dark:from-gray-800 dark:hover:border-gray-600 dark:hover:shadow-lg'
//       }`}
//     >
//       {isSelected && (
//         <div className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 shadow-md dark:bg-blue-500">
//           <Check className="h-4 w-4 text-white" />
//         </div>
//       )}

//       <div
//         className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-2xl shadow-sm ${
//           isSelected ? `${colors.iconBg} ${colors.iconDarkBg}` : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800'
//         }`}
//       >
//         <span className={isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-300'}>{module.icon}</span>
//       </div>

//       <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">{module.name}</h3>
//       <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{module.description}</p>

//       <div className="mb-4 space-y-2">
//         {module.features.map((feature, idx) => (
//           <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
//             <div className="h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-gray-500"></div>
//             <span>{feature}</span>
//           </div>
//         ))}
//       </div>

//       <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/50">
//         <div className="mb-2 flex items-center justify-between">
//           <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly price:</span>
//           <span className="text-lg font-bold text-gray-900 dark:text-gray-100">€{pricing.price}</span>
//         </div>
//         <div className="flex items-center justify-between">
//           <span className="text-xs text-gray-500 dark:text-gray-500">Commission:</span>
//           <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{pricing.commission}%</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// // import { Check } from 'lucide-react';
// // import React from 'react';
// // import { ModuleConfig, ModulePricing } from './types';

// // interface ModuleCardProps {
// //   module: ModuleConfig;
// //   pricing: ModulePricing;
// //   isSelected: boolean;
// //   onToggle: () => void;
// // }

// // export const ModuleCard: React.FC<ModuleCardProps> = ({ module, pricing, isSelected, onToggle }) => {
// //   const colorClasses = {
// //     blue: {
// //       border: 'border-blue-500',
// //       lightBg: 'bg-blue-50',
// //       darkBg: 'dark:bg-gray-800 dark:border-gray-600',
// //       iconBg: 'bg-blue-600',
// //     },
// //     purple: {
// //       border: 'border-purple-500',
// //       lightBg: 'bg-purple-50',
// //       darkBg: 'dark:bg-gray-800 dark:border-gray-600',
// //       iconBg: 'bg-purple-600',
// //     },
// //     green: {
// //       border: 'border-green-500',
// //       lightBg: 'bg-green-50',
// //       darkBg: 'dark:bg-gray-800 dark:border-gray-600',
// //       iconBg: 'bg-green-600',
// //     },
// //   };

// //   const colors = colorClasses[module.color];

// //   return (
// //     <div
// //       onClick={onToggle}
// //       className={`relative cursor-pointer rounded-lg border-2 p-5 transition-all ${
// //         isSelected
// //           ? `${colors.border} ${colors.lightBg} ${colors.darkBg} shadow-md`
// //           : 'border-gray-200 hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
// //       }`}
// //     >
// //       {isSelected && (
// //         <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
// //           <Check className="h-4 w-4 text-white" />
// //         </div>
// //       )}

// //       <div
// //         className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-2xl ${
// //           isSelected ? colors.iconBg : 'bg-gray-100 dark:bg-gray-700'
// //         }`}
// //       >
// //         <span className={isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-300'}>{module.icon}</span>
// //       </div>

// //       <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">{module.name}</h3>
// //       <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{module.description}</p>

// //       <div className="mb-4 space-y-1">
// //         {module.features.map((feature, idx) => (
// //           <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
// //             <div className="h-1 w-1 rounded-full bg-gray-400 dark:bg-gray-500"></div>
// //             <span>{feature}</span>
// //           </div>
// //         ))}
// //       </div>

// //       <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
// //         <div className="mb-2 flex items-center justify-between">
// //           <span className="text-sm text-gray-600 dark:text-gray-400">Monthly price:</span>
// //           <span className="font-bold text-gray-900 dark:text-gray-100">€{pricing.price}</span>
// //         </div>
// //         <div className="flex items-center justify-between">
// //           <span className="text-xs text-gray-500 dark:text-gray-500">Commission:</span>
// //           <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{pricing.commission}%</span>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // import { Check } from 'lucide-react';
// // // import React from 'react';
// // // import { ModuleConfig, ModulePricing } from './types';

// // // interface ModuleCardProps {
// // //   module: ModuleConfig;
// // //   pricing: ModulePricing;
// // //   isSelected: boolean;
// // //   onToggle: () => void;
// // // }

// // // export const ModuleCard: React.FC<ModuleCardProps> = ({ module, pricing, isSelected, onToggle }) => {
// // //   const colorClasses = {
// // //     blue: {
// // //       border: 'border-blue-500',
// // //       bg: 'bg-blue-50',
// // //       iconBg: 'bg-blue-600',
// // //     },
// // //     purple: {
// // //       border: 'border-purple-500',
// // //       bg: 'bg-purple-50',
// // //       iconBg: 'bg-purple-600',
// // //     },
// // //     green: {
// // //       border: 'border-green-500',
// // //       bg: 'bg-green-50',
// // //       iconBg: 'bg-green-600',
// // //     },
// // //   };

// // //   const colors = colorClasses[module.color];

// // //   return (
// // //     <div
// // //       onClick={onToggle}
// // //       className={`relative cursor-pointer rounded-lg border-2 p-5 transition-all ${
// // //         isSelected ? `${colors.border} ${colors.bg} shadow-md` : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
// // //       }`}
// // //     >
// // //       {isSelected && (
// // //         <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
// // //           <Check className="h-4 w-4 text-white" />
// // //         </div>
// // //       )}

// // //       <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-2xl ${isSelected ? colors.iconBg : 'bg-gray-100'}`}>
// // //         {isSelected ? <span className="text-white">{module.icon}</span> : <span className="text-gray-600">{module.icon}</span>}
// // //       </div>

// // //       <h3 className="mb-2 text-lg font-bold text-gray-900">{module.name}</h3>
// // //       <p className="mb-4 text-sm text-gray-600">{module.description}</p>

// // //       <div className="mb-4 space-y-1">
// // //         {module.features.map((feature, idx) => (
// // //           <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
// // //             <div className="h-1 w-1 rounded-full bg-gray-400"></div>
// // //             <span>{feature}</span>
// // //           </div>
// // //         ))}
// // //       </div>

// // //       <div className="mt-3 border-t border-gray-200 pt-3">
// // //         <div className="mb-2 flex items-center justify-between">
// // //           <span className="text-sm text-gray-600">Monthly price:</span>
// // //           <span className="font-bold text-gray-900">€{pricing.price}</span>
// // //         </div>
// // //         <div className="flex items-center justify-between">
// // //           <span className="text-xs text-gray-500">Commission:</span>
// // //           <span className="text-xs font-semibold text-gray-700">{pricing.commission}%</span>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };
