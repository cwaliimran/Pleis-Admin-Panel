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
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
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
};

export function RHFMultiSelect({
  name,
  label,
  placeholder = "Select",
  options,
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selectedValues = field.value || [];

        const handleSelect = (val: string) => {
          const newValue = selectedValues.includes(val)
            ? selectedValues.filter((v: string) => v !== val)
            : [...selectedValues, val];

          field.onChange(newValue);
        };

        return (
          <FormItem className="w-full">
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between h-[40px] dark:bg-input/30 border-input bg-transparent shadow-xs",
                      !selectedValues.length && "text-muted-foreground"
                    )}
                  >
                    <div className="flex gap-1 flex-wrap">
                      {selectedValues.length ? (
                        selectedValues.map((val: string) => {
                          const item = options.find((o) => o.value === val);
                          return (
                            <Badge
                              key={val}
                              variant="outline"
                              className="text-xs"
                            >
                              {item?.label}
                            </Badge>
                          );
                        })
                      ) : (
                        <span>{placeholder}</span>
                      )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={4}
                  className="w-[var(--radix-popover-trigger-width)] max-h-[300px] p-0 z-[9999]"
                >
                  <Command>
                    <CommandGroup className="w-full">
                      {options.map((option) => (
                        <CommandItem
                          key={option.value}
                          onSelect={() => handleSelect(option.value)}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm",
                              selectedValues.includes(option.value)
                                ? ""
                                : "opacity-50"
                            )}
                          >
                            {selectedValues.includes(option.value) && (
                              <Check className="h-4 w-4" />
                            )}
                          </div>
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
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
