"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Category, CategoryFormData } from "./types";

// Dummy data
const initialCategories: Category[] = [
  {
    id: "1",
    name: "Category Name",
    type: "categoryType",
    priority: "priority-1",
    isPinned: true,
    isVisible: true,
    order: 1,
    itemCount: 12,
  },
  {
    id: "2",
    name: "Tags",
    type: "categoryType",
    priority: "priority-1",
    isPinned: false,
    isVisible: false,
    order: 2,
    itemCount: 5,
  },
  {
    id: "3",
    name: "Category Name",
    type: "categoryType",
    priority: "priority-1",
    isPinned: true,
    isVisible: true,
    order: 3,
    itemCount: 8,
  },
  {
    id: "4",
    name: "Venue Type",
    type: "categoryType",
    priority: "priority-1",
    isPinned: false,
    isVisible: true,
    order: 4,
    itemCount: 15,
  },
  {
    id: "5",
    name: "Category Name",
    type: "categoryType",
    priority: "priority-1",
    isPinned: true,
    isVisible: true,
    order: 1,
    itemCount: 12,
  },
];

interface CategoryFormDataExtended extends CategoryFormData {
  selectedOption?: string;
}

const dropdownOptions = {
  categoryType: [
    { value: "events", label: "Events" },
    { value: "experiences", label: "Experiences" },
    { value: "food-drinks", label: "Food & Drinks" },
    { value: "entertainment", label: "Entertainment" },
    { value: "sports", label: "Sports" },
    { value: "wellness", label: "Wellness" },
  ],
  tags: [
    { value: "trending", label: "Trending" },
    { value: "popular", label: "Popular" },
    { value: "new", label: "New" },
    { value: "featured", label: "Featured" },
    { value: "exclusive", label: "Exclusive" },
  ],
  venueTag: [
    { value: "indoor", label: "Indoor Venue" },
    { value: "outdoor", label: "Outdoor Venue" },
    { value: "rooftop", label: "Rooftop" },
    { value: "beachfront", label: "Beachfront" },
    { value: "downtown", label: "Downtown" },
    { value: "suburban", label: "Suburban" },
  ],
};

const categoryIcons = {
  events: "📅",
  experiences: "🎯",
  organizers: "🏢",
  loyalty: "💳",
};

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
      `${category.itemCount} ${category.itemCount === 1 ? "event" : "events"}`
    );
    return parts.join(" • ");
  };

  return (
    <div
      className={`border-l-blue-400 border-l-4 bg-white border border-gray-200 rounded-lg px-4 py-2.5 transition-all hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h3 className="font-semibold text-gray-900 text-md">
                {category.name}
              </h3>
            </div>

            <p className="text-sm text-gray-600 mt-0">Experiences</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(category)}
            className="h-8 w-8 p-0 cursor-pointer"
          >
            <Edit className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(category.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 cursor-pointer"
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
  onSave,
  category,
  mode,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CategoryFormData) => void;
  category?: Category | null;
  mode: "create" | "edit";
}) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name || "",
    type: category?.type || "categoryType",
    priority: category?.priority || "priority-1",
    isPinned: category?.isPinned || false,
    isVisible: category?.isVisible !== undefined ? category.isVisible : true,
    selectedOption: "",
  });

  // Reset selectedOption when type changes
  const handleTypeChange = (value: string) => {
    setFormData({
      ...formData,
      type: value,
      selectedOption: "", // Reset selection when type changes
    });
  };

  const getCurrentOptions = () => {
    return dropdownOptions[formData.type as keyof typeof dropdownOptions] || [];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
      onClose();
    }
  };

  const resetForm = () => {
    setFormData({
      name: category?.name || "",
      type: category?.type || "categoryType",
      priority: category?.priority || "priority-1",
      isPinned: category?.isPinned || false,
      isVisible: category?.isVisible !== undefined ? category.isVisible : true,
      selectedOption: "",
    });
  };

  // Reset form when modal opens/closes or category changes
  useState(() => {
    if (isOpen) {
      resetForm();
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Create Pinned Content"
              : "Edit Pinned Content"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 w-full">
            <Label htmlFor="type">Pinned Content Type</Label>
            <Select value={formData.type} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="categoryType">Category Name</SelectItem>
                <SelectItem value="tags">Tags</SelectItem>
                <SelectItem value="venueTag">Venue Type</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conditional dropdown based on type selection */}
          {formData.type && (
            <div className="space-y-2 w-full">
              <Label htmlFor="selectedOption">
                Select{" "}
                {formData.type === "categoryType"
                  ? "Category"
                  : formData.type === "tags"
                  ? "Tag"
                  : "Venue Tag"}
              </Label>
              <Select
                value={formData.selectedOption}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, selectedOption: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={`Select ${
                      formData.type === "categoryType"
                        ? "category"
                        : formData.type === "tags"
                        ? "tag"
                        : "venue tag"
                    }`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {getCurrentOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                id="visible"
                type="checkbox"
                checked={formData.isVisible}
                onChange={(e) =>
                  setFormData({ ...formData, isVisible: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="visible" className="text-sm font-medium">
                Always Visible
              </Label>
            </div>
          </div> */}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === "create" ? "Create" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Main Pinned Content Component
export function PinnedContentV2() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  const handleSaveCategory = (formData: CategoryFormData) => {
    if (modalMode === "create") {
      const newCategory: Category = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        order: categories.length + 1,
        itemCount: Math.floor(Math.random() * 20) + 1, // Random item count for demo
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
        <h1 className="text-2xl font-bold text-gray-900">Pinned Content</h1>

        <Button
          onClick={handleCreateCategory}
          className="size-10 rounded-full bg-primary hover:bg-primary/90 cursor-pointer text-white"
        >
          <Plus className="w-4 h-4" />
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

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No categories created yet</p>
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
