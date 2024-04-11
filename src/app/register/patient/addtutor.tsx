import * as React from "react"

import { Button } from "../../../components/ui/button"
import { cn } from "../../../lib/utils"
import * as z from "zod"
import { useMediaQuery } from '@react-hook/media-query'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../../components/ui/drawer"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { prisma } from "@/lib/prisma"
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"
import { revalidateTag } from "next/cache"

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

  const [disabledfieldany, setdisabled] = React.useState(false)
  React.useEffect(() => {
    setdisabled(disabledfield);
  }, [disabledfield]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button disabled={disabledfieldany} variant="ghost">+ adicionar</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cadastre aqui o tutor</DialogTitle>
            <DialogDescription>
            Insira as informaçoes do tutor para que seja registrado no banco de dados e incluído na lista de consultas do sistema.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm className="px-4" tag={tag} onStatusChange={onStatusChange} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button disabled={disabledfieldany} variant="ghost">+ adicionar</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Cadastre aqui o tutor</DrawerTitle>
          <DrawerDescription>
            Insira as informaçoes do tutor para que seja registrado no banco de dados e incluído na lista de consultas do sistema.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" tag={tag} onStatusChange={onStatusChange} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function ProfileForm({ className, tag, onStatusChange }: React.ComponentProps<"form"> & { tag: string, onStatusChange: (status: string) => void }) {

  const handleStatusSelect = (data: String) => {
    console.log(data)

  };

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
    communicationEmailsTutor: true,
    socialWhatsappTutor: false,
    marketingEmailsTutor: false,
  
  }

  const form = useForm<TutoresFormValues>({
    mode: "all",
    defaultValues,
  });

  const onSubmit = async (data: TutoresFormValues) => {
    handleStatusSelect(data.nameTutor)

    // Ajustar o código para fazer a solicitação do servidor
    const response = await fetch(
      "http://localhost:3000/api/tasks/createtutor",
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = await response.json();

    
    onStatusChange(responseData.idTutor)
  };



  async function salvar() {
    form.handleSubmit(onSubmit)();
  }

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








        <DrawerClose asChild>
          <Button type="submit">Salvar o tutor</Button>
        </DrawerClose>
      </form>
    </Form>




  )
}
