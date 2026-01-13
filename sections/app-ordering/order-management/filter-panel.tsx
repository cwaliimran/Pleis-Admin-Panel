import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import React from 'react';
import { FILTER_DELIVERY_OPTIONS, FILTER_STATUS_OPTIONS } from './constants';
import { FilterOptions } from './types';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onApply: () => void;
  onClear: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose, filters, onFiltersChange, onApply, onClear }) => {
  const handleStatusToggle = (statusId: string) => {
    const newStatuses = filters.statuses.includes(statusId as any)
      ? filters.statuses.filter((s) => s !== statusId)
      : [...filters.statuses, statusId as any];
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const handleDeliveryTypeToggle = (typeId: string) => {
    const newTypes = filters.deliveryTypes.includes(typeId as any)
      ? filters.deliveryTypes.filter((t) => t !== typeId)
      : [...filters.deliveryTypes, typeId as any];
    onFiltersChange({ ...filters, deliveryTypes: newTypes });
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="animate-in fade-in fixed inset-0 z-40 bg-black/50 duration-200" onClick={onClose} />}

      {/* Panel */}
      <div
        className={cn(
          'dark:bg-secondary fixed top-0 right-0 bottom-0 z-50 w-full max-w-md overflow-y-auto bg-white transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Filters</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-11 w-11 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-5">
          {/* Status Filter */}
          <div>
            <h3 className="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">Status</h3>
            <div className="space-y-2">
              {FILTER_STATUS_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className="dark:hover:bg-gray-750 flex min-h-12 cursor-pointer items-center rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-gray-800"
                >
                  <Checkbox
                    checked={filters.statuses.includes(option.id)}
                    onCheckedChange={() => handleStatusToggle(option.id)}
                    className="mr-3 h-5 w-5"
                  />
                  <span className="flex-1 text-sm text-gray-900 dark:text-gray-100">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Delivery Type Filter */}
          <div>
            <h3 className="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">Delivery Type</h3>
            <div className="space-y-2">
              {FILTER_DELIVERY_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className="dark:hover:bg-gray-750 flex min-h-12 cursor-pointer items-center rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-gray-800"
                >
                  <Checkbox
                    checked={filters.deliveryTypes.includes(option.id)}
                    onCheckedChange={() => handleDeliveryTypeToggle(option.id)}
                    className="mr-3 h-5 w-5"
                  />
                  <span className="flex-1 text-sm text-gray-900 dark:text-gray-100">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Order Type Filter */}
          <div>
            <h3 className="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">Order Type</h3>
            <div className="space-y-2">
              <label className="dark:hover:bg-gray-750 flex min-h-12 cursor-pointer items-center rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-gray-800">
                <Checkbox
                  checked={filters.preorderOnly}
                  onCheckedChange={(checked) =>
                    onFiltersChange({
                      ...filters,
                      preorderOnly: checked as boolean,
                    })
                  }
                  className="mr-3 h-5 w-5"
                />
                <span className="flex-1 text-sm text-gray-900 dark:text-gray-100">Preorders Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 border-t border-gray-200 p-5 dark:border-gray-800">
          <Button variant="outline" onClick={onClear} className="h-12 font-bold">
            Clear All
          </Button>
          <Button onClick={onApply} className="h-12 font-bold">
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  );
};
