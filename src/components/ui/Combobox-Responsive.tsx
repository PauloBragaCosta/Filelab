"use client"

import * as React from "react"

import { useMediaQuery } from "@react-hook/media-query"
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
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"

export type Status = {
    value: string
    label: string
}

export function ComboBoxResponsive({
    statuses,
    texArea,
    onStatusChange,
}: {
    statuses: Status[]
    texArea: any
    onStatusChange: (status: Status | null) => void
}) {

    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(
        null
    )

    


    const handleStatusSelect = (status: Status | null) => {
        setSelectedStatus(status);
        onStatusChange(status);
    };
    


    if (isDesktop) {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[150px] justify-start">
                        {selectedStatus ? <>{selectedStatus.label}</> : <>+ Definir {texArea}</>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                    <StatusList setOpen={setOpen} setSelectedStatus={handleStatusSelect} statuses={statuses} textArea={texArea}/>

                </PopoverContent>
            </Popover>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline" className="w-[150px] justify-start">
                    {selectedStatus ? <>{selectedStatus.label}</> : <>+ Definir {texArea}</>}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mt-4 border-t">
                    <StatusList setOpen={setOpen} setSelectedStatus={handleStatusSelect} statuses={statuses} textArea={texArea}/>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

function StatusList({
    setOpen,
    setSelectedStatus,
    statuses,
    textArea
}: {
    setOpen: (open: boolean) => void
    setSelectedStatus: (status: Status | null) => void
    statuses: Status[]
    textArea: string
}) {
    return (
        <Command>
            <CommandInput placeholder={`Filtrar ${textArea}...`} />
            <CommandList>
                <CommandEmpty>Nenhum resultado encontrado</CommandEmpty>
                <CommandGroup>
                    {statuses.map((statusItem) => (
                        <CommandItem
                            key={statusItem.value}
                            value={statusItem.value}
                            onSelect={(value) => {
                                setSelectedStatus(
                                    statuses.find((priority: { value: string }) => priority.value === value) || null
                                )
                                setOpen(false)
                            }}
                        >
                            {statusItem.label}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    )
}

