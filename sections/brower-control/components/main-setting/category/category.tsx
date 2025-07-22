"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Pin, EyeOff } from "lucide-react";
import type { Category, CategoryFormData } from "./types";

// Dummy data
const initialCategories: Category[] = [
  {
    id: "1",
    name: "Summer Specials",
    type: "events",
    isPinned: true,
    isVisible: true,
    order: 1,
    itemCount: 12,
  },
  {
    id: "2",
    name: "VIP Exclusive",
    type: "loyalty",
    isPinned: false,
    isVisible: false,
    order: 2,
    itemCount: 5,
  },
  {
    id: "3",
    name: "Adventure Tours",
    type: "experiences",
    isPinned: true,
    isVisible: true,
    order: 3,
    itemCount: 8,
  },
  {
    id: "4",
    name: "Event Partners",
    type: "organizers",
    isPinned: false,
    isVisible: true,
    order: 4,
    itemCount: 15,
  },
];

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
      `${category.itemCount} ${category.itemCount === 1 ? "item" : "items"}`
    );
    if (category.isPinned) parts.push("Pinned");
    if (!category.isVisible) parts.push("Hidden");
    return parts.join(" • ");
  };

  return (
    <div
      className={`border-l-blue-400 border-l-4 bg-white border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="text-2xl">{categoryIcons[category.type]}</div>
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h3 className="font-semibold text-gray-900 text-lg">
                {category.name}
              </h3>
              <div className="flex items-center space-x-2">
                {category.isPinned && (
                  <Badge variant="outline" className="text-xs">
                    <Pin className="w-3 h-3 mr-1" />
                    Pinned
                  </Badge>
                )}
                {!category.isVisible && (
                  <Badge variant="outline" className="text-xs">
                    <EyeOff className="w-3 h-3 mr-1" />
                    Hidden
                  </Badge>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-1">{getStatusText()}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(category)}
            className="h-8 w-8 p-0 cursor-pointer"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(category.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
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
    type: category?.type || "events",
    isPinned: category?.isPinned || false,
    isVisible: category?.isVisible !== undefined ? category.isVisible : true,
  });

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
      type: category?.type || "events",
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Category" : "Edit Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="type">Category Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: any) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="experiences">Experiences</SelectItem>
                <SelectItem value="organizers">Organizers</SelectItem>
                <SelectItem value="loyalty">Loyalty Programs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                id="pinned"
                type="checkbox"
                checked={formData.isPinned}
                onChange={(e) =>
                  setFormData({ ...formData, isPinned: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="pinned" className="text-sm font-medium">
                Pin to Homepage
              </Label>
            </div>

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
                Visible to Users
              </Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === "create" ? "Create Category" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Main Category Management Component
export function CategoryManagement() {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Custom Categories</h1>
        {/* <Button
          onClick={handleCreateCategory}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Category
        </Button> */}

        <Button
          onClick={handleCreateCategory}
          className="rounded-4xl py-2 bg-primary cursor-pointer text-white hover:bg-primary"
        >
          <Plus />
          New Category
        </Button>
      </div>

      <div className="space-y-3">
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
