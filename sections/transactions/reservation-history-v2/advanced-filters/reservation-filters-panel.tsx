'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { showSuccess } from '@/utils/toast';
import { Star } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { FILTER_ACTIVE_SOFT } from '../config/theme';
import { defaultValueForType, getDefaultFilterValues } from './default-values';
import FilterSection from './filter-section';
import { getFieldById, isSectionDisabled, FILTER_SECTIONS } from './schema';
import { DEFAULT_SAVED_VIEWS } from './saved-views';
import { FilterValues, SavedFilterView } from './types';

interface ReservationFiltersPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  values: FilterValues;
  onApply: (values: FilterValues) => void;
  onClear: () => void;
}

const ReservationFiltersPanel: FC<ReservationFiltersPanelProps> = ({ open, onOpenChange, values, onApply, onClear }) => {
  const [draft, setDraft] = useState<FilterValues>(values);
  const [openSectionId, setOpenSectionId] = useState<string>(FILTER_SECTIONS[0].id);
  const [savedViews, setSavedViews] = useState<SavedFilterView[]>(DEFAULT_SAVED_VIEWS);
  const [activeViewId, setActiveViewId] = useState<string | null>(null);

  useEffect(() => {
    if (open) setDraft(values);
  }, [open, values]);

  const handleFieldChange = (fieldId: string, value: FilterValues[string]) => {
    setDraft((prev) => {
      const next = { ...prev, [fieldId]: value };
      getFieldById(fieldId)?.resets?.forEach((resetId) => {
        const resetField = getFieldById(resetId);
        if (resetField) next[resetId] = defaultValueForType(resetField.type);
      });
      return next;
    });
    setActiveViewId(null);
  };

  const handleSelectView = (view: SavedFilterView) => {
    setDraft(view.values);
    setActiveViewId(view.id);
  };

  const handleSaveCurrentAsView = () => {
    const newView: SavedFilterView = { id: `view-${Date.now()}`, label: `Custom view ${savedViews.length + 1}`, values: draft };
    setSavedViews((prev) => [...prev, newView]);
    setActiveViewId(newView.id);
    showSuccess('Saved current filters as a view');
  };

  const handleApply = () => {
    onApply(draft);
    onOpenChange(false);
  };

  const handleClearAll = () => {
    const cleared = getDefaultFilterValues();
    setDraft(cleared);
    setActiveViewId(null);
    onClear();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-xl md:max-w-2xl">
        <SheetHeader className="border-b border-gray-200 dark:border-gray-700">
          <SheetTitle>Filters — Reservations</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          <div className="border-b border-gray-200 py-4 dark:border-gray-700">
            <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">Saved views</p>
            <div className="flex flex-wrap items-center gap-2">
              {savedViews.map((savedView) => (
                <button
                  key={savedView.id}
                  type="button"
                  onClick={() => handleSelectView(savedView)}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    activeViewId === savedView.id
                      ? FILTER_ACTIVE_SOFT
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  {savedView.starred && <Star className="h-3 w-3 fill-current text-amber-500" />}
                  {savedView.label}
                </button>
              ))}
              <button
                type="button"
                onClick={handleSaveCurrentAsView}
                className="cursor-pointer rounded-full border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                + Save current as view
              </button>
            </div>
          </div>

          {FILTER_SECTIONS.map((section) => (
            <FilterSection
              key={section.id}
              section={section}
              open={openSectionId === section.id}
              onToggle={() => setOpenSectionId((prev) => (prev === section.id ? '' : section.id))}
              disabled={isSectionDisabled(section, draft)}
              values={draft}
              onFieldChange={handleFieldChange}
            />
          ))}
        </div>

        <SheetFooter className="flex-row justify-end gap-2 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={handleClearAll}>
            Clear all
          </Button>
          <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleApply}>
            Apply filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ReservationFiltersPanel;
