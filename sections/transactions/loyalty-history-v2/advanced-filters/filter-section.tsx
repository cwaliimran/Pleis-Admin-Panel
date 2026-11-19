'use client';

import { ChevronRight } from 'lucide-react';
import { FC } from 'react';
import { FilterFieldRow } from './filter-field';
import SaBadge from './sa-badge';
import { FilterSectionDef, FilterValues } from './types';

interface FilterSectionProps {
  section: FilterSectionDef;
  open: boolean;
  onToggle: () => void;
  disabled: boolean;
  values: FilterValues;
  onFieldChange: (fieldId: string, value: FilterValues[string]) => void;
}

const FilterSection: FC<FilterSectionProps> = ({ section, open, onToggle, disabled, values, onFieldChange }) => (
  <div className="border-b border-gray-200 dark:border-gray-700">
    <button type="button" onClick={onToggle} className="flex w-full cursor-pointer items-center justify-between gap-3 py-4 text-left">
      <span className="flex items-center gap-2">
        <ChevronRight className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
        <span className="font-semibold">{section.label}</span>
        {section.superAdminOnly && <SaBadge />}
        {disabled && section.disabledHelperText && <span className="text-muted-foreground text-xs">{section.disabledHelperText}</span>}
      </span>
      {!disabled && <span className="text-muted-foreground text-sm">{section.fields.length} filters</span>}
    </button>

    <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
      <div className="overflow-hidden">
        <div className={`grid grid-cols-1 gap-5 pb-5 sm:grid-cols-2 ${disabled ? 'opacity-50' : ''}`}>
          {section.fields.map((field) => (
            <FilterFieldRow key={field.id} field={field} values={values} onChange={(value) => onFieldChange(field.id, value)} disabled={disabled} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default FilterSection;
