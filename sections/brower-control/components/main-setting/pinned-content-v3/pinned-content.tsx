'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { CustomDndProvider } from '@/components/providers/DndProvider';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { useDeletePinnedContentMutation, useGetPinnedContentQuery, useReorderPinnedContentMutation } from '@/store/Reducer/pinned-content-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { DraggablePromoItemSkeleton } from '../promo-manager/DraggablePromoItemSkeleton';
import { ReorderPayload } from '../promo-manager/types';
import { CategoryCard } from './pinned-content-card';
import CategoryModal from './pinned-content-modal';
import type { Category } from './types';

type CustomCategoryProps = {
  heading?: string;
};

export function PinnedContentV3({ heading }: CustomCategoryProps) {
  const deleteModal = useBoolean();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [activeCategory, setActiveCategory] = useState<{} | null>(null);

  const { data: apiData, isLoading } = useGetPinnedContentQuery({
    page: 0,
    limit: 10,
  });

  const [reorder] = useReorderPinnedContentMutation();

  useEffect(() => {
    if (apiData?.data) {
      setCategories(apiData.data);
    }
  }, [apiData]);

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

  // const handleDeleteCategory = (id: string) => {
  //   if (confirm('Are you sure you want to delete this category?')) {
  //     setCategories(categories.filter((cat) => cat.id !== id));
  //   }
  // };

  // ------- DELETE PINNED CONTENT ------- //
  const [deletePinnedContent, { isLoading: deleteLoading }] = useDeletePinnedContentMutation();

  const handleDelete = useCallback(
    (id: string) => {
      setSelectedId(id);
      deleteModal.onTrue();
    },
    [deleteModal]
  );

  const onDelete = useCallback(async () => {
    if (!selectedId) return;

    try {
      const response = await deletePinnedContent(selectedId).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      showSuccess(response?.message || 'Pinned content deleted successfully.');
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setSelectedId(null);
      deleteModal.onFalse();
    }
  }, [selectedId, deletePinnedContent, deleteModal]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const draggedCategory: any = categories.find((category: any) => category._id === active.id);

      setActiveCategory({
        _id: draggedCategory?._id,
        object: {
          title: draggedCategory?.filter?.title,
          _id: draggedCategory?.filter?._id,
        },
        type: draggedCategory?.filterType,
        contentType: draggedCategory?.contentType,
        status: draggedCategory?.status,
      });
    },
    [categories]
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveCategory(null);

      if (!over || active.id === over.id) return;

      const activeIndex = categories.findIndex((category: any) => category._id === active.id);
      const overIndex = categories.findIndex((category: any) => category._id === over.id);

      if (activeIndex === -1 || overIndex === -1) return;

      const previousOrder = activeIndex + 1;
      const newOrder = overIndex + 1;

      const reorderedArray = arrayMove(categories, activeIndex, overIndex);
      const updatedCategories = reorderedArray.map((category, index) => ({
        ...category,
        order: index + 1,
      }));
      setCategories(updatedCategories);

      try {
        const payload: ReorderPayload = {
          movedId: (categories as any)?.[activeIndex]?._id,
          previousOrder,
          newOrder,
        };

        const response = await reorder(payload).unwrap();

        if (response?.error) {
          setCategories(categories);
          showError(getErrorMessage(response.error));
          return;
        }

        showSuccess(response?.message || 'Reordered successfully');
      } catch (error) {
        setCategories(categories);
        showError(getErrorMessage(error));
      }
    },
    [categories, reorder]
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{heading}</h1>

        <Button onClick={handleCreateCategory} className="bg-primary hover:bg-primary/90 size-10 cursor-pointer rounded-full text-white">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <DraggablePromoItemSkeleton key={i} />)
        ) : categories.length === 0 ? (
          <div className="flex min-h-50 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-400">No pinned content available.</p>
          </div>
        ) : (
          <CustomDndProvider
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            overlay={activeCategory ? <CategoryCard category={activeCategory} onEdit={() => {}} onDelete={() => {}} isOverlay={true} /> : null}
          >
            {categories.map((category: any) => (
              <CategoryCard
                key={category?._id}
                category={{
                  _id: category?._id,
                  object: {
                    title: category?.filter?.title,
                    _id: category?.filter?._id,
                  },
                  type: category?.filterType,
                  contentType: category?.contentType,
                  status: category?.status, 
                }}
                onEdit={handleEditCategory}
                onDelete={handleDelete}
              />
            ))}
          </CustomDndProvider>
        )}
      </div>

      <CategoryModal open={isModalOpen} onClose={() => setIsModalOpen(false)} isEdit={modalMode === 'edit'} selectedData={editingCategory} />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Pinned Content"
        content="Are you sure you want to delete this pinned content? This action cannot be undone."
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
        isLoading={deleteLoading}
      />
    </div>
  );
}
