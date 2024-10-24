'use client'

import * as React from "react"
import { useMediaQuery } from '@react-hook/media-query'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const tutorFormSchema = z.object({
  nameTutor: z.string().nonempty({ message: 'Nome do tutor é obrigatório' }),
  telephoneTutor: z.string().optional(),
  emailTutor: z.string().email({ message: 'Email inválido' }).optional(),
  communicationEmailsTutor: z.boolean().optional(),
  socialWhatsappTutor: z.boolean().optional(),
  marketingEmailsTutor: z.boolean().optional(),
})

type TutoresFormValues = z.infer<typeof tutorFormSchema>

export function AddTutor({
  tag,
  disabledfield,
  onStatusChange,
}: {
  tag: string
  disabledfield: boolean
  onStatusChange: (status: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [disabledfieldany, setDisabled] = React.useState(false)
  React.useEffect(() => {
    setDisabled(disabledfield);
  }, [disabledfield]);

  const Content = (
    <>
      <ProfileForm className="px-4" tag={tag} onStatusChange={onStatusChange} setOpen={setOpen} />
      {!isDesktop && (
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      )}
    </>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" disabled={disabledfieldany} variant="ghost">+ Criar</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cadastre aqui o tutor</DialogTitle>
            <DialogDescription>
              Insira as informações do tutor para que seja registrado no banco de dados e incluído na lista de consultas do sistema.
            </DialogDescription>
          </DialogHeader>
          {Content}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button type="button" disabled={disabledfieldany} variant="ghost">+ Criar</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Cadastre aqui o tutor</DrawerTitle>
          <DrawerDescription>
            Insira as informações do tutor para que seja registrado no banco de dados e incluído na lista de consultas do sistema.
          </DrawerDescription>
        </DrawerHeader>
        {Content}
      </DrawerContent>
    </Drawer>
  )
}

function ProfileForm({ className, tag, onStatusChange, setOpen }: React.ComponentProps<"form"> & { 
  tag: string, 
  onStatusChange: (status: string) => void,
  setOpen: (open: boolean) => void
}) {
  const form = useForm<TutoresFormValues>({
    resolver: zodResolver(tutorFormSchema),
    defaultValues: {
      communicationEmailsTutor: true,
      socialWhatsappTutor: false,
      marketingEmailsTutor: false,
    },
  })


  const onSubmit = async (data: TutoresFormValues) => {
    try {
      const response = await fetch('/api/tasks/cadastro/tutor-api-route-updated', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Falha ao criar tutor');
      }
  
      const createdTutor = await response.json();
      onStatusChange(createdTutor.id);
      setOpen(false);
      // Você pode usar createdTutor aqui para atualizar o estado local ou fazer outras operações necessárias
      console.log('Tutor criado:', createdTutor);
    } catch (error) {
      console.error('Erro ao criar tutor:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("grid items-start gap-4", className)}>
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
                <Input placeholder="+55 (__) _____-____" {...field} />
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
                <Input type="email" placeholder="Email" {...field} />
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
                      Receba e-mails sobre o diagnóstico do meu pet.
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
                    <FormLabel className="text-base">Comunicação por WhatsApp</FormLabel>
                    <FormDescription>
                      Receba mensagens sobre o diagnóstico do meu pet via WhatsApp.
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

        <Button type="button" onClick={() => form.handleSubmit(onSubmit)()}>Salvar o tutor</Button>
      </form>
    </Form>
  )
}