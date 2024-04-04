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

export type Status = {
    value: string
    label: string
}

export function ComboBoxResponsive({
    statuses,
    texArea,
    Formfather,
    IDFather, // esse e o valor do tutor mas vai ser levado para a raça tb quando fazer o banco de dados parecido com o do medico e tutor
    onStatusChange,
    disabledfield
}: {
    statuses: Status[] | null
    texArea: any
    IDFather: string | null
    Formfather: Status | null | undefined
    onStatusChange: (status: Status | null) => void
    disabledfield: any
}) {

    const [open, setOpen] = React.useState(false)
    const [disabledfieldany, setdisabled] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(
        null
    )
    const [Data, setData] = React.useState<{ label: string, value: string }[]>([]);


    const foundTutor = Data.find((r: { value: any }) => r.value === IDFather);

  
    React.useEffect(() => {
        if (foundTutor) {
            setSelectedStatus(foundTutor);
        }
    }, [IDFather]);

    React.useEffect(() => {
        setdisabled(disabledfield);

        if (IDFather === "invalido") {
        setdisabled(false);
        }
        
    }, [disabledfield]);



    const handleStatusSelect = (status: Status | null) => {
        setSelectedStatus(status);
        onStatusChange(status);
    };

    const [TutorState, setTutorState] = React.useState<Status | null>();


    React.useEffect(() => {
        if (TutorState) {
            setSelectedStatus(TutorState);
        }
    }, [TutorState]);

    React.useEffect(() => {
        find()
    }, []);

   


    async function find() {
        try {
            const response = await fetch(`/api/tasks/find${texArea}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                next: {
                    tags: ['get-tags']
                }
            });

            if (texArea === 'medico') {
                const Medicos = await response.json();

                // Transforma os dados para o formato desejado
                const formattedPosts = Medicos.map((post: {
                    nameMedico: any; idMedico: any
                }) => ({
                    label: post.nameMedico,
                    value: post.idMedico,
                }));


                sessionStorage.setItem('MedicoData', JSON.stringify(formattedPosts));
                setData(formattedPosts); // Atualiza o estado com os dados do tutor

                return formattedPosts;
            }


            if (texArea === 'tutor') {
                const Tutores = await response.json();

                // Transforma os dados para o formato desejado
                const formattedPosts = Tutores.map((post: {
                    nameTutor: any; idTutor: any
                }) => ({
                    label: post.nameTutor,
                    value: post.idTutor,
                }));


                const foundTutor = formattedPosts.find((r: { value: any }) => r.value === IDFather);
                setTutorState(foundTutor)


                sessionStorage.setItem('TutorData', JSON.stringify(formattedPosts));
                setData(formattedPosts); // Atualiza o estado com os dados do tutor

                return formattedPosts;
            }

            else if (texArea) {
                const Tutores = await response.json();
                // Transforma os dados para o formato desejado
                const formattedPosts = Tutores.map((post: {
                    label: any; value: any
                }) => ({
                    label: post.label,
                    value: post.value,
                }));

                const foundRaça = formattedPosts.find((r: { value: any }) => r.value === IDFather);

                console.log(foundRaça)


                setData(formattedPosts); // Atualiza o estado com os dados do tutor

                return formattedPosts;
            }

        } catch (error) {
            console.error("An error occurred while fetching data:", error);
        }
    }



    if (isDesktop) {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button disabled={disabledfieldany} variant="outline" className="w-[240px] justify-start text-muted-foreground">
                        {selectedStatus ? <>{selectedStatus.label}</> : <>+ Selecione o {texArea}</>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                    <StatusList setOpen={setOpen} setSelectedStatus={handleStatusSelect} statuses={Data} textArea={texArea} />

                </PopoverContent>
            </Popover>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button disabled={disabledfieldany} variant="outline" className="w-[240px] justify-start">
                    {selectedStatus ? <>{selectedStatus.label}</> : <>+ Selecione o {texArea}</>}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mt-4 border-t">
                    <StatusList setOpen={setOpen} setSelectedStatus={handleStatusSelect} statuses={Data} textArea={texArea} />
                </div>
            </DrawerContent>
        </Drawer>
    )
}

function StatusList({
    setOpen,
    setSelectedStatus,
    statuses,
    textArea,

}: {
    setOpen: (open: boolean) => void
    setSelectedStatus: (status: Status | null) => void
    statuses: Status[]
    textArea: string
}) {

    React.useEffect(() => {

        console.log(textArea)
    });
    return (
        <Command>
            <CommandInput placeholder={`Filtrar ${textArea}...`} />
            <CommandList>
                <CommandEmpty>Nenhum {textArea} encontrado</CommandEmpty>
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

