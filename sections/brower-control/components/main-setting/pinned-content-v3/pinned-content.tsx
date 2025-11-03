'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { useDeletePinnedContentMutation, useGetPinnedContentQuery } from '@/store/Reducer/pinned-content-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { DraggablePromoItemSkeleton } from '../promo-manager/DraggablePromoItemSkeleton';
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

  const { data: apiData, isLoading } = useGetPinnedContentQuery({
    page: 0,
    limit: 10,
  });

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
          <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-400">No categories available. Create your first category!</p>
          </div>
        ) : (
          categories.map((category: any) => (
            <CategoryCard key={category?._id} category={category} onEdit={handleEditCategory} onDelete={handleDelete} />
          ))
        )}
      </div>

      {!isLoading && categories.length === 0 && (
        <div className="py-12 text-center">
          <p className="mb-4 text-gray-500 dark:text-white">No pinned content created yet</p>
          <Button onClick={handleCreateCategory} variant="outline">
            Create Your First Pinned Content
          </Button>
        </div>
      )}

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
