'use client';

import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { Category } from './types';

export function CategoryCard({
  category,
  onEdit,
  onDelete,
}: {
  category: any;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className={`dark:bg-secondary rounded-lg border border-l-4 border-gray-200 border-l-blue-400 bg-white px-4 py-2.5 transition-all hover:shadow-md dark:border-gray-600`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h3 className="text-md font-semibold text-gray-900 dark:text-white">
                {category?.title || ''}
              </h3>
            </div>

            <p className="mt-0 text-sm text-gray-600 dark:text-white">
              {category?.type || 'N/A'}
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
            onClick={() => onDelete(category?._id)}
            className="h-8 w-8 cursor-pointer p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
