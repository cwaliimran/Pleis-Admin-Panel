'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { PromoEvent } from './types';

interface DraggablePromoItemProps {
  promo: any;
  onEdit?: (promo: PromoEvent) => void;
  onDelete?: (id: any) => void;
  isOverlay?: boolean;
}

export function DraggablePromoItem({
  promo,
  isOverlay = false,
}: DraggablePromoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: promo?._id?.toString(),
    data: {
      type: 'promo',
      promo,
    },
  });

  const className = `bg-white dark:bg-secondary rounded-lg border border-gray-200 dark:border-gray-600 p-4 flex items-center justify-between border-l-4 border-l-blue-500 hover:shadow-sm transition-shadow 
  ${isDragging ? 'opacity-50' : ''} `;

  if (isOverlay) {
    return (
      <div className="dark:bg-secondary flex scale-105 rotate-1 items-center justify-between rounded-lg border border-l-4 border-gray-200 border-l-blue-500 bg-white p-4 opacity-95 shadow-lg dark:border-gray-800">
        <div>
          <h3 className="text-xs font-semibold text-gray-900 dark:text-white">
            {promo?.title}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    );
  }

  // Use CSS.Transform for proper drag and drop functionality
  const dragStyle = transform
    ? {
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }
    : {};

  return (
    // eslint-disable-next-line react/forbid-component-props
    <div ref={setNodeRef} className={className} style={dragStyle}>
      <div>
        <h3 className="text-[14px] font-semibold text-gray-900 sm:text-[16px] dark:text-white">
          {promo?.title}
        </h3>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab rounded p-1 hover:cursor-grabbing hover:bg-gray-100 hover:dark:bg-gray-700"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
