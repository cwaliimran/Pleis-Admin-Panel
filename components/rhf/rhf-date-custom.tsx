"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useState } from "react";
import { useFormContext } from "react-hook-form";

interface RHFDatePickerWithDropdownProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

const RHFDatePickerWithDropdown: FC<RHFDatePickerWithDropdownProps> = ({
  name,
  label,
  placeholder = "Pick a date",
  className,
}) => {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const value = field.value ? new Date(field.value) : undefined;

        return (
          <FormItem className="flex-1">
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      className,
                      "w-full justify-start text-left font-normal",
                      !value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? (
                      format(value, "dd-MM-yyyy") // 👈 formatted
                    ) : (
                      <span>{placeholder}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 dark:bg-secondary"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    captionLayout="dropdown" // 👈 adds month/year dropdown
                    selected={value}
                    onSelect={(date) => {
                      field.onChange(date ? date.toISOString() : null); // store ISO string
                      setOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default RHFDatePickerWithDropdown;
