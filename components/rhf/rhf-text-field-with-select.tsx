import React, { FC, useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '../ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { FormLabel } from '../ui/form';

interface PageProps {
    label?: string
    name: string;
    options: { value: string; label: string; disabled?: boolean }[];
    placeholder?: string;
}

const RHFTextfieldWithSelect: FC<PageProps> = ({
    name,
    label,
    options,
    placeholder = 'Select',
}) => {
    const { control } = useFormContext();
    const [open, setOpen] = useState(false);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                const selected = options.find((opt) => opt.value === field.value);
                return (
                    <>
                         {label && <FormLabel className="">{label}</FormLabel>}
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between"
                                >
                                    {selected ? selected.label : <span className="text-muted-foreground">{placeholder}</span>}
                                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 ">
                                <Command className='dark:bg-[#171717]'>
                                    <CommandInput placeholder="Search" />
                                    <CommandList>
                                        <CommandEmpty>No results found.</CommandEmpty>

                                        <CommandGroup >
                                            {options.slice(0, 3).map((opt) => (
                                                <CommandItem
                                                    key={opt.value}
                                                    onSelect={() => {
                                                        if (!opt.disabled) {
                                                            field.onChange(opt.value);
                                                            setOpen(false);
                                                        }
                                                    }}
                                                    disabled={opt.disabled}
                                                    className={clsx({
                                                        'opacity-50 pointer-events-none': opt.disabled,
                                                        'bg-muted': opt.value === field.value,
                                                    })}
                                                >
                                                    {opt.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>


                                        <CommandGroup>
                                            {options.slice(3).map((opt) => (
                                                <CommandItem
                                                    key={opt.value}
                                                    onSelect={() => {
                                                        if (!opt.disabled) {
                                                            field.onChange(opt.value);
                                                            setOpen(false);
                                                        }
                                                    }}
                                                    disabled={opt.disabled}
                                                    className={clsx({
                                                        'opacity-50 pointer-events-none': opt.disabled,
                                                        'bg-muted': opt.value === field.value,
                                                    })}
                                                >
                                                    {opt.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </>
                );
            }}
        />
    );
};

export default RHFTextfieldWithSelect;
