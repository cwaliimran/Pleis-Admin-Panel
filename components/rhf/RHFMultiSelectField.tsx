"use client"

import { FC, useMemo } from "react"
import { useFormContext } from "react-hook-form"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, X } from "lucide-react"

interface Option {
    label: string
    value: string
}

interface RHFMultiSelectFieldProps {
    name: string
    label?: string
    placeholder?: string
    options: Option[]
    className?: string
    disabled?: boolean
}

const RHFMultiSelectField: FC<RHFMultiSelectFieldProps> = ({
    name,
    label,
    placeholder = "Select options",
    options,
    className,
    disabled,
}) => {
    const { control, setValue, watch } = useFormContext()

    const selectedValues = useMemo(() => watch(name) || [], [watch, name])

    const selectedOptions = useMemo(
        () => options.filter(o => selectedValues.includes(o.value)),
        [options, selectedValues]
    )

    const toggle = (val: string) => {
        const next = selectedValues.includes(val)
            ? selectedValues.filter((v: string) => v !== val)
            : [...selectedValues, val]
        setValue(name, next)
    }

    const clearOne = (val: string) => {
        setValue(name, selectedValues.filter((v: string) => v !== val))
    }

    const clearAll = () => setValue(name, [])

    return (
        <div className="flex flex-col gap-2">
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        {label && <FormLabel>{label}</FormLabel>}

                        {/* Dropdown to select new tags */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded="false"
                                        className={cn(className ||
                                            "w-full min-h-[40px] rounded-md border border-muted bg-background text-muted-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                                            disabled && "opacity-60 cursor-not-allowed"
                                        )}
                                        disabled={disabled}
                                    >
                                        <span className="flex-1 text-left text-muted-foreground">
                                            {selectedOptions.length > 0
                                                ? `${selectedOptions.length} Tag${selectedOptions.length > 1 ? 's' : ''} selected`
                                                : placeholder}
                                        </span>
                                        <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>

                            <PopoverContent className="dark:bg-secondary z-[9999] max-h-[300px] w-[var(--radix-popover-trigger-width)] p-0">
                                <Command>
                                    <CommandInput placeholder="Search..." />
                                    <CommandList>
                                        <CommandEmpty>No options found.</CommandEmpty>
                                        <CommandGroup className="dark:bg-secondary w-full">
                                            {options.map(opt => {
                                                const checked = selectedValues.includes(opt.value)
                                                return (
                                                    <CommandItem
                                                        key={opt.value}
                                                        onSelect={() => toggle(opt.value)}
                                                        className="cursor-pointer"
                                                    >
                                                        <div className="mr-2">
                                                            <Checkbox checked={checked} aria-hidden />
                                                        </div>
                                                        <span className="flex-1">{opt.label}</span>
                                                        {checked && <Check className="h-4 w-4" />}
                                                    </CommandItem>
                                                )
                                            })}
                                        </CommandGroup>
                                    </CommandList>

                                    {selectedValues.length > 0 && (
                                        <div className="border-t p-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className="w-full"
                                                onClick={clearAll}
                                            >
                                                Clear all
                                            </Button>
                                        </div>
                                    )}
                                </Command>
                            </PopoverContent>
                        </Popover>



                        {/* preserve blur event for RHF */}
                        <input type="hidden" onBlur={field.onBlur} />
                        <FormMessage />

                    </FormItem>

                )}
            />
            {/* Display selected tags below the field, with flex-wrap */}
            {selectedOptions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {selectedOptions.map(opt => (
                        <Badge
                            key={opt.value}
                            className="bg-secondary text-sm text-white dark:bg-white dark:text-black flex items-center gap-1"
                        >
                            {opt.label}
                            <button
                                type="button"
                                title="Remove Tag"
                                onClick={() => clearOne(opt.value)}
                                className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
                            >
                                <X className="h-3 w-3 cursor-pointer" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}

export default RHFMultiSelectField
