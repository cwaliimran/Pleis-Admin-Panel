'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetLoyaltyTransactionsQuery } from '@/store/Reducer/loyalty-transactions-api';
import { useDeleteVenueMutation } from '@/store/Reducer/venue';
import { getErrorMessage } from '@/utils/api';
import { formatDate } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { useCallback, useEffect, useState } from 'react';
import TransactionModal from './transactions-modal';
import TransactionsTable from './transactions-table';

const LoyaltyTransactionsView = () => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [transactionType, setTransactionType] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const { companyId } = useCompanySelectionState();

  const [deleteVenue, { isLoading: deleteLoading }] = useDeleteVenueMutation();

  const { data: apiData, isLoading } = useGetLoyaltyTransactionsQuery({
    page: page - 1,
    search,
    limit,
    status: status === 'all' ? '' : status,
    date: date ? formatDate(date) : undefined,
    companyOrganizer: companyId || undefined,
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

  // const handleCreateNew = () => {
  //   setSelectedRecord(null);
  //   setSelectedId(null);
  //   editModal.onFalse();
  //   openModal.onTrue();
  // };

  // ------------ EDIT FUNCTION FOR STATIC ------------
  const handleEdit = (id: string) => {
    const selectedData = localData?.find((item: any) => item?._id === id);

    console.log('id', id);
    setSelectedId(id);
    setSelectedRecord(selectedData);
    openModal.onTrue();
    editModal.onTrue();
  };

  // ------------ EDIT FUNCTION FOR API VERSION ------------
  // const handleEdit = (id: string) => {
  //   const selectedData = localData?.find((item: any) => item?._id === id);

  //   if (selectedData) {
  //     setSelectedId(id);
  //     setSelectedRecord(selectedData);
  //     editModal.onTrue();
  //     openModal.onTrue();
  //   } else {
  //     showError('Reward not found');
  //   }
  // };

  const handleDelete = useCallback(
    (id: string) => {
      if (!id) {
        showError('No challenge selected');
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
      const response = await deleteVenue(selectedId).unwrap();

      if (response?.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      showSuccess(response?.message || 'Deleted successfully');

      setSelectedId(null);
      deleteModal.onFalse();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  return (
    <div>
      <TransactionsTable
        data={localData}
        meta={meta}
        loading={isLoading}
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
        transactionType={transactionType}
        onTransactionTypeChange={(val: any) => {
          setTransactionType(val);
          setPage(1);
        }}
        onStatusChange={(val: any) => {
          setStatus(val);
          setPage(1);
        }}
        date={date}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={(val: any) => {
          setStartDate(val);
          setPage(1);
        }}
        onEndDateChange={(val: any) => {
          setEndDate(val);
          setPage(1);
        }}
        onResetFilters={() => {
          setStatus('');
          setDate(undefined);
          setSearch('');
          setPage(1);
        }}
      />

      <TransactionModal open={openModal.value} onClose={openModal.onFalse} selectedData={selectedRecord} />

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Transactions"
        content="Are you sure you want to delete this transactions?"
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default LoyaltyTransactionsView;
