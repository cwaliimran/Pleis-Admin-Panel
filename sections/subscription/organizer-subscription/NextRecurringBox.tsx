import React from 'react';
import { RefreshCw } from 'lucide-react';
import { NextRecurringCalculation } from './types';
import { format } from 'date-fns';

interface NextRecurringBoxProps {
  nextRecurring: NextRecurringCalculation;
  isFreePlan?: boolean;
}

export const NextRecurringBox: React.FC<NextRecurringBoxProps> = ({ nextRecurring, isFreePlan = false }) => {
  if (isFreePlan) {
    return (
      <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/30">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Next Recurring Plan</h3>
          </div>
          <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white dark:bg-green-700">FREE</span>
        </div>

        {/* Free Plan Message */}
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center dark:border-green-800 dark:bg-green-950/30">
          <p className="mb-2 text-lg font-bold text-green-800 dark:text-green-300">Switching to Free Plan</p>
          <p className="mb-4 text-sm text-green-700 dark:text-green-400">
            Starting from <strong>{format(new Date(nextRecurring.startDate), 'MMMM dd, yyyy')}</strong>
          </p>
          <div className="text-4xl font-bold text-green-600 dark:text-green-500">€0/month</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-6 shadow-sm dark:border-purple-800 dark:bg-purple-950/30">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-purple-600 dark:text-purple-500" />
          <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100">Next Recurring Plan</h3>
        </div>
        <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-bold text-white dark:bg-purple-700">
          FROM {format(new Date(nextRecurring.startDate), 'MMM dd')}
        </span>
      </div>

      {/* Configuration Summary */}
      <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Modules */}
        <div>
          <span className="text-xs font-medium text-purple-700 dark:text-purple-400">Modules</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {nextRecurring.modules.map((module) => (
              <span
                key={module}
                className="rounded bg-purple-100 px-1.5 py-0.5 text-xs font-semibold text-purple-800 capitalize dark:bg-purple-900/50 dark:text-purple-200"
              >
                {module}
              </span>
            ))}
            {nextRecurring.includeAnalytics && (
              <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-xs font-semibold text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200">
                Analytics
              </span>
            )}
          </div>
        </div>

        {/* Organizations */}
        <div>
          <span className="text-xs font-medium text-purple-700 dark:text-purple-400">Organizations</span>
          <p className="mt-1 text-lg font-bold text-purple-900 dark:text-purple-100">{nextRecurring.organizationCount}</p>
        </div>

        {/* Billing */}
        <div>
          <span className="text-xs font-medium text-purple-700 dark:text-purple-400">Billing</span>
          <p className="mt-1 text-lg font-bold text-purple-900 capitalize dark:text-purple-100">{nextRecurring.billingCycle}</p>
        </div>

        {/* Start Date */}
        <div>
          <span className="text-xs font-medium text-purple-700 dark:text-purple-400">Starts</span>
          <p className="mt-1 text-sm font-semibold text-purple-900 dark:text-purple-100">
            {format(new Date(nextRecurring.startDate), 'MMM dd, yyyy')}
          </p>
        </div>
      </div>

      {/* Price Display */}
      <div className="rounded-lg border border-purple-300 bg-white p-4 dark:border-purple-700 dark:bg-purple-900/30">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
              {nextRecurring.billingCycle === 'yearly' ? 'Yearly' : 'Monthly'} Amount
            </span>
            {nextRecurring.billingCycle === 'yearly' && (
              <p className="text-xs text-purple-700 dark:text-purple-400">(€{nextRecurring.monthlyTotal.toFixed(2)}/month equivalent)</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-500">€{nextRecurring.displayAmount.toFixed(2)}</div>
          </div>
        </div>

        {/* Discounts Applied */}
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {nextRecurring.bundleDiscountPercent > 0 && (
            <span className="rounded-full bg-green-100 px-2 py-1 font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
              ✓ Bundle {nextRecurring.bundleDiscountPercent}%
            </span>
          )}
          {nextRecurring.organizationCount > 1 && (
            <span className="rounded-full bg-green-100 px-2 py-1 font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
              ✓ Multi-org {100 - nextRecurring.multiOrgDiscountPercent}% off
            </span>
          )}
          {nextRecurring.yearlyDiscountPercent && (
            <span className="rounded-full bg-green-100 px-2 py-1 font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
              ✓ Yearly {nextRecurring.yearlyDiscountPercent}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// import React from 'react';
// import { RefreshCw, Calendar, Check } from 'lucide-react';
// import { NextRecurringCalculation } from './types';
// import { format } from 'date-fns';

// interface NextRecurringBoxProps {
//   nextRecurring: NextRecurringCalculation;
//   isFreePlan?: boolean;
// }

// export const NextRecurringBox: React.FC<NextRecurringBoxProps> = ({ nextRecurring, isFreePlan = false }) => {
//   if (isFreePlan) {
//     return (
//       <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/30">
//         {/* Header */}
//         <div className="mb-4 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <RefreshCw className="h-5 w-5 text-gray-600 dark:text-gray-400" />
//             <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Next Recurring Plan</h3>
//           </div>
//           <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white dark:bg-green-700">FREE</span>
//         </div>

//         {/* Free Plan Message */}
//         <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center dark:border-green-800 dark:bg-green-950/30">
//           <p className="mb-2 text-lg font-bold text-green-800 dark:text-green-300">Switching to Free Plan</p>
//           <p className="mb-4 text-sm text-green-700 dark:text-green-400">
//             Starting from <strong>{format(new Date(nextRecurring.startDate), 'MMMM dd, yyyy')}</strong>
//           </p>
//           <div className="text-4xl font-bold text-green-600 dark:text-green-500">€0/month</div>
//         </div>

//         {/* Free Plan Features Reminder */}
//         <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/30">
//           <p className="text-xs text-blue-800 dark:text-blue-400">
//             ℹ️ <strong>Free Plan includes:</strong> 1 Organization, Event posting & management, Basic ticketing (with commission)
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-6 shadow-sm dark:border-purple-800 dark:bg-purple-950/30">
//       {/* Header */}
//       <div className="mb-4 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <RefreshCw className="h-5 w-5 text-purple-600 dark:text-purple-500" />
//           <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100">Next Recurring Plan</h3>
//         </div>
//         <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-bold text-white dark:bg-purple-700">
//           FROM {format(new Date(nextRecurring.startDate), 'MMM dd')}
//         </span>
//       </div>

//       {/* Configuration */}
//       <div className="mb-4 space-y-3">
//         {/* Modules */}
//         <div className="flex items-start justify-between">
//           <span className="text-sm font-medium text-purple-800 dark:text-purple-300">Modules:</span>
//           <div className="flex flex-wrap justify-end gap-1">
//             {nextRecurring.modules.map((module) => (
//               <span
//                 key={module}
//                 className="rounded-md bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800 capitalize dark:bg-purple-900/50 dark:text-purple-200"
//               >
//                 {module}
//               </span>
//             ))}
//             {nextRecurring.includeAnalytics && (
//               <span className="rounded-md bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200">
//                 Analytics
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Organizations */}
//         <div className="flex items-center justify-between">
//           <span className="text-sm font-medium text-purple-800 dark:text-purple-300">Organizations:</span>
//           <span className="text-sm font-bold text-purple-900 dark:text-purple-100">{nextRecurring.organizationCount}</span>
//         </div>

//         {/* Billing Cycle */}
//         <div className="flex items-center justify-between">
//           <span className="text-sm font-medium text-purple-800 dark:text-purple-300">Billing Cycle:</span>
//           <span className="text-sm font-bold text-purple-900 capitalize dark:text-purple-100">{nextRecurring.billingCycle}</span>
//         </div>

//         {/* Start Date */}
//         <div className="flex items-center justify-between border-t border-purple-200 pt-3 dark:border-purple-800">
//           <div className="flex items-center gap-2">
//             <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-500" />
//             <span className="text-sm font-medium text-purple-800 dark:text-purple-300">Starts:</span>
//           </div>
//           <span className="text-sm font-semibold text-purple-900 dark:text-purple-100">
//             {format(new Date(nextRecurring.startDate), 'MMMM dd, yyyy')}
//           </span>
//         </div>
//       </div>

//       {/* Price Breakdown */}
//       <div className="mb-4 space-y-2 rounded-lg border border-purple-300 bg-white/50 p-3 dark:border-purple-700 dark:bg-purple-900/20">
//         <p className="text-xs font-semibold tracking-wide text-purple-700 uppercase dark:text-purple-400">Price Breakdown</p>

//         {/* Base Modules */}
//         <div className="flex items-center justify-between text-sm">
//           <span className="text-purple-700 dark:text-purple-400">Base modules ({nextRecurring.modules.length})</span>
//           <span className="text-purple-900 dark:text-purple-100">€{nextRecurring.baseModulesPrice.toFixed(2)}</span>
//         </div>

//         {/* Bundle Discount */}
//         {nextRecurring.bundleDiscountPercent > 0 && (
//           <div className="flex items-center justify-between text-sm">
//             <span className="font-semibold text-green-600 dark:text-green-500">
//               <Check className="mr-1 inline h-3 w-3" />
//               Bundle discount ({nextRecurring.bundleDiscountPercent}%)
//             </span>
//             <span className="font-semibold text-green-600 dark:text-green-500">-€{nextRecurring.bundleDiscountAmount.toFixed(2)}</span>
//           </div>
//         )}

//         {/* After Bundle */}
//         {nextRecurring.bundleDiscountPercent > 0 && (
//           <div className="flex items-center justify-between text-sm">
//             <span className="text-purple-700 dark:text-purple-400">After bundle discount</span>
//             <span className="text-purple-900 dark:text-purple-100">€{nextRecurring.priceAfterBundleDiscount.toFixed(2)}</span>
//           </div>
//         )}

//         {/* Analytics */}
//         {nextRecurring.includeAnalytics && (
//           <div className="flex items-center justify-between text-sm">
//             <span className="text-purple-700 dark:text-purple-400">+ Analytics (no bundle discount)</span>
//             <span className="text-purple-900 dark:text-purple-100">€{nextRecurring.analyticsPrice.toFixed(2)}</span>
//           </div>
//         )}

//         {/* Organizations Multiplier */}
//         {nextRecurring.organizationCount > 1 && (
//           <>
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-purple-700 dark:text-purple-400">× {nextRecurring.organizationCount} organizations</span>
//               <span className="text-purple-900 dark:text-purple-100">€{nextRecurring.priceAfterOrgMultiply.toFixed(2)}</span>
//             </div>

//             <div className="flex items-center justify-between text-sm">
//               <span className="font-semibold text-green-600 dark:text-green-500">
//                 <Check className="mr-1 inline h-3 w-3" />
//                 Multi-org rate ({nextRecurring.multiOrgDiscountPercent}%)
//               </span>
//               <span className="text-purple-900 dark:text-purple-100">Applied</span>
//             </div>
//           </>
//         )}

//         {/* Monthly Total */}
//         <div className="flex items-center justify-between border-t border-purple-200 pt-2 text-sm font-bold dark:border-purple-800">
//           <span className="text-purple-800 dark:text-purple-300">Monthly Total</span>
//           <span className="text-purple-900 dark:text-purple-100">€{nextRecurring.monthlyTotal.toFixed(2)}</span>
//         </div>

//         {/* Yearly Calculations */}
//         {nextRecurring.billingCycle === 'yearly' && (
//           <>
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-purple-700 dark:text-purple-400">× 12 months</span>
//               <span className="text-purple-900 dark:text-purple-100">€{(nextRecurring.monthlyTotal * 12).toFixed(2)}</span>
//             </div>

//             <div className="flex items-center justify-between text-sm">
//               <span className="font-semibold text-green-600 dark:text-green-500">
//                 <Check className="mr-1 inline h-3 w-3" />
//                 Yearly discount ({nextRecurring.yearlyDiscountPercent}%)
//               </span>
//               <span className="font-semibold text-green-600 dark:text-green-500">-€{nextRecurring.yearlyDiscountAmount?.toFixed(2)}</span>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Final Amount */}
//       <div className="rounded-lg border-2 border-purple-300 bg-white p-4 dark:border-purple-700 dark:bg-purple-900/30">
//         <div className="flex items-center justify-between">
//           <span className="text-sm font-bold text-purple-800 dark:text-purple-300">
//             {nextRecurring.billingCycle === 'yearly' ? 'Yearly' : 'Monthly'} Amount:
//           </span>
//           <div className="text-right">
//             <div className="text-3xl font-bold text-purple-600 dark:text-purple-500">
//               €{nextRecurring.displayAmount.toFixed(2)}
//               <span className="text-base font-normal text-purple-700 dark:text-purple-400">/{nextRecurring.displayPeriod}</span>
//             </div>
//             {nextRecurring.billingCycle === 'yearly' && (
//               <div className="text-xs text-purple-700 dark:text-purple-400">(€{nextRecurring.monthlyTotal.toFixed(2)}/month equivalent)</div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Discount Summary */}
//       <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/30">
//         <p className="text-xs text-green-800 dark:text-green-400">
//           ✓ <strong>All discounts applied:</strong> Bundle
//           {nextRecurring.bundleDiscountPercent > 0 ? ` (${nextRecurring.bundleDiscountPercent}%)` : ''}, Multi-org (
//           {100 - nextRecurring.multiOrgDiscountPercent}% off)
//           {nextRecurring.yearlyDiscountPercent && `, Yearly (${nextRecurring.yearlyDiscountPercent}%)`}
//         </p>
//       </div>
//     </div>
//   );
// };
