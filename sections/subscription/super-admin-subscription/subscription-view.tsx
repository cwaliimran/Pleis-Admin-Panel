// 'use client';

// import React, { useState } from 'react';
// import { Settings, Users, DollarSign, Package, TrendingUp, Calendar, Edit2, Trash2, Plus, Save, X } from 'lucide-react';

// export default function SubscriptionManagement() {
//   const [activeTab, setActiveTab] = useState('subscriptions');
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedSubscription, setSelectedSubscription] = useState(null);

//   // Mock data for subscriptions
//   const [subscriptions, setSubscriptions] = useState([
//     {
//       id: 1,
//       organizer: 'City Events Co',
//       modules: ['ordering', 'loyalty', 'analytics'],
//       organizations: 3,
//       billing: 'yearly',
//       startDate: '2024-01-15',
//       endDate: '2025-01-15',
//       status: 'active',
//       monthlyPrice: 180,
//       commissions: { ordering: 5, loyalty: 3, reservations: 0 },
//     },
//     {
//       id: 2,
//       organizer: 'Downtown Restaurants',
//       modules: ['ordering', 'reservations'],
//       organizations: 1,
//       billing: 'monthly',
//       startDate: '2024-06-01',
//       endDate: '2024-07-01',
//       status: 'active',
//       monthlyPrice: 54,
//       commissions: { ordering: 5, loyalty: 0, reservations: 4 },
//     },
//   ]);

//   // Pricing configuration
//   const [pricing, setPricing] = useState({
//     modules: {
//       ordering: 30,
//       loyalty: 25,
//       reservations: 30,
//       analytics: 20,
//     },
//     commissions: {
//       ordering: 5,
//       loyalty: 3,
//       reservations: 4,
//     },
//     bundleDiscounts: {
//       twoModules: 10,
//       threeModules: 15,
//     },
//     multiOrgPricing: [
//       { orgs: 1, percentage: 100 },
//       { orgs: 2, percentage: 80 },
//       { orgs: 3, percentage: 70 },
//       { orgs: 4, percentage: 65 },
//       { orgs: 5, percentage: 60 },
//       { orgs: 6, percentage: 55 },
//     ],
//     yearlyDiscount: 15,
//   });

//   const moduleNames = {
//     ordering: 'Ordering',
//     loyalty: 'Loyalty',
//     reservations: 'Reservations',
//     analytics: 'Analytics',
//   };

//   const handleEditSubscription = (subscription) => {
//     setSelectedSubscription(subscription);
//     setShowEditModal(true);
//   };

//   const handleDeleteSubscription = (id) => {
//     if (confirm('Are you sure you want to cancel this subscription?')) {
//       setSubscriptions(subscriptions.filter((s) => s.id !== id));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="border-b border-gray-200 bg-white">
//         <div className="mx-auto max-w-7xl px-6 py-6">
//           <div className="flex items-center gap-3">
//             <Settings className="h-8 w-8 text-blue-600" />
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
//               <p className="text-sm text-gray-600">Manage organizer subscriptions and pricing</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="mx-auto max-w-7xl px-6">
//         <div className="mt-6 flex gap-4 border-b border-gray-200">
//           <button
//             onClick={() => setActiveTab('subscriptions')}
//             className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
//               activeTab === 'subscriptions' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
//             }`}
//           >
//             <div className="flex items-center gap-2">
//               <Users className="h-4 w-4" />
//               Manage Subscriptions
//             </div>
//           </button>
//           <button
//             onClick={() => setActiveTab('pricing')}
//             className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
//               activeTab === 'pricing' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
//             }`}
//           >
//             <div className="flex items-center gap-2">
//               <DollarSign className="h-4 w-4" />
//               Price Management
//             </div>
//           </button>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="mx-auto max-w-7xl px-6 py-6">
//         {activeTab === 'subscriptions' && (
//           <div className="space-y-6">
//             {/* Action Bar */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-900">Active Subscriptions</h2>
//                 <p className="text-sm text-gray-600">Manage all organizer subscriptions</p>
//               </div>
//               <button
//                 onClick={() => setShowCreateModal(true)}
//                 className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
//               >
//                 <Plus className="h-4 w-4" />
//                 Create Subscription
//               </button>
//             </div>

//             {/* Subscriptions List */}
//             <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
//               <table className="w-full">
//                 <thead className="border-b border-gray-200 bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Organizer</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Modules</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Organizations</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Billing</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Period</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Price</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
//                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {subscriptions.map((sub) => (
//                     <tr key={sub.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4">
//                         <div className="font-medium text-gray-900">{sub.organizer}</div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex flex-wrap gap-1">
//                           {sub.modules.map((module) => (
//                             <span key={module} className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
//                               {moduleNames[module]}
//                             </span>
//                           ))}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900">{sub.organizations}</td>
//                       <td className="px-6 py-4">
//                         <span
//                           className={`rounded px-2 py-1 text-xs font-medium ${
//                             sub.billing === 'yearly' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
//                           }`}
//                         >
//                           {sub.billing === 'yearly' ? 'Yearly' : 'Monthly'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-600">
//                         <div>{new Date(sub.startDate).toLocaleDateString()}</div>
//                         <div className="text-xs text-gray-500">to {new Date(sub.endDate).toLocaleDateString()}</div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="font-medium text-gray-900">€{sub.monthlyPrice}</div>
//                         <div className="text-xs text-gray-500">/month</div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span
//                           className={`rounded px-2 py-1 text-xs font-medium ${
//                             sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//                           }`}
//                         >
//                           {sub.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex justify-end gap-2">
//                           <button
//                             onClick={() => handleEditSubscription(sub)}
//                             className="rounded p-2 text-blue-600 transition-colors hover:bg-blue-50"
//                           >
//                             <Edit2 className="h-4 w-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteSubscription(sub.id)}
//                             className="rounded p-2 text-red-600 transition-colors hover:bg-red-50"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {activeTab === 'pricing' && (
//           <div className="space-y-6">
//             {/* Module Pricing */}
//             <div className="rounded-lg border border-gray-200 bg-white p-6">
//               <div className="mb-4 flex items-center gap-2">
//                 <Package className="h-5 w-5 text-blue-600" />
//                 <h3 className="text-lg font-semibold text-gray-900">Module Pricing</h3>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 {Object.entries(pricing.modules).map(([module, price]) => (
//                   <div key={module}>
//                     <label className="mb-2 block text-sm font-medium text-gray-700">
//                       {moduleNames[module]}
//                       {module === 'analytics' && <span className="ml-1 text-xs text-gray-500">(Fixed price, no discounts)</span>}
//                     </label>
//                     <div className="relative">
//                       <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">€</span>
//                       <input
//                         type="number"
//                         value={price}
//                         onChange={(e) =>
//                           setPricing({
//                             ...pricing,
//                             modules: { ...pricing.modules, [module]: Number(e.target.value) },
//                           })
//                         }
//                         className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-8 focus:border-transparent focus:ring-2 focus:ring-blue-500"
//                       />
//                       <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-500">/month</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Commission Settings */}
//             <div className="rounded-lg border border-gray-200 bg-white p-6">
//               <div className="mb-4 flex items-center gap-2">
//                 <TrendingUp className="h-5 w-5 text-blue-600" />
//                 <h3 className="text-lg font-semibold text-gray-900">Default Commission Rates</h3>
//               </div>
//               <div className="grid grid-cols-3 gap-4">
//                 {Object.entries(pricing.commissions).map(([module, rate]) => (
//                   <div key={module}>
//                     <label className="mb-2 block text-sm font-medium text-gray-700">{moduleNames[module]}</label>
//                     <div className="relative">
//                       <input
//                         type="number"
//                         value={rate}
//                         onChange={(e) =>
//                           setPricing({
//                             ...pricing,
//                             commissions: { ...pricing.commissions, [module]: Number(e.target.value) },
//                           })
//                         }
//                         className="w-full rounded-lg border border-gray-300 py-2 pr-8 pl-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
//                       />
//                       <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">%</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Bundle Discounts */}
//             <div className="rounded-lg border border-gray-200 bg-white p-6">
//               <div className="mb-4 flex items-center gap-2">
//                 <Package className="h-5 w-5 text-blue-600" />
//                 <h3 className="text-lg font-semibold text-gray-900">Bundle Discounts</h3>
//               </div>
//               <p className="mb-4 text-sm text-gray-600">Discounts applied when multiple modules are selected (excludes Analytics)</p>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-gray-700">2 Modules Selected</label>
//                   <div className="relative">
//                     <input
//                       type="number"
//                       value={pricing.bundleDiscounts.twoModules}
//                       onChange={(e) =>
//                         setPricing({
//                           ...pricing,
//                           bundleDiscounts: { ...pricing.bundleDiscounts, twoModules: Number(e.target.value) },
//                         })
//                       }
//                       className="w-full rounded-lg border border-gray-300 py-2 pr-8 pl-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
//                     />
//                     <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">%</span>
//                   </div>
//                 </div>
//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-gray-700">3 Modules Selected</label>
//                   <div className="relative">
//                     <input
//                       type="number"
//                       value={pricing.bundleDiscounts.threeModules}
//                       onChange={(e) =>
//                         setPricing({
//                           ...pricing,
//                           bundleDiscounts: { ...pricing.bundleDiscounts, threeModules: Number(e.target.value) },
//                         })
//                       }
//                       className="w-full rounded-lg border border-gray-300 py-2 pr-8 pl-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
//                     />
//                     <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">%</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Multi-Organization Pricing */}
//             <div className="rounded-lg border border-gray-200 bg-white p-6">
//               <div className="mb-4 flex items-center gap-2">
//                 <Users className="h-5 w-5 text-blue-600" />
//                 <h3 className="text-lg font-semibold text-gray-900">Multi-Organization Pricing</h3>
//               </div>
//               <p className="mb-4 text-sm text-gray-600">Percentage of base price per organization</p>
//               <div className="space-y-3">
//                 {pricing.multiOrgPricing.map((tier, index) => (
//                   <div key={tier.orgs} className="flex items-center gap-4">
//                     <div className="w-32">
//                       <label className="text-sm font-medium text-gray-700">
//                         {tier.orgs === 6 ? '6+ Orgs' : `${tier.orgs} Org${tier.orgs > 1 ? 's' : ''}`}
//                       </label>
//                     </div>
//                     <div className="relative flex-1">
//                       <input
//                         type="number"
//                         value={tier.percentage}
//                         disabled={tier.orgs === 1}
//                         onChange={(e) => {
//                           const newPricing = [...pricing.multiOrgPricing];
//                           newPricing[index].percentage = Number(e.target.value);
//                           setPricing({ ...pricing, multiOrgPricing: newPricing });
//                         }}
//                         className={`w-full rounded-lg border border-gray-300 py-2 pr-8 pl-4 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
//                           tier.orgs === 1 ? 'bg-gray-50' : ''
//                         }`}
//                       />
//                       <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">%</span>
//                     </div>
//                     <div className="w-40 text-sm text-gray-600">Total: {(tier.orgs * tier.percentage).toFixed(0)}%</div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Yearly Discount */}
//             <div className="rounded-lg border border-gray-200 bg-white p-6">
//               <div className="mb-4 flex items-center gap-2">
//                 <Calendar className="h-5 w-5 text-blue-600" />
//                 <h3 className="text-lg font-semibold text-gray-900">Yearly Subscription Discount</h3>
//               </div>
//               <p className="mb-4 text-sm text-gray-600">Discount applied when paying yearly instead of monthly</p>
//               <div className="max-w-xs">
//                 <div className="relative">
//                   <input
//                     type="number"
//                     value={pricing.yearlyDiscount}
//                     onChange={(e) => setPricing({ ...pricing, yearlyDiscount: Number(e.target.value) })}
//                     className="w-full rounded-lg border border-gray-300 py-2 pr-8 pl-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
//                   />
//                   <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">%</span>
//                 </div>
//                 <p className="mt-2 text-xs text-gray-500">Formula: Yearly = 12 × Monthly × (1 - {pricing.yearlyDiscount}%)</p>
//               </div>
//             </div>

//             {/* Save Button */}
//             <div className="flex justify-end">
//               <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700">
//                 <Save className="h-4 w-4" />
//                 Save Pricing Configuration
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Edit Subscription Modal */}
//       {showEditModal && selectedSubscription && (
//         <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
//           <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
//             <div className="border-b border-gray-200 p-6">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-semibold text-gray-900">Edit Subscription</h3>
//                 <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
//                   <X className="h-5 w-5" />
//                 </button>
//               </div>
//             </div>
//             <div className="space-y-4 p-6">
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">Organizer</label>
//                 <input
//                   type="text"
//                   value={selectedSubscription.organizer}
//                   disabled
//                   className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2"
//                 />
//               </div>
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">Modules</label>
//                 <div className="space-y-2">
//                   {Object.keys(moduleNames).map((module) => (
//                     <label key={module} className="flex items-center gap-2">
//                       <input type="checkbox" defaultChecked={selectedSubscription.modules.includes(module)} className="rounded" />
//                       <span className="text-sm text-gray-700">{moduleNames[module]}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">Number of Organizations</label>
//                 <input
//                   type="number"
//                   defaultValue={selectedSubscription.organizations}
//                   min="1"
//                   className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-gray-700">Start Date</label>
//                   <input
//                     type="date"
//                     defaultValue={selectedSubscription.startDate}
//                     className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-gray-700">End Date</label>
//                   <input
//                     type="date"
//                     defaultValue={selectedSubscription.endDate}
//                     className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">Commission Overrides (%)</label>
//                 <div className="grid grid-cols-3 gap-4">
//                   {Object.entries(selectedSubscription.commissions).map(([module, rate]) => (
//                     <div key={module}>
//                       <label className="mb-1 block text-xs text-gray-600">{moduleNames[module]}</label>
//                       <input
//                         type="number"
//                         defaultValue={rate}
//                         className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//             <div className="flex justify-end gap-3 border-t border-gray-200 p-6">
//               <button
//                 onClick={() => setShowEditModal(false)}
//                 className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => setShowEditModal(false)}
//                 className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
