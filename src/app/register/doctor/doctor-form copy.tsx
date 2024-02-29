"use client"

import { useForm } from "react-hook-form"
import * as z from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form"
import { Switch } from "../../../components/ui/switch"
import { Input } from "@/components/ui/input"
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { revalidateTag } from "next/cache"

const medicoFormSchema = z.object({
  nameMedico: z.string().nonempty({ message: 'Nome do tutor é obrigatório' }),
  telephoneMedico: z.string().nonempty({ message: 'Telefone é obrigatório' }),
  emailMedico: z.string().nonempty({ message: 'Email é obrigatório' }),
  crmv: z.string().nonempty({ message: 'CRMV é obrigatório' }),
  comunicacaoEmailsMedico: z.boolean().default(false).optional(),
  marketingEmailsMedico: z.boolean().default(false).optional(),
  comunicacaoWhatsappMedico: z.boolean().default(false).optional(),
})

type MedicoFormValues = z.infer<typeof medicoFormSchema>

// This can come from your database or API.
const defaultValues: Partial<MedicoFormValues> = {
  nameMedico: 'Dr. Paulo',
  telephoneMedico: "5812565",
  emailMedico: "sdfgvsfd",
  crmv: 'gfdgd',
  comunicacaoEmailsMedico: true,
  comunicacaoWhatsappMedico: false,
  marketingEmailsMedico: false,

}


export function MedicoForm() {
  const form = useForm<MedicoFormValues>({
    mode: "all",
    defaultValues,
  });

  const onSubmit = async (data: MedicoFormValues) => {

    console.log(data)

    // Ajustar o código para fazer a solicitação do servidor
    const response = await fetch(
      "http://localhost:3000/api/tasks/createMedico",
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    revalidateTag('get-tags')

    if (response.status === 201) {
      // Sucesso!
      console.log("Sucesso no envio")

      // Simular a pressão da tecla "esc"
      var event = new KeyboardEvent('keydown', { 'key': 'Escape' });
      document.dispatchEvent(event);



    } else {
      // Erro!
      console.log("erro no envio")
    }
  };

  async function salvar() {
    form.handleSubmit(onSubmit)();
  }



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cadastre aqui o tutor</AlertDialogTitle>
            <AlertDialogDescription>
              <FormField
                control={form.control}
                name="nameMedico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dr.(a)</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome Completo" {...field} />
                    </FormControl>
                    <FormDescription>
                      Este campo é destinado ao nome do médico
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telephoneMedico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="+55 (__) _____-____" {...field}></Input>
                    </FormControl>
                    <FormDescription>
                      Este campo é destinado ao número de telefone do médico, incluindo o DDD.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emailMedico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="crmv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CRMV</FormLabel>
                    <FormControl>
                      <Input placeholder="CRMV" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />



              <div>
                <h3 className="mb-4 text-lg font-medium">Notificação</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="comunicacaoEmailsMedico"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Comunicação por email
                          </FormLabel>
                          <FormDescription>
                            Receba e-mails sobre o diagnostico do meu pet.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="comunicacaoWhatsappMedico"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            E-mails de marketing
                          </FormLabel>
                          <FormDescription>
                            Receba e-mails sobre novos produtos, recursos e muito mais.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="marketingEmailsMedico"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Comunicação por Whatsapp</FormLabel>
                          <FormDescription>
                            Receba e-mails sobre o diagnostico do meu pet.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                </div>
              </div>

            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction onClick={salvar}>Salvar</AlertDialogAction>

          </AlertDialogFooter>
        </AlertDialogContent>
      </form>
    </Form>
  )
}
