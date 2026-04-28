'use client';

import { CustomDndProvider } from '@/components/providers/DndProvider';
import { useGetQuickAccessQuery, useReorderQuickAccessMutation } from '@/store/Reducer/promo-section-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DraggablePromoItem } from './DraggablePromoItem';
import { DraggablePromoItemSkeleton } from './DraggablePromoItemSkeleton';
import { PromoEvent, ReorderPayload } from './types';

type PromoManagerProps = {
  heading?: string;
  viewAll?: boolean;
  fixLength?: boolean;
};

const QuickAccessV2 = ({ heading }: PromoManagerProps) => {
  const [promoEvents, setPromoEvents] = useState<any[]>([]);
  const [activePromo, setActivePromo] = useState<PromoEvent | null>(null);

  const [reorderPromo] = useReorderQuickAccessMutation();

  const { data: apiData, isLoading } = useGetQuickAccessQuery({
    page: 0,
    limit: 10000,
  });

  console.log('apiData', apiData?.data);

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

      console.log('previousOrder', previousOrder);
      console.log('newOrder', newOrder);

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
