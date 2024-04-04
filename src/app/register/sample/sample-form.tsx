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
import { useSearchParams } from 'next/navigation'

import html2canvas from 'html2canvas';
import QRCode from 'qrcode'


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


const searchParams = useSearchParams()
const pacienteForm = (searchParams?.get('pacienteForm'))
console.log(pacienteForm)
const PacienteID = searchParams?.get('PacienteID')
console.log(PacienteID)


const MedicoNameID = searchParams?.get('MedicoNameID')
console.log(MedicoNameID)

const TutoreName = searchParams?.get('TutoreName')
console.log(TutoreName)


export function SampleForm() {



  // This can come from your database or API.
  const defaultValues: Partial<AccountFormValues> = {
    // amostraType: [],
    // exam: [],
    // DateTimeColeta: new Date("2023-01-23"),

  }









  const [amostraForm, setAmostraForm] = React.useState("") // o set vai vim da IA
  const [dataForm, setdataForm] = React.useState<Date>() // o set vai vim da IA

  const [image, setImage] = React.useState("");
  const [base64Image, setbase64Image] = React.useState("");
  const [id, setId] = React.useState("");


  async function CreateImageWithText(id: any) {
    // Crie um elemento div
    const div = document.createElement('div');
    div.style.width = '384px';
    div.style.height = '152px';
    div.style.background = '#FFFFFF';
    div.style.marginTop = '3px';
    div.style.color = '#000';
    div.style.fontSize = '20px';
    div.style.display = 'flex';
    div.style.padding = '1px';

    // Crie uma div para o QRCode
    const qrDiv = document.createElement('div');
    qrDiv.style.flex = '1';
    qrDiv.style.display = 'flex'; // Adicione esta linha
    qrDiv.style.justifyContent = 'center'; // Adicione esta linha
    qrDiv.style.width = '150px';
    qrDiv.style.flexDirection = 'column';
    qrDiv.style.alignItems = 'center'; // Adicione esta linha
    qrDiv.style.gap = "2px";
    qrDiv.style.marginLeft = '5px'
    div.appendChild(qrDiv);

    // Adicione as informações solicitadas
    const exameID = document.createElement('p');
    exameID.textContent = `${id}`;
    exameID.style.fontWeight = 'bold'; // Adicione esta linha
    exameID.style.marginBottom = '0'; // Adicione esta linha
    qrDiv.appendChild(exameID);

    // Gere o QRCode
    const examNumber = `${id}`; // Substitua pelo número do exame
    QRCode.toDataURL(examNumber, function (err: any, url: string) {
      const qrCode = document.createElement('img');
      qrCode.src = url;
      qrCode.style.width = '120px';
      qrCode.style.height = '120px';
      qrDiv.appendChild(qrCode);
    });

    // Crie uma div para as informações
    const infoDiv = document.createElement('div');
    infoDiv.style.flex = '2';
    infoDiv.style.display = 'flex';
    infoDiv.style.flexDirection = 'column';
    infoDiv.style.alignItems = "center";
    div.appendChild(infoDiv);

    const patientName = document.createElement('p');
    patientName.textContent = `${pacienteForm}`; // Substitua pelo nome do paciente
    patientName.style.fontWeight = 'bold'; // Adicione esta linha
    patientName.style.marginBottom = '0'; // Adicione esta linha
    infoDiv.appendChild(patientName);

    const tutorDiv = document.createElement('div');
    tutorDiv.style.display = 'flex';
    tutorDiv.style.justifyContent = 'center';
    tutorDiv.style.alignItems = 'center';
    tutorDiv.style.border = '2px solid #000';
    tutorDiv.style.height = "30px";
    tutorDiv.style.backgroundColor = '#000';
    tutorDiv.style.borderRadius = '5px';
    tutorDiv.style.padding = '2px';

    const tutorName = document.createElement('p');
    tutorName.textContent = `Tutor: ${TutoreName}`; // Substitua pelo nome do tutor
    tutorName.style.marginBottom = '0px'; // Adicione esta linha
    infoDiv.appendChild(tutorName);

    const collectionDate = document.createElement('p');
    collectionDate.textContent = 'Data da coleta: 30/03/2024'; // Substitua pela data da coleta
    collectionDate.style.marginBottom = '10px'; // Adicione esta linha
    infoDiv.appendChild(collectionDate);

    const urgencyDiv = document.createElement('div');
    urgencyDiv.style.display = 'flex';
    urgencyDiv.style.justifyContent = 'center';
    urgencyDiv.style.alignItems = 'center';
    urgencyDiv.style.border = '2px solid #000';
    urgencyDiv.style.height = "30px";
    urgencyDiv.style.backgroundColor = '#000';
    urgencyDiv.style.borderRadius = '5px';
    urgencyDiv.style.padding = '2px';

    const urgency = document.createElement('p');
    urgency.textContent = 'Urgente';
    urgency.style.marginBottom = '20px';
    urgency.style.fontWeight = 'bold';
    urgency.style.color = '#FFFFFF';

    urgencyDiv.appendChild(urgency);
    infoDiv.appendChild(urgencyDiv);

    // Adicione o div ao corpo do documento
    document.body.appendChild(div);

    // Gere a imagem a partir do div
    const canvas = await html2canvas(div);
    const dataUrl = canvas.toDataURL();
    const base64Image = dataUrl.replace(/^data:image\/\w+;base64,/, "");

    // Remova o div do corpo do documento
    document.body.removeChild(div);


    // Atualize o estado da imagem
    setImage(dataUrl);
    setbase64Image(base64Image);


  }

  async function onSubmit(data: AccountFormValues) {
    setdataForm(data.DateTimeColeta)
    const body = {
      data,
      PacienteID,
      MedicoNameID,
    };


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

    CreateImageWithText(responseData)
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
