'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FC } from 'react';
import { FILTER_ACTIVE_SOLID } from '../config/theme';
import SaBadge from './sa-badge';
import { DateRangeValue, FilterFieldDef, FilterOption, FilterValue, FilterValues, RangeValue, TriState } from './types';

const FieldLabel: FC<{ label: string; superAdminOnly?: boolean }> = ({ label, superAdminOnly }) => (
  <div className="mb-1.5 flex items-center gap-1.5">
    <Label className="text-sm font-medium">{label}</Label>
    {superAdminOnly && <SaBadge />}
  </div>
);

const PillGroup: FC<{ options: FilterOption[]; value: string[]; onChange: (value: string[]) => void; disabled?: boolean }> = ({
  options,
  value,
  onChange,
  disabled,
}) => (
  <div className="flex flex-wrap gap-2">
    {options.map((option) => {
      const active = value.includes(option.value);
      return (
        <button
          key={option.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(active ? value.filter((v) => v !== option.value) : [...value, option.value])}
          className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
            active
              ? FILTER_ACTIVE_SOLID
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-800'
          }`}
        >
          {option.label}
          {option.superAdminOnly && <SaBadge />}
        </button>
      );
    })}
  </div>
);

const DEFAULT_TRISTATE_LABELS: [string, string, string] = ['Any', 'Yes', 'No'];

const TriStateControl: FC<{ value: TriState; onChange: (value: TriState) => void; disabled?: boolean; labels?: [string, string, string] }> = ({
  value,
  onChange,
  disabled,
  labels = DEFAULT_TRISTATE_LABELS,
}) => (
  <div className="inline-flex rounded-md border border-gray-300 p-0.5 dark:border-gray-600">
    {(['any', 'yes', 'no'] as TriState[]).map((option, idx) => (
      <button
        key={option}
        type="button"
        disabled={disabled}
        onClick={() => onChange(option)}
        className={`cursor-pointer rounded px-3 py-1 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
          value === option ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        }`}
      >
        {labels[idx]}
      </button>
    ))}
  </div>
);

interface FilterFieldControlProps {
  field: FilterFieldDef;
  options?: FilterOption[];
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  disabled?: boolean;
}

const FilterFieldControl: FC<FilterFieldControlProps> = ({ field, options, value, onChange, disabled }) => {
  switch (field.type) {
    case 'pill':
      return <PillGroup options={options || []} value={value as string[]} onChange={onChange} disabled={disabled} />;

    case 'tristate':
      return <TriStateControl value={value as TriState} onChange={onChange} disabled={disabled} labels={field.triStateLabels} />;

    case 'select':
      return (
        <Select value={value as string} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option) => (
              <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'text':
      return <Input value={value as string} disabled={disabled} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />;

    case 'range': {
      const range = value as RangeValue;
      return (
        <div className="flex items-center gap-2">
          <Input type="number" placeholder="Min" disabled={disabled} value={range.min} onChange={(e) => onChange({ ...range, min: e.target.value })} />
          <span className="text-muted-foreground text-sm">–</span>
          <Input type="number" placeholder="Max" disabled={disabled} value={range.max} onChange={(e) => onChange({ ...range, max: e.target.value })} />
          {field.unit && <span className="text-muted-foreground shrink-0 text-xs">{field.unit}</span>}
        </div>
      );
    }

    case 'date-range': {
      const range = value as DateRangeValue;
      return (
        <div className="flex items-center gap-2">
          <Input type="text" placeholder="dd/mm/yyyy" disabled={disabled} value={range.start} onChange={(e) => onChange({ ...range, start: e.target.value })} />
          <span className="text-muted-foreground text-sm">–</span>
          <Input type="text" placeholder="dd/mm/yyyy" disabled={disabled} value={range.end} onChange={(e) => onChange({ ...range, end: e.target.value })} />
        </div>
      );
    }

    default:
      return null;
  }
};

interface FilterFieldRowProps {
  field: FilterFieldDef;
  values: FilterValues;
  onChange: (value: FilterValue) => void;
  disabled?: boolean;
}

export const FilterFieldRow: FC<FilterFieldRowProps> = ({ field, values, onChange, disabled }) => {
  const fieldDisabled = disabled || Boolean(field.disabledWhen?.(values));
  const options = field.optionsFor ? field.optionsFor(values) : field.options;

  return (
    <div>
      <FieldLabel label={field.label} superAdminOnly={field.superAdminOnly} />
      <FilterFieldControl field={field} options={options} value={values[field.id]} onChange={onChange} disabled={fieldDisabled} />
      {field.helperText && <p className="text-muted-foreground mt-1.5 text-xs">{field.helperText}</p>}
      {fieldDisabled && field.disabledHelperText && <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">{field.disabledHelperText}</p>}
    </div>
  );
};
