'use client'

import * as React from "react"
import { useMediaQuery } from '@react-hook/media-query'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
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

const medicoFormSchema = z.object({
  nameMedico: z.string().nonempty({ message: 'Nome do médico é obrigatório' }),
  telephoneMedico: z.string().optional(),
  emailMedico: z.string().email({ message: 'Email inválido' }).optional(),
  crmv: z.string().optional(),
  comunicacaoEmailsMedico: z.boolean().default(false),
  marketingEmailsMedico: z.boolean().default(false),
  comunicacaoWhatsappMedico: z.boolean().default(false),
})

type MedicoFormValues = z.infer<typeof medicoFormSchema>

export function AddDoctor({
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
      <ScrollArea className="h-[400px] md:h-[500px] px-4">
        <ProfileForm className="pr-4" tag={tag} onStatusChange={onStatusChange} setOpen={setOpen} />
      </ScrollArea>
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
          <Button disabled={disabledfieldany} variant="ghost">+ Criar</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cadastre aqui o médico</DialogTitle>
            <DialogDescription>
              Insira as informações do médico para que seja registrado no banco de dados e incluído na lista de consultas do sistema.
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
        <Button disabled={disabledfieldany} variant="ghost">+ Criar</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Cadastre aqui o médico</DrawerTitle>
          <DrawerDescription>
            Insira as informações do médico para que seja registrado no banco de dados e incluído na lista de consultas do sistema.
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
  const form = useForm<MedicoFormValues>({
    resolver: zodResolver(medicoFormSchema),
    defaultValues: {
      comunicacaoEmailsMedico: true,
      comunicacaoWhatsappMedico: false,
      marketingEmailsMedico: false,
    },
  })


  const onSubmit = async (data: MedicoFormValues) => {
    try {
      const response = await fetch('/api/tasks/cadastro/doctor-api-route-updated', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Falha ao criar médico');
      }
  
      const createdDoctor = await response.json();
      onStatusChange(createdDoctor.id);
      setOpen(false);
      // Você pode usar createdDoctor aqui para atualizar o estado local ou fazer outras operações necessárias
      console.log('Médico criado:', createdDoctor);
    } catch (error) {
      console.error('Erro ao criar médico:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("grid items-start gap-4", className)}>
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
                <Input placeholder="+55 (__) _____-____" {...field} />
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
                <Input type="email" placeholder="Email" {...field} />
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
                      Receba e-mails sobre o diagnóstico do paciente.
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
              name="comunicacaoWhatsappMedico"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Comunicação por WhatsApp</FormLabel>
                    <FormDescription>
                      Receba mensagens sobre o diagnóstico do paciente via WhatsApp.
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

        <Button type="button" onClick={() => form.handleSubmit(onSubmit)()}>Salvar o médico</Button>
      </form>
    </Form>
  )
}