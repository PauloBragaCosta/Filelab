"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface Item {
    id: string;
    label: string;
}

interface ComboboxProps extends React.ComponentPropsWithoutRef<'div'> {
    tag: string;
    disabledfield: boolean;
    onStatusChange: (status: string) => void;
    nomePrint: (status: string) => void;
    fetchItems: () => Promise<Item[]>;
    refreshTrigger: number;
    newItemId?: string;
}

export const Combobox = React.forwardRef<HTMLDivElement, ComboboxProps>(
    ({ tag, disabledfield, onStatusChange, fetchItems, nomePrint, refreshTrigger, newItemId, ...props }, ref) => {
        const [open, setOpen] = React.useState(false)
        const [value, setValue] = React.useState("")
        const [items, setItems] = React.useState<Item[]>([])

        React.useEffect(() => {
            const loadItems = async () => {
                const fetchedItems = await fetchItems();
                setItems(fetchedItems);

                if (newItemId) {
                    setValue(newItemId);
                    onStatusChange(newItemId);
                }
            };
            loadItems();
        }, [fetchItems, refreshTrigger, newItemId, onStatusChange]);

        return (
            <div ref={ref} {...props}>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                            disabled={disabledfield}
                        >
                            {value === "medico"
                                ? "Procure aqui o medico"
                                : value
                                    ? items.find((item) => item.id === value)?.label
                                    : `ou selecionar um registro de ${tag}`}


                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput placeholder={`Buscar ${tag}...`} />
                            <CommandList>
                                <CommandEmpty>Não foram encontrados {tag}</CommandEmpty>
                                <CommandGroup>
                                    {items.map((item) => (
                                        <CommandItem
                                            key={item.id}
                                            value={item.id}
                                            onSelect={(currentValue) => {
                                                setValue(currentValue === value ? "" : currentValue)
                                                onStatusChange(currentValue)
                                                nomePrint(item.label)
                                                setOpen(false)
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === item.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {item.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        )
    }
)

// Adicionar displayName para melhor debugging
Combobox.displayName = "Combobox"