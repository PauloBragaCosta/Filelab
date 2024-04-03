"use client"

import { useMediaQuery } from "@react-hook/media-query"
import { Separator } from "../../components/ui/separator"
import { SidebarNav } from "./components/sidebar-nav"
import Header from "@/components/ui/dashboard/Header"


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
    
    <div className="space-y-6 p-4 sm:p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-lg sm:text-2xl font-bold tracking-tight">Cadastro</h2>
        <p className="text-muted-foreground">
          Preencha todos os campos do formulário para concluir o registro
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 sm:space-y-0 sm:flex-row sm:space-x-12">
        <aside className="mx-4 sm:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 sm:max-w-2xl">{children}</div>
      </div>
    </div>
  </>
  
  )
}
