"use client";

import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Settings2 } from "lucide-react";
import { useState } from "react";

// Define filterable fields (based on headLabel)
const filterFields = [
  { id: "name", label: "By Name" },
  { id: "phone", label: "By Phone" },
  { id: "email", label: "By Email" },
  { id: "createdDate", label: "By Created Date" },
  { id: "subscriptionType", label: "By Subscription Type" },
  { id: "subscriptionValidity", label: "By Subscription End Date" },
  { id: "commission", label: "By Commission" },
  { id: "totalViews", label: "By Total Views" },
  { id: "totalRevenue", label: "By Total Revenue" },
  { id: "region", label: "By Region" },
];

export default function OrganizationFilter({ selectedField, onChangeField }: {
  selectedField: string;
  onChangeField: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const selectedLabel = filterFields.find(f => f.id === selectedField)?.label || "Filter by";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Badge className="bg-white text-black shadow-md px-3 py-1 text-md flex items-center gap-2 w-fit cursor-pointer">
          <Settings2 className="w-4 h-4" />
          <span className="whitespace-nowrap">{selectedLabel}</span>
        </Badge>
      </PopoverTrigger>

      <PopoverContent className="w-56 p-0">
        <Command>
          <CommandInput placeholder="Search fields..." />
          <CommandEmpty>No field found.</CommandEmpty>
          <CommandGroup>
            {filterFields.map((field) => (
              <CommandItem
                key={field.id}
                value={field.id}
                onSelect={(value) => {
                  onChangeField(value);
                  setOpen(false);
                }}
              >
                {field.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
