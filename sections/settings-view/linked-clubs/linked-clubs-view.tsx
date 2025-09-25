'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { useBoolean } from '@/hooks/useBoolean';
import {
  useDeleteVenueMutation,
  useGetVenuesQuery,
} from '@/store/Reducer/venue';
import { getErrorMessage } from '@/utils/api';
import { formatDate } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { useCallback, useEffect, useState } from 'react';
import LinkedClubsTable from './linked-clubs-table';

interface Props {
  tableName?: string;
}

const LinkedClubsView = ({ tableName }: Props) => {
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

  const [deleteVenue, { isLoading: deleteLoading }] = useDeleteVenueMutation();

  const { data: apiData, isLoading } = useGetVenuesQuery({
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

  // ------------ EDIT FUNCTION FOR STATIC ------------
  const handleEdit = (id: string) => {
    console.log('id', id);
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
      <LinkedClubsTable
        data={localData}
        tableName={tableName}
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

      <ConfirmDialog
        open={deleteModal.value}
        title={`Remove ${tableName === 'Incoming Requests' ? 'Incoming Request' : 'Club'}`}
        content={`Are you sure you want to remove this ${tableName === 'Incoming Requests' ? 'incoming request' : 'club'}?`}
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

export default LinkedClubsView;
