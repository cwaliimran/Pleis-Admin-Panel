"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, Tag, MapPin, Plus, X } from "lucide-react";

interface ContentItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const initialPinnedItems: ContentItem[] = [
  {
    id: "category",
    name: "Category",
    icon: <FolderOpen className="w-4 h-4" />,
    color: "text-blue-600",
  },
  {
    id: "tag",
    name: "Tag",
    icon: <Tag className="w-4 h-4" />,
    color: "text-purple-600",
  },
];

const initialAvailableItems: ContentItem[] = [
  {
    id: "venue-type",
    name: "Venue Type",
    icon: <MapPin className="w-4 h-4" />,
    color: "text-red-600",
  },
];

export default function PinnedContent() {
  const [pinnedItems, setPinnedItems] =
    useState<ContentItem[]>(initialPinnedItems);
  const [availableItems, setAvailableItems] = useState<ContentItem[]>(
    initialAvailableItems
  );

  const moveToTop = (item: ContentItem) => {
    setAvailableItems((prev) => prev.filter((i) => i.id !== item.id));
    setPinnedItems((prev) => [...prev, item]);
  };

  const moveToBottom = (item: ContentItem) => {
    setPinnedItems((prev) => prev.filter((i) => i.id !== item.id));
    setAvailableItems((prev) => [...prev, item]);
  };

  return (
    <Card className="w-full gap-0 max-w-md mx-auto ">
      <CardHeader className="mb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Pinned Content
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Quick Access Bar
          </h3>
          <div className="space-y-2">
            {pinnedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={item.color}>{item.icon}</div>
                  <span className="text-sm font-medium text-gray-900">
                    {item.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-red-100 cursor-pointer"
                  onClick={() => moveToBottom(item)}
                >
                  <X className="w-3 h-3 text-red-500" />
                </Button>
              </div>
            ))}
            {pinnedItems.length === 0 && (
              <div className="text-sm text-gray-500 italic p-2">
                No pinned items
              </div>
            )}
          </div>
        </div>

        {/* Available to Pin Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Available to Pin
          </h3>
          <div className="space-y-2">
            {availableItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={item.color}>{item.icon}</div>
                  <span className="text-sm font-medium text-gray-900">
                    {item.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-gray-100 cursor-pointer"
                  onClick={() => moveToTop(item)}
                >
                  <Plus className="w-3 h-3 text-gray-500" />
                </Button>
              </div>
            ))}
            {availableItems.length === 0 && (
              <div className="text-sm text-gray-500 italic p-2">
                All items are pinned
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
