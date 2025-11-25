'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { useGetMembersQuery } from '@/store/Reducer/members-api';
import { useDeletePromotionMutation } from '@/store/Reducer/promotion-api';
import { getErrorMessage } from '@/utils/api';
import { formatDate } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { useCallback, useEffect, useState } from 'react';
import PromotionsModal from './members-modal';
import LoyaltyMembersTable from './members-table';

interface PromotionsViewProps {
  global?: boolean;
  usertype: string;
}

const LoyaltyMembersView = ({ global, usertype }: PromotionsViewProps) => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const selectedCompany = JSON.parse(localStorage.getItem('selectedCompany') || 'null');

  const [deletePromotion, { isLoading: deleteLoading }] = useDeletePromotionMutation();

  const { data: apiData, isLoading } = useGetMembersQuery({
    page: page - 1,
    search,
    limit,
    status: status === 'all' ? '' : status,
    date: date ? formatDate(date) : undefined,
    companyOrganizer: selectedCompany?.value || undefined,
  });

  console.log('apiData', apiData?.data);

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
  const handleEdit = (id: string) => {
    const selectedData = localData?.find((item: any) => item?._id === id);

    if (selectedData) {
      setSelectedId(id);
      setSelectedRecord(selectedData);
      editModal.onTrue();
      openModal.onTrue();
    } else {
      showError('Reward not found');
    }
  };

  const handleDelete = useCallback(
    (id: string) => {
      if (!id) {
        showError('No promotion selected');
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
      const response = await deletePromotion(selectedId).unwrap();

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
      <LoyaltyMembersTable
        data={localData}
        meta={meta}
        usertype={usertype}
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
          global={global}
        />
      )}

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Promotion"
        content="Are you sure you want to delete this promotion?"
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

export default LoyaltyMembersView;
