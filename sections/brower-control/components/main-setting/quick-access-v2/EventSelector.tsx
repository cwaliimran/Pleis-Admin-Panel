"use client";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { mockEvents } from "./types";

interface EventSelectorProps {
  selectedEvent: number | null;
  onEventSelect: (eventId: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder?: string;
}

export const EventSelector = ({
  selectedEvent,
  onEventSelect,
  open,
  onOpenChange,
  placeholder = "Search and select an event...",
}: EventSelectorProps) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-11 px-3 bg-white border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <span
            className={
              selectedEvent ? "text-gray-900 dark:text-white" : "text-gray-500"
            }
          >
            {selectedEvent
              ? mockEvents.find((event) => event.id === selectedEvent)?.name
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 border-gray-200 shadow-lg"
        style={{ width: "var(--radix-popover-trigger-width)" }}
        onWheel={(e) => e.stopPropagation()}
      >
        <Command className="rounded-lg dark:bg-secondary">
          <CommandInput
            placeholder="Search events..."
            className="border-0 focus:ring-0 focus:outline-none h-11"
          />
          <div
            className="max-h-[240px] overflow-hidden"
            onWheel={(e) => {
              e.stopPropagation();
              const commandList = e.currentTarget.querySelector("[cmdk-list]");
              if (commandList) {
                commandList.scrollTop += e.deltaY;
              }
            }}
          >
            <CommandList className="max-h-[240px] overflow-y-auto">
              <CommandEmpty className="py-6 text-center text-sm text-gray-500">
                No event found.
              </CommandEmpty>
              <CommandGroup>
                {mockEvents.map((event) => (
                  <CommandItem
                    key={event.id}
                    value={event.name}
                    onSelect={() => {
                      onEventSelect(event.id);
                      onOpenChange(false);
                    }}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-50 dark:bg-secondary data-[selected]:bg-gray-50"
                  >
                    <Check
                      className={cn(
                        "mr-3 h-4 w-4 text-blue-600",
                        selectedEvent === event.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {event.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {event.category} • {event.date}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
