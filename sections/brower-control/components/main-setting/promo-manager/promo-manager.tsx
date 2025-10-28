'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { CustomDndProvider } from '@/components/providers/DndProvider';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import {
  useDeletePromoSectionMutation,
  useGetPromoSectionQuery,
  useReorderPromoSectionMutation,
} from '@/store/Reducer/promo-section-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DraggablePromoItem } from './DraggablePromoItem';
import { DraggablePromoItemSkeleton } from './DraggablePromoItemSkeleton';
import PromoSectionModal from './PromoSectionModal';
import { PromoEvent, ReorderPayload } from './types';

const PromoManager = () => {
  const router = useRouter();
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [promoEvents, setPromoEvents] = useState<any[]>([]);
  const [activePromo, setActivePromo] = useState<PromoEvent | null>(null);
  const [editingPromo, setEditingPromo] = useState<PromoEvent | null>(null);

  const [deletePromo, { isLoading: deletePromoLoading }] =
    useDeletePromoSectionMutation();

  const [reorderPromo, { isLoading: reorderLoading }] =
    useReorderPromoSectionMutation();

  const { data: apiData, isLoading } = useGetPromoSectionQuery({
    page: 0,
    limit: 10,
  });

  // Update local state when API data changes
  useEffect(() => {
    if (apiData?.data) {
      const sortedData = [...apiData.data].sort((a, b) => a.order - b.order);
      setPromoEvents(sortedData);
    }
  }, [apiData]);

  // Handle delete action
  const handleDelete = useCallback(
    (id: string) => {
      if (!id) {
        showError('No promo selected');
        return;
      }

      setSelectedId(id);
      deleteModal.onTrue();
    },
    [deleteModal]
  );

  // Delete API call
  const onDelete = useCallback(async () => {
    if (!selectedId) return;

    try {
      const response = await deletePromo(selectedId).unwrap();

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
  }, [selectedId, deletePromo, deleteModal]);

  // Open edit modal
  const openEditModal = useCallback(
    (promo: PromoEvent) => {
      if (promo) {
        setEditingPromo(promo);
        editModal.onTrue();
        openModal.onTrue();
      } else {
        showError('Promo not found');
      }
    },
    [editModal, openModal]
  );

  // Handle drag start
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const draggedPromo = promoEvents.find((promo) => promo._id === active.id);
      setActivePromo(draggedPromo || null);
    },
    [promoEvents]
  );

  // Handle drag end with API call
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActivePromo(null);

      if (!over || active.id === over.id) return;

      const activeIndex = promoEvents.findIndex(
        (promo: any) => promo._id === active.id
      );
      const overIndex = promoEvents.findIndex(
        (promo: any) => promo._id === over.id
      );

      if (activeIndex === -1 || overIndex === -1) return;

      // Get the moved promo and its previous order
      const movedPromo = promoEvents[activeIndex];
      const previousOrder = movedPromo.order;
      const newOrder = promoEvents[overIndex].order;

      // Optimistically update UI
      const reorderedArray = arrayMove(promoEvents, activeIndex, overIndex);
      const updatedPromoEvents = reorderedArray.map((promo, index) => ({
        ...promo,
        order: index + 1,
      }));

      setPromoEvents(updatedPromoEvents);

      // Call reorder API
      try {
        const payload: ReorderPayload = {
          movedId: movedPromo?._id,
          previousOrder,
          newOrder,
        };

        const response = await reorderPromo(payload).unwrap();

        if (response?.error) {
          // Revert on error
          setPromoEvents(promoEvents);
          const errorMessage = getErrorMessage(response.error);
          showError(errorMessage);
          return;
        }

        showSuccess(response?.message || 'Reordered successfully');
      } catch (error) {
        // Revert on error
        setPromoEvents(promoEvents);
        showError(getErrorMessage(error));
      }
    },
    [promoEvents, reorderPromo]
  );

  // Navigate to all promos
  const navigateToAllPromos = useCallback(() => {
    router.push('/super-admin/browser-control/all-promos');
  }, [router]);

  // Close modal
  const handleCloseModal = useCallback(() => {
    openModal.onFalse();
    editModal.onFalse();
    setEditingPromo(null);
  }, [openModal, editModal]);

  // Display only top 10
  const displayedEvents = useMemo(
    () => promoEvents.slice(0, 10),
    [promoEvents]
  );

  // Memoize sortable items
  const sortableIds = useMemo(
    () => displayedEvents.map((promo: any) => promo?._id),
    [displayedEvents]
  );

  return (
    <CustomDndProvider
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      overlay={
        activePromo ? (
          <DraggablePromoItem
            promo={activePromo}
            onEdit={() => {}}
            onDelete={() => {}}
            isOverlay={true}
          />
        ) : null
      }
    >
      <div className="p-0">
        <div className="mx-auto max-w-full">
          {/* Header */}
          <div className="mb-6 flex flex-col items-center justify-between gap-y-2 sm:flex-row">
            <h1 className="w-full text-center text-xl font-bold text-gray-900 sm:w-auto sm:text-start sm:text-2xl dark:text-white">
              Top 10 / Promo Section
            </h1>

            <Button
              onClick={() => openModal.onTrue()}
              className="bg-primary hover:bg-primary cursor-pointer rounded-full px-3 text-white"
              disabled={reorderLoading}
            >
              <Plus className="mr-1 h-4 w-4" />
              New Promo
            </Button>
          </div>

          {/* Promo Events List */}
          <SortableContext
            items={sortableIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <DraggablePromoItemSkeleton key={i} />
                ))
              ) : displayedEvents.length === 0 ? (
                <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
                  <p className="text-gray-500 dark:text-gray-400">
                    No promos available. Create your first promo!
                  </p>
                </div>
              ) : (
                displayedEvents.map((promo: any) => (
                  <DraggablePromoItem
                    key={promo?._id}
                    promo={promo}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </SortableContext>

          {/* View All Button */}
          {displayedEvents.length > 0 && (
            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                onClick={navigateToAllPromos}
                className="border-gray-300 bg-white px-6 py-2 hover:border-gray-400"
              >
                View All
              </Button>
            </div>
          )}

          {/* Modals */}
          <PromoSectionModal
            open={openModal.value}
            isEdit={editModal.value}
            onClose={handleCloseModal}
            selectedData={editingPromo}
          />

          <ConfirmDialog
            open={deleteModal.value}
            title="Delete Promo"
            content="Are you sure you want to delete this promo? This action cannot be undone."
            onClose={() => {
              deleteModal.onFalse();
              setSelectedId(null);
            }}
            onConfirm={onDelete}
            isLoading={deletePromoLoading}
          />
        </div>
      </div>
    </CustomDndProvider>
  );
};

export default PromoManager;
