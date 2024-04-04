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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card"

import {
  PersonIcon,
} from "@radix-ui/react-icons"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../components/ui/command"

import { toast } from "../../../components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { TutorForm } from "../tutor/tutor-form copy"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import React, { useEffect, useState } from 'react';
import { MedicoForm } from "../doctor/doctor-form copy"
import { ComboBoxResponsive, Status } from "@/components/ui/Combobox-Responsive"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TabsCalendario } from "@/components/ui/TabsCalendario"
import Cookies from 'js-cookie'





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
  medico: z.string({
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
    //nomeCompleto: "pacientes",
    // dataNascimento: new Date("2023-01-23"),
    // raca: "yorkshire",
    //especieValue: "canino",
    //sexo: sexoForm,
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
      const medicoID = (data.medico);


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


  const [disabledfield, setdisabled] = React.useState(true)




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

                    }}>apagar</Button>


                  </div>
                </div>

                <CommandList>
                  <CommandEmpty>
                    <h1>Não foram encontrados pacientes com esse mesmo nome.</h1>
                    <Button variant="ghost" className="flex-none my-3 mr-4" onClick={(event) => {
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
                            setMedicoIDForm("");


                            Dataformat(statusItem.dataNascimento)
                            setDataForm(statusItem.dataNascimento)



                            setPacientIdForm(statusItem.PacientId)

                            setdisabled(true);
                            setCondition(true)

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
                  <ComboBoxResponsive
                    statuses={null}
                    texArea="Tutor"
                    IDFather={tutorIDForm} // esse e o valor do tutor mas vai ser levado para a raça tb quando fazer o banco de dados parecido com o do medico e tutor
                    Formfather={null}
                    onStatusChange={(status) => {
                      field.onChange(status ? status.value : '');
                      setNameTutorfind(status?.label);
                    }}
                    disabledfield={disabledfield}
                  />
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
                  <FormDescription>
                    Procure o nome do Medico
                  </FormDescription>
                  {isVisible ? (<FormMessage>Seu texto aqui</FormMessage>) : (<FormMessage />)}

                </div>
                <div className="mx-0">
                  <AlertDialog >
                    <AlertDialogTrigger asChild >
                      <Button variant="outline">+ cadastrar</Button>
                    </AlertDialogTrigger>
                    <MedicoForm onStatusChange={(newMedicoName) => {
                      setNameMedicofind(newMedicoName); // Paulo muda isso pelo ID fica melhor igual o que faz com
                    }} />
                  </AlertDialog>
                </div>
              </FormItem>

            )}
          /></CardContent>
        </CardHeader>
      </Card>



      {condition ? (
        <Button onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          // sessionStorage.setItem('MedicoName', JSON.stringify(nameMedicofind));
          // sessionStorage.setItem('PacienteName', JSON.stringify(pacienteForm));
          // sessionStorage.setItem('TutoreName', JSON.stringify(nameTutorfind));
          // sessionStorage.setItem('PacienteID', JSON.stringify(pacientIdForm));
          // sessionStorage.setItem('MedicoName', JSON.stringify(MedicoIDForm));

          Cookies.set('PacienteName', pacienteForm)
          const pacientId = String(pacientIdForm) || "";
          Cookies.set('PacienteID', pacientId)
          if (MedicoIDForm !== undefined) {
            Cookies.set('MedicoNameID', MedicoIDForm)
          }
          if (nameTutorfind !== undefined) {
            Cookies.set('TutoreName', nameTutorfind)
          }
          if (MedicoIDForm) {
            router.push(`/register/sample?PacienteName=${pacienteForm}?PacienteID=${pacientIdForm}?MedicoNameID=${MedicoIDForm}?TutoreName=${nameTutorfind}`);

          } else {
            setIsVisible(true);
          }
        }}
          className="mt-4">
          Proximo
        </Button>
      ) : (
        <Button type="submit" onClick={form.handleSubmit(onSubmit)} className="mt-4">Salvar</Button>
      )}



    </Form>

  )
}