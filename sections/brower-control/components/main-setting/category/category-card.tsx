'use client';

import { Button } from '@/components/ui/button';
import { Edit, GripVertical, Loader2, Trash2 } from 'lucide-react';
import type { Category } from './types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useUpdateCustomCategoryMutation } from '@/store/Reducer/custom-categories-api';
import { showError, showSuccess } from '@/utils/toast';
import { getErrorMessage } from '@/utils/api';
// import { useState } from 'react';

export function CategoryCard({
  category,
  onEdit,
  onDelete,
  isOverlay = false,
}: {
  category: any;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  isOverlay?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: category?._id?.toString(),
    data: { type: 'category', category },
  });

  // Remove local isActive state; always use category.status
  const [updateCategory, { isLoading: isToggling }] = useUpdateCustomCategoryMutation();

  const handleStatusToggle = async () => {
    const newStatus = category?.status === 'active' ? 'inactive' : 'active';
    try {
      const response = await updateCategory({
        id: category?._id,
        status: newStatus,
      }).unwrap();

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || `Status updated to ${newStatus}`);
    } catch (err) {
      showError(getErrorMessage(err));
    }
  };

  const dragStyle = transform
    ? { transform: CSS.Transform.toString(transform), transition }
    : {};

  const typeLabel = category?.type === 'User' ? 'Loyalty Club' : category?.type || 'N/A';

  if (isOverlay) {
    return (
      <div className="dark:bg-secondary flex scale-105 rotate-1 items-center justify-between rounded-lg border border-l-4 border-gray-200 border-l-blue-500 bg-white p-4 opacity-95 shadow-lg dark:border-gray-800">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex flex-1 items-center space-x-4">
            <div className="flex-1">
              <h3 className="text-md font-semibold text-gray-900 dark:text-white">
                {category?.title || ''}
              </h3>
              <p className="mt-0 text-sm text-gray-600 dark:text-white">{typeLabel}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      className={`dark:bg-secondary rounded-lg border border-l-4 border-gray-200 border-l-blue-400 bg-white px-4 py-2.5 transition-shadow hover:shadow-md dark:border-gray-600 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center justify-between">

        {/* Left: title + type */}
        <div className="flex flex-1 items-center space-x-4">
          <div className="flex-1">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white">
              {category?.title || ''}
            </h3>
            <p className="mt-0 text-sm text-gray-600 dark:text-white">{typeLabel}</p>
          </div>
        </div>

        {/* Right: toggle + drag + actions */}
        <div className="flex items-center space-x-3">

          {/* ✅ Status toggle */}
          <div className="relative flex items-center">
            {isToggling ? (
              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            ) : (
              <>
                <input
                  id={`status-toggle-${category?._id}`}
                  type="checkbox"
                  checked={category?.status === 'active'}
                  onChange={handleStatusToggle}
                  className="peer sr-only"
                  disabled={isToggling}
                />
                <div
                  onClick={isToggling ? undefined : handleStatusToggle}
                  className={`peer relative h-6 w-11 cursor-pointer rounded-full after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] ${
                    category?.status === 'active'
                      ? 'bg-primary after:translate-x-full after:border-white'
                      : 'bg-gray-200'
                  }`}
                />
              </>
            )}
          </div>

          {/* Drag handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab rounded p-1 hover:cursor-grabbing hover:bg-gray-100 hover:dark:bg-gray-700"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>

          {/* Edit */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(category)}
            className="h-8 w-8 cursor-pointer p-0"
          >
            <Edit className="h-5 w-5" />
          </Button>

          {/* Delete */}
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


// 'use client';

// import { Button } from '@/components/ui/button';
// import { Edit, GripVertical, Trash2 } from 'lucide-react';
// import type { Category } from './types';
// import { useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';

// export function CategoryCard({
//   category,
//   onEdit,
//   onDelete,
//   isOverlay = false
// }: {
//   category: any;
//   onEdit: (category: Category) => void;
//   onDelete: (id: string) => void;
//   isOverlay?: boolean
// }) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({
//     id: category?._id?.toString(),
//     data: {
//       type: 'category',
//       category,
//     },
//   });


//   const dragStyle = transform
//     ? {
//       transform: CSS.Transform.toString(transform),
//       transition: transition,
//     }
//     : {};

//   if (isOverlay) {
//     return (
//       <div className="dark:bg-secondary flex scale-105 rotate-1 items-center justify-between rounded-lg border border-l-4 border-gray-200 border-l-blue-500 bg-white p-4 opacity-95 shadow-lg dark:border-gray-800">
//         <div className="flex items-center justify-between flex-1">
//           <div className="flex flex-1 items-center space-x-4">
//             <div className="flex-1">
//               <div className="flex items-center space-x-3">
//                 <h3 className="text-md font-semibold text-gray-900 dark:text-white">{category?.title || ''}</h3>
//               </div>

//               <p className="mt-0 text-sm text-gray-600 dark:text-white">{category?.type === 'User' ? 'Loyalty Club' : category?.type || 'N/A'}</p>
//             </div>
//           </div>

//           <div className="flex space-x-2 items-center justify-end">
//             <div
//               className=" flex items-center space-x-2"
//             >
//               <GripVertical className="h-4 w-4 text-gray-400" />
//             </div>
//           </div>
//         </div>

//       </div>
//     );
//   }


//   return (
//     <div
//       className={`dark:bg-secondary rounded-lg border border-l-4 border-gray-200 border-l-blue-400 bg-white px-4 py-2.5 transition-all hover:shadow-md dark:border-gray-600  ${isDragging ? 'opacity-50' : ''}`}

//       ref={setNodeRef} style={dragStyle}
//     >
//       <div className="flex items-center justify-between">
//         <div className="flex flex-1 items-center space-x-4">
//           <div className="flex-1">
//             <div className="flex items-center space-x-3">
//               <h3 className="text-md font-semibold text-gray-900 dark:text-white">{category?.title || ''}</h3>
//             </div>

//             <p className="mt-0 text-sm text-gray-600 dark:text-white">{category?.type === 'User' ? 'Loyalty Club' : category?.type || 'N/A'}</p>
//           </div>
//         </div>

//         <div className="flex space-x-2 items-center">
//           <div
//             {...attributes}
//             {...listeners}
//             className="cursor-grab  rounded p-1 hover:cursor-grabbing hover:bg-gray-100 hover:dark:bg-gray-700"
//           >
//             <GripVertical className="h-4 w-4 text-gray-400" />
//           </div>
//           <Button variant="ghost" size="sm" onClick={() => onEdit(category)} className="h-8 w-8 cursor-pointer p-0">
//             <Edit className="h-5 w-5" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => onDelete(category?._id)}
//             className="h-8 w-8 cursor-pointer p-0 text-red-600 hover:text-red-700"
//           >
//             <Trash2 className="h-5 w-5" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
