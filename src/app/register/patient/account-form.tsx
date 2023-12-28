"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from 'next/navigation';

import { cn } from "@/lib/utils"
import { Button } from "../../../components/ui/button"
import { Calendar } from "../../../components/ui/calendar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../../../components/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form"

import { Input } from "../../../components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card"

import { toast } from "../../../components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { TutorForm } from "../tutor/tutor-form copy"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import React, { useState } from 'react';
import { MedicoForm } from "../doctor/doctor-form copy"


const breed = [
  { label: "Labrador Retriever", value: "labrador" },
  { label: "Bulldog Francês", value: "bulldog_frances" },
  { label: "Poodle", value: "poodle" },
  { label: "Beagle", value: "beagle" },
  { label: "Rottweiler", value: "rottweiler" },
  { label: "Yorkshire Terrier", value: "yorkshire" },
  { label: "Dachshund", value: "dachshund" },
  { label: "Shih Tzu", value: "shihtzu" },
  { label: "Husky Siberiano", value: "husky" },
] as const;


const species = [
  { label: "Equino", value: "Equino" },
  { label: "Caprino", value: "Caprino" },
  { label: "canino", value: "canino" },
] as const;

const gender = [
  { label: "Macho", value: "Macho" },
  { label: "Fêmea", value: "Fêmea" },
] as const;



type Tutor = {
  label: string;
  value: string;
};

type Medico = {
  label: string;
  value: string;
};

const accountFormSchema = z.object({
  nomeCompleto: z.string({
    required_error: "Please select a observation.",
  }),
  dataNascimento: z.date({
    required_error: "A date of birth is required.",
  }),
  raca: z.string({
    required_error: "Please select a breed.",
  }),
  especie: z.string({
    required_error: "Please select a species.",
  }),
  sexo: z.string({
    required_error: "Please select a species.",
  }),
  tutorId: z.string({
    required_error: "Please select a species.",
  }),
  medico: z.string({
    required_error: "Please select a species.",
  }),
})

type AccountFormValues = z.infer<typeof accountFormSchema>


// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  // nomeCompleto: "Your name",
  // dataNascimento: new Date("2023-01-23"),
  // raca: "yorkshire",
  // especie: "canino",
  // sexo: "femea",

}



export function AccountForm() {

  const [openRaca, setOpenRaca] = React.useState(false)


  const [TutorData, setTutorData] = useState<{ label: string, value: string }[]>([]);
  const [openTutor, setOpenTutor] = React.useState(false)

  const [MedicoData, setMedicoData] = useState<{ label: string, value: string }[]>([]);
  const [openMedico, setOpenMedico] = React.useState(false)

  const router = useRouter();

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });



  async function onSubmit(data: AccountFormValues) {
    console.log(data);


    // Armazene os dados do paciente no localStorage
    sessionStorage.setItem('pacienteData', JSON.stringify(data));

    const response = await fetch('http://localhost:3000/api/tasks/create', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const jsonResponse = await response.json();
    const medicoid = data.medico


    sessionStorage.setItem('IdPaciente', JSON.stringify(jsonResponse));
    sessionStorage.setItem('MedicoId', JSON.stringify(medicoid));



  

    // Redirecione para a página do tutor
    router.push('/register/sample');


    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })

  }



  async function findTutor() {
    const response = await fetch('http://localhost:3000/api/tasks/findTutor', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
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
    setTutorData(formattedPosts); // Atualiza o estado com os dados do tutor

    return formattedPosts;
  }

  async function findMedico() {
    const response = await fetch('http://localhost:3000/api/tasks/findMedico', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const Medicos = await response.json();

    // Transforma os dados para o formato desejado
    const formattedPosts = Medicos.map((post: {
      nameMedico: any; idMedico: any
    }) => ({
      label: post.nameMedico,
      value: post.idMedico,
    }));

    sessionStorage.setItem('MedicoData', JSON.stringify(formattedPosts));
    setMedicoData(formattedPosts); // Atualiza o estado com os dados do tutor

    return formattedPosts;
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="nomeCompleto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paciente</FormLabel>
              <FormControl>
                <Input placeholder="Nome Completo" {...field} />
              </FormControl>
              <FormDescription>
                Este é o nome do animal
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="especie"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Espécie</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="canino" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Canino
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="felino" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Felino
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="outros" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[200px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? species.find(
                                  (species) => species.value === field.value
                                )?.label
                                : "Selecione uma espécie"}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Pesquise a espécies..." />
                            <CommandEmpty>Nenhuma Espécies encontrada.</CommandEmpty>
                            <CommandGroup>
                              {species.map((species) => (
                                <CommandItem
                                  value={species.label}
                                  key={species.value}
                                  onSelect={() => {
                                    form.setValue("especie", species.value)
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      "h-4 w-4 shrink-0",
                                      field.value === species.value && "text-primary"
                                    )}
                                  />
                                  {species.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sexo"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Sexo do animal</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="canino" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Macho
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="felino" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Fêmea
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dataNascimento"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Idade Anos Meses</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Escolha uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                A data de nascimento é usada para calcular a idade do animal.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="raca"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Selecione a raça do animal</FormLabel>
              <Popover open={openRaca} onOpenChange={setOpenRaca}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openRaca}
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? breed.find(
                          (breed) => breed.value === field.value
                        )?.label
                        : "Selecione a raça"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Pesquise a raça..." />
                    <CommandEmpty>Nenhuma raça encontrada.</CommandEmpty>
                    <CommandGroup>
                      {breed.map((breed) => (
                        <CommandItem
                          value={breed.label}
                          key={breed.value}
                          onSelect={() => {
                            form.setValue("raca", breed.value)
                            setOpenRaca(false)
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              "h-4 w-4 shrink-0",
                              field.value === breed.value && "text-primary"
                            )}
                          />
                          {breed.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Selecione a raça do animal.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Card>
          <CardHeader>
            <CardTitle>Tutor</CardTitle>
            <CardContent className="p-0 center"><FormField
              control={form.control}
              name="tutorId"
              render={({ field }) => (
                //aqui 321
                <FormItem className="space-y-0 flex flex-row justify-between mx-0 object-top">
                  <div className="flex flex-col">
                    <Popover open={openTutor} onOpenChange={setOpenTutor}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openTutor}
                            className={cn(
                              "w-[500px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                            onClick={async () => {
                              await findTutor();
                              const storedTutorDataItem = sessionStorage.getItem('TutorData');
                              if (storedTutorDataItem !== null) {
                                const TutorData = JSON.parse(storedTutorDataItem);
                                console.log(TutorData);
                                setTutorData(TutorData); // Atualiza o estado com os dados do tutor
                              } else {
                                console.log('No TutorData found in sessionStorage');
                              }
                            }}
                          >
                            {field.value
                              ? TutorData?.find(
                                (tutor: Tutor) => tutor.value === field.value
                              )?.label
                              : "Selecione o tutor"}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[500px] p-0">
                        <Command>
                          <CommandInput placeholder="Pesquise o tutor..." />
                          <CommandEmpty>Nenhuma tutor encontrada.</CommandEmpty>
                          <CommandGroup style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                            {TutorData?.map((tutor: Tutor) => (
                              <CommandItem
                                value={tutor.label}
                                key={tutor.value}
                                onSelect={() => {
                                  form.setValue("tutorId", tutor.value)
                                  setOpenTutor(false)
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    "h-4 w-4 shrink-0",
                                    field.value === tutor.value && "text-primary"
                                  )}
                                />
                                {tutor.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>

                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Procure o nome do tutor
                    </FormDescription>
                    <FormMessage />
                  </div>
                  <div className="mx-0">
                    <AlertDialog >
                      <AlertDialogTrigger asChild >
                        <Button variant="outline">+ cadastrar</Button>
                      </AlertDialogTrigger>
                      <TutorForm />
                    </AlertDialog>
                  </div>
                </FormItem>

              )}
            /></CardContent>


            <CardTitle>Médico</CardTitle>
            <CardContent className="p-0 center"><FormField
              control={form.control}
              name="medico"
              render={({ field }) => (
                //aqui 321
                <FormItem className="space-y-0 flex flex-row justify-between mx-0 object-top">
                  <div className="flex flex-col">
                    <Popover open={openMedico} onOpenChange={setOpenMedico}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openMedico}
                            className={cn(
                              "w-[500px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                            onClick={async () => {
                              await findMedico();
                              const storedMedicoDataItem = sessionStorage.getItem('MedicoData');
                              if (storedMedicoDataItem !== null) {
                                const MedicoData = JSON.parse(storedMedicoDataItem);
                                console.log(MedicoData);
                                setMedicoData(MedicoData); // Atualiza o estado com os dados do tutor
                              } else {
                                console.log('No MedicoData found in sessionStorage');
                              }
                            }}
                          >
                            {field.value
                              ? MedicoData?.find(
                                (medico: Medico) => medico.value === field.value
                              )?.label
                              : "Selecione o medico"}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[500px] p-0">
                        <Command>
                          <CommandInput placeholder="Pesquise o medico..." />
                          <CommandEmpty>Nenhuma medico encontrada.</CommandEmpty>
                          <CommandGroup style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                            {MedicoData?.map((medico: Medico) => (
                              <CommandItem
                                value={medico.label}
                                key={medico.value}
                                onSelect={() => {
                                  form.setValue("medico", medico.value)
                                  setOpenMedico(false)
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    "h-4 w-4 shrink-0",
                                    field.value === medico.value && "text-primary"
                                  )}
                                />
                                {medico.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>

                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Procure o nome do tutor
                    </FormDescription>
                    <FormMessage />
                  </div>
                  <div className="mx-0">
                    <AlertDialog >
                      <AlertDialogTrigger asChild >
                        <Button variant="outline">+ cadastrar</Button>
                      </AlertDialogTrigger>
                      <MedicoForm />
                    </AlertDialog>
                  </div>
                </FormItem>

              )}
            /></CardContent>
          </CardHeader>
        </Card>



        <Button type="submit" className="mt-4">
          Proximo
        </Button>
      </form>
    </Form>

  )
}

