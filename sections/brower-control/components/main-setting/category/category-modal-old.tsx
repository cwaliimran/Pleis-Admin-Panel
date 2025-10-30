'use client';

import FormProvider from '@/components/rhf';
import { RHFCustomCombobox } from '@/components/rhf/rhf-custom-combobox';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { defaultValues, schema } from '@/lib/schemas/organization-schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Category, CategoryFormData } from './types';

// Category Modal Component
function CategoryModal({
  isOpen,
  onClose,
  // onSave,
  category,
  mode,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CategoryFormData) => void;
  category?: Category | null;
  mode: 'create' | 'edit';
}) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name || '',
    type: category?.type || 'events',
    priority: category?.priority || 'priority-1',
    isPinned: category?.isPinned || false,
    isVisible: category?.isVisible !== undefined ? category.isVisible : true,
  });

  // const [open, setOpen] = useState(false);
  // const [value, setValue] = useState("");

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (formData.name.trim()) {
  //     onSave(formData);
  //     onClose();
  //   }
  // };

  const resetForm = () => {
    setFormData({
      name: category?.name || '',
      type: category?.type || 'events',
      priority: category?.priority || 'priority-1',
      isPinned: category?.isPinned || false,
      isVisible: category?.isVisible !== undefined ? category.isVisible : true,
    });
  };

  useState(() => {
    if (isOpen) {
      resetForm();
    }
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const handleTypeChange = (value: string) => {
    setFormData({
      ...formData,
      type: value,
      selectedOption: '', // Reset selection when type changes
    });
  };

  const onSubmit = () => {};

  const dropdownOptions = {
    events: [
      { value: 'summer-fest', label: 'Summer Fest' },
      { value: 'music-night', label: 'Music Night' },
      { value: 'food-carnival', label: 'Food Carnival' },
      { value: 'sports-day', label: 'Sports Day' },
      { value: 'wellness-retreat', label: 'Wellness Retreat' },
      { value: 'art-expo', label: 'Art Expo' },
    ],
    loyaltyClub: [
      { value: 'vip-club', label: 'VIP Club' },
      { value: 'gold-members', label: 'Gold Members' },
      { value: 'silver-circle', label: 'Silver Circle' },
      { value: 'platinum-elite', label: 'Platinum Elite' },
      { value: 'exclusive-access', label: 'Exclusive Access' },
    ],
    organization: [
      { value: 'city-hall', label: 'City Hall' },
      { value: 'beach-resort', label: 'Beach Resort' },
      { value: 'mountain-retreat', label: 'Mountain Retreat' },
      { value: 'urban-center', label: 'Urban Center' },
      { value: 'suburban-hub', label: 'Suburban Hub' },
      { value: 'rooftop-lounge', label: 'Rooftop Lounge' },
    ],
  };

  const getCurrentOptions = () => {
    return dropdownOptions[formData.type as keyof typeof dropdownOptions] || [];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="dark:bg-secondary sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Category' : 'Edit Category'}
          </DialogTitle>
        </DialogHeader>
        <FormProvider
          methods={methods}
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <div className="mt-3 w-full space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter category name"
                required
              />
            </div>

            <div className="w-full space-y-2">
              <Label htmlFor="type">Select Type</Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="dark:bg-secondary">
                  <SelectItem value="events">Events</SelectItem>
                  <SelectItem value="loyaltyClub">Loyalty Club</SelectItem>
                  <SelectItem value="organization">Organizations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full space-y-2">
              <RHFCustomCombobox
                name="event"
                label={`Select ${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}`}
                placeholder={`Select ${formData.type}`}
                className="w-full flex-1"
                multiple={true}
                allowCustom={true}
                options={getCurrentOptions().map((option) => ({
                  label: option.label,
                  value: option.value,
                }))}
              />
            </div>
          </div>

          <div className="flex justify-center space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Create Category' : 'Save Changes'}
            </Button>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export default CategoryModal;
