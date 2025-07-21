// // 
// "use client";

// import { useState } from "react";
// import { Check, Settings2 } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from "@/components/ui/command";

// type Option = {
//   id: string;
//   label: string;
// };

// interface FilterDropdownProps {
//   options: Option[];
//   selectedOptions: string[];
//   onSelectOption: (selected: string[]) => void;
//   icon?: React.ReactNode;
//   placeholder?: string;
// }

// export default function FilterDropdown({
//   options,
//   selectedOptions,
//   onSelectOption,
//   icon = <Settings2 className="w-4 h-4" />,
//   placeholder = "Filter by",
// }: FilterDropdownProps) {
//   const [open, setOpen] = useState(false);

//   const toggleOption = (value: string) => {
//     if (selectedOptions.includes(value)) {
//       onSelectOption(selectedOptions.filter((id) => id !== value));
//     } else {
//       onSelectOption([...selectedOptions, value]);
//     }
//   };

//   const selectedLabels = options
//     .filter((opt) => selectedOptions.includes(opt.id))
//     .map((opt) => opt.label);

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Badge className="bg-white text-black shadow-md px-3 py-1 text-md flex items-center gap-2 w-fit cursor-pointer">
//           {icon}
//           <span className="whitespace-nowrap text-[10px]">
//             {selectedLabels.length > 0
//               ? selectedLabels.join(",")
//               : placeholder}
//           </span>
//         </Badge>
//       </PopoverTrigger>

//       <PopoverContent className="w-56 p-0">
//         <Command>
//           <CommandInput placeholder="Search fields..." />
//           <CommandEmpty>No field found.</CommandEmpty>
//           <CommandGroup>
//             {options.map((option) => {
//               const isSelected = selectedOptions.includes(option.id);
//               return (
//                 <CommandItem
//                   key={option.id}
//                   value={option.id}
//                   onSelect={() => toggleOption(option.id)}
//                 >
//                   <span className="flex items-center justify-between w-full">
//                     {option.label}
//                     {isSelected && <Check className="w-4 h-4 text-primary" />}
//                   </span>
//                 </CommandItem>
//               );
//             })}
//           </CommandGroup>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// }

"use client";

import { useState } from "react";
import { Check, Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

type Option = {
  id: string;
  label: string;
};

interface FilterDropdownProps {
  options: Option[];
  selectedOptions: string[];
  onSelectOption: (selected: string[]) => void;
  icon?: React.ReactNode;
  placeholder?: string;
}

export default function FilterDropdown({
  options,
  selectedOptions,
  onSelectOption,
  icon = <Settings2 className="w-4 h-4" />,
  placeholder = "Filter by",
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);

  const toggleOption = (value: string) => {
    if (selectedOptions.includes(value)) {
      onSelectOption(selectedOptions.filter((id) => id !== value));
    } else {
      onSelectOption([...selectedOptions, value]);
    }
  };

  const selectedLabels = options
    .filter((opt) => selectedOptions.includes(opt.id))
    .map((opt) => opt.label);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="inline-flex items-center gap-2 cursor-pointer px-3 py-1 border rounded-md shadow-sm text-sm bg-white text-black hover:bg-gray-50 transition">
          {icon}
          <span className="truncate max-w-[150px] text-xs">
            {selectedLabels.length > 0
              ? selectedLabels.join(", ")
              : placeholder}
          </span>
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => {
              const isSelected = selectedOptions.includes(option.id);
              return (
                <CommandItem
                  key={option.id}
                  value={option.id}
                  onSelect={() => toggleOption(option.id)}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2",
                    isSelected && "bg-muted"
                  )}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-primary" />}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
