'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { useAuth } from '@/hooks/useAuth';
import { useBoolean } from '@/hooks/useBoolean';
import { useDeletePromoCodeMutation, useGetPromoCodesQuery } from '@/store/Reducer/promo-codes-api';
import { getErrorMessage } from '@/utils/api';
import { formatDate } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { useCallback, useEffect, useState } from 'react';
import ReviewEditModal from './edit-review-modal';
import ReviewsTable from './reviews-table';
import RatingsSummary from '@/components/common/rating-summary';

const ReviewsView = () => {
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
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const [deletePromoCode, { isLoading: deleteLoading }] = useDeletePromoCodeMutation();

  const {
    data: apiData,
    isLoading,
    // refetch,
  } = useGetPromoCodesQuery({
    page: page - 1,
    search,
    limit,
    status: status === 'all' ? '' : status,
    date: date ? formatDate(date) : undefined,
  });

  console.log('apiData', apiData);

  // useEffect(() => {
  //   refetch();
  // }, [selectedCompany, refetch]);

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
  const handleEdit = (id: string, review: string) => {
    setSelectedId(id);
    setSelectedRecord(review);
    editModal.onTrue();
    openModal.onTrue();
  };

  const handleUpdate = async (updatedReview: string) => {
    console.log('updatedReview', updatedReview);
    editModal.onFalse();
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
      <RatingsSummary
        title="Customer Reviews"
        averageRating={4.5}
        totalRatings={24000}
        distribution={[
          { stars: 5, count: 20000, percentage: 83 },
          { stars: 4, count: 2000, percentage: 8 },
          { stars: 3, count: 1000, percentage: 4 },
          { stars: 2, count: 500, percentage: 2 },
          { stars: 1, count: 500, percentage: 3 },
        ]}
      />

      <ReviewsTable
        data={localData}
        meta={meta}
        user={user}
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

      {editModal.value && (
        <ReviewEditModal open={editModal.value} onClose={editModal.onFalse} defaultReview={selectedRecord} onUpdate={handleUpdate} />
      )}

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Review"
        content="Are you sure you want to delete this review?"
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

export default ReviewsView;
