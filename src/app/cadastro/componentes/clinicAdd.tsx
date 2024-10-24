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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

const clinicFormSchema = z.object({
  nameClinic: z.string().nonempty({ message: 'Nome da clínica é obrigatório' }),
  telephoneClinic: z.string().optional(),
  emailClinic: z.string().email({ message: 'Email inválido' }).optional(),
  Endereco: z.string().optional(),
  CEP: z.string().optional(),

});

type ClinicFormValues = z.infer<typeof clinicFormSchema>;


export function AddClinic({
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
  const [cepInput, setCep] = React.useState("")

  const form = useForm<ClinicFormValues>({
    resolver: zodResolver(clinicFormSchema),
    defaultValues: {
      CEP: cepInput
    },
  })


  const handleCepChange = (value: string) => {
    console.log(value)
    setCep(value)
    form.setValue("CEP", value)
  }

  const onSubmit = async (data: ClinicFormValues) => {
    try {
      const response = await fetch('/api/tasks/cadastro/clinic-api-route-updated', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar clínica');
      }

      const createdClinic = await response.json();
      onStatusChange(createdClinic.id);
      setOpen(false);
      console.log('Clínica criada:', createdClinic);
    } catch (error) {
      console.error('Erro ao criar clínica:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("grid items-start gap-4", className)}>
        <FormField
          control={form.control}
          name="nameClinic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Clínica</FormLabel>
              <FormControl>
                <Input placeholder="Nome Completo da Clínica" {...field} />
              </FormControl>
              <FormDescription>
                Este campo é destinado ao nome da clínica
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telephoneClinic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="+55 (__) _____-____" {...field} />
              </FormControl>
              <FormDescription>
                Este campo é destinado ao número de telefone da clínica, incluindo o DDD.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="emailClinic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email da Clínica" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="CEP"
          render={({ field }) => (
            <FormItem className="w-full max-w-sm">
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={8}
                  value={cepInput}
                  onChange={handleCepChange}
                  render={({ slots }) => (
                    <>
                      <InputOTPGroup>
                        {slots.slice(0, 5).map((slot, index) => (
                          <InputOTPSlot key={index} {...slot} />
                        ))}
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        {slots.slice(5).map((slot, index) => (
                          <InputOTPSlot key={index + 5} {...slot} />
                        ))}
                      </InputOTPGroup>
                    </>
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Endereco"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Endereço Completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        

        <Button type="button" onClick={() => form.handleSubmit(onSubmit)()}>Salvar a clínica</Button>
      </form>
    </Form>
  )
}
