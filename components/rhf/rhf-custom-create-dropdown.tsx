'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Search, Plus } from 'lucide-react';
import { type FC, useState, useMemo, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { showSuccess, showError } from '@/utils/toast';
import { getErrorMessage } from '@/utils/api';
import { useAddItemsCategoryMutation } from '@/store/Reducer/items-category-api';
import TagsTypeModal from '@/sections/items-category/items-category-modal';

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

const categorySchema = Yup.object({
  title: Yup.string()
    .required('Category name is required')
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name cannot exceed 50 characters')
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      'Category name can only contain letters, numbers, and spaces'
    ),
  status: Yup.string().oneOf(['active', 'inactive']).optional(),
});

const RHFCustomCreatableDropdown: FC<Props> = ({
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
  const { control, setValue } = useFormContext();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const [addItemCategory, { isLoading: addCategoryLoading }] =
    useAddItemsCategoryMutation();

  const categoryFormMethods = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      title: '',
      status: 'active',
    },
  });

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

  const handleCreateCategory = async (data: any) => {
    try {
      const payload = {
        title: data.title,
        status: data.status || 'active',
      };

      const response = await addItemCategory(payload).unwrap();

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'Category added successfully');

      setValue(name, response.data._id);
      setIsModalOpen(false);
      categoryFormMethods.reset();
      setOpen(true);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleModalClose = () => {
    if (!addCategoryLoading) {
      setIsModalOpen(false);
      categoryFormMethods.reset();
      setOpen(true);
    }
  };

  return (
    <>
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
                  onOpenChange={(isOpen) => {
                    setOpen(isOpen);
                    if (!isOpen) setSearch('');
                  }}
                  value={field.value || ''}
                  onValueChange={(value) => {
                    field.onChange(value === 'none' ? undefined : value);
                  }}
                  disabled={disabled}
                >
                  <SelectTrigger
                    className={cn(
                      'h-[40px] w-full capitalize',
                      triggerClassName
                    )}
                  >
                    <SelectValue placeholder={placeholder}>
                      {selectedOption?.label || placeholder}
                    </SelectValue>
                  </SelectTrigger>
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
                        onKeyDown={(e) => {
                          e.stopPropagation();
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            setIsModalOpen(true);
                          }
                        }}
                      />
                    </div>
                    <div className="px-3 pb-2">
                      <Button
                        variant="outline"
                        className="flex w-full items-center justify-start gap-2 text-[13px]"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsModalOpen(true);
                          setOpen(false);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                        Add New Category
                      </Button>
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

      <TagsTypeModal
        open={isModalOpen}
        onClose={handleModalClose}
        editMode={false}
        isLoading={addCategoryLoading}
        methods={categoryFormMethods}
        onSubmit={categoryFormMethods.handleSubmit(handleCreateCategory)}
      />
    </>
  );
};
export default RHFCustomCreatableDropdown;
