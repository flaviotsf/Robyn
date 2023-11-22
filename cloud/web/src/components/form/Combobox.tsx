'use client';

import { useState } from 'react';
import { Popover, PopoverContent } from '../ui/popover';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandInput,
  CommandList,
} from '../ui/command';
import { cn } from '@/lib/utils';
import flatten from 'lodash/flatten';

export type ComboboxProps = {
  data: Array<{
    group: string;
    items: Array<{ value: string; label: string }>;
  }>;
  value: string | undefined;
  onChange: (newValue: string | undefined) => void;
  placeholderText: string;
  searchPlaceholderText: string;
  notFoundText: string;
  width?: number;
};

export function Combobox({
  data,
  value,
  onChange,
  notFoundText,
  searchPlaceholderText,
  placeholderText,
  width = 280,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const allItems = flatten(data.map((d) => d.items));
  const item = allItems.find(
    (i) => i.value.toLowerCase() === value?.toLowerCase()
  );
  const displayName = item != null ? item.label : placeholderText;

  // The command has a bug where it only searches by value
  const onValueChange = (v: string) => {
    const item = allItems.find(
      (i) => i.label.toLowerCase() === v?.toLowerCase()
    );
    setOpen(false);
    onChange(item?.value);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
          style={{ width }}
        >
          {displayName}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 z-50" style={{ width }}>
        <Command>
          <CommandInput placeholder={searchPlaceholderText} />
          <CommandEmpty>{notFoundText}</CommandEmpty>
          <CommandList className="max-h-[200px]">
            {data.map((item) => (
              <CommandGroup heading={item.group} key={item.group}>
                {item.items.map((groupItem) => (
                  <CommandItem
                    key={groupItem.label}
                    value={groupItem.label}
                    onSelect={onValueChange}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === groupItem.label ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {groupItem.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
