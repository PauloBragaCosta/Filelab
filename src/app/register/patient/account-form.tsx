"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, CaretSortIcon, CheckIcon, Half1Icon } from "@radix-ui/react-icons"
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
import React, { useEffect, useState } from 'react';
import { MedicoForm } from "../doctor/doctor-form copy"
import { SparklesIcon } from "lucide-react"
import { ComboBoxResponsive, Status } from "@/components/ui/Combobox-Responsive"
import { ComboBoxResponsiveMedicoAndTutor } from "@/components/ui/Combobox-tutor-medico"


const especie: Status[] = [
  { label: "Equino", value: "equino" },
  { label: "Caprino", value: "caprino" },
  { label: "Canino", value: "canino" },
  { label: "Felino", value: "felino" },
] as const;

const race: Status[] = [
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

export function AccountForm() {

  const [openEspecie, setOpenEspecie] = React.useState(false)
  const [openRaca, setOpenRaca] = React.useState(false)



 
  const [sexoForm, setsexoForm] = useState("");
  const [pacienteForm, setPacienteForm] = useState("")
  const [especieState, setEspecieState] = useState<Status | null>();
  const [idadeForm, setIdadeForm] = useState("")
  const [racaForm, setracaForm] = useState()
  const [raceState, setRaceState] = useState<Status | null>();
  const [tutorIDForm, setTutorIDForm] = useState("")





  // This can come from your database or API.
  const defaultValues: Partial<AccountFormValues> = {
    //nomeCompleto: "pacientes",
    // dataNascimento: new Date("2023-01-23"),
    // raca: "yorkshire",
    //especie: "canino",
    //sexo: sexoForm,
  }

  const router = useRouter();

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  const [iAForm, setIAForm] = useState(false);

  useEffect(() => {
    const pacienteSON = sessionStorage.getItem('PacienteSON');
    if (pacienteSON) {
      setIAForm(true);
    }
  }, [])



  const [progressDescriptionPaciente, setProgressDescriptionPaciente] = useState("Digite o nome do animal");

  async function findPaciente(textInput: string) {
    const response = await fetch('http://localhost:3000/api/tasks/findPaciente', {
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

    const Paciente = await response.json() as any;

    // Transforma os dados para o formato desejado
    const formattedPosts = Paciente.map((post: {
      PacientId: number;
      nomeCompleto: string;
      especie: string;
      sexo: string;
      dataNascimento: Date;
      raca: string;
      createdAt: Date;
      updatedAt: Date;
      tutorId: string;
      ExameDoPaciente: any[];
      Tutor: any;
    }) => ({
      nomeCompleto: post.nomeCompleto,
      PacientId: post.PacientId,
      especie: post.especie,
      sexo: post.sexo,
      dataNascimento: post.dataNascimento,
      raca: post.raca,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      tutorId: post.tutorId,
      ExameDoPaciente: post.ExameDoPaciente,
      Tutor: post.Tutor,
    }));


    // Busca o "textInput" na lista de "nomeCompleto" do paciente
    const foundPaciente = formattedPosts.find((post: { nomeCompleto: string }) => post.nomeCompleto === textInput);



    
    console.log(foundPaciente.raca)
    console.log(foundPaciente.sexo)
    console.log(foundPaciente.PacientId)
    console.log(foundPaciente.nomeCompleto)
    console.log(foundPaciente.tutorId)

    setsexoForm(foundPaciente.sexo)

    const foundRace = race.find(r => r.value === foundPaciente.raca);
    setRaceState(foundRace)

    const foundEspecie = especie.find(r => r.value === foundPaciente.especie);
    setEspecieState(foundEspecie)
    console.log(foundEspecie)

    setTutorIDForm(foundPaciente.tutorId)
   


    if (foundPaciente) {
      setProgressDescriptionPaciente(`o paciente ${foundPaciente.nomeCompleto} foi encontrado no banco de dados.`);
    } else {
      setProgressDescriptionPaciente(`o paciente não foi encontrado no banco de dados, complete o formulario para seguir com o cadastro ${formattedPosts.label}`);
    }

    return formattedPosts;
  }








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



  const [open, setOpen] = React.useState(false)

  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

  const handleStatusChange = (status: Status | null) => {
    setSelectedStatus(status);
    // Aqui você pode adicionar o código para lidar com a mudança de status
    console.log(status);
  };

  const [nameTutorfind, setNameTutorfind] = React.useState("")
  const [nameMedicofind, setNameMedicofind] = React.useState("")

  // Adicione um estado para armazenar o progresso da conversão




  return (

    <Form {...form}>
      {/* {iAForm &&
        <div className="">
          <button className="w-[200px] h-[30px] rounded-full items-center border-2 pulse-button hover:border-transparent hover:animate-[pulsecolor_5s_ease-in-out_infinite]" onClick={preencherFormulario}>
            <div className="flex items-center justify-content-end gap-1 ml-2">
              <SparklesIcon className="text-gray-600" />
              <h1 className="text-gray-800">Preencher Formulário</h1>
            </div>
          </button>
        </div>
      } */}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">


        <FormField
          control={form.control}
          name="nomeCompleto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paciente</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nome Completo" {...field} />
              </FormControl>
              <Button onClick={() => findPaciente(field.value)}> pesqusiar </Button>
              <FormDescription>
                {progressDescriptionPaciente}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="especie"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Selecione a especie do animal</FormLabel>
              <ComboBoxResponsive

                statuses={especie}
                texArea="especie"
                Formfather={especieState}
                onStatusChange={(status) => {
                  handleStatusChange(status);
                  field.onChange(status ? status.label : '');
                }}
              />
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
                      <RadioGroupItem value="Macho" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Macho
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Fêmea" />
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
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      aria-expanded={open}
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
              <ComboBoxResponsive
                statuses={race}
                texArea="raça"
                Formfather={raceState}
                onStatusChange={(status) => {
                  handleStatusChange(status);
                  field.onChange(status ? status.label : '');
                }}
              />
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
                    <ComboBoxResponsiveMedicoAndTutor findany={'Tutor'} textAreafather={nameTutorfind} formFather={form} fieldFather={field} IDFather={tutorIDForm}/>
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
                      <TutorForm onStatusChange={(newTutorName) => {
                        setNameTutorfind(newTutorName);
                      }} />
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
                <FormItem className="space-y-0 flex flex-row justify-between mx-0 object-top">
                  <div className="flex flex-col">
                    <ComboBoxResponsiveMedicoAndTutor findany={"Medico"} textAreafather={nameMedicofind} formFather={form} fieldFather={field} IDFather={tutorIDForm}/>
                    <FormDescription>
                      Procure o nome do Medico
                    </FormDescription>
                    <FormMessage />
                  </div>
                  <div className="mx-0">
                    <AlertDialog >
                      <AlertDialogTrigger asChild >
                        <Button variant="outline">+ cadastrar</Button>
                      </AlertDialogTrigger>
                      <MedicoForm onStatusChange={(newMedicoName) => {
                        setNameMedicofind(newMedicoName);
                      }} />
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