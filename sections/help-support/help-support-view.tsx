'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { useDeleteHelpSupportMutation, useGetHelpSupportQuery } from '@/store/Reducer/help-support-api';
import { getErrorMessage } from '@/utils/api';
import { formatDate } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { useCallback, useEffect, useState } from 'react';
import HelpSupportTable from './help-support-table';
import ReplySupportModal from './reply-support-modal';

const HelpSupportView = () => {
  const deleteModal = useBoolean();

  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [deleteSupportRequest, { isLoading: deleteLoading }] = useDeleteHelpSupportMutation();

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyOpen, setReplyOpen] = useState(false);

  const handleReply = (ticket: any) => {
    setSelectedTicket(ticket);
    setReplyOpen(true);
  };

  const { data: apiData, isLoading } = useGetHelpSupportQuery({
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

  const handleDelete = useCallback(
    (id: string) => {
      if (!id) {
        showError('No status selected');
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
      const response = await deleteSupportRequest(selectedId).unwrap();

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
      <HelpSupportTable
        data={localData}
        meta={meta}
        loading={isLoading}
        handleDelete={handleDelete}
        handleEdit={handleReply}
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

      <ReplySupportModal open={replyOpen} ticket={selectedTicket} onClose={() => setReplyOpen(false)} />

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Support Ticket"
        content="Are you sure you want to delete this support ticket?"
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

export default HelpSupportView;
