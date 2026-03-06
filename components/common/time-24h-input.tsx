'use client';

import { cn } from '@/lib/utils';
import { to24HourTime } from '@/utils/time';
import { useEffect, useMemo, useState } from 'react';

type Time24hInputProps = {
  value: string;
  onChange: (value: string) => void;
  title?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

const normalize24hTime = (input: string): string => {
  const raw = input.trim();
  if (!raw) return '';

  if (/am|pm/i.test(raw)) {
    const converted = to24HourTime(raw.toUpperCase());
    return converted || '';
  }

  const sanitized = raw.replace(/[^\d:]/g, '');

  if (!sanitized) return '';

  let hours = '';
  let minutes = '';

  if (sanitized.includes(':')) {
    const [h = '', m = ''] = sanitized.split(':');
    hours = h;
    minutes = m;
  } else {
    const digits = sanitized.replace(/\D/g, '');
    if (digits.length <= 2) {
      hours = digits;
    } else {
      hours = digits.slice(0, 2);
      minutes = digits.slice(2, 4);
    }
  }

  if (!hours) return '';

  const parsedHours = Number(hours);
  const parsedMinutes = minutes ? Number(minutes) : 0;

  if (Number.isNaN(parsedHours) || parsedHours < 0 || parsedHours > 23) return '';
  if (Number.isNaN(parsedMinutes) || parsedMinutes < 0 || parsedMinutes > 59) return '';

  return `${String(parsedHours).padStart(2, '0')}:${String(parsedMinutes).padStart(2, '0')}`;
};

const formatPartial24hTime = (input: string): string => {
  const digits = input.replace(/\D/g, '').slice(0, 4);

  if (!digits) return '';
  if (digits.length <= 2) return digits;

  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
};

const Time24hInput = ({ value, onChange, title, placeholder = 'HH:mm', className, disabled = false }: Time24hInputProps) => {
  const [displayValue, setDisplayValue] = useState(value || '');

  useEffect(() => {
    setDisplayValue(value || '');
  }, [value]);

  const ariaLabel = useMemo(() => title || 'Time in 24-hour format', [title]);

  const handleChange = (nextValue: string) => {
    const formatted = formatPartial24hTime(nextValue);
    setDisplayValue(formatted);

    if (formatted.length === 5) {
      const normalized = normalize24hTime(formatted);
      if (normalized) {
        setDisplayValue(normalized);
        onChange(normalized);
      }
      return;
    }

    if (!formatted) {
      onChange('');
    }
  };

  const handleBlur = () => {
    const normalized = normalize24hTime(displayValue);
    setDisplayValue(normalized);
    onChange(normalized);
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="^([01]\d|2[0-3]):([0-5]\d)$"
      maxLength={5}
      title={ariaLabel}
      value={displayValue}
      placeholder={placeholder}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={handleBlur}
      disabled={disabled}
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        className
      )}
    />
  );
};

export default Time24hInput;
