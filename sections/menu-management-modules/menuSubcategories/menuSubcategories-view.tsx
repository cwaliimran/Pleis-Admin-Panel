'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import {
  useDeleteMenuItemSubcategoryMutation,
  useGetMenuItemSubcategoriesQuery,
  useLazyGetMenuItemSubcategoriesQuery,
  useLazyGetMenuItemSubcategoryItemsQuery,
  useUpdateMenuItemSubcategoryOrderMutation,
} from '@/store/Reducer/menu-item-subcategories-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { arrayMove } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import SubcategoryModal from './menuSubcategories-modal';
import MenuSubcategoryTable from './menuSubcategories-table';
import SubcategoryTransferModal, { TRANSFER_TARGET_QUERY_ARGS } from './menuSubcategories-transfer-modal';
import { MenuSubcategoryRecord } from './types';

const MenuSubcategoriesView = ({ userType }: { userType: 'organizer' | 'super-admin' }) => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();
  const transferModal = useBoolean();

  const { companyId } = useCompanySelectionState();
  const scopedCompanyId = userType === 'super-admin' ? companyId : undefined;
  const companySkip = userType === 'super-admin' && !companyId;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');

  const { data, isLoading, isFetching } = useGetMenuItemSubcategoriesQuery(
    {
      page: page - 1,
      limit,
      search,
      status: !status || status === 'all' ? undefined : status,
      companyOrganizer: scopedCompanyId || undefined,
    },
    { skip: companySkip }
  );

  const [deleteSubcategory, { isLoading: deleteLoading }] = useDeleteMenuItemSubcategoryMutation();
  const [updateSubcategoryOrder] = useUpdateMenuItemSubcategoryOrderMutation();
  const [fetchSubcategoryItems] = useLazyGetMenuItemSubcategoryItemsQuery();
  const [fetchSubcategories] = useLazyGetMenuItemSubcategoriesQuery();
  const [checkingId, setCheckingId] = useState<string | null>(null);

  const serverSubcategories: MenuSubcategoryRecord[] = data?.data || [];
  const meta = data?.meta || { currentPage: page, totalPages: 1, totalRecords: 0, limit };

  // Holds the dragged-to order so the row stays where the user dropped it while the PUT and the
  // refetch it invalidates run in the background. Cleared the moment fresh server data lands.
  const [optimisticOrder, setOptimisticOrder] = useState<MenuSubcategoryRecord[] | null>(null);
  const subcategories = optimisticOrder ?? serverSubcategories;

  useEffect(() => {
    setOptimisticOrder(null);
  }, [data]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MenuSubcategoryRecord | null>(null);

  const hasActiveFilters = !!search.trim() || (!!status && status !== 'all');

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

  // A subcategory can only be deleted outright when nothing points at it. If it still holds menu
  // items they have to be moved first, which needs somewhere to move them to.
  const handleDelete = async (id: string) => {
    if (checkingId) return;

    const record = subcategories.find((item) => item._id === id) || null;
    setSelectedId(id);
    setSelectedRecord(record);
    setCheckingId(id);

    try {
      const items = await fetchSubcategoryItems({ subCategory: id, page: 0, limit: 1 }).unwrap();
      const itemCount = items?.meta?.totalRecords ?? items?.data?.length ?? 0;

      if (itemCount === 0) {
        deleteModal.onTrue();
        return;
      }

      // Same args the transfer modal's target dropdown uses, so both share one cache entry and the
      // list is fetched once rather than per consumer.
      const actives = await fetchSubcategories(TRANSFER_TARGET_QUERY_ARGS(scopedCompanyId)).unwrap();
      const hasTarget = (actives?.data || []).some((item: MenuSubcategoryRecord) => item._id !== id);

      if (!hasTarget) {
        showError('Create another active subcategory first, so these menu items have somewhere to move to.');
        return;
      }

      transferModal.onTrue();
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setCheckingId(null);
    }
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
        loading={isLoading || (isFetching && !optimisticOrder)}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleReorder={handleReorder}
        reorderDisabled={reorderDisabled}
        checkingId={checkingId}
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
        onResetFilters={() => {
          setStatus('');
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
          companyId={scopedCompanyId}
          userType={userType}
          nextOrder={(meta?.totalRecords || 0) + 1}
        />
      )}

      {transferModal.value && (
        <SubcategoryTransferModal
          open={transferModal.value}
          onClose={transferModal.onFalse}
          subcategory={selectedRecord}
          companyId={scopedCompanyId}
          userType={userType}
          onTransferred={() => {
            setSelectedId(null);
            setSelectedRecord(null);
          }}
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

export default MenuSubcategoriesView;
