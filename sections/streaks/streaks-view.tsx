'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import {
  useDeleteVenueMutation,
  useGetVenuesQuery,
} from '@/store/Reducer/venue';
import { getErrorMessage } from '@/utils/api';
import { formatDate } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import StreaksTable from './streaks-table';
import StreaksModal from './streaks-modal';

interface StreaksViewProps {
  global?: boolean;
}

const StreaksView = ({ global }: StreaksViewProps) => {
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

  const handleCreateNew = () => {
    setSelectedRecord(null);
    setSelectedId(null);
    editModal.onFalse();
    openModal.onTrue();
  };

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
      <div>
        <div className="mt-3 flex w-full items-center justify-end md:mt-0">
          <Button
            className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white"
            onClick={handleCreateNew}
          >
            <Plus />
            Create Streaks
          </Button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 rounded-md md:grid-cols-2">
        {[1, 2, 3, 4].map((data, idx) => (
          <div
            key={idx}
            className="card dark:bg-secondary rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-none"
          >
            <div className="card-body">
              <div className="flex items-center justify-start gap-4">
                <h5 className="flex size-10 items-center justify-center rounded-md bg-gray-800 text-lg font-semibold text-white dark:bg-gray-300 dark:text-black">
                  5
                </h5>

                <div>
                  <h5 className="card-title text-lg font-semibold">
                    Every 5 Visits
                  </h5>
                  <p className="text-md font-medium">150 Points</p>
                  {global && (
                    <span className="text-sm text-gray-500">
                      48 hours expiry
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <StreaksTable
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

      <StreaksModal
        open={openModal.value}
        onClose={openModal.onFalse}
        isEdit={editModal.value}
        selectedData={selectedRecord}
      />

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

export default StreaksView;
