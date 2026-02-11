'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import QueryDialog from '@/components/comfirm-dialog/query-dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useDeleteClubMutation, useGetAllClubsListQuery, useUpdateRequestMutation } from '@/store/Reducer/loyalty-club-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { useEffect, useState } from 'react';
import ClubsTable from './clubs-table';
import { ClubsViewProps } from './types';

const ClubsView = ({ title, type }: ClubsViewProps) => {
  const confirmModal = useBoolean();
  const rejectModal = useBoolean();
  const unLinkClub = useBoolean();

  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { companyId } = useCompanySelectionState();

  const [updateRequest, { isLoading: updateLoading }] = useUpdateRequestMutation();
  const [deleteClub, { isLoading: deleteLoading }] = useDeleteClubMutation();

  const {
    data: apiData,
    isLoading,
    isFetching,
  } = useGetAllClubsListQuery({
    page: page - 1,
    limit: 10000,
    status: type ? type : undefined,
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

  const handleAcceptRequest = (id: string) => {
    setSelectedId(id);
    confirmModal.onTrue();
  };

  const handleRejectRequest = (id: string) => {
    setSelectedId(id);
    rejectModal.onTrue();
  };

  const handleUnLinkClub = (id: string) => {
    setSelectedId(id);
    unLinkClub.onTrue();
  };

  const handleUpdateRequest = async (status: string) => {
    try {
      const payload = {
        status: status,
        companyOrganizer: companyId || undefined,
        id: selectedId,
      };

      const response = await updateRequest(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'Loyalty club linked successfully');

      rejectModal.onFalse();
      confirmModal.onFalse();
      setSelectedId(null);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) {
      showError('No club selected');
      return;
    }

    try {
      const response = await deleteClub(selectedId).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'Club unlinked successfully');
      unLinkClub.onFalse();
      setSelectedId(null);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  return (
    <div>
      <ClubsTable
        data={localData}
        title={title}
        type={type}
        meta={meta}
        loading={isLoading || isFetching}
        handleAcceptRequest={handleAcceptRequest}
        handleRejectRequest={handleRejectRequest}
        handleUnLinkClub={handleUnLinkClub}
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

      {/* ----------- ACCEPT INCOMING REQUEST ----------- */}
      <QueryDialog
        open={confirmModal.value}
        title="Accept Incoming Request"
        content="Are you sure you want to accept this incoming request?"
        onClose={confirmModal.onFalse}
        onConfirm={() => handleUpdateRequest('accepted')}
        isLoading={updateLoading}
        btnClassName="bg-green-700 hover:bg-green-800 text-white"
      />

      {/* ----------- REJECT INCOMING REQUEST ----------- */}
      <ConfirmDialog
        open={rejectModal.value}
        title="Remove Incoming Request"
        content="Are you sure you want to remove this incoming request?"
        onClose={() => {
          rejectModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={() => handleUpdateRequest('rejected')}
        isLoading={updateLoading}
      />

      {/* ----------- UNLINK CLUB ----------- */}
      <ConfirmDialog
        open={unLinkClub.value}
        title="Unlink Club"
        content="Are you sure you want to unlink this club?"
        onClose={() => {
          unLinkClub.onFalse();
          setSelectedId(null);
        }}
        onConfirm={handleDelete}
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default ClubsView;
