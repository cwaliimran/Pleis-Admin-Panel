"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Pin, EyeOff } from "lucide-react";
import type { Category } from "./types";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

const categoryIcons = {
  events: "📅",
  experiences: "🎯",
  organizers: "🏢",
  loyalty: "💳",
};

const categoryColors = {
  events: "bg-orange-50 border-l-orange-400",
  experiences: "bg-blue-50 border-l-blue-400",
  organizers: "bg-green-50 border-l-green-400",
  loyalty: "bg-purple-50 border-l-purple-400",
};

export function CategoryCard({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) {
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
      className={`${
        categoryColors[category.type as keyof typeof categoryColors]
      } border-l-4 bg-white border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="text-2xl">
            {categoryIcons[category.type as keyof typeof categoryIcons]}
          </div>
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
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {category.type.charAt(0).toUpperCase() + category.type.slice(1)}
                : {category.itemCount}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(category)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(category.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
