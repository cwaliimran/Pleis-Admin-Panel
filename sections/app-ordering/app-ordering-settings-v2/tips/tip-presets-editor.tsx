'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showError } from '@/utils/toast';
import { DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { MAX_TIP_FIXED_AMOUNT, MAX_TIP_PERCENTAGE, MAX_TIP_PRESETS, TIP_UNIT_CONFIG, TIP_UNIT_OPTIONS } from './constants';
import { TipPresetChip, formatTipPreset } from './tip-preset-chip';
import { TipPreset, TipPresetUnit } from './types';

interface TipPresetsEditorProps {
  presets: TipPreset[];
  onChange: (presets: TipPreset[]) => void;
  disabled?: boolean;
}

export const TipPresetsEditor: React.FC<TipPresetsEditorProps> = ({ presets, onChange, disabled = false }) => {
  const [unit, setUnit] = useState<TipPresetUnit>('percentage');
  const [draftValue, setDraftValue] = useState('');

  // A small activation distance keeps the × button clickable inside a draggable chip.
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const from = presets.findIndex((preset) => preset.id === active.id);
    const to = presets.findIndex((preset) => preset.id === over.id);
    if (from === -1 || to === -1) return;

    onChange(arrayMove(presets, from, to));
  };

  const handleAdd = () => {
    const parsed = Number(draftValue);
    const max = unit === 'percentage' ? MAX_TIP_PERCENTAGE : MAX_TIP_FIXED_AMOUNT;

    if (draftValue.trim() === '' || Number.isNaN(parsed)) {
      showError('Enter a tip value');
      return;
    }
    if (parsed <= 0) {
      showError('Tip value must be greater than 0');
      return;
    }
    if (parsed > max) {
      showError(`Tip value cannot exceed ${unit === 'percentage' ? `${max}%` : `${TIP_UNIT_CONFIG.fixed.symbol}${max}`}`);
      return;
    }
    if (presets.length >= MAX_TIP_PRESETS) {
      showError(`You can add up to ${MAX_TIP_PRESETS} presets`);
      return;
    }

    const candidate: TipPreset = { id: `preset_${Date.now()}`, unit, value: parsed };

    if (presets.some((preset) => preset.unit === unit && preset.value === parsed)) {
      showError(`${formatTipPreset(candidate)} is already a preset`);
      return;
    }

    onChange([...presets, candidate]);
    setDraftValue('');
  };

  const handleRemove = (id: string) => onChange(presets.filter((preset) => preset.id !== id));

  return (
    <div className="bg-gray-50 p-5 dark:bg-[#1a1a1a]">
      <h4 className="mb-1 text-sm font-bold text-gray-900 dark:text-gray-100">Tip preset options</h4>
      <p className="mb-4 text-[13px] leading-relaxed text-gray-500 dark:text-gray-400">
        Quick-select chips shown to the customer. Drag to reorder, or click × to remove.
      </p>

      {presets.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={presets.map((preset) => preset.id)} strategy={horizontalListSortingStrategy}>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {presets.map((preset) => (
                <TipPresetChip key={preset.id} preset={preset} onRemove={handleRemove} disabled={disabled} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <p className="mb-4 text-[13px] text-gray-400 dark:text-gray-500">No presets yet — customers will only see the custom amount option.</p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Select value={unit} onValueChange={(next) => setUnit(next as TipPresetUnit)} disabled={disabled}>
          <SelectTrigger className="w-20 bg-white dark:bg-[#222121]" aria-label="Tip preset unit">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIP_UNIT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          min={0}
          inputMode="decimal"
          placeholder="e.g. 10"
          aria-label="Tip preset value"
          value={draftValue}
          disabled={disabled}
          onChange={(event) => setDraftValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return;
            // Enter adds the preset rather than bubbling to any enclosing form.
            event.preventDefault();
            handleAdd();
          }}
          className="w-32 bg-white dark:bg-[#222121]"
        />

        <Button type="button" variant="outline" onClick={handleAdd} disabled={disabled} className="gap-1.5 font-semibold">
          <Plus className="h-4 w-4" />
          Add preset
        </Button>
      </div>
    </div>
  );
};
