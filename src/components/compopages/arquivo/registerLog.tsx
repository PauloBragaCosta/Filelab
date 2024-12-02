import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMediaQuery } from "@react-hook/media-query"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, PlusIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  status: z.string(),
  observation: z.string().min(1, { message: "Observation is required." }),
})

interface RegisterLogProps {
  onStatusChange: (newStatus: string) => void;
  currentItemCode: string;
  currentItemType: string;
  currentUserName: string;
}

export function RegisterLog({ onStatusChange, currentItemCode, currentItemType, currentUserName }: RegisterLogProps) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <PlusIcon className="mr-2 h-4 w-4" />
            Mudar status
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Registrar Log</DialogTitle>
            <DialogDescription>
              Registre uma nova atualização de status para este item.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm
            className="px-4"
            setOpen={setOpen}
            onStatusChange={onStatusChange}
            currentItemCode={currentItemCode}
            currentItemType={currentItemType}
            currentUserName={currentUserName}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon">
          <PlusIcon className="h-4 w-4" />
          <span className="sr-only">Adicionar Log</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Registrar Log</DrawerTitle>
          <DrawerDescription>
            Registre uma nova atualização de status para este item.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm
          className="px-4"
          setOpen={setOpen}
          onStatusChange={onStatusChange}
          currentItemCode={currentItemCode}
          currentItemType={currentItemType}
          currentUserName={currentUserName}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

interface ProfileFormProps extends React.ComponentProps<"form"> {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onStatusChange: (newStatus: string) => void;
  currentItemCode: string;
  currentItemType: string;
  currentUserName: string;
}

function ProfileForm({ className, setOpen, onStatusChange, currentItemCode, currentItemType, currentUserName }: ProfileFormProps) {
  const [buttonStatus, setButtonStatus] = React.useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "",
      observation: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setButtonStatus("Loading")
    try {
      const response = await fetch('/api/tasks/createLog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          itemCode: currentItemCode,
          itemType:currentItemType,
          userCreated: currentUserName,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Log created:', result);

      onStatusChange(data.status);
      setOpen(false);
    } catch (error) {
      console.error('Error creating log:', error);
      setButtonStatus("Error")
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-8", className)}>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Arquivado">Arquivado</SelectItem>
                  <SelectItem value="Microtomia">Microtomia</SelectItem>
                  <SelectItem value="Patologista">Patologista</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="observation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observação</FormLabel>
              <FormControl>
                <Textarea placeholder="Digite sua observação aqui." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={buttonStatus === "Loading"}>
          {buttonStatus === "Loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Carregando
            </>
          ) : buttonStatus === "Error" ? (
            "Tentar novamente"
          ) : (
            "Salvar"
          )}
        </Button>
      </form>
    </Form>
  )
}