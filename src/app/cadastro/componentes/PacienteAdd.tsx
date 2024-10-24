'use client'

import * as React from "react"
import { useMediaQuery } from '@react-hook/media-query'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Info } from "lucide-react"


export function AddPaciente({
  tag,
  disabledfield,
  onStatusChange,
  tutorId,
  nameBox,
  nameCroppedImage,
  name,
  especieBox,
  especieCroppedImage,
  especie,
  generoBox,
  generoCroppedImage,
  genero,
  raçaBox,
  raçaCroppedImage,
  raça,
  idadeBox,
  idadeCroppedImage,
  idade,
}: {
  tag: string
  disabledfield: boolean
  onStatusChange: (status: string) => void
  tutorId: string | undefined
  nameBox: any,
  nameCroppedImage: any,
  name: any,
  especieBox: any,
  especieCroppedImage: any,
  especie: any
  generoBox: any,
  generoCroppedImage: any,
  genero: any,
  raçaBox: any,
  raçaCroppedImage: any,
  raça: any,
  idadeBox: any,
  idadeCroppedImage: any,
  idade: any,
}) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [disabledfieldany, setDisabled] = React.useState(false)
  React.useEffect(() => {
    setDisabled(disabledfield);
  }, [disabledfield]);

  const Content = (
    <>
      <ProfileForm
        className="px-4"
        tag={tag}
        onStatusChange={onStatusChange}
        setOpen={setOpen} tutorId={tutorId}

        nameBox={nameBox}
        nameCroppedImage={nameCroppedImage}
        name={name}

        especieBox={especieBox}
        especieCroppedImage={especieCroppedImage}
        especie={especie}

        generoBox={generoBox}
        generoCroppedImage={generoCroppedImage}
        genero={genero}

        raçaBox={raçaBox}
        raçaCroppedImage={raçaCroppedImage}
        raça={raça}

        idadeBox={idadeBox}
        idadeCroppedImage={idadeCroppedImage}
        idade={idade}
      />
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
            <DialogTitle>Cadastre aqui o paciente</DialogTitle>
            <DialogDescription>
              Insira as informações do paciente para que seja registrado no banco de dados e incluído na lista de consultas do sistema.
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
          <DrawerTitle>Cadastre aqui o paciente</DrawerTitle>
          <DrawerDescription>
            Insira as informações do paciente para que seja registrado no banco de dados e incluído na lista de consultas do sistema.
          </DrawerDescription>
        </DrawerHeader>
        {Content}
      </DrawerContent>
    </Drawer>
  )
}



const pacienteFormSchema = z.object({
  name: z.string().nonempty({ message: 'Nome do paciente é obrigatório' }),
  especie: z.string().nonempty({ message: 'Espécie é obrigatória' }),
  raca: z.string().optional(),
  idade: z.number().optional(),
  sexo: z.string().optional(),
  peso: z.number().optional(),
  tutorId: z.string().nonempty({ message: 'ID do tutor é obrigatório' }),
})

type PacienteFormValues = z.infer<typeof pacienteFormSchema>

function ProfileForm({
  className,
  tag,
  onStatusChange,
  setOpen,
  tutorId,
  nameBox,
  nameCroppedImage,
  name,
  especieBox,
  especieCroppedImage,
  especie,
  generoBox,
  generoCroppedImage,
  genero,
  raçaBox,
  raçaCroppedImage,
  raça,
  idadeBox,
  idadeCroppedImage,
  idade,
}: React.ComponentProps<"form"> & {
  tag: string,
  onStatusChange: (status: string) => void,
  setOpen: (open: boolean) => void,
  tutorId: string | undefined,
  nameBox: any,
  nameCroppedImage: any,
  name: any,
  especieBox: any,
  especieCroppedImage: any,
  especie: any
  generoBox: any,
  generoCroppedImage: any,
  genero: any,
  raçaBox: any,
  raçaCroppedImage: any,
  raça: any,
  idadeBox: any,
  idadeCroppedImage: any,
  idade: any,
}) {
  // Funções auxiliares para mapear os valores recebidos para os valores das opções
  const mapEspecie = (value: string) => {
    const lowerValue = value.toLowerCase();
    if (lowerValue.includes('canino') || lowerValue.includes('canino')) return 'canino';
    if (lowerValue.includes('felino')) return 'felino';
    return 'outro';
  };

  const mapGenero = (value: string) => {
    const lowerValue = value.toLowerCase();
    if (lowerValue.includes('macho')) return 'macho';
    if (lowerValue.includes('femea') || lowerValue.includes('fêmea')) return 'femea';
    return '';
  };

  const form = useForm<PacienteFormValues>({
    resolver: zodResolver(pacienteFormSchema),
    defaultValues: {
      name: name || "",
      especie: especie ? mapEspecie(especie) : "",
      raca: raça || "",
      idade: idade ? parseInt(idade) : undefined,
      sexo: genero ? mapGenero(genero) : "",
      peso: 0,
      tutorId: tutorId,
    },
  })

  const onSubmit = async (data: PacienteFormValues) => {
    console.log(data)
    try {
      const response = await fetch('/api/tasks/cadastro/patient-api-route-updated', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar paciente');
      }

      const createdPatient = await response.json();
      onStatusChange(createdPatient.id);
      setOpen(false);
      console.log('Paciente criado:', createdPatient);
    } catch (error) {
      console.error('Erro ao criar paciente:', error);
    }
  };

  // Função 'ia' que retorna JSX
  const IA = ({ specialBox, specialCroppedImage, name }: { specialBox: any, specialCroppedImage: any, name: any }) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full"
            disabled={!specialCroppedImage || !specialBox}
          >
            <Info className="h-4 w-4" />
            <span className="sr-only">Imagem</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          {specialCroppedImage ? (
            <div className="space-y-2">
              <img src={specialCroppedImage} alt="Nome do Animal" className="max-w-full h-auto rounded" />
              {specialBox && (
                <div className="text-sm">
                  <p>Label: {specialBox.label}</p>
                  <h1>IA identificou como: {name}</h1>
                </div>
              )}
            </div>
          ) : (
            <p>Nenhuma imagem disponível</p>
          )}
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("grid items-start gap-4", className)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-1">
                <FormLabel>Paciente</FormLabel>
                <IA specialBox={nameBox} specialCroppedImage={nameCroppedImage} name={name} />
              </div>
              <FormControl>
                <Input placeholder="Nome" {...field} />
              </FormControl>
              <FormDescription>
                Este campo é destinado ao nome do paciente
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="especie"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-1">
                <FormLabel>Espécie</FormLabel>
                <IA specialBox={especieBox} specialCroppedImage={especieCroppedImage} name={especie} />
              </div>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a espécie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="canino">Canino</SelectItem>
                  <SelectItem value="felino">Felino</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="raca"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-1">
                <FormLabel>Raça</FormLabel>
                <IA specialBox={raçaBox} specialCroppedImage={raçaCroppedImage} name={raça} />
              </div>
              <FormControl>
                <Input placeholder="Ex: Labrador" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idade"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-1">
                <FormLabel>Idade</FormLabel>
                <IA specialBox={idadeBox} specialCroppedImage={idadeCroppedImage} name={idade} />
              </div>
              <FormControl>
                <Input type="number" placeholder="Ex: 5" {...field} onChange={e => field.onChange(+e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sexo"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-1">
                <FormLabel>Sexo</FormLabel>
                <IA specialBox={generoBox} specialCroppedImage={generoCroppedImage} name={genero} />
              </div>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o sexo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="macho">Macho</SelectItem>
                  <SelectItem value="femea">Fêmea</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="peso"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peso (kg)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" placeholder="Ex: 10.5" {...field} onChange={e => field.onChange(+e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tutorId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="button" onClick={() => form.handleSubmit(onSubmit)()}>Salvar o paciente</Button>
      </form>
    </Form>
  )
}