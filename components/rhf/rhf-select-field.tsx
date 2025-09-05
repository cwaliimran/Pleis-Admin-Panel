// components/form/RHFSelectField.tsx
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

interface RHFSelectFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string
    label?: string
    placeholder?: string
    options: Option[],
    className?: string
}

const RHFSelectField: FC<RHFSelectFieldProps> = ({
    name,
    label,
    placeholder = "Select option",
    options,
    className = "",
    ...rest
}) => {
    const { control } = useFormContext()

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel className="">{label}</FormLabel>}
                    <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
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
                    <input
                        type="hidden"
                        onBlur={field.onBlur}
                        value={field.value}
                        {...rest}
                    />
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default RHFSelectField
