// components/CommandDialogSearch.tsx
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";

interface Item {
  itemCode: string;
  itemType: string;
}

interface CommandDialogSearchProps {
  items: Item[];
  onSelectItem: (itemCode: string) => void;
}

export function CommandDialogSearch({ items, onSelectItem }: CommandDialogSearchProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false);
    onSelectItem(currentValue);
  };

  const normalizeCode = (code: string) => {
    return code.replace(/-/g, "").padStart(10, "0");
  };

  const sortedItems = [...items].sort((a, b) =>
    normalizeCode(a.itemCode).localeCompare(normalizeCode(b.itemCode))
  );

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} className="relative ml-auto flex-1 md:grow-0">
        <div className="flex w-full gap-20 md:w-auto">
          <div className="gap-20">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <span className="ml-8 md:ml-2">Search...</span>
          </div>
          <p className="hidden md:flex text-sm text-muted-foreground items-center ml-2">
            Press{" "}
            <kbd className="ml-1 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>J
            </kbd>
          </p>
        </div>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {sortedItems.map((item, index) => (
              <CommandItem
                key={index}
                onSelect={() => handleSelect(item.itemCode)}
              >
                {item.itemCode}
                <CommandShortcut>{item.itemType}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}