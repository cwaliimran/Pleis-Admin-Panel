'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useBoolean } from '@/hooks/useBoolean';
import { useGetMarketingRequestQuery, useUpdateMarketingRequestMutation } from '@/store/Reducer/marketing-request-api';
import { useDeletePromoCodeMutation } from '@/store/Reducer/promo-codes-api';
import { getErrorMessage } from '@/utils/api';
import { formatDate } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import MarketingRequestModal from './marketing-request-modal';
import MarketingRequestTable from './marketing-request-table';

type MarketingRequestViewProps = {
  userType: 'super-admin' | 'organizer';
};

const MarketingRequestView = ({ userType }: MarketingRequestViewProps) => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();
  const { user } = useAuth();

  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [updateMarketingRequest] = useUpdateMarketingRequestMutation();
  const [deletePromoCode, { isLoading: deleteLoading }] = useDeletePromoCodeMutation();

  const { data: apiData, isLoading } = useGetMarketingRequestQuery({
    page: page - 1,
    search,
    limit,
    status: status === 'all' ? '' : status,
    date: date ? formatDate(date) : undefined,
    userType,
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
    setSelectedId(null);
    editModal.onFalse();
    openModal.onTrue();
  };

  // ------------ EDIT FUNCTION FOR API VERSION ------------
  const handleEdit = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const response = await updateMarketingRequest({ id, status }).unwrap();

      if (response?.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      showSuccess(response?.message || 'Updated successfully');
      setSelectedId(null);
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = useCallback(
    (id: string) => {
      if (!id) {
        showError('No promo code selected');
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
      const response = await deletePromoCode(selectedId).unwrap();

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
      {user?.accountState?.userType !== 'admin' && (
        <div className="mt-3 flex w-full items-center justify-end md:mt-0">
          <Button className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white" onClick={handleCreateNew}>
            <Plus />
            Create Request
          </Button>
        </div>
      )}

      <MarketingRequestTable
        data={localData}
        meta={meta}
        user={user}
        loading={isLoading}
        updatingId={updatingId}
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

      {openModal.value && <MarketingRequestModal open={openModal.value} onClose={openModal.onFalse} />}

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Marketing Request"
        content="Are you sure you want to delete this marketing request?"
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

export default MarketingRequestView;
