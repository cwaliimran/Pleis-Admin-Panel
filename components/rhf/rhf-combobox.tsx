import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
};

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  options: Option[];
  multiple?: boolean;
  allowCustom?: boolean;
  className?: string;
};

export function RHFCombobox({
  name,
  label,
  placeholder = "Select or type to add...",
  options,
  multiple = false,
  allowCustom = true,
  className,
}: Props) {
  const { control } = useFormContext();
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const createNewOption = (value: string): Option => ({
    label: value,
    value: value.toLowerCase().replace(/\s+/g, "-"),
  });

  const handleAddCustom = (
    inputValue: string,
    currentValue: any,
    onChange: (value: any) => void
  ) => {
    if (!inputValue.trim()) return;

    const newOption = createNewOption(inputValue.trim());

    if (multiple) {
      const currentValues = Array.isArray(currentValue) ? currentValue : [];
      if (!currentValues.includes(newOption.value)) {
        onChange([...currentValues, newOption.value]);
      }
    } else {
      onChange(newOption.value);
    }

    setInputValue("");
    setOpen(false);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selectedValues = multiple
          ? field.value || []
          : field.value
          ? [field.value]
          : [];

        const handleSelect = (optionValue: string) => {
          if (multiple) {
            const newValue = selectedValues.includes(optionValue)
              ? selectedValues.filter((v: string) => v !== optionValue)
              : [...selectedValues, optionValue];
            field.onChange(newValue);
          } else {
            field.onChange(optionValue);
            setOpen(false);
          }
        };

        const handleRemove = (valueToRemove: string) => {
          if (multiple) {
            const newValue = selectedValues.filter(
              (v: string) => v !== valueToRemove
            );
            field.onChange(newValue);
          } else {
            field.onChange("");
          }
        };

        // Combine original options with any custom options that might have been added
        const allOptions = [...options];
        selectedValues.forEach((value: string) => {
          if (!allOptions.find((opt) => opt.value === value)) {
            allOptions.push({
              label: value
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
              value: value,
            });
          }
        });

        const filteredOptions = allOptions.filter((option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        );

        const showAddOption =
          allowCustom &&
          inputValue.trim() &&
          !filteredOptions.some(
            (opt) => opt.label.toLowerCase() === inputValue.trim().toLowerCase()
          );

        return (
          <FormItem className={cn("w-full", className)}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                      "w-full justify-between min-h-9 h-auto py-2",
                      !selectedValues.length && "text-muted-foreground"
                    )}
                  >
                    <div className="flex gap-1 flex-wrap items-center flex-1 text-left overflow-hidden">
                      {selectedValues.length > 0 ? (
                        multiple ? (
                          selectedValues.length > 5 ? (
                            <>
                              {selectedValues
                                .slice(0, 4)
                                .map((value: string) => {
                                  const option = allOptions.find(
                                    (o) => o.value === value
                                  );
                                  return (
                                    <Badge
                                      key={value}
                                      variant="outline"
                                      className="text-xs flex items-center gap-1 max-w-[80px]"
                                    >
                                      <span className="truncate">
                                        {option?.label || value}
                                      </span>
                                      <X
                                        className="h-3 w-3 cursor-pointer hover:text-red-500 flex-shrink-0"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          handleRemove(value);
                                        }}
                                      />
                                    </Badge>
                                  );
                                })}
                              <Badge
                                variant="secondary"
                                className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                              >
                                +{selectedValues.length - 4} more
                              </Badge>
                            </>
                          ) : (
                            selectedValues.map((value: string) => {
                              const option = allOptions.find(
                                (o) => o.value === value
                              );
                              return (
                                <Badge
                                  key={value}
                                  variant="outline"
                                  className="text-xs flex items-center gap-1 max-w-[100px]"
                                >
                                  <span className="truncate">
                                    {option?.label || value}
                                  </span>
                                  <X
                                    className="h-3 w-3 cursor-pointer hover:text-red-500 flex-shrink-0"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleRemove(value);
                                    }}
                                  />
                                </Badge>
                              );
                            })
                          )
                        ) : (
                          <span className="truncate">
                            {allOptions.find(
                              (o) => o.value === selectedValues[0]
                            )?.label || selectedValues[0]}
                          </span>
                        )
                      ) : (
                        <span>{placeholder}</span>
                      )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0"
                  align="start"
                >
                  <Command>
                    <CommandInput
                      placeholder="Search or type to add..."
                      value={inputValue}
                      onValueChange={setInputValue}
                    />
                    {/* {multiple && selectedValues.length > 0 && (
                      <div className="px-3 py-2 border-b">
                        <div className="text-xs text-muted-foreground mb-2">
                          Selected ({selectedValues.length}):
                        </div>
                        <div className="flex flex-wrap gap-1 max-h-[80px] overflow-y-auto">
                          {selectedValues.map((value: string) => {
                            const option = allOptions.find(
                              (o) => o.value === value
                            );
                            return (
                              <Badge
                                key={value}
                                variant="secondary"
                                className="text-xs flex items-center gap-1"
                              >
                                <span className="max-w-[80px] truncate">
                                  {option?.label || value}
                                </span>
                                <X
                                  className="h-3 w-3 cursor-pointer hover:text-red-500"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleRemove(value);
                                  }}
                                />
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )} */}
                    <CommandEmpty>
                      {allowCustom && inputValue.trim() ? (
                        <div className="px-2 py-1 text-sm text-muted-foreground">
                          No results found.
                        </div>
                      ) : (
                        "No results found."
                      )}
                    </CommandEmpty>
                    <CommandList className="max-h-[200px] overflow-y-auto">
                      <CommandGroup>
                        {filteredOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={() => handleSelect(option.value)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedValues.includes(option.value)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {option.label}
                          </CommandItem>
                        ))}

                        {showAddOption && (
                          <CommandItem
                            onSelect={() =>
                              handleAddCustom(
                                inputValue,
                                field.value,
                                field.onChange
                              )
                            }
                            className="text-blue-600 cursor-pointer"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add "{inputValue.trim()}"
                          </CommandItem>
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
