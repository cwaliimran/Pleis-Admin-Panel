"use client"

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { FC } from "react"
import { useFormContext } from "react-hook-form"

interface Option {
    label: string
    value: string
}

interface RHFSelectFieldProps {
    name: string
    label?: string
    placeholder?: string
    options: Option[]
    className?: string
}

const RHFSelectField: FC<RHFSelectFieldProps> = ({
    name,
    label,
    placeholder = "Select option",
    options,
    className = "",
}) => {
    const { control } = useFormContext()

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel>{label}</FormLabel>}
                    <Select
                        onValueChange={(val) => {
                            // Only update if valid
                            if (options.some(o => o.value === val)) {
                                field.onChange(val)
                            }
                        }}
                        value={field.value || ""} // ✅ controlled only
                    >
                        <FormControl>
                            <SelectTrigger className={`w-full ${className}`}>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="dark:bg-secondary">
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Hidden input to support RHF blur + validation */}
                    <input
                        type="hidden"
                        onBlur={field.onBlur}
                        value={field.value || ""}
                        name={field.name}
                        ref={field.ref}
                    />

                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default RHFSelectField
