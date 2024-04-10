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

export function AddTags({
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
            <DialogTitle>Adicionar {tag}</DialogTitle>
            <DialogDescription>
              Insira o valor de {tag} para que seja registrado no banco de dados e incluído na lista de consultas do sistema.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm className="px-4" tag={tag} onStatusChange={onStatusChange}/>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost">+ adicionar</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>+ adicionar</DrawerTitle>
          <DrawerDescription>
            Insira o valor de {tag} para que seja registrado no banco de dados e incluído na lista de consultas do sistema.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" tag={tag} onStatusChange={onStatusChange}/>
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
  function capitalizeFirstLetter(texto: string = ""): string {
    if (typeof texto !== "string") {
      return ""; // Ou alguma outra mensagem de erro
    }

    if (texto.length === 0) return "";

    const primeiraLetra = texto.length > 0 ? texto[0].toUpperCase() : "";
    const restoDoTexto = texto.slice(1).toLowerCase();

    return `${primeiraLetra}${restoDoTexto}`;
  }
  const tagTitlelabel = capitalizeFirstLetter(tag)

  function filterInput(input: string) {
    // Remove acentos
    const from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç";
    const to = "aaaaaeeeeeiiiiooooouuuunc";
    for (let i = 0, len = from.length; i < len; i++) {
      input = input.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    // Converte para minúsculas
    input = input.toLowerCase();

    // Substitui espaços por hífens
    input = input.replace(/\s/g, '-');

    // Remove caracteres não alfanuméricos (exceto hífens)
    input = input.replace(/[^a-z0-9-]/g, '');

    return input;
  }

  const [inputValue, setInputValue] = React.useState('');

  function handleInputChange(event: any) {
    const filteredInput = filterInput(event.target.value);
    setInputValue(filteredInput);
  }

  const formSchema = z.object({
    label: z.string().nonempty({ message: 'Nome do tutor é obrigatório' }),
  })


  type FormValues = z.infer<typeof formSchema>

  const form = useForm<FormValues>({
    mode: "all",
  });

  const onSubmit = async (data: FormValues) => {
    const datatag = data.label
    console.log(inputValue)
    const body = {
      datatag,
      inputValue,
      tag
    }

    await fetch(
      "http://localhost:3000/api/tasks/createTag",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    onStatusChange(inputValue)

  }



  return (

    <Form {...form}>

      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("grid items-start gap-4", className)}>

        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>{tagTitlelabel}</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Beagle exemplo" onInput={handleInputChange} {...field}></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-2">
          <Label htmlFor="username">{tagTitlelabel}-tags</Label>
          <Input disabled id="username" defaultValue={inputValue} placeholder="beagle-exemplo" />

        </div>
        <DrawerClose asChild>
          <Button type="submit">Salvar a tag</Button>
        </DrawerClose>
      </form>
    </Form>
  )
}
