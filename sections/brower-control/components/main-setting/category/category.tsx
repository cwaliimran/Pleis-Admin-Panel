'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { useDeleteCustomCategoryMutation, useGetCustomCategoriesQuery } from '@/store/Reducer/custom-categories-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { DraggablePromoItemSkeleton } from '../promo-manager/DraggablePromoItemSkeleton';
import { CategoryCard } from './category-card';
import CategoryModal from './category-modal';
import type { Category } from './types';

type CustomCategoryProps = {
  heading?: string;
  viewAll?: boolean;
  fixLength?: boolean;
};

// Main Category Management Component
export function CategoryManagement({ heading, viewAll, fixLength }: CustomCategoryProps) {
  const router = useRouter();
  const deleteModal = useBoolean();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: apiData, isLoading } = useGetCustomCategoriesQuery({
    page: 0,
    limit: 10,
  });

  // console.log('apiData', apiData?.data);

  useEffect(() => {
    if (apiData?.data) {
      setCategories(apiData.data);
    }
  }, [apiData]);

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

  // const handleDeleteCategory = (id: string) => {
  //   if (confirm('Are you sure you want to delete this category?')) {
  //     setCategories(categories.filter((cat) => cat.id !== id));
  //   }
  // };

  // ------- DELETE CATEGORY ------- //
  const [deleteCategory, { isLoading: deleteLoading }] = useDeleteCustomCategoryMutation();

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
      const res = await deleteCategory(selectedId).unwrap();

      if (res?.error) {
        const errorMessage = getErrorMessage(res.error);
        showError(errorMessage);
        return;
      }

      showSuccess(res?.message || 'Category deleted');
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setSelectedId(null);
      deleteModal.onFalse();
    }
  }, [selectedId, deleteCategory, deleteModal]);

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
            <p className="text-gray-500 dark:text-gray-400">No custom categories available.</p>
          </div>
        ) : (
          (fixLength ? categories.slice(0, 10) : categories).map((category: any) => (
            <CategoryCard key={category?._id} category={category} onEdit={handleEditCategory} onDelete={handleDelete} />
          ))
        )}
      </div>

      {categories?.length > 0 && viewAll && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" onClick={navigateToAllCustomCategory} className="border-gray-300 bg-white px-6 py-2 hover:border-gray-400">
            View All
          </Button>
        </div>
      )}

      <CategoryModal open={isModalOpen} onClose={() => setIsModalOpen(false)} isEdit={modalMode === 'edit'} selectedData={editingCategory} />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Category"
        content="Are you sure you want to delete this category?"
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
