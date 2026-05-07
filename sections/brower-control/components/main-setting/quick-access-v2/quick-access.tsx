'use client';

import { CustomDndProvider } from '@/components/providers/DndProvider';
import {
  useGetQuickAccessQuery,
  useReorderQuickAccessMutation,
  useGetQuickActionConfigQuery,
  useUpdateQuickActionConfigMutation,
} from '@/store/Reducer/promo-section-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DraggablePromoItem } from './DraggablePromoItem';
import { DraggablePromoItemSkeleton } from './DraggablePromoItemSkeleton';
import { PromoEvent, ReorderPayload } from './types';
import { Loader2 } from 'lucide-react';

type PromoManagerProps = {
  heading?: string;
  viewAll?: boolean;
  fixLength?: boolean;
};

const QuickAccessV2 = ({ heading }: PromoManagerProps) => {
  const [promoEvents, setPromoEvents] = useState<any[]>([]);
  const [activePromo, setActivePromo] = useState<PromoEvent | null>(null);

  const [reorderPromo] = useReorderQuickAccessMutation();
  const [updateQuickActionConfig, { isLoading: isUpdatingConfig }] = useUpdateQuickActionConfigMutation();

  const { data: apiData, isLoading } = useGetQuickAccessQuery({
    page: 0,
    limit: 10000,
  });

  const { data: quickActionConfig, isLoading: isLoadingConfig } = useGetQuickActionConfigQuery({});

  // Update local state when API data changes
  useEffect(() => {
    if (apiData?.data) {
      setPromoEvents(apiData?.data);
    }
  }, [apiData]);

  // Handle drag start
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const draggedPromo = promoEvents.find((promo) => promo._id === active.id);
      setActivePromo(draggedPromo || null);
    },
    [promoEvents]
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActivePromo(null);

      if (!over || active.id === over.id) return;

      const activeIndex = promoEvents.findIndex((promo) => promo._id === active.id);
      const overIndex = promoEvents.findIndex((promo) => promo._id === over.id);

      if (activeIndex === -1 || overIndex === -1) return;

      const previousOrder = activeIndex + 1;
      const newOrder = overIndex + 1;

      const reorderedArray = arrayMove(promoEvents, activeIndex, overIndex);
      const updatedPromoEvents = reorderedArray.map((promo, index) => ({
        ...promo,
        order: index + 1,
      }));

      setPromoEvents(updatedPromoEvents);

      try {
        const payload: ReorderPayload = {
          movedId: promoEvents[activeIndex]._id,
          previousOrder,
          newOrder,
        };

        const response = await reorderPromo(payload).unwrap();

        if (response?.error) {
          setPromoEvents(promoEvents);
          showError(getErrorMessage(response.error));
          return;
        }

        showSuccess('Quick access reordered successfully');
      } catch (error) {
        setPromoEvents(promoEvents);
        showError(getErrorMessage(error));
      }
    },
    [promoEvents, reorderPromo]
  );

  // Handle toggle quick action status
  const handleToggleQuickAction = useCallback(async () => {
    try {
      const currentStatus = quickActionConfig?.quickAction || false;
      const response = await updateQuickActionConfig({
        quickAction: !currentStatus,
      }).unwrap();

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(`Quick Access ${!currentStatus ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  }, [quickActionConfig?.quickAction, updateQuickActionConfig]);

  const displayedEvents = useMemo(() => promoEvents.slice(0, 10), [promoEvents]);
  const sortableIds = useMemo(() => displayedEvents.map((promo: any) => promo?._id), [displayedEvents]);

  return (
    <CustomDndProvider
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      overlay={activePromo ? <DraggablePromoItem promo={activePromo} onEdit={() => {}} onDelete={() => {}} isOverlay={true} /> : null}
    >
      <div className="p-0">
        <div className="mx-auto max-w-full">
          {/* Header */}
          <div className="mb-6 flex flex-col items-center justify-between gap-y-2 sm:flex-row">
            <h1 className="w-full text-center text-xl font-bold text-gray-900 sm:w-auto sm:text-start sm:text-2xl dark:text-white">{heading}</h1>

            {/* Enable/Disable Button */}
            <div className="flex w-full justify-center sm:w-auto sm:justify-end">
              <button
                type="button"
                onClick={handleToggleQuickAction}
                disabled={isUpdatingConfig || isLoadingConfig}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  quickActionConfig?.quickAction
                    ? 'cursor-pointer bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800'
                    : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800'
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {isUpdatingConfig || isLoadingConfig ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>{quickActionConfig?.quickAction ? '✓ Enabled' : '✕ Disabled'}</span>
                )}
              </button>
            </div>
          </div>

          {/* Promo Events List */}
          <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => <DraggablePromoItemSkeleton key={i} />)
              ) : promoEvents.length === 0 ? (
                <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
                  <p className="text-gray-500 dark:text-gray-400">No quick access items available.</p>
                </div>
              ) : (
                promoEvents.map((promo: any) => <DraggablePromoItem key={promo?._id} promo={promo} />)
              )}
            </div>
          </SortableContext>
        </div>
      </div>
    </CustomDndProvider>
  );
};

export default QuickAccessV2;
