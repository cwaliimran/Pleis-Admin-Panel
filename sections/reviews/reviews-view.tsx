'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import RatingsSummary from '@/components/common/rating-summary';
import { useAuth } from '@/hooks/useAuth';
import { useBoolean } from '@/hooks/useBoolean';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useDeleteReviewMutation, useGetReviewsQuery, useUpdateReviewMutation } from '@/store/Reducer/reviews-api';
import { getErrorMessage } from '@/utils/api';
import { formatDate } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { useCallback, useEffect, useState } from 'react';
import RatingsSummarySkeleton from './components/rating-skelton';
import ReviewEditModal from './edit-review-modal';
import ReviewsTable from './reviews-table';

type ReviewsViewProps = {
  userType: 'super-admin' | 'organizer';
};

const ReviewsView = ({ userType }: ReviewsViewProps) => {
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
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');

  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(1);
  };

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const [deleteReview, { isLoading: deleteLoading }] = useDeleteReviewMutation();
  const [updateReview, { isLoading: updateLoading }] = useUpdateReviewMutation();

  const { companyId } = useCompanySelectionState();

  const { data: apiData, isLoading, isFetching } = useGetReviewsQuery({
    page: page - 1,
    search,
    limit,
    status: status === 'all' ? '' : status,
    date: date ? formatDate(date) : undefined,
    companyOrganizer: companyId || undefined,
    userType: userType,
    sortBy: sortBy || undefined,
    sortOrder: sortOrder || undefined,
  });

  const reviewsStatData = apiData?.meta || {};

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

  const handleEdit = (id: string, review: string) => {
    setSelectedId(id);
    setSelectedRecord(review);
    editModal.onTrue();
    openModal.onTrue();
  };

  const handleUpdate = async (updatedReview: string) => {
    if (!selectedId) {
      showError('No review selected');
      return;
    }
    try {
      const response = await updateReview({ id: selectedId, comment: updatedReview }).unwrap();
      if (response?.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }
      showSuccess(response?.message || 'Review updated successfully');
      editModal.onFalse();
      setSelectedId(null);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleDelete = useCallback(
    (id: string) => {
      if (!id) {
        showError('No review selected');
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
      const response = await deleteReview(selectedId).unwrap();

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
      {isLoading ? (
        <RatingsSummarySkeleton />
      ) : (
        <RatingsSummary
          title="Customer Reviews"
          averageRating={reviewsStatData?.avgRating || 0}
          totalRatings={reviewsStatData?.totalCount || 0}
          distribution={reviewsStatData?.distribution || []}
        />
      )}

      <ReviewsTable
        data={localData}
        meta={meta}
        user={user}
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
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        onResetFilters={() => {
          setStatus('');
          setDate(undefined);
          setSearch('');
          setSortBy('');
          setSortOrder('');
          setPage(1);
        }}
      />

      {editModal.value && (
        <ReviewEditModal
          open={editModal.value}
          onClose={editModal.onFalse}
          defaultReview={selectedRecord}
          onUpdate={handleUpdate}
          loading={updateLoading}
        />
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
