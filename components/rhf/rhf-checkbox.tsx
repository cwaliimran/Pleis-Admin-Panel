'use client'

import { Checkbox } from "@/components/ui/checkbox"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { FC } from "react"
import { useFormContext } from "react-hook-form"

interface RHFCheckboxProps {
    name: string
    label?: string
    description?: string,
    className?: string
}

const RHFCheckbox: FC<RHFCheckboxProps> = ({ name, label, description ,className}) => {
    const { control } = useFormContext()

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn("flex flex-row items-start space-x-3 space-y-4",className)}>
                    <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            ref={field.ref}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        {label && <FormLabel className="text-sm">{label}</FormLabel>}
                        {description && <FormDescription>{description}</FormDescription>}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default RHFCheckbox