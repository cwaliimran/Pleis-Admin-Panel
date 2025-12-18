import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { MenuItem } from './types';
import ButtonLoading from '@/components/common/button-loading';

interface DeliveryItemsModalProps {
  open: boolean;
  isLoading?: boolean;
  items: MenuItem[];
  onClose: () => void;
  onConfirm: (selectedItemIds: string[]) => void;
}

export const DeliveryItemsModal: React.FC<DeliveryItemsModalProps> = ({ open, isLoading, items, onClose, onConfirm }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter out already delivered items
  const undeliveredItems = items.filter((item) => !item.isDelivered);

  // Reset selection when modal opens
  useEffect(() => {
    if (open) {
      setSelectedIds([]);
    }
  }, [open]);

  const handleToggleItem = (itemId: string) => {
    setSelectedIds((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
  };

  const handleSelectAll = () => {
    if (selectedIds.length === undeliveredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(undeliveredItems.map((item) => item.id));
    }
  };

  const handleConfirm = () => {
    if (selectedIds.length > 0) {
      onConfirm(selectedIds);
    }
  };

  const isAllSelected = selectedIds.length === undeliveredItems.length && undeliveredItems.length > 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 flex items-center justify-center">
        <DialogContent aria-describedby={undefined} className="dark:bg-secondary w-full max-w-md rounded-2xl p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Select Items to Mark as Delivered</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-3">
            {/* Select All Checkbox */}
            <div
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-all',
                isAllSelected
                  ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
              )}
              onClick={handleSelectAll}
            >
              <div
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded border-2 transition-all',
                  isAllSelected ? 'border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400' : 'border-gray-300 dark:border-gray-600'
                )}
              >
                {isAllSelected && (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="font-semibold text-gray-900 dark:text-gray-100">Select All ({undeliveredItems.length} items)</span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700" />

            {/* Items List */}
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {undeliveredItems.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-all',
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                    )}
                    onClick={() => handleToggleItem(item.id)}
                  >
                    <div
                      className={cn(
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all',
                        isSelected ? 'border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400' : 'border-gray-300 dark:border-gray-600'
                      )}
                    >
                      {isSelected && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex flex-1 items-center justify-between">
                      <span className="text-sm">
                        <span className="mr-2 font-bold text-blue-600 dark:text-blue-400">{item.quantity}×</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</span>
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Already Delivered Items */}
            {items.some((item) => item.isDelivered) && (
              <>
                <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
                  <div className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">Already Delivered</div>
                  <div className="space-y-2">
                    {items
                      .filter((item) => item.isDelivered)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 rounded-lg border-2 border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20"
                        >
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-500 dark:bg-green-600">
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="flex flex-1 items-center justify-between">
                            <span className="text-sm">
                              <span className="mr-2 font-bold text-green-600 dark:text-green-400">{item.quantity}×</span>
                              <span className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</span>
                            </span>
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">Delivered</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" className="cursor-pointer" onClick={onClose}>
              Cancel
            </Button>
            {isLoading ? (
              <Button type="button" className="cursor-not-allowed bg-blue-600 hover:bg-blue-600/80" disabled>
                <ButtonLoading />
              </Button>
            ) : (
              <Button
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleConfirm}
                disabled={selectedIds.length === 0}
              >
                Mark {selectedIds.length > 0 ? `${selectedIds.length} Item${selectedIds.length > 1 ? 's' : ''}` : 'Selected'} as Delivered
              </Button>
            )}
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};
