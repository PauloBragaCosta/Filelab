"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Filter } from "@/types/search"
import { useFilterSelection } from "@/hooks/search/use-filter-selection"

interface FilterSelectorProps {
  filters: Filter[]
  selectedFilter: string
  onFilterChange: (value: string) => void
}

export function FilterSelector({
  filters,
  selectedFilter,
  onFilterChange,
}: FilterSelectorProps) {
  const { open, setOpen, handleFilterSelect } = useFilterSelection(onFilterChange)
  const [query, setQuery] = React.useState("")
  const selectedFilterLabel = filters.find(
    (filter) => filter.value === selectedFilter
  )?.label || "Filtro"

  const filteredFilters = filters.filter((filter) =>
    filter.label.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          className="absolute right-1 top-2 cursor-pointer"
        >
          <Badge variant="secondary" className="h-5 w-fit px-2 py-1 flex items-center gap-1">
            {selectedFilterLabel}
            <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
          </Badge>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Buscar filtro..."
            className="h-9"
            value={query}
            onValueChange={setQuery} // This is the key change
          />
          <CommandEmpty>Nenhum filtro encontrado.</CommandEmpty>
          <CommandGroup>
            {filteredFilters.map((filter) => ( // Use filteredFilters here
              <CommandItem
                key={filter.value}
                value={filter.value}
                onSelect={() => handleFilterSelect(filter.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedFilter === filter.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {filter.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}