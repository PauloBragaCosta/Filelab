"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "../../../components/ui/button"
import { Calendar } from "../../../components/ui/calendar"
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
import { toast } from "../../../components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { PrinterDialog } from "@/components/ui/ResponsiveDialogPrint"
import React from 'react';
import { ComboBoxResponsive } from "@/components/ui/Combobox-Responsive"
import Cookies from 'js-cookie'


// const amostraType = [
//   {
//     id: "tubo",
//     label: "Tubo",
//   },
//   {
//     id: "Pote",
//     label: "pote",
//   },
//   {
//     id: "outros",
//     label: "Outros",
//   },
// ] as const;

// const exam= [
//   {
//     id: "anatomia_patologica",
//     label: "Anatomia patólogica",
//   },
//   {
//     id: "citopatologia",
//     label: "Citopatologia",
//   },
//   {
//     id: "analise_liquidos",
//     label: "Análise líquidos",
//   },
//   {
//     id: "analise_hematologica",
//     label: "Análise hematológica",
//   },
//   {
//     id: "analise_bioquimica",
//     label: "Análise bioquimica",
//   },
// ] as const


const accountFormSchema = z.object({
  DateTimeColeta: z.date({
    required_error: "A date of birth is required.",
  }),
  observation: z.string({
    required_error: "Please select a observation.",
  }),
  amostraType: z.string({
    required_error: "Please select a species.",
  }),
  storageQuantity: z.string({
    required_error: "Please select a species.",
  }),
  clinicalSuspicion: z.string({
    required_error: "Please select a species.",
  }),
  examType: z.string({
    required_error: "Please select a species.",
  }),
})

type AccountFormValues = z.infer<typeof accountFormSchema>





export function SampleForm() {



  // This can come from your database or API.
  const defaultValues: Partial<AccountFormValues> = {
    // amostraType: [],
    // exam: [],
    // DateTimeColeta: new Date("2023-01-23"),

  }


  const PacienteName = Cookies.get('PacienteName')
  console.log(PacienteName)

  const PacienteID = Cookies.get('PacienteID')
  console.log(PacienteID)

  const MedicoNameID = Cookies.get('MedicoNameID')
  console.log(MedicoNameID)

  const TutoreName = Cookies.get('TutoreName')
  console.log(TutoreName)



  const [amostraForm, setAmostraForm] = React.useState("") // o set vai vim da IA
  const [dataForm, setdataForm] = React.useState<Date>() // o set vai vim da IA

  const [image, setImage] = React.useState("");
  const [base64Image, setbase64Image] = React.useState("");
  const [id, setId] = React.useState("");



  async function onSubmit(data: AccountFormValues) {
    setdataForm(data.DateTimeColeta)
  

    const body = {
      data,
      PacienteID,
      MedicoNameID,
    };

    console.log(body.PacienteID)
    console.log(body.MedicoNameID)

    console.log(data.DateTimeColeta)


    const response = await fetch('/api/tasks/createExame', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Converte a resposta para JSON
    const responseData = await response.json();

    console.log(responseData)



    const result = String(CreateImageWithText(id, PacienteName, TutoreName))

    setImage(result);
   

    const base64Image = result.replace(/^data:image\/\w+;base64,/, "");
    console.log(base64Image);

    setId(responseData)



    // router.push('/dashboard');


    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  })










  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="amostraType"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Selecione o tipo de armazenamento da amostra</FormLabel>
            <ComboBoxResponsive
              statuses={null}
              texArea="storage"
              IDFather={amostraForm}
              Formfather={null}
              onStatusChange={(status) => {
                field.onChange(status ? status.value : '');
              }}
              disabledfield={null}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="storageQuantity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quantidade de frascos</FormLabel>
            <FormControl>
              <Input placeholder="00" {...field || ''} />
            </FormControl>
            <FormDescription>
              Escreva a quantida de amostras recebidas
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="clinicalSuspicion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Suspeita clínica</FormLabel>
            <FormControl>
              <Input placeholder="  " {...field || ''} />
            </FormControl>
            <FormDescription>

            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="observation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observação </FormLabel>
            <FormControl>
              <Textarea placeholder="Histórico, sinais clínicos, tratamento submetido" {...field || ''} />
            </FormControl>
            <FormDescription>

            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="DateTimeColeta"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Data de coleta</FormLabel>
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
            <FormMessage />
          </FormItem>
        )}
      />


      <FormField
        control={form.control}
        name="examType"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Selecione o tipo de armazenamento da amostra</FormLabel>
            <ComboBoxResponsive
              statuses={null}
              texArea="exam"
              IDFather={amostraForm}
              Formfather={null}
              onStatusChange={(status) => {
                field.onChange(status ? status.value : '');
              }}
              disabledfield={null}
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" >salvar</Button>

      <PrinterDialog image={image} base64Image={base64Image} idExame={id} form={form} onSubmit={onSubmit} />
    </Form>

  )
}
function CreateImageWithText(id: string, PacienteName: string | undefined, TutoreName: string | undefined) {
  throw new Error("Function not implemented.")
}

