'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useState } from 'react';
import { DISCOUNT_TYPE_OPTIONS } from '../constants';
import { BulkSaleFormData, DiscountType, MenuItem } from '../types';

interface BulkSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BulkSaleFormData) => void;
  availableItems: MenuItem[];
}

export const BulkSaleModal: React.FC<BulkSaleModalProps> = ({ isOpen, onClose, onSubmit, availableItems }) => {
  const [formData, setFormData] = useState<BulkSaleFormData>({
    saleName: '',
    discountType: 'percentage',
    discountValue: 0,
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    selectedItems: [],
  });

  const handleItemToggle = (itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedItems: prev.selectedItems.includes(itemId) ? prev.selectedItems.filter((id) => id !== itemId) : [...prev.selectedItems, itemId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby={undefined}
        className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[50vh] w-full flex-col items-center overflow-y-auto md:max-w-[630px]!"
      >
        <DialogHeader>
          <DialogTitle>Create Bulk Sale</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {/* Sale Name - PATTERN: Label + Input in space-y-2 */}
          <div className="space-y-2">
            <Label htmlFor="saleName" className="text-sm font-semibold">
              Sale Name
            </Label>
            <Input
              id="saleName"
              type="text"
              placeholder="e.g., Happy Hour, Weekend Special"
              value={formData.saleName}
              onChange={(e) => setFormData({ ...formData, saleName: e.target.value })}
              required
              className="h-11 border-2"
            />
          </div>

          {/* Discount Type and Value Row - PATTERN: Two-column grid with gap-4 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full space-y-2">
              <Label htmlFor="discountType" className="text-sm font-semibold">
                Discount Type
              </Label>
              <Select value={formData.discountType} onValueChange={(value: DiscountType) => setFormData({ ...formData, discountType: value })}>
                <SelectTrigger id="discountType" className="h-11 w-full border-2">
                  {' '}
                  {/* Ensures h-11 and full width */}
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {DISCOUNT_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountValue" className="text-sm font-semibold">
                Discount Value
              </Label>
              <Input
                id="discountValue"
                type="number"
                placeholder="e.g., 20 or 5.00"
                step="0.01"
                min="0"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                required
                className="h-11 border-2"
              />
            </div>
          </div>

          <div className="space-y-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">⏰ Sale Period</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-semibold">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  className="h-11 border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-sm font-semibold">
                  Start Time
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                  className="h-11 border-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-semibold">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                  className="h-11 border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-sm font-semibold">
                  End Time
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                  className="h-11 border-2"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Select Items for Sale</Label>
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border-2 border-gray-200 p-3 dark:border-gray-800">
              {availableItems.map((item) => (
                <div key={item.id} className="flex items-start gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                  <Checkbox
                    id={`item-${item.id}`}
                    checked={formData.selectedItems.includes(item.id)}
                    onCheckedChange={() => handleItemToggle(item.id)}
                    className="mt-1 h-5 w-5"
                  />
                  <Label htmlFor={`item-${item.id}`} className="flex-1 cursor-pointer text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {item.name} - ${item.price.toFixed(2)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
            <Button type="button" variant="outline" onClick={onClose} className="h-10 font-bold">
              Cancel
            </Button>

            <Button type="submit" className="h-10 bg-green-600 font-bold hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600">
              Create Sale
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
