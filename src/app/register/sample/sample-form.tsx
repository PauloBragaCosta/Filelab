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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

const amostraType = [
  {
    id: "tubo",
    label: "Tubo",
  },
  {
    id: "Pote",
    label: "pote",
  },
  {
    id: "outros",
    label: "Outros",
  },
] as const;


const exame = [
  {
    id: "anatomia_patologica",
    label: "Anatomia patólogica",
  },
  {
    id: "citopatologia",
    label: "Citopatologia",
  },
  {
    id: "analise_liquidos",
    label: "Análise líquidos",
  },
  {
    id: "analise_hematologica",
    label: "Análise hematológica",
  },
  {
    id: "analise_bioquimica",
    label: "Análise bioquimica",
  },
  {
    id: "documents",
    label: "Documents",
  },
] as const


const accountFormSchema = z.object({
  DateTimeColeta: z.date({
    required_error: "A date of birth is required.",
  }),
  observation: z.string({
    required_error: "Please select a observation.",
  }),
  amostraType: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  amostra: z.string({
    required_error: "Please select a species.",
  }),
  clinicalSuspicion: z.string({
    required_error: "Please select a species.",
  }),
  exame: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  amostraType: [],
  exame: [],
  DateTimeColeta: new Date("2023-01-23"),

}

export function AccountForm() {
  const router = useRouter();
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  })

  async function onSubmit(data: AccountFormValues) {
    event?.preventDefault();
    console.log(data);
    
    const IdPacientebody = sessionStorage.getItem('IdPaciente');
    const Idmedicobody = sessionStorage.getItem('MedicoId');

    const body = {
      data,
      IdPacientebody,
      Idmedicobody
    };

    console.log('Corpo da solicitação:', body);

    await fetch('http://localhost:3000/api/tasks/createExame', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    });


    //router.push('/dashboard');


    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        <FormField
          control={form.control}
          name="amostraType"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Sidebar</FormLabel>
                <FormDescription>
                  Select the items you want to display in the sidebar.
                </FormDescription>
              </div>
              {amostraType.map((amostraType) => (
                <FormField
                  key={amostraType.id}
                  control={form.control}
                  name="amostraType"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={amostraType.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(amostraType.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, amostraType.id])
                                : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== amostraType.id
                                  )
                                )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {amostraType.label}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amostra"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade de frascos</FormLabel>
              <FormControl>
                <Input placeholder="00" {...field} />
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
          name="clinicalSuspicion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Suspeita clínica</FormLabel>
              <FormControl>
                <Input placeholder="  " {...field} />
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
                <Textarea placeholder="Histórico, sinais clínicos, tratamento submetido" {...field} />
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
          name="exame"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Sidebar</FormLabel>
                <FormDescription>
                  Select the items you want to display in the sidebar.
                </FormDescription>
              </div>
              {exame.map((exame) => (
                <FormField
                  key={exame.id}
                  control={form.control}
                  name="exame"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={exame.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(exame.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, exame.id])
                                : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== exame.id
                                  )
                                )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {exame.label}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-4">
          Salvar
        </Button>
      </form>
    </Form>

  )
}
