'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { type FC, useEffect, useMemo, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface DropdownOption {
  value: string;
  label: string;
}

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  options: DropdownOption[];
  disabled?: boolean;
  isLoading?: boolean;
  showNone?: boolean;
}

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}

const RHFCustomDropdown: FC<Props> = ({
  name,
  label,
  placeholder = 'Select an option',
  className,
  triggerClassName,
  contentClassName,
  options = [],
  disabled = false,
  isLoading = false,
  showNone = true,
}) => {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  // const filteredOptions = useMemo(() => {
  //   return [
  //     { value: 'none', label: 'None' }, // Add "None" option
  //     ...options.filter((option) =>
  //       option.label.toLowerCase().includes(debouncedSearch.toLowerCase())
  //     ),
  //   ];
  // }, [options, debouncedSearch]);

  const filteredOptions = useMemo(() => {
    const baseOptions = options.filter((option) =>
      option.label.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    return showNone
      ? [{ value: 'none', label: 'None' }, ...baseOptions]
      : baseOptions;
  }, [options, debouncedSearch, showNone]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  return (
    // <FormItem className={cn('w-full', className)}>
    //   {label && <FormLabel>{label}</FormLabel>}
    //   <FormControl>
    //     <Select
    //       open={open}
    //       onOpenChange={setOpen}
    //       value={field.value || ''}
    //       onValueChange={(value) => {
    //         field.onChange(value === 'none' ? undefined : value);
    //       }}
    //       disabled={disabled}
    //     >
    //       <SelectTrigger
    //         className={cn('h-[40px] w-full capitalize', triggerClassName)}
    //       >
    //         <SelectValue placeholder={placeholder}>
    //           {selectedOption?.label || placeholder}
    //         </SelectValue>
    //       </SelectTrigger>

    //       <SelectContent
    //         className={cn(
    //           'max-h-[300px] w-full dark:bg-[#171717]',
    //           contentClassName
    //         )}
    //       >
    //         {/* search input */}
    //         <div className="relative px-3 pb-2">
    //           <Search className="absolute top-2 left-6 h-4 w-4 opacity-50" />
    //           <Input
    //             placeholder="Search..."
    //             value={search}
    //             onChange={(e) => handleSearchChange(e.target.value)}
    //             className="h-8 w-full border-0 pr-3 pl-8 focus-visible:ring-0 focus-visible:ring-offset-0"
    //             onKeyDown={(e) => e.stopPropagation()}
    //           />
    //         </div>

    //         {/* options */}
    //         <div className="max-h-[200px] overflow-y-auto">
    //           {isLoading ? (
    //             <div className="text-muted-foreground py-6 text-center text-sm">
    //               Loading...
    //             </div>
    //           ) : filteredOptions.length === 0 ? (
    //             <div className="text-muted-foreground py-6 text-center text-sm">
    //               {debouncedSearch
    //                 ? 'No results found.'
    //                 : 'No options available.'}
    //             </div>
    //           ) : (
    //             filteredOptions.map((option) => (
    //               <SelectItem
    //                 key={option.value}
    //                 value={option.value}
    //                 className="w-full cursor-pointer capitalize"
    //               >
    //                 {option.label}
    //               </SelectItem>
    //             ))
    //           )}
    //         </div>
    //       </SelectContent>
    //     </Select>
    //   </FormControl>
    //   <FormMessage />
    // </FormItem>

    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedOption = field.value
          ? options.find((option) => option.value === field.value)
          : null;

        return (
          <FormItem className={cn('w-full', className)}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Select
                open={open}
                onOpenChange={setOpen}
                value={field.value || ''}
                onValueChange={(value) => {
                  field.onChange(value === 'none' ? undefined : value);
                }}
                disabled={disabled}
              >
                {/* <SelectTrigger className="h-[40px] w-full capitalize"> */}
                <SelectTrigger
                  className={cn('h-[40px] w-full capitalize', triggerClassName)}
                >
                  <SelectValue placeholder={placeholder}>
                    {selectedOption?.label || placeholder}
                  </SelectValue>
                </SelectTrigger>
                {/* <SelectContent className="max-h-[300px] w-full dark:bg-[#171717]"> */}
                <SelectContent
                  className={cn(
                    'max-h-[300px] w-full dark:bg-[#171717]',
                    contentClassName
                  )}
                >
                  <div className="relative px-3 pb-2">
                    <Search className="absolute top-2 left-6 h-4 w-4 opacity-50" />
                    <Input
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="h-8 w-full border-0 pr-3 pl-8 focus-visible:ring-0 focus-visible:ring-offset-0"
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>

                  <div className="max-h-[200px] overflow-y-auto">
                    {isLoading ? (
                      <div className="text-muted-foreground py-6 text-center text-sm">
                        Loading...
                      </div>
                    ) : filteredOptions.length === 0 ? (
                      <div className="text-muted-foreground py-6 text-center text-sm">
                        {debouncedSearch
                          ? 'No results found.'
                          : 'No options available.'}
                      </div>
                    ) : (
                      filteredOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="w-full cursor-pointer capitalize"
                        >
                          {option.label}
                        </SelectItem>
                      ))
                    )}
                  </div>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default RHFCustomDropdown;
