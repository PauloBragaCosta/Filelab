import React, { useCallback, useEffect, useMemo, useState, KeyboardEvent as ReactKeyboardEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useDebounce } from 'use-debounce'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { useMediaQuery } from '@react-hook/media-query'

interface Item {
  itemCode: string
  itemType: string
}

interface CommandDialogSearchProps {
  items: Item[]
  onSelectItem: (itemCode: string) => void
}

export function CommandDialogSearch({ items, onSelectItem }: CommandDialogSearchProps) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const commonTriggerButton = (
    <Button
      variant="outline"
      className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
      onClick={() => setOpen(true)}
    >
      <Search className="mr-2 h-4 w-4" />
      <span className="hidden lg:inline-flex">Search items...</span>
      <span className="inline-flex lg:hidden">Search...</span>
      <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {commonTriggerButton}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          
          <ProfileForm items={items} onSelectItem={onSelectItem} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {commonTriggerButton}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Buscar pelo id</DrawerTitle>
          <DrawerDescription>
            Search for items by code or type.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm items={items} onSelectItem={onSelectItem} setOpen={setOpen} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

interface ProfileFormProps extends CommandDialogSearchProps {
  setOpen: (open: boolean) => void
}

function ProfileForm({ items, onSelectItem, setOpen }: ProfileFormProps) {
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounce(search, 300)

  const filteredItems = useMemo(() => {
    if (!debouncedSearch) return items
    const searchLower = debouncedSearch.toLowerCase()
    return items.filter(
      item =>
        item.itemCode.toLowerCase().includes(searchLower) ||
        item.itemType.toLowerCase().includes(searchLower)
    )
  }, [items, debouncedSearch])

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const aCode = a.itemCode.replace(/-/g, "").padStart(10, "0")
      const bCode = b.itemCode.replace(/-/g, "").padStart(10, "0")
      return aCode.localeCompare(bCode)
    })
  }, [filteredItems])

  const handleSelect = useCallback((currentValue: string) => {
    setOpen(false)
    onSelectItem(currentValue)
  }, [onSelectItem, setOpen])

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && sortedItems.length > 0) {
      handleSelect(sortedItems[0].itemCode)
    }
  }

  return (
    <div className="grid gap-4 py-4">
      <div className="flex items-center">
        <Search className="mr-2 h-4 w-4" />
        <Input
          placeholder="Type to search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="max-h-[300px] overflow-y-auto">
        {sortedItems.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">No results found.</p>
        ) : (
          <ul>
            {sortedItems.map((item) => (
              <li
                key={item.itemCode}
                className="flex items-center justify-between px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                onClick={() => handleSelect(item.itemCode)}
              >
                <span>{item.itemCode}</span>
                <span className="text-muted-foreground">{item.itemType}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}