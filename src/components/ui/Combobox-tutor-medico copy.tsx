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
    IDFather

}: {
    findany: string

    fieldFather: any
    textAreafather: string
    formFather: any
    IDFather: string

}) {

    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")


    const [Data, setData] = useState<{ label: string, value: string }[]>([]);

  const [TutorState, setTutorState] = useState<Status | null>();
  
  React.useEffect(() => {
    find()
}, []);

React.useEffect(() => {
    getButtonLabel();
}, [IDFather]);


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

            if (findany === 'Medico') {
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


            else if (findany === 'Tutor') {
                const Tutores = await response.json();

                // Transforma os dados para o formato desejado
                const formattedPosts = Tutores.map((post: {
                    nameTutor: any; idTutor: any
                }) => ({
                    label: post.nameTutor,
                    value: post.idTutor,
                }));

                console.log(IDFather)

                const foundTutor = formattedPosts.find((r: { value: any }) => r.value === IDFather);
                setTutorState(foundTutor)

                console.log(foundTutor)


                sessionStorage.setItem('TutorData', JSON.stringify(formattedPosts));
                setData(formattedPosts); // Atualiza o estado com os dados do tutor

                return formattedPosts;
            }

        } catch (error) {
            console.error("An error occurred while fetching data:", error);
        }
    }

    function getButtonLabel() {
        if (findany === 'Medico') {
            if (fieldFather.value) {
                const selectedMedico = Data?.find(
                    (medico: Status) => medico.value === fieldFather.value
                );
                return selectedMedico?.label;
            }
            return "Selecione o medico";
        }
        else if (findany === 'Tutor') {
            if (fieldFather.value) {
                const selectedTutor = Data?.find(
                    (tutor: Status) => tutor.value === fieldFather.value
                );
                return selectedTutor?.label;
            }

            if (TutorState) {
                return `${TutorState.label}`;
            }
           
            return "Selecione o tutor";
        }
    }




    async function handleButtonClick() {
        if (findany === 'Medico') {
            await find();
            const storedMedicoDataItem = sessionStorage.getItem('MedicoData');
            if (storedMedicoDataItem !== null) {
                const MedicoData = JSON.parse(storedMedicoDataItem);
                console.log(MedicoData);
                setData(MedicoData); // Atualiza o estado com os dados do tutor
            } else {
                console.log('No MedicoData found in sessionStorage');
            }
        }
        else if (findany === 'Tutor') {
            await find();
            const storedTutorDataItem = sessionStorage.getItem('TutorData');
            if (storedTutorDataItem !== null) {
                const TutorData = JSON.parse(storedTutorDataItem);
                console.log(TutorData);
                setData(TutorData); // Atualiza o estado com os dados do tutor
            } else {
                console.log('No TutorData found in sessionStorage');
            }
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
                        onClick={handleButtonClick}
                    >
                        {getButtonLabel()}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[500px] p-0" align="start">
                    <StatusList nameArea={textAreafather} textArea={findany} setOpenSon={setOpen} dataSon={Data} formSon={formFather} fieldSon={fieldFather} TutorStateSon={TutorState}/>

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
                    onClick={handleButtonClick}
                >
                    {getButtonLabel()}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mt-4 border-t">
                    <StatusList nameArea={textAreafather} textArea={findany} setOpenSon={setOpen} dataSon={Data} formSon={formFather} fieldSon={fieldFather} TutorStateSon={TutorState}/>
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
    TutorStateSon,
}: {

    nameArea: string
    textArea: string
    setOpenSon: any
    dataSon: any
    formSon: any
    fieldSon: any
    TutorStateSon: any
}) {

    function renderCommandItems() {
        if (textArea === 'Medico') {
            return (
                dataSon?.map((medico: Status) => (
            <CommandItem
              value={medico.label}
              key={medico.value}
              onSelect={() => {
                formSon.setValue("medico", medico.value)
                setOpenSon(false)
              }}
            >
              <CheckIcon
                className={cn(
                  "h-4 w-4 shrink-0",
                  fieldSon.value === medico.value && "text-primary"
                )}
              />
              {medico.label}
            </CommandItem>
          )));
        }

        else if (textArea === 'Tutor') {
            return (
                dataSon?.map((tutor: Status) => (
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
              )));
      }
    }



    return (
        <Command>
            <CommandInput value={nameArea || ""} placeholder={`Pesquise o ${textArea}...`} />
            <CommandEmpty>Nenhuma {textArea} encontrada.</CommandEmpty>
            <CommandGroup style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                {renderCommandItems()}
            </CommandGroup>
        </Command>
    )
}




