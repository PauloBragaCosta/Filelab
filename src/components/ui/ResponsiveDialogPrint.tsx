import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import { useMediaQuery } from "@react-hook/media-query"
import html2canvas from "html2canvas"
import QRCode from 'qrcode'
import router from "next/router"


export function PrinterDialog({
  image,
  base64Image,
  idExame,
  form,
  onSubmit,
}: {
  image: string
  base64Image: string
  idExame: string|null
  form: any
  onSubmit: any
} ) {


  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  async function print() {
    await fetch(`http://localhost:5000/`, {
      method: 'POST',
      body: JSON.stringify(base64Image),
      headers: {
        'Content-Type': 'application/json'
      }
    })

  }
   
  async function routerpush() {
    router.push(`/dashboard?PacientId=${idExame}`);

  }



  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={form.handleSubmit(onSubmit)} variant="outline" type="submit" >Imprimir</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Área de impreção</DialogTitle>
          </DialogHeader>
          <ProfileForm className={""} image={image} print={print} idExame={idExame} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button onClick={form.handleSubmit(onSubmit)} variant="outline" type="submit">Imprimir</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Área de impreção</DrawerTitle>
        </DrawerHeader>
        <ProfileForm className="px-4" image={image} print={print} idExame={idExame}/>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function ProfileForm({ className, image, print, idExame }: {
  className: string | React.ComponentProps<"form">
  image: any
  print: any
  idExame:string | null
}) {

  async function routerpush() {
    router.push(`/dashboard?PacientId=${idExame}`);
  }
  
  return (
    <form className={cn("grid items-start gap-20", className)}>
      <div className="grid gap-2">
        <Label htmlFor="email">Etiqueta grande para rotulos</Label>
        <img src={image} alt="Image" className="aspect-ratio-16/9 rounded-md object-cover" />
        <Button onClick={print} variant={'ghost'}>Imprimir</Button>
      </div>

      <Button onClick={routerpush}>Concluir</Button>
      <Button >Cadastrar outro exame</Button>
    </form>
  )
}
