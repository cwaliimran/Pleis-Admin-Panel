import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import CustomBadge from '../ui/custom-badge';

interface RHFCustomComboboxProps {
  name: string;
  label?: string;
  placeholder: string;
  className?: string;
  multiple: boolean;
  allowCustom: boolean;
  options: { value: string; label: string }[];
}

export const RHFCustomCombobox = ({
  name,
  label,
  placeholder,
  className,
  multiple,
  allowCustom,
  options,
}: RHFCustomComboboxProps) => {
  const { setValue, watch } = useFormContext();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const selectedValues = watch(name) || [];

  const handleSelect = (value: string) => {
    let newValues: string[];
    if (multiple) {
      newValues = selectedValues.includes(value)
        ? selectedValues.filter((v: string) => v !== value)
        : [...selectedValues, value];
    } else {
      newValues = [value];
    }
    setValue(name, newValues, { shouldValidate: true });
  };

  const handleRemove = (value: string) => {
    const newValues = selectedValues.filter((v: string) => v !== value);
    setValue(name, newValues, { shouldValidate: true });
  };

  // const filteredOptions = options.filter((option) =>
  //   option.label.toLowerCase().includes(search.toLowerCase())
  // );

  return (
    <div className={cn('', className)}>
      <div className="space-y-2">
        <Label htmlFor={name}>{label}</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between font-normal text-gray-600 dark:text-white"
            >
              {selectedValues.length > 0
                ? `${selectedValues.length} selected`
                : placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-full border-gray-200 p-0 shadow-lg dark:border-[#272727]"
            style={{ width: 'var(--radix-popover-trigger-width)' }}
            onWheel={(e) => e.stopPropagation()}
          >
            {/* <Command className="dark:bg-secondary rounded-lg">
              <CommandInput
                placeholder="Search..."
                value={search}
                onValueChange={setSearch}
                className="h-11 border-0 focus:ring-0 focus:outline-none"
              />
              <CommandList className="max-h-[240px] overflow-y-auto">
                <CommandEmpty className="py-6 text-center text-sm text-gray-500">
                  No results found.
                </CommandEmpty>
                <CommandGroup>
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedValues.includes(option.value)
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                  {allowCustom &&
                    search &&
                    !filteredOptions.some(
                      (opt) => opt.label.toLowerCase() === search.toLowerCase()
                    ) && (
                      <CommandItem
                        value={search}
                        onSelect={() => {
                          const newOption = {
                            value: search.toLowerCase().replace(/\s+/g, '-'),
                            label: search,
                          };
                          options.push(newOption);
                          handleSelect(newOption.value);
                        }}
                      >
                        &quot;{search}&quot;
                      </CommandItem>
                    )}
                </CommandGroup>
              </CommandList>
            </Command> */}
            <Command className="dark:bg-secondary rounded-lg">
              <CommandInput
                placeholder="Search..."
                value={search}
                onValueChange={setSearch}
                className="h-11 border-0 focus:ring-0 focus:outline-none"
              />
              <CommandList className="max-h-[240px] overflow-y-auto">
                <CommandEmpty className="py-6 text-center text-sm text-gray-500">
                  No results found.
                </CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label} // ✅ use label for search
                      onSelect={() => handleSelect(option.value)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedValues.includes(option.value)
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}

                  {allowCustom &&
                    search &&
                    !options.some(
                      (opt) => opt.label.toLowerCase() === search.toLowerCase()
                    ) && (
                      <CommandItem
                        value={search}
                        onSelect={() => {
                          const newOption = {
                            value: search.toLowerCase().replace(/\s+/g, '-'),
                            label: search,
                          };
                          options.push(newOption);
                          handleSelect(newOption.value);
                        }}
                      >
                        &quot;{search}&quot;
                      </CommandItem>
                    )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div
        className={`flex flex-wrap gap-2 ${
          selectedValues.length > 0 ? 'mt-2' : 'mt-0'
        }`}
      >
        {selectedValues.map((value: string) => {
          const option = options.find((opt) => opt.value === value);
          return (
            <CustomBadge
              key={value}
              variant="info"
              className="flex items-center gap-1"
            >
              {option?.label || value}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleRemove(value)}
              />
            </CustomBadge>
          );
        })}
      </div>
    </div>
  );
};
