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
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Category, CategoryFormData } from './types';

// Dummy data
const initialCategories: Category[] = [
  {
    id: '1',
    name: 'Summer Specials',
    type: 'event-1',
    priority: 'priority-1',
    isPinned: true,
    isVisible: true,
    order: 1,
    itemCount: 12,
  },
  {
    id: '2',
    name: 'VIP Exclusive',
    type: 'event-1',
    priority: 'priority-1',
    isPinned: false,
    isVisible: false,
    order: 2,
    itemCount: 5,
  },
  {
    id: '3',
    name: 'Adventure Tours',
    type: 'event-1',
    priority: 'priority-1',
    isPinned: true,
    isVisible: true,
    order: 3,
    itemCount: 8,
  },
  {
    id: '4',
    name: 'Event Partners',
    type: 'event-1',
    priority: 'priority-1',
    isPinned: false,
    isVisible: true,
    order: 4,
    itemCount: 15,
  },
  {
    id: '5',
    name: 'Summer Specials 2',
    type: 'event-1',
    priority: 'priority-1',
    isPinned: true,
    isVisible: true,
    order: 1,
    itemCount: 12,
  },
];

// Category Card Component
function CategoryCard({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}) {
  const getStatusText = () => {
    const parts = [];
    parts.push(
      `${category.itemCount} ${category.itemCount === 1 ? 'event' : 'events'}`
    );
    return parts.join(' • ');
  };

  return (
    <div
      className={`dark:bg-secondary rounded-lg border border-l-4 border-gray-200 border-l-blue-400 bg-white px-4 py-2.5 transition-all hover:shadow-md dark:border-gray-600`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h3 className="text-md font-semibold text-gray-900 dark:text-white">
                {category.name}
              </h3>
            </div>

            <p className="mt-0 text-sm text-gray-600 dark:text-white">
              {getStatusText()}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(category)}
            className="h-8 w-8 cursor-pointer p-0"
          >
            <Edit className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(category.id)}
            className="h-8 w-8 cursor-pointer p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

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

  // Reset form when modal opens/closes or category changes
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

  // const frameworks = [
  //   {
  //     value: 'event-1',
  //     label: 'Event 1',
  //   },
  //   {
  //     value: 'event-2',
  //     label: 'Event 2',
  //   },
  //   {
  //     value: 'event-3',
  //     label: 'Event 3',
  //   },
  //   {
  //     value: 'event-4',
  //     label: 'Event 4',
  //   },
  // ];

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

            <div className="w-full space-y-2">
              <Label htmlFor="type">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category type" />
                </SelectTrigger>
                <SelectContent className="dark:bg-secondary">
                  <SelectItem value="priority-1">Priority 1</SelectItem>
                  <SelectItem value="priority-2">Priority 2</SelectItem>
                  <SelectItem value="priority-3">Priority 3</SelectItem>
                  <SelectItem value="priority-4">Priority 4</SelectItem>
                  <SelectItem value="priority-5">Priority 5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  id="visible"
                  type="checkbox"
                  checked={formData.isVisible}
                  onChange={(e) =>
                    setFormData({ ...formData, isVisible: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor="visible" className="text-sm font-medium">
                  Always Visible
                </Label>
              </div>
            </div> */}
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

// Main Category Management Component
export function CategoryManagement() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  const navigateToAllCustomCategory = () => {
    router.push('/super-admin/browser-control/all-custom-categories');
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  const handleSaveCategory = (formData: CategoryFormData) => {
    if (modalMode === 'create') {
      const newCategory: Category = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        order: categories.length + 1,
        itemCount: Math.floor(Math.random() * 20) + 1,
      };
      setCategories([...categories, newCategory]);
    } else if (editingCategory) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, ...formData } : cat
        )
      );
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Custom Categories
        </h1>

        <Button
          onClick={handleCreateCategory}
          className="bg-primary hover:bg-primary/90 size-10 cursor-pointer rounded-full text-white"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {sortedCategories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <Button
          variant="outline"
          onClick={navigateToAllCustomCategory}
          className="border-gray-300 bg-white px-6 py-2 hover:border-gray-400"
        >
          View All
        </Button>
      </div>

      {categories.length === 0 && (
        <div className="py-12 text-center">
          <p className="mb-4 text-gray-500 dark:text-white">
            No categories created yet
          </p>
          <Button onClick={handleCreateCategory} variant="outline">
            Create Your First Category
          </Button>
        </div>
      )}

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        category={editingCategory}
        mode={modalMode}
      />
    </div>
  );
}
