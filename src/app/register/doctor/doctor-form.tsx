"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useMask } from '@react-input/mask';

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
import { Switch } from "../../../components/ui/switch"
import { toast } from "../../../components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

const notificationsFormSchema = z.object({
  nameMedico: z
    .string()
    .min(1, {
      message: "Name must be at least 1 characters.",
    })
    .max(60, {
      message: "Name must not be longer than 30 characters.",
    }),
  telephone: z
    .string()
    .min(1, {
      message: "Name must be at least 1 characters.",
    })
    .max(60, {
      message: "Name must not be longer than 30 characters.",
    }),
  email: z
    .string()
    .min(1, {
      message: "Name must be at least 1 characters.",
    })
    .max(60, {
      message: "Name must not be longer than 30 characters.",
    }),
  crmv: z
    .string()
    .min(1, {
      message: "Name must be at least 1 characters.",
    })
    .max(60, {
      message: "Name must not be longer than 30 characters.",
    }),
  comunicacaoEmails: z.boolean().default(false).optional(),
  marketingEmails: z.boolean().default(false).optional(),
  comunicacaoWhatsapp: z.boolean().default(false).optional(),
})

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>

// This can come from your database or API.
const defaultValues: Partial<NotificationsFormValues> = {
  comunicacaoEmails: true,
  comunicacaoWhatsapp: false,
  marketingEmails: false,

}


export function NotificationsForm() {
  const router = useRouter();
  const inputRef = useMask({ mask: '+55 (__) _____-____', replacement: { _: /\d/ } });

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues,
  })



  function onSubmit(data: NotificationsFormValues) {
    console.log(data);
    // Armazene os dados do paciente no sessionStorage
    sessionStorage.setItem('doctorData', JSON.stringify(data));



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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          name="telephone"
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
          name="email"
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
              name="comunicacaoEmails"
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
              name="comunicacaoWhatsapp"
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
              name="marketingEmails"
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

        <Button type="submit">Salvar</Button>
      </form>
    </Form>
  )
}
