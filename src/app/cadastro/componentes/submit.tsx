'use client'

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useMediaQuery } from '@react-hook/media-query'
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"




export function LabelPrintingMenu({
  dialogsetopen,
  idExame,
  nomeTutor,
  nomePatient,
  urgenteStatos,
  date,
}: {
  dialogsetopen: boolean
  idExame: string
  nomeTutor: string
  nomePatient: string
  urgenteStatos: boolean
  date: Date | undefined
}) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [printerStatus, setPrinterStatus] = React.useState<"success" | "error">("error")
  const [badgeVariant, setBadgeVariant] = React.useState<"default" | "destructive" | "outline" | "secondary" | "success" | null | undefined>("destructive");

  React.useEffect(() => {
    setOpen(dialogsetopen);
  }, [dialogsetopen]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild />
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <DialogTitle>Print Labels</DialogTitle>
              <Badge variant={badgeVariant}>
                {printerStatus === "success" ? (
                  "Impressora conectada"
                ) : (
                  "Impressora desconectada"
                )}
              </Badge>
            </div>
            <DialogDescription>
              Set the quantity of labels to print and click "Print" when you're ready.
            </DialogDescription>
          </DialogHeader>
          <LabelPrintForm
            className=""
            idExame={idExame}
            nomeTutor={nomeTutor}
            nomePatient={nomePatient}
            urgenteStatos={urgenteStatos}
            date={date}
            setBadgeVariant={setBadgeVariant}
            setPrinterStatus={setPrinterStatus} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild />
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Print Labels</DrawerTitle>
          <Badge variant={badgeVariant}>
            {printerStatus === "success" ? (
              <>
                Impressora conectada
              </>
            ) : (
              <>
                Impressora desconectada
              </>
            )}
          </Badge>
          <DrawerDescription>
            Set the quantity of labels to print and click "Print" when you're ready.
          </DrawerDescription>
        </DrawerHeader>
        <LabelPrintForm className="px-4"
          idExame={idExame}
          nomeTutor={nomeTutor}
          nomePatient={nomePatient}
          urgenteStatos={urgenteStatos}
          date={date}
          setBadgeVariant={setBadgeVariant}
          setPrinterStatus={setPrinterStatus} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}


function LabelPrintForm({ className, setBadgeVariant, setPrinterStatus, idExame, nomeTutor, nomePatient, urgenteStatos, date }: React.ComponentProps<"form"> & {
  setBadgeVariant: (status: "default" | "destructive" | "outline" | "secondary" | "success" | null | undefined) => void,
  setPrinterStatus: (status: "success" | "error") => void,
  idExame: string
  nomeTutor: string
  nomePatient: string
  urgenteStatos: boolean
  date: Date | undefined
}) {
  const [quantity, setQuantity] = React.useState(1)

  React.useEffect(() => {
    const verificarStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/teste', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const statusData = await response.json();
        console.log('impressora operante:', statusData.status);
        setPrinterStatus(statusData.status);
        
        if (statusData.status === "success") {
          setBadgeVariant("success");
        }
      } catch (erro) {
        console.error('Erro ao verificar status:', erro);
      }
    };

    verificarStatus();
  }, []);


  const handlePrint = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
        // Primeiro verifica o status da impressora
        const statusResponse = await fetch('http://localhost:5000/teste', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const statusData = await statusResponse.json()
        console.log(`impressora operante:`, statusData.status)
        setPrinterStatus(statusData.status)
        
        if (statusData.status === "success") {
            setBadgeVariant("success")
            
            // Faz apenas uma chamada para imprimir, enviando a quantidade
            const response = await fetch('http://localhost:5000/print', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_exame: idExame,
                    nome_paciente: nomePatient,
                    nome_tutor: nomeTutor,
                    urgente_status: urgenteStatos,
                    date: date,
                    quantity: quantity  // Adiciona a quantidade ao payload
                }),
            })

            const data = await response.json()
            console.log('Resultado das impressões:', data)
        } else {
          setBadgeVariant("destructive")
        }
    } catch (error) {
        console.error('Error:', error)
    }
}

  return (
    <form onSubmit={handlePrint} className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          type="number"
          id="quantity"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
        />
      </div>
      <Button type="button" onClick={handlePrint}>Print</Button>
      <Button type="button" variant="secondary" asChild>
        <Link href="/cadastro">Register New</Link>
      </Button>
    </form>
  )
}
