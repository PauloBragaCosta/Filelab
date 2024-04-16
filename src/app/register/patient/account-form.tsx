"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from 'next/navigation';

import { Button } from "../../../components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form"

import {
  PersonIcon,
} from "@radix-ui/react-icons"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandInputSearch,
  CommandList,
} from "../../../components/ui/command"

import { toast } from "../../../components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import React, { useEffect, useState } from 'react';
import { ComboBoxResponsive, Status } from "@/components/ui/Combobox-Responsive"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TabsCalendario } from "@/components/ui/TabsCalendario"
import Cookies from 'js-cookie'
import { AddTags } from "./addtags";
import { AddTutor } from "./addtutor";
import { AddMedico } from "./addMedico";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDownIcon, SearchIcon, Bird, Rabbit, Turtle } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { truncate } from "fs";




const especie: Status[] = [
  { label: "Equino", value: "equino" },
  { label: "Caprino", value: "caprino" },
  { label: "Canino", value: "canino" },
  { label: "Felino", value: "felino" },
] as const;


const accountFormSchema = z.object({
  nomeCompleto: z.string({
    required_error: "Escreva um nome valido",
  }),
  dataNascimento: z.date({
    required_error: "A date of birth is required.",
  }),
  raca: z.string({
    required_error: "Please select a breed.",
  }),
  especieValue: z.string({
    required_error: "Please select a species.",
  }),
  sexo: z.string({
    required_error: "Please select a species.",
  }),
  tutorId: z.string({
    required_error: "Please select a species.",
  }),
  medicoId: z.string({
    required_error: "Please select a species.",
  }),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

export function AccountForm() {


  const [sexoForm, setsexoForm] = useState("");
  const [pacienteForm, setPacienteForm] = useState("")

  const [nameMedicofind, setNameMedicofind] = React.useState<string | undefined>("")
  const [MedicoIDForm, setMedicoIDForm] = useState<string | undefined>("")


  const [especieForm, setEspecieForm] = useState("")
  const [DataForm, setDataForm] = useState<Date>()
  const [racaForm, setracaForm] = useState("")
  // const [tutorState, setTutorState] = useState<Status | null>(); não vai dar certo pois todos precisam ser o Value ID

  const [tutorIDForm, setTutorIDForm] = useState("")
  const [nameTutorfind, setNameTutorfind] = React.useState<string | undefined>("")

  const [isVisible, setIsVisible] = useState(false);
  const [cadastroisVisible, setCadastroIsVisible] = useState(false);

 
  React.useEffect(() => {
    if (pacienteForm !== "") {
      setCadastroIsVisible(true);
      console.log(pacienteForm);
    }
  }, [pacienteForm]);
  



  const [dataPaciente, setDataPaciente] = useState<{
    PacientId: number;
    nomeCompleto: string;
    especieValue: string;
    sexoValue: string;
    dataNascimento: Date;
    racaValue: string;
    createdAt: Date;
    updatedAt: Date;
    tutorId: string;
    ExameDoPaciente: any[];
    Tutor: any;
    Raca: any;
    sexo: any;
    Especie: any;
  }[]>([]);






  // This can come from your database or API.
  const defaultValues: Partial<AccountFormValues> = {
    nomeCompleto: "pacientes",
    // dataNascimento: new Date("2023-01-23"),
    // raca: "teste-02",
    // especieValue: "teste-07",
    // sexo: "Femea",
  }

  const router = useRouter();

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  const [iAForm, setIAForm] = useState(false);

  // useEffect(() => {
  //   //const pacienteSON = sessionStorage.getItem('PacienteSON');


  //   if (pacienteSON) {
  //     setIAForm(true);
  //   }

  //   findPaciente();
  // }, [])

  useEffect(() => {
    findPaciente();
  }, [])




  async function findPaciente() {

    const response = await fetch('/api/tasks/findPaciente', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      next: {
        tags: ['get-tags']
      }
    });


    const Paciente = await response.json() as any;

    //Transforma os dados para o formato desejado
    const formattedPosts = Paciente.map((post: {
      PacientId: number;
      nomeCompleto: string;
      especieValue: string;
      sexoValue: string;
      dataNascimento: Date;
      racaValue: string;
      createdAt: Date;
      updatedAt: Date;
      tutorId: string;
      ExameDoPaciente: any[];
      Tutor: any;
      Raca: any;
      sexo: any;
      Especie: any;
    }) => ({
      nomeCompleto: post.nomeCompleto,
      PacientId: post.PacientId,
      especieValue: post.especieValue,
      sexoValue: post.sexoValue,
      dataNascimento: post.dataNascimento,
      racaValue: post.racaValue,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      tutorId: post.tutorId,
      ExameDoPaciente: post.ExameDoPaciente,
      Tutor: post.Tutor,
      Raca: post.Raca,
      sexo: post.sexo,
      Especie: post.Especie,
    }));

    setDataPaciente(formattedPosts)

  }


  const [pacientIdForm, setPacientIdForm] = useState(0)



  async function onSubmit(data: AccountFormValues) {
    console.log(data)
    if (pacientIdForm === 0) {
      // Armazene os dados do paciente no localStorage
      //sessionStorage.setItem('pacienteData', JSON.stringify(data));

      const response = await fetch('/api/tasks/create', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Converte a resposta para JSON
      const responseData = await response.json();
      const medicoID = (data.medicoId);


      // Agora você pode acessar o PacientId
      setPacientIdForm(responseData.IdPaciente)


      Cookies.set('PacienteName', pacienteForm)
      Cookies.set('PacienteID', responseData.IdPaciente)
      Cookies.set('MedicoNameID', medicoID)
      if (nameTutorfind !== undefined) {
        Cookies.set('TutoreName', nameTutorfind)
      }

      // Redirecione para a página do tutor
      router.push(`/register/sample?PacienteID=${responseData.IdPaciente}`);

    }

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })

  }


  const [disabledfield, setdisabled] = React.useState(false)




  const handleValueChange = (value: string) => {
    setPacienteForm(value);
  };


  async function Dataformat(event: Date) {

    var { zonedTimeToUtc, format } = require('date-fns-tz'); // requer a biblioteca date-fns-tz.js

    function convertIsoToReadable(isoString: Date) {
      // Converte a string ISO para um objeto Date
      var date = zonedTimeToUtc(isoString, 'Etc/UTC');

      // Formata a data no formato desejado
      var formattedDate = format(date, "EEE MMM dd yyyy HH:mm:ss 'GMT'xx '(Horário Padrão de Brasília)'", { timeZone: 'America/Sao_Paulo' });

      return formattedDate.replace(/GMT\+(\d{2})(\d{2})/, 'GMT-$1$2');
    }





  }

  let [condition, setCondition] = useState(false);




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
                <Command className="rounded-lg border shadow-md h-35">

                  <div className="flex">
                    <CommandInput placeholder="Digite ou pesquise o nome do animal..." value={pacienteForm} onValueChange={handleValueChange} />
                    <div className="border-b">
                      <Button variant="ghost" className="flex-none my-3 mr-4" onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        field.onChange('');
                        setdisabled(true);
                        setPacienteForm('');
                        setEspecieForm("");
                        setsexoForm("");
                        setracaForm("");
                        setTutorIDForm("");
                        setMedicoIDForm("");
                        setPacientIdForm(0);
                        setDataForm(undefined)
                        setCondition(false)
                        setCadastroIsVisible(false)

                      }}>apagar</Button>
                    </div>
                    {cadastroisVisible ? (
                      <Button className="flex-none my-3 mr-4" onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setdisabled(false);
                        setPacientIdForm(0);
                        setEspecieForm("");
                        setsexoForm("");
                        setracaForm("");
                        setTutorIDForm("");
                        setMedicoIDForm("");
                        setDataForm(undefined);
                        field.onChange(pacienteForm);
                        setCondition(false)

                      }}>Cadastrar</Button>
                    ) : (<></>)}
                  </div>

                  <CommandList>
                    <CommandEmpty>
                      <h1>Não foram encontrados pacientes com esse mesmo nome.</h1>
                    </CommandEmpty>

                    <ScrollArea className="w-full rounded-md border">
                      <CommandGroup heading="Nomes encontrados no sistema">
                        {dataPaciente.map((statusItem) => (
                          <CommandItem
                            key={statusItem.PacientId}
                            value={statusItem.nomeCompleto}
                            onSelect={(value) => {
                              // Atualize o valor do campo de entrada
                              field.onChange(value)
                              // Verifique se o valor do campo de entrada foi atualizado
                              setPacienteForm(value);

                              setEspecieForm(statusItem.especieValue);


                              setsexoForm(statusItem.sexoValue);

                              setracaForm(statusItem.racaValue);

                              setTutorIDForm(statusItem.tutorId);
                              Cookies.set('TutoreName', statusItem.tutorId)
                              setMedicoIDForm("");


                              Dataformat(statusItem.dataNascimento)
                              setDataForm(statusItem.dataNascimento)



                              setPacientIdForm(statusItem.PacientId)

                              setdisabled(true);
                              setCondition(true)

                              setCadastroIsVisible(false)

                            }}
                          >
                            <PersonIcon className="mr-2 h-4 w-4" />
                            <span>Nº {statusItem.PacientId} - {statusItem.nomeCompleto}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </ScrollArea>
                  </CommandList>
                </Command>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />





          
        <FormField
          control={form.control}
          name="especieValue"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Selecione a especie do animal</FormLabel>
              <div className="flex">
                <ComboBoxResponsive
                  statuses={null}
                  texArea="especie"
                  IDFather={especieForm}
                  Formfather={null}
                  onStatusChange={(status) => {
                    field.onChange(status ? status.value : '');
                  }}
                  disabledfield={disabledfield}
                />
                <AddTags
                  tag="especie"
                  disabledfield={disabledfield}
                  onStatusChange={(status) => {
                    setracaForm(status);
                    console.log(status)
                  }}
                />

              </div>

              <FormDescription>
                Selecione a especie do animal.
              </FormDescription>
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
                  value={sexoForm || field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Macho" disabled={disabledfield} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Macho
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Femea" disabled={disabledfield} />
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
              <TabsCalendario
                IDFather={DataForm}
                onStatusChange={(status) => {
                  field.onChange(status ? status : '');
                }} />
              <FormDescription>

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
              <div className="flex">

                <ComboBoxResponsive
                  statuses={null}
                  texArea="raca"
                  IDFather={racaForm}
                  Formfather={null}
                  onStatusChange={(status) => {
                    field.onChange(status ? status.value : '');
                  }}
                  disabledfield={disabledfield}
                />
                <AddTags
                  tag="raça"
                  disabledfield={disabledfield}
                  onStatusChange={(status) => {
                    setracaForm(status);
                    console.log(status)
                  }}
                />
              </div>
              <FormDescription>
                Selecione a raça do animal.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tutorId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Selecione o tutor</FormLabel>
              <div className="flex">
                <ComboBoxResponsive
                  statuses={null}
                  texArea="Tutor"
                  IDFather={tutorIDForm}
                  Formfather={null}
                  onStatusChange={(status) => {
                    field.onChange(status ? status.value : '');
                    setNameTutorfind(status?.label);
                  }}
                  disabledfield={disabledfield}
                />
                <AddTutor
                  tag="tutor"
                  disabledfield={disabledfield}
                  onStatusChange={(status) => {
                    setTutorIDForm(status);
                    console.log(status)
                  }}
                />
              </div>
              <FormDescription>
                Selecione o nome do tutor.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="medicoId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Selecione o Medico</FormLabel>
              <div className="flex">
                <ComboBoxResponsive
                  statuses={null}
                  texArea="Medico"
                  IDFather={null}
                  Formfather={null}
                  onStatusChange={(status) => {
                    field.onChange(status ? status.value : '');
                    setMedicoIDForm(status?.value)
                    setNameMedicofind(status?.label)
                  }}
                  disabledfield={false}
                />
                <AddMedico
                  tag="Medico"
                  disabledfield={false}
                  onStatusChange={(status) => {
                    setTutorIDForm(status);
                    console.log(status)
                  }}
                />
              </div>
              <FormDescription>
                Procure o nome do Medico
              </FormDescription>
              {isVisible ? (<FormMessage>Seu texto aqui</FormMessage>) : (<FormMessage />)}
            </FormItem>

          )}
        />

{
        condition ? (
          <Button onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();

            Cookies.set('PacienteName', pacienteForm)
            const pacientId = String(pacientIdForm) || "";
            Cookies.set('PacienteID', pacientId)
            if (MedicoIDForm !== undefined) {
              Cookies.set('MedicoNameID', MedicoIDForm)
            }
            if (MedicoIDForm) {
              router.push(`/register/sample?PacienteName=${pacienteForm}?PacienteID=${pacientIdForm}?MedicoNameID=${MedicoIDForm}?TutoreName=${nameTutorfind}`);

            } else {
              setIsVisible(true);
            }
          }}
            className="mt-4" >
            Proximo
          </Button >
        ) : (
          <Button type="submit">Salvar</Button>
        )
      }



        
      </form>
    </Form >



  )
}