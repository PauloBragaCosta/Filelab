import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@react-hook/media-query"
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
import {
  Loader2,
  PlusCircle,
  PlusIcon,
  Search,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Textarea } from "../ui/textarea"
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

type FormData = {
  itemCode: string;
  UserCreated: string;
  status: string;
  observation: string;
};

const formSchema = z.object({
  itemCode: z.string(),
  UserCreated: z.string().min(2, { message: "User must be at least 2 characters." }),
  status: z.string(),
  observation: z.string().min(1, { message: "Observation is required." }),
})

export function RegisterLog() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <PlusIcon className="mr-2 h-4 w-4" />
            mudar status
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon">
          <PlusIcon className="h-4 w-4" />
          <span className="sr-only">Add Log</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" setOpen={setOpen} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function ProfileForm({ className, setOpen }: React.ComponentProps<"form"> & { setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const itemCode = searchParams?.get('itemCode');

  const { register, handleSubmit, reset } = useForm<FormData>();

  const [buttonStatus, setButtonStatus] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemCode: `${itemCode}`,
      UserCreated: "",
      observation: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setButtonStatus("Loading")
    console.log(data)
    try {
      const response = await fetch('/api/tasks/createLog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Log created:', result);

      router.refresh;
      // Reset the form fields
      // Close the drawer
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
          name="itemCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Code</FormLabel>
              <FormControl>
                <Input {...field} readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="UserCreated"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Created</FormLabel>
              <FormControl>
                <Input placeholder="Enter user name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
              <FormLabel>Observation</FormLabel>
              <FormControl>
                <Textarea placeholder="Type your observation here." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {buttonStatus === "Loading" ? (
          <Button type="submit" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading
          </Button>
        ) : buttonStatus === "Error" ? (
          <Button type="submit">Edit again and click here</Button>
        ) : (
          <Button type="submit">Save</Button>
        )}
      </form>
    </Form>
  )
}
