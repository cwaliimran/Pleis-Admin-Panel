'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';
import { CATEGORY_OPTIONS } from '../constants';
import { MenuItem, MenuItemFormData } from '../types';

interface AddEditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MenuItemFormData) => void;
  item?: MenuItem | null;
}

export const AddEditItemModal: React.FC<AddEditItemModalProps> = ({ isOpen, onClose, onSubmit, item }) => {
  const [formData, setFormData] = useState<MenuItemFormData>({
    name: item?.name || '',
    category: item?.category || 'drinks',
    price: item?.price || 0,
    description: item?.description || '',
    imageUrl: item?.imageUrl || '',
    isUpsell: item?.isUpsell || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby={undefined}
        className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[50vh] w-full flex-col items-center overflow-y-auto md:max-w-[530px]!"
      >
        <DialogHeader>
          <DialogTitle>{item ? `Edit: ${item.name}` : 'Add Menu Item'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {/* Item Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">
              Item Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter item name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="h-11 border-2"
            />
          </div>

          {/* Category and Price Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full space-y-2">
              <Label htmlFor="category" className="text-sm font-semibold">
                Category
              </Label>
              <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                <SelectTrigger id="category" className="h-[43px]! w-full border-2">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-semibold">
                Price ($)
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
                className="h-11 border-2"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your menu item..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[100px] resize-y border-2"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-sm font-semibold">
              Image URL <span className="font-normal text-gray-500">(optional)</span>
            </Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="h-11 border-2"
            />
          </div>

          {/* Upsell Checkbox */}
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
            <div className="flex items-start gap-4">
              <Checkbox
                id="upsell"
                checked={formData.isUpsell}
                onCheckedChange={(checked) => setFormData({ ...formData, isUpsell: checked as boolean })}
                className="mt-1 h-5 w-5"
              />

              <div>
                <Label htmlFor="upsell" className="cursor-pointer text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Enable as Upsell Item
                </Label>

                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Show this item in upsell popups when users are ordering</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
            <Button type="button" variant="outline" onClick={onClose} className="h-10 font-bold">
              Cancel
            </Button>
            <Button type="submit" className="h-10 font-bold">
              Save Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
