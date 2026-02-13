'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import PromotionConfirmDialog from '@/components/comfirm-dialog/promotion-confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useDeletePromotionMutation, useGetPromotionQuery } from '@/store/Reducer/promotion-api';
import { getErrorMessage } from '@/utils/api';
import { formatDate } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import PromotionsModal from './promotions-modal';
import PromotionsTable from './promotions-table';

const OrganizerPromotionsView = () => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();
  
  const recurringDeleteModal = useBoolean();

  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [deleteScope, setDeleteScope] = useState<string | null>(null);

  const { companyId: selectedCompany } = useCompanySelectionState();

  const [deletePromotion, { isLoading: deleteLoading }] = useDeletePromotionMutation();

  const {
    data: apiData,
    isLoading,
    isFetching,
  } = useGetPromotionQuery({
    page: page - 1,
    search,
    limit,
    status: status === 'all' ? '' : status,
    date: date ? formatDate(date) : undefined,
  });

  const [localData, setLocalData] = useState<any[]>([]);

  const [meta, setMeta] = useState<any>({
    currentPage: page,
    totalPages: 1,
    totalRecords: 0,
    limit,
  });

  useEffect(() => {
    if (apiData?.data) {
      setLocalData(apiData.data);
      setMeta(
        apiData.meta || {
          currentPage: page,
          totalPages: 1,
          totalRecords: 0,
          limit,
        }
      );
    }
  }, [apiData, page, limit]);

  const handleCreateNew = () => {
    setSelectedRecord(null);
    setSelectedId(null);
    editModal.onFalse();
    openModal.onTrue();
  };

  // ------------ EDIT FUNCTION FOR API VERSION ------------
  const handleEdit = (id: string) => {
    const selectedData = localData?.find((item: any) => item?._id === id);

    if (selectedData) {
      setSelectedId(id);
      setSelectedRecord(selectedData);
      editModal.onTrue();
      openModal.onTrue();
    } else {
      showError('Promotion not found');
    }
  };

  const handleDelete = useCallback(
    (data: any) => {
      if (!data) {
        showError('No promotion selected');
        return;
      }

      if (data?.recurringMeta?.parentPromotion === null) {
        setSelectedId(data?._id);
        deleteModal.onTrue();
      } else {
        setSelectedId(data?._id);
        recurringDeleteModal.onTrue();
      }
    },
    [recurringDeleteModal, deleteModal]
  );

  // DELETE CALL
  const onDelete = async (scope?: string) => {
    try {
      if (scope) {
        setDeleteScope(scope);
      }

      const response = await deletePromotion({ id: selectedId, ...(scope && { scope }) }).unwrap();

      if (response?.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      showSuccess(response?.message || 'Deleted successfully');

      setSelectedId(null);
      setDeleteScope(null);
      deleteModal.onFalse();
      recurringDeleteModal.onFalse();
    } catch (error) {
      showError(getErrorMessage(error));
      setDeleteScope(null);
    }
  };

  return (
    <div>
      <div className="mt-3 flex w-full items-center justify-end md:mt-0">
        <Button className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white" onClick={handleCreateNew}>
          <Plus />
          Create Promotion
        </Button>
      </div>

      <PromotionsTable
        data={localData}
        meta={meta}
        loading={isLoading || isFetching}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
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
        page={page}
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        date={date}
        onDateChange={(val) => {
          setDate(val);
          setPage(1);
        }}
        onResetFilters={() => {
          setStatus('');
          setDate(undefined);
          setSearch('');
          setPage(1);
        }}
      />

      {openModal.value && (
        <PromotionsModal
          open={openModal.value}
          onClose={openModal.onFalse}
          isEdit={editModal.value}
          selectedData={selectedRecord}
          selectedCompany={selectedCompany}
          global={false}
        />
      )}

      <ConfirmDialog
        open={deleteModal.value}
        title={`Delete Promotion`}
        content={`Are you sure you want to delete this promotion?`}
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
        isLoading={deleteLoading}
      />

      {recurringDeleteModal.value && (
        <PromotionConfirmDialog
          open={recurringDeleteModal.value}
          title="Delete Promotion"
          content="Are you sure you want to delete this promotion?"
          onClose={recurringDeleteModal.onFalse}
          onConfirm={onDelete}
          isLoading={deleteLoading && deleteScope === 'single'}
          isLoadingForAllEventsDelete={deleteLoading && deleteScope === 'future'}
        />
      )}
    </div>
  );
};

export default OrganizerPromotionsView;
