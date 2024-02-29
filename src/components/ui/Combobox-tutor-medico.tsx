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
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"

export type Status = {
    value: string
    label: string
}

export function ComboBoxResponsiveMedicoAndTutor({
    findany,
    fieldFather,
    textAreafather,
    formFather,
    
}: {
    findany: string
    
    fieldFather: any
    textAreafather: string
    formFather: any
    
}) {

    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")
   

    const [Data, setData] = useState<{ label: string, value: string }[]>([]);

    async function find() {
        try {
            const response = await fetch(`http://localhost:3000/api/tasks/find${findany}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                next: {
                    tags: ['get-tags']
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const Tutores = await response.json();
    
            // Transforma os dados para o formato desejado
            const formattedPosts = Tutores.map((post: {
                nameTutor: any; idTutor: any
            }) => ({
                label: post.nameTutor,
                value: post.idTutor,
            }));
    
            sessionStorage.setItem('TutorData', JSON.stringify(formattedPosts));
            setData(formattedPosts); // Atualiza o estado com os dados do tutor
    
            return formattedPosts;
        } catch (error) {
            console.error("An error occurred while fetching data:", error);
        }
    }
    



    if (isDesktop) {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-[500px] justify-between",
                            !fieldFather.value && "text-muted-foreground"
                        )}
                        onClick={async () => {
                            await find();
                            const storedTutorDataItem = sessionStorage.getItem('TutorData');
                            if (storedTutorDataItem !== null) {
                                const TutorData = JSON.parse(storedTutorDataItem);
                                console.log(TutorData);
                                setData(TutorData); // Atualiza o estado com os dados do tutor
                            } else {
                                console.log('No TutorData found in sessionStorage');
                            }
                        }}
                    >
                        {fieldFather.value
                            ? Data?.find(
                                (tutor: Status) => tutor.value === fieldFather.value
                            )?.label
                            : "Selecione o tutor"}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[500px] p-0" align="start">
                    <StatusList nameArea={textAreafather} textArea={findany} setOpenSon={setOpen} dataSon={Data} formSon={formFather} fieldSon={fieldFather}/>

                </PopoverContent>
            </Popover>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-[500px] justify-between",
                        !fieldFather.value && "text-muted-foreground"
                    )}
                    onClick={async () => {
                        await find();
                        const storedTutorDataItem = sessionStorage.getItem('TutorData');
                        if (storedTutorDataItem !== null) {
                            const TutorData = JSON.parse(storedTutorDataItem);
                            console.log(TutorData);
                            setData(TutorData); // Atualiza o estado com os dados do tutor
                        } else {
                            console.log('No TutorData found in sessionStorage');
                        }
                    }}
                >
                    {fieldFather.value
                        ? Data?.find(
                            (tutor: Status) => tutor.value === fieldFather.value
                        )?.label
                        : "Selecione o tutor"}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mt-4 border-t">
                    <StatusList nameArea={textAreafather} textArea={findany} setOpenSon={setOpen} dataSon={Data} formSon={formFather} fieldSon={fieldFather}/>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

function StatusList({
    nameArea,
    textArea,
    setOpenSon,
    dataSon,
    formSon,
    fieldSon,
}: {
    
    nameArea: string
    textArea: string
    setOpenSon: any
    dataSon: any
    formSon: any
    fieldSon: any
}) {


    return (
        <Command>
            <CommandInput value={nameArea || ""} placeholder={`Pesquise o ${textArea}...`} />
            <CommandEmpty>Nenhuma tutor encontrada.</CommandEmpty>
            <CommandGroup style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                {dataSon?.map((tutor: Status) => (
                    <CommandItem
                        value={tutor.label}
                        key={tutor.value}
                        onSelect={() => {
                            formSon.setValue("tutorId", tutor.value)
                            setOpenSon(false)
                        }}
                    >
                        <CheckIcon
                            className={cn(
                                "h-4 w-4 shrink-0",
                                fieldSon.value === tutor.value && "text-primary"
                            )}
                        />
                        {tutor.label}
                    </CommandItem>
                ))}
            </CommandGroup>

        </Command>
    )
}




