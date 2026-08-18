'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { useGetItemsCategoryQuery } from '@/store/Reducer/items-category-api';
import {
  useDeleteMenuSubcategoryMutation,
  useGetMenuSubcategoriesQuery,
  useUpdateMenuSubcategoryOrderMutation,
} from '@/store/Reducer/menu-subcategories-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { arrayMove } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import SubcategoryModal from './presetSubcategories-modal';
import MenuSubcategoryTable from './presetSubcategories-table';
import { CategoryOption, MenuSubcategoryRecord } from './types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- userType kept for the route contract; sub-categories endpoints are admin-only for now
const PresetSubcategoriesView = ({ userType }: { userType: 'organizer' | 'super-admin' }) => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');

  const { data, isLoading, isFetching } = useGetMenuSubcategoriesQuery({
    page: page - 1,
    limit,
    search,
    status: !status || status === 'all' ? undefined : status,
    category: !categoryId || categoryId === 'all' ? undefined : categoryId,
  });

  const { data: categoriesData } = useGetItemsCategoryQuery({ page: 0, limit: 1000, search: '' });

  const [deleteSubcategory, { isLoading: deleteLoading }] = useDeleteMenuSubcategoryMutation();
  const [updateSubcategoryOrder] = useUpdateMenuSubcategoryOrderMutation();

  const serverSubcategories: MenuSubcategoryRecord[] = data?.data || [];
  const meta = data?.meta || { currentPage: page, totalPages: 1, totalRecords: 0, limit };
  const categories: CategoryOption[] = categoriesData?.data || [];

  // Holds the dragged-to order so the row stays where the user dropped it while the PUT and the
  // refetch it invalidates run in the background. Cleared the moment fresh server data lands.
  const [optimisticOrder, setOptimisticOrder] = useState<MenuSubcategoryRecord[] | null>(null);
  const subcategories = optimisticOrder ?? serverSubcategories;

  useEffect(() => {
    setOptimisticOrder(null);
  }, [data]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MenuSubcategoryRecord | null>(null);

  const hasActiveFilters = !!search.trim() || (!!status && status !== 'all') || (!!categoryId && categoryId !== 'all');

  // Pagination is fine to reorder within — the page offset below maps a row index back to its real
  // order. Filters are not: the visible rows aren't contiguous, so any index we compute is wrong.
  const reorderDisabled = hasActiveFilters;

  const handleCreateNew = () => {
    setSelectedRecord(null);
    setSelectedId(null);
    editModal.onFalse();
    openModal.onTrue();
  };

  const handleEdit = (id: string) => {
    const selectedData = subcategories.find((item) => item._id === id) || null;
    setSelectedId(id);
    setSelectedRecord(selectedData);
    editModal.onTrue();
    openModal.onTrue();
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    deleteModal.onTrue();
  };

  const onDelete = async () => {
    try {
      await deleteSubcategory(selectedId).unwrap();
      showSuccess('Subcategory deleted successfully');
      setSelectedId(null);
      deleteModal.onFalse();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleReorder = async (activeId: string, overId: string) => {
    const activeIndex = subcategories.findIndex((item) => item._id === activeId);
    const overIndex = subcategories.findIndex((item) => item._id === overId);
    if (activeIndex === -1 || overIndex === -1) return;

    const previousOrder = subcategories;
    setOptimisticOrder(arrayMove(subcategories, activeIndex, overIndex));

    // `order` is global, so the row's position on page N has to be offset by the pages before it.
    const pageOffset = ((meta?.currentPage || page) - 1) * (meta?.limit || limit);

    try {
      await updateSubcategoryOrder({ id: activeId, newOrder: pageOffset + overIndex + 1 }).unwrap();
      showSuccess('Order updated');
    } catch (error) {
      setOptimisticOrder(previousOrder);
      showError(getErrorMessage(error));
    }
  };

  return (
    <div>
      <div className="mt-3 flex w-full items-center justify-end md:mt-0">
        <Button className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white" onClick={handleCreateNew}>
          <Plus />
          Create Subcategory
        </Button>
      </div>

      <MenuSubcategoryTable
        data={subcategories}
        meta={meta}
        categories={categories}
        loading={isLoading || (isFetching && !optimisticOrder)}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleReorder={handleReorder}
        reorderDisabled={reorderDisabled}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
        onSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        search={search}
        limit={limit}
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        categoryId={categoryId}
        onCategoryChange={(val) => {
          setCategoryId(val);
          setPage(1);
        }}
        onResetFilters={() => {
          setStatus('');
          setCategoryId('');
          setSearch('');
          setPage(1);
        }}
      />

      {openModal.value && (
        <SubcategoryModal
          open={openModal.value}
          onClose={openModal.onFalse}
          isEdit={editModal.value}
          selectedData={selectedRecord}
          nextOrder={(meta?.totalRecords || 0) + 1}
        />
      )}

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Subcategory"
        content="Are you sure you want to delete this subcategory?"
        isLoading={deleteLoading}
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default PresetSubcategoriesView;
