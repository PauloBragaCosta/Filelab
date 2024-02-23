"use client"
import Image from "next/image"

import { Separator } from "../../components/ui/separator"
import { SidebarNav } from "./components/sidebar-nav"
import Header from "@/components/Pages/menus/header"


// https://youtu.be/6JnkwfrAI-U?si=ANF8bv0Dgaq_wOti Veja esse vide de novo paulo para corrigir os problemas 

const sidebarNavItems = [
  {
    title: "Anexar imagem",
    href: "/register/image",
  },
  {
    title: "Cadastro de Paciente",
    href: "/register/patient",
  },
  {
    title: "Amostra",
    href: "/register/sample",
  },
  {
    title: "Pagamento",
    href: "/register/pay",
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}


export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <Header />
      <div className="md:hidden">
        <Image
          src="/examples/forms-light.png"
          width={1280}
          height={791}
          alt="Forms"
          className="block dark:hidden"
        />
        <Image
          src="/examples/forms-dark.png"
          width={1280}
          height={791}
          alt="Forms"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Cadastro</h2>
          <p className="text-muted-foreground">
            Preencha todos os campos do formulário para concluir o registro
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  )
}
