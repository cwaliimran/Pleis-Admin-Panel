'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

interface RHFDatePickerProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  minDate?: Date;
  displayFormat?: string;
}

const RHFDatePicker: FC<RHFDatePickerProps> = ({
  name,
  label,
  placeholder = 'Pick a date',
  className,
  minDate = new Date(),
  displayFormat = 'PPP',
}) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      rules={{
        validate: (value) => !minDate || !value || value >= minDate || `Date must be after ${format(minDate, displayFormat)}`,
      }}
      render={({ field, formState: {} }) => (
        <FormItem className={'flex-1'}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(className, 'w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? format(field.value, displayFormat) : <span>{placeholder}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="dark:bg-secondary w-auto p-0" align="start">
                <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RHFDatePicker;
