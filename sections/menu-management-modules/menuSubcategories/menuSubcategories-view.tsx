'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { arrayMove } from '@dnd-kit/sortable';
import { showSuccess } from '@/utils/toast';
import { formatDate } from '@/utils/format-time';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { mockCategories, mockSubcategories } from './data';
import SubcategoryModal from './menuSubcategories-modal';
import MenuSubcategoryTable from './menuSubcategories-table';
import { MenuSubcategoryRecord, SubcategoryFormValues } from './types';

let nextSubcategoryId = mockSubcategories.length + 1;

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- userType kept for the route contract; will scope mock data once the v2 API lands
const MenuSubcategoriesView = ({ userType }: { userType: 'organizer' | 'super-admin' }) => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  // TODO(v2-api): replace this local state with a real query once the backend endpoint is ready.
  const [subcategories, setSubcategories] = useState<MenuSubcategoryRecord[]>([...mockSubcategories].sort((a, b) => a.sortOrder - b.sortOrder));

  const categories = mockCategories;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MenuSubcategoryRecord | null>(null);

  const hasActiveFilters = !!search.trim() || (!!status && status !== 'all') || (!!categoryId && categoryId !== 'all');

  const filteredSubcategories = useMemo(() => {
    let result = [...subcategories];

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter((item) => item.title.toLowerCase().includes(term));
    }

    if (status && status !== 'all') {
      result = result.filter((item) => item.status === status);
    }

    if (categoryId && categoryId !== 'all') {
      result = result.filter((item) => item.categoryId === categoryId);
    }

    return result;
  }, [subcategories, search, status, categoryId]);

  const totalRecords = filteredSubcategories.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));
  const paginatedSubcategories = filteredSubcategories.slice((page - 1) * limit, page * limit);

  // Manual drag-and-drop reordering only makes sense on the full, unfiltered, single-page list —
  // reordering a filtered/paginated subset would silently scramble the real order underneath it.
  const reorderDisabled = hasActiveFilters || totalPages > 1;

  const meta = {
    currentPage: page,
    totalPages,
    totalRecords,
    limit,
  };

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

  const onDelete = () => {
    setSubcategories((prev) => prev.filter((item) => item._id !== selectedId));
    showSuccess('Subcategory deleted successfully');
    setSelectedId(null);
    deleteModal.onFalse();
  };

  const handleReorder = (activeId: string, overId: string) => {
    setSubcategories((prev) => {
      const activeIndex = prev.findIndex((item) => item._id === activeId);
      const overIndex = prev.findIndex((item) => item._id === overId);
      if (activeIndex === -1 || overIndex === -1) return prev;

      const reordered = arrayMove(prev, activeIndex, overIndex);
      return reordered.map((item, index) => ({ ...item, sortOrder: index + 1 }));
    });
    showSuccess('Order updated');
  };

  const onSubcategorySubmit = (values: SubcategoryFormValues) => {
    if (editModal.value && selectedId) {
      setSubcategories((prev) =>
        prev.map((item) =>
          item._id === selectedId
            ? { ...item, title: values.title, categoryId: values.categoryId, sortOrder: Number(values.sortOrder), status: values.status }
            : item
        )
      );
      showSuccess('Subcategory updated successfully');
    } else {
      const newSubcategory: MenuSubcategoryRecord = {
        _id: `subcat-new-${nextSubcategoryId++}`,
        title: values.title,
        categoryId: values.categoryId,
        itemsCount: 0,
        sortOrder: Number(values.sortOrder),
        status: 'active',
        createdAt: formatDate(new Date())!,
      };
      setSubcategories((prev) => [...prev, newSubcategory]);
      showSuccess('Subcategory created successfully');
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Menu Subcategories</h2>
          <p className="text-muted-foreground text-sm">Reusable sections shared across all menus of this venue.</p>
        </div>

        <Button className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white" onClick={handleCreateNew}>
          <Plus />
          Create Subcategory
        </Button>
      </div>

      <MenuSubcategoryTable
        data={paginatedSubcategories}
        meta={meta}
        categories={categories}
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
          categories={categories}
          nextSortOrder={subcategories.length + 1}
          onSubmit={onSubcategorySubmit}
        />
      )}

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Subcategory"
        content="Are you sure you want to delete this subcategory?"
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default MenuSubcategoriesView;
