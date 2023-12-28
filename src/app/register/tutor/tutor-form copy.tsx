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

import { Input } from "../../../components/ui/input"

import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"


const tutorFormSchema = z.object({
  nameTutor: z.string().nonempty({ message: 'Nome do tutor é obrigatório' }),
  telephoneTutor: z.string().nonempty({ message: 'Telefone é obrigatório' }),
  emailTutor: z.string().nonempty({ message: 'CRMV é obrigatório' }),
  communicationEmailsTutor: z.boolean().default(false).optional(),
  socialWhatsappTutor: z.boolean().default(false).optional(),
  marketingEmailsTutor: z.boolean().default(false).optional(),
})

type TutoresFormValues = z.infer<typeof tutorFormSchema>



const defaultValues: Partial<TutoresFormValues> = {
  nameTutor: "joaquin",
  telephoneTutor: "2342342",
  emailTutor: "ewfwef",
  communicationEmailsTutor: true,
  marketingEmailsTutor: false,
  socialWhatsappTutor: false,

}


export function TutorForm() {
  const form = useForm<TutoresFormValues>({
    mode: "all",
    defaultValues,
  });

  const onSubmit = async (data: TutoresFormValues) => {

    console.log(data)

    // Ajustar o código para fazer a solicitação do servidor
    const response = await fetch(
      "http://localhost:3000/api/tasks/createTutor",
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 overflow-y-scroll">
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cadastre aqui o tutor</AlertDialogTitle>
            <AlertDialogDescription>

              <FormField
                control={form.control}
                name="nameTutor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tutor(a)</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome Completo" {...field} />
                    </FormControl>
                    <FormDescription>
                      Este campo é destinado ao nome do tutor
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telephoneTutor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="+55 (__) _____-____" {...field}></Input>
                    </FormControl>

                    <FormDescription>
                      Este campo é destinado ao número de telefone do tutor, incluindo o DDD.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emailTutor"
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



              <div>
                <h3 className="mb-4 text-lg font-medium">Notificação</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="communicationEmailsTutor"
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
                    name="marketingEmailsTutor"
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
                    name="socialWhatsappTutor"
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

