'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import PaginationControls from '@/components/table/pagination-controls';
import CustomBadge from '@/components/ui/custom-badge';
import { useBoolean } from '@/hooks/useBoolean';
import { useDeleteReservationMutation } from '@/store/Reducer/reservations-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { ChevronDown, Pencil, Trash2 } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import ReservationSkelton from './reservation-skelton';
import { ReservationBodyProps } from './reservation-types';
import UserReservationsList from './user-reservation-list';

const ReservationBody = ({ data, isLoading, meta, onPageChange, limit, organizationId, onEdit }: ReservationBodyProps) => {
  const [expandedReservations, setExpandedReservations] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const deleteModal = useBoolean();

  const [deleteReservation, { isLoading: deleteLoading }] = useDeleteReservationMutation();

  const toggleExpand = (reservationId: string) => {
    setExpandedReservations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reservationId)) newSet.delete(reservationId);
      else newSet.add(reservationId);
      return newSet;
    });
  };

  const conditionType = (method: string) => {
    switch (method) {
      case 'fixedPrice':
        return 'Fixed Price';
      case 'minimumSpendOnLocation':
        return 'Minimum Spend on Location';
      case 'prepayOption':
        return 'Prepay Option';
      case 'noCondition':
        return 'No Condition - Free reservation';
      case 'ticketRequirement':
        return 'Ticket Requirement';
      case 'customText':
        return 'Custom Text Condition';
      default:
        return method;
    }
  };

  const handleDelete = useCallback(
    (id: string) => {
      if (!id) {
        showError('No reservation selected');
        return;
      }

      setSelectedId(id);
      deleteModal.onTrue();
    },
    [deleteModal]
  );

  const onDelete = async () => {
    if (!selectedId) return;

    try {
      const response = await deleteReservation({ id: selectedId }).unwrap();

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'Reservation deleted successfully');
      setSelectedId(null);
      deleteModal.onFalse();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <div className="mt-5">
        <div className="dark:bg-secondary mt-5 flex flex-col rounded-xl border bg-white p-6 shadow">
          <ReservationSkelton count={limit} />
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div className="mt-5 text-center text-xl text-gray-500">No reservations found</div>;
  }

  return (
    <>
      {data.map((reservation) => {
        const isExpanded = expandedReservations.has(reservation._id);

        return (
          <div key={reservation._id} className="dark:bg-secondary mt-5 flex flex-col rounded-xl border bg-white px-6 py-5 shadow">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="mb-3 text-xl font-semibold capitalize">{reservation.reservationType}</h2>
                <div className="flex flex-wrap gap-12">
                  <div>
                    <div className="text-gray-500">Available</div>
                    <div className="text-lg font-semibold">{reservation.availableReservations} tables</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Max Capacity</div>
                    <div className="text-lg font-semibold">{reservation.maxCapacityPerReservation} people</div>
                  </div>
                  <div className="min-w-32">
                    <div className="text-gray-500">Condition</div>
                    <div className="text-lg font-semibold">{conditionType(reservation.conditionType)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Tax</div>
                    <div className="text-lg font-semibold">{reservation.taxPercentage}%</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Bonus Points</div>
                    <div className="text-lg font-semibold">{reservation?.bonusPoints || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">PreOrder</div>
                    <div className="text-lg font-semibold">
                      <CustomBadge variant={reservation?.allowPreOrderMenuItems ? 'success' : 'error'}>
                        {reservation.allowPreOrderMenuItems ? 'Active' : 'Inactive'}
                      </CustomBadge>
                    </div>
                  </div>
                  {reservation.amount !== undefined && (
                    <div>
                      <div className="text-gray-500">Total Price</div>
                      <div className="text-lg font-semibold text-green-600">€{reservation.amount}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-gray-500">Status</div>
                    <CustomBadge variant={reservation?.status === 'active' ? 'success' : 'error'}>{reservation?.status}</CustomBadge>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-x-3">
                <button
                  title="Edit Reservation"
                  type="button"
                  className="cursor-pointer rounded-md p-1.5 transition hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => onEdit?.(reservation)}
                >
                  <Pencil className="text-gray-700 dark:text-gray-200" size={18} />
                </button>

                <button
                  title="Delete Reservation"
                  type="button"
                  className="cursor-pointer text-red-500 transition-colors hover:text-red-700"
                  onClick={() => handleDelete(reservation._id)}
                >
                  <Trash2 size={20} />
                </button>

                <button
                  title="Toggle User Reservations"
                  type="button"
                  className={`cursor-pointer text-black transition-transform duration-300 dark:text-white ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
                  onClick={() => toggleExpand(reservation._id)}
                >
                  <ChevronDown size={28} />
                </button>
              </div>
            </div>

            <div
              className="overflow-hidden transition-all duration-500 ease-in-out"
              style={{ maxHeight: isExpanded ? '2000px' : '0', opacity: isExpanded ? 1 : 0 }}
            >
              {isExpanded && reservation.companyOrganizer && (
                <UserReservationsList
                  reservationId={reservation._id}
                  companyOrganizer={reservation.companyOrganizer}
                  organizationId={organizationId}
                />
              )}
            </div>
          </div>
        );
      })}

      {meta && (
        <PaginationControls
          limit={limit}
          totalPages={meta.totalPages}
          currentPage={meta.currentPage}
          totalRecords={meta.totalRecords}
          onPageChange={onPageChange}
        />
      )}

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Reservation"
        content="Are you sure you want to delete this reservation?"
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
        isLoading={deleteLoading}
      />
    </>
  );
};

export default ReservationBody;
