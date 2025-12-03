'use client';

import { Edit2, Trash2 } from 'lucide-react';
import React from 'react';
import { MODULE_NAMES } from './constants';
import { Subscription } from './types';

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export const SubscriptionTableV2: React.FC<SubscriptionTableProps> = ({ subscriptions, onEdit, onDelete }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-[#222121]">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-[#1a1a1a]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase dark:text-gray-400">Organizer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase dark:text-gray-400">Modules</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase dark:text-gray-400">Organizations</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase dark:text-gray-400">Billing</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase dark:text-gray-400">Period</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase dark:text-gray-400">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase dark:text-gray-400">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {subscriptions.map((sub) => (
            <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a]">
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900 dark:text-gray-100">{sub.organizer}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {sub.modules.map((module) => (
                    <span
                      key={module}
                      className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      {MODULE_NAMES[module]}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{sub.organizations}</td>
              <td className="px-6 py-4">
                <span
                  className={`rounded px-2 py-1 text-xs font-medium ${
                    sub.billing === 'yearly'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  {sub.billing === 'yearly' ? 'Yearly' : 'Monthly'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                <div>{new Date(sub.startDate).toLocaleDateString()}</div>
                <div className="text-xs text-gray-500 dark:text-gray-500">to {new Date(sub.endDate).toLocaleDateString()}</div>
              </td>
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900 dark:text-gray-100">€{sub.monthlyPrice}</div>
                <div className="text-xs text-gray-500 dark:text-gray-500">/month</div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`rounded px-2 py-1 text-xs font-medium ${
                    sub.status === 'active'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {sub.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(sub)}
                    className="rounded p-2 text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                    title="Edit subscription"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(sub.id)}
                    className="rounded p-2 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    title="Delete subscription"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
