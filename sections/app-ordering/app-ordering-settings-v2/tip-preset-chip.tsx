'use client';

import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';
import React from 'react';
import { TIP_UNIT_CONFIG } from './constants';
import { TipPreset } from './types';

export const formatTipPreset = (preset: TipPreset) =>
  preset.unit === 'percentage' ? `${preset.value}%` : `${TIP_UNIT_CONFIG.fixed.symbol}${preset.value}`;

interface TipPresetChipProps {
  preset: TipPreset;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

export const TipPresetChip: React.FC<TipPresetChipProps> = ({ preset, onRemove, disabled = false }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: preset.id,
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 py-1.5 pr-1.5 pl-3.5 text-sm font-semibold text-blue-700',
        'dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300',
        disabled ? 'opacity-60' : 'cursor-grab active:cursor-grabbing',
        isDragging && 'z-10 opacity-50 shadow-lg'
      )}
      {...attributes}
      {...listeners}
    >
      <span>{formatTipPreset(preset)}</span>
      <button
        type="button"
        aria-label={`Remove ${formatTipPreset(preset)} preset`}
        disabled={disabled}
        // Stop the drag sensor from swallowing the click.
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => onRemove(preset.id)}
        className={cn(
          'flex h-5 w-5 items-center justify-center rounded-full text-blue-500 transition-colors',
          'hover:bg-blue-200 hover:text-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-200',
          disabled && 'cursor-not-allowed'
        )}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
