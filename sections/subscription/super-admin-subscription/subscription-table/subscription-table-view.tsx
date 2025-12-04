'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetPromotionQuery } from '@/store/Reducer/promotion-api';
import { getErrorMessage } from '@/utils/api';
import { formatDate } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { useCallback, useEffect, useState } from 'react';
import SubscriptionTable from './subscription-table';
import SubscriptionModal from '../edit-subscription-modal';

const SubscriptionTableView = () => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [billing, setBilling] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const { companyId: selectedCompany } = useCompanySelectionState();

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
    companyOrganizer: selectedCompany || undefined,
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

  // ------------ EDIT FUNCTION FOR API VERSION ------------
  const handleEdit = (selectedRecord: any) => {
    if (!selectedRecord) {
      showError('No subscription selected');
      return;
    }

    setSelectedRecord(selectedRecord);
    editModal.onTrue();
    openModal.onTrue();
  };

  const handleDelete = useCallback(
    (id: string) => {
      if (!id) {
        showError('No subscription selected');
        return;
      }

      setSelectedId(id);
      deleteModal.onTrue();
    },
    [deleteModal]
  );

  // DELETE CALL
  const onDelete = async () => {
    try {
      showSuccess('Subscription canceled successfully');
      setSelectedId(null);
      deleteModal.onFalse();

      console.log('selectedId', selectedId);
      console.log('selectedRecord', selectedRecord);

      // const response = await deletePromotion({
      //   id: selectedId,
      //   isGlobal: global,
      // }).unwrap();

      // if (response?.error) {
      //   const errorMessage = getErrorMessage(response.error);
      //   showError(errorMessage);
      //   return;
      // }

      // showSuccess(response?.message || 'Deleted successfully');

      // setSelectedId(null);
      // deleteModal.onFalse();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };
  
  return (
    <div>
      <SubscriptionTable
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
        billing={billing}
        onBillingChange={(val) => {
          setBilling(val);
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

      <SubscriptionModal
        open={editModal.value}
        onClose={() => {
          editModal.onFalse();
          setSelectedRecord(null);
        }}
        selectedData={selectedRecord}
      />

      <ConfirmDialog
        open={deleteModal.value}
        title="Cancel subscriptions"
        content="Are you sure you want to delete this subscription?"
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
        isLoading={false}
      />
    </div>
  );
};

export default SubscriptionTableView;
