'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { AVAILABILITY_OPTIONS, CATEGORY_OPTIONS } from '../constants';
import { AvailabilityType, LimitedTimeFormData } from '../types';

interface LimitedTimeItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LimitedTimeFormData) => void;
}

export const LimitedTimeItemModal: React.FC<LimitedTimeItemModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<LimitedTimeFormData>({
    name: '',
    category: 'drinks',
    price: 0,
    description: '',
    imageUrl: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    availabilityType: 'preorder-only',
    isUpsell: false,
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
        className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[50vh] w-full flex-col items-center overflow-y-auto md:max-w-[600px]!"
      >
        <DialogHeader>
          <DialogTitle>Add Limited-Time Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {/* Item Name - PATTERN: Label + Input in space-y-2 */}
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

          {/* Category and Price Row - PATTERN: Two-column grid with gap-4 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full space-y-2">
              <Label htmlFor="category" className="text-sm font-semibold">
                Category
              </Label>
              <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                <SelectTrigger id="category" className="h-11 w-full border-2">
                  {' '}
                  {/* Match height and full width */}
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

          {/* Image URL (Missing from the original LimitedTime but added here to match the structure of AddEdit) */}
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

          {/* Description - PATTERN: Label + Textarea */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your limited-time item..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[100px] resize-y border-2"
            />
          </div>

          {/* Availability Period - PATTERN: Grouped section with distinct background (rounded-xl bg-gray-50 p-4) */}
          <div className="space-y-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
            {' '}
            {/* Changed p-5 to p-4 */}
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Availability Period</div> {/* Standardized font-size */}
            {/* Start Date and Time - PATTERN: Two-column grid with gap-4 */}
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
            {/* End Date and Time - PATTERN: Two-column grid with gap-4 */}
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

          {/* Availability Type - PATTERN: Grouped section with distinct background (rounded-xl bg-gray-50 p-4) */}
          <div className="space-y-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
            {' '}
            {/* Changed p-5 to p-4 */}
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Availability Type</div> {/* Standardized font-size */}
            <RadioGroup
              value={formData.availabilityType}
              onValueChange={(value: AvailabilityType) => setFormData({ ...formData, availabilityType: value })}
            >
              <div className="space-y-2">
                {AVAILABILITY_OPTIONS.map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={option.value}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-lg border-2 bg-white p-3 transition-all dark:bg-[#222121]',
                      formData.availabilityType === option.value
                        ? 'border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-950'
                        : 'border-gray-200 dark:border-gray-800'
                    )}
                  >
                    <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
                    <div className="flex-1">
                      <div className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{option.label}</div>
                      <div className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">{option.description}</div>
                    </div>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Upsell Checkbox - PATTERN: Distinct background box with p-4 and items-start gap-4 */}
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
            {' '}
            {/* Match p-4 from original */}
            <div className="flex items-start gap-4">
              {' '}
              {/* Match flex items-start gap-4 from original */}
              <Checkbox
                id="limitedUpsell"
                checked={formData.isUpsell}
                onCheckedChange={(checked) => setFormData({ ...formData, isUpsell: checked as boolean })}
                className="mt-1 h-5 w-5" // Match mt-1 from original
              />
              <div className="flex-1">
                <Label htmlFor="limitedUpsell" className="cursor-pointer text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {' '}
                  {/* Match font-semibold */}
                  Enable as Upsell Item
                </Label>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Show this limited-time item in upsell popups</p>{' '}
                {/* Match mt-1 from original */}
              </div>
            </div>
          </div>

          {/* Actions - PATTERN: Two-column grid with gap-3, border-t, and pt-5. Standard button height h-10 */}
          <div className="grid grid-cols-2 gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
            <Button type="button" variant="outline" onClick={onClose} className="h-10 font-bold">
              {' '}
              {/* Changed h-12 to h-10 */}
              Cancel
            </Button>
            <Button type="submit" className="h-10 bg-green-600 font-bold hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600">
              {' '}
              {/* Changed h-12 to h-10 */}
              Create Limited-Time Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
