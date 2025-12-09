'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useState } from 'react';
import { MenuItem } from '../types';

export interface AddSaleFormData {
  menuItemId: string;
  discountPrice: number;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

interface AddSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddSaleFormData) => void;
  availableItems: MenuItem[];
}

export const AddSaleModal: React.FC<AddSaleModalProps> = ({ isOpen, onClose, onSubmit, availableItems }) => {
  const [formData, setFormData] = useState<AddSaleFormData>({
    menuItemId: '',
    discountPrice: 0,
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  });

  const selectedItem = availableItems.find((item) => item.id === formData.menuItemId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    // Reset form
    setFormData({
      menuItemId: '',
      discountPrice: 0,
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby={undefined}
        className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[50vh] w-full flex-col items-center overflow-y-auto md:max-w-[600px]!"
      >
        <DialogHeader>
          <DialogTitle>Add Sale</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {/* Menu Item Selection */}
          <div className="space-y-2">
            <Label htmlFor="menuItem" className="text-sm font-semibold">
              Select Menu Item
            </Label>
            <Select value={formData.menuItemId} onValueChange={(value) => setFormData({ ...formData, menuItemId: value })}>
              <SelectTrigger id="menuItem" className="h-11 w-full border-2">
                <SelectValue placeholder="Choose an item" />
              </SelectTrigger>
              <SelectContent>
                {availableItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name} - ${item.price.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Original Price Display & Discount Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Original Price</Label>
              <div className="flex h-11 items-center rounded-md border-2 border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100">
                ${selectedItem ? selectedItem.price.toFixed(2) : '0.00'}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountPrice" className="text-sm font-semibold">
                Sale Price ($)
              </Label>
              <Input
                id="discountPrice"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                max={selectedItem?.price || undefined}
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: parseFloat(e.target.value) })}
                required
                className="h-11 border-2"
              />
            </div>
          </div>

          {/* Sale Discount Preview */}
          {selectedItem && formData.discountPrice > 0 && formData.discountPrice < selectedItem.price && (
            <div className="rounded-xl bg-green-50 p-4 dark:bg-green-950">
              <div className="text-sm font-semibold text-green-900 dark:text-green-100">
                💰 Discount: ${(selectedItem.price - formData.discountPrice).toFixed(2)} (
                {(((selectedItem.price - formData.discountPrice) / selectedItem.price) * 100).toFixed(0)}% off)
              </div>
            </div>
          )}

          {/* Sale Period */}
          <div className="space-y-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Sale Period</div>

            {/* Start Date and Time */}
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

            {/* End Date and Time */}
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

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
            <Button type="button" variant="outline" onClick={onClose} className="h-10 font-bold">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.menuItemId || formData.discountPrice <= 0}
              className="h-10 bg-green-600 font-bold hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
            >
              Create Sale
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
