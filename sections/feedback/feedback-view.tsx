'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import RatingsSummary from '@/components/common/rating-summary';
import { useAuth } from '@/hooks/useAuth';
import { useBoolean } from '@/hooks/useBoolean';
import { useDeleteReviewMutation, useUpdateReviewMutation } from '@/store/Reducer/reviews-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { useCallback, useEffect, useState } from 'react';
import RatingsSummarySkeleton from './components/rating-skelton';
import ReviewEditModal from './edit-review-modal';
import ReviewsTable from './reviews-table';
import { useGeteventFeedbackByIdQuery } from '@/store/Reducer/events';

type ReviewsViewProps = {
  id?: any;
  feedbackEnabled?: boolean;
  onRequestFeedback?: () => void;
  feedbackLoading?: boolean;
  isEventEnded?: boolean;
};

const FeedbackView = ({ id, feedbackEnabled = false, onRequestFeedback, feedbackLoading = false, isEventEnded = false }: ReviewsViewProps) => {
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

  const [deleteReview, { isLoading: deleteLoading }] = useDeleteReviewMutation();
  const [updateReview, { isLoading: updateLoading }] = useUpdateReviewMutation();

  const { data: apiData, isLoading } = useGeteventFeedbackByIdQuery({ id, page: page - 1, search, limit });

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

  // Show request feedback prompt if feedback is not enabled
  if (!feedbackEnabled) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-md text-center">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          {!isEventEnded ? (
            <>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Event Has Not Ended Yet</h3>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">You can request feedback from attendees once the event has ended.</p>
            </>
          ) : (
            <>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">No Feedback Requested Yet</h3>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                Request feedback from attendees to gather valuable insights about your event.
              </p>
              {onRequestFeedback && (
                <button
                  onClick={onRequestFeedback}
                  disabled={feedbackLoading}
                  className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-3xl px-6 py-2.5 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {feedbackLoading ? (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : null}
                  Request Feedback
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {isLoading ? (
        <RatingsSummarySkeleton />
      ) : (
        <RatingsSummary
          title="Feedback Summary"
          averageRating={reviewsStatData?.avgRating || 0}
          totalRatings={reviewsStatData?.totalCount || 0}
          distribution={reviewsStatData?.distribution || []}
        />
      )}

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
        title="Delete Feedback"
        content="Are you sure you want to delete this feedback?"
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

export default FeedbackView;
