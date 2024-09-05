'use client'

import { Button } from "@/components/ui/button"
import { Package2 } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function LandingPage() {
  const { data: session, status } = useSession()

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-200">
        <Link className="flex items-center justify-center" href="/">
          <span className="sr-only">File-Lab</span>
          <Package2/>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button className="text-sm font-medium" variant="ghost">
            Sobre
          </Button>
          <Button className="text-sm font-medium" variant="ghost">
            Funcionalidades
          </Button>
          <Button className="text-sm font-medium" variant="ghost">
            Contato
          </Button>
          <Link href="/home">
          {status === "authenticated" ? (
            <Button>Home</Button>
          ) : (
            <Button>Signin</Button>
          )}
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  File-Lab
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Sistema de gerenciamento de blocos e lâminas para laboratórios de anatomia patológica
                </p>
              </div>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg">
                File-Lab oferece simplicidade no controle de blocos e lâminas, otimização de processos e rastreabilidade completa para seu laboratório.
              </p>
              <div className="space-x-4">
                <Button className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50">
                  Solicitar Demonstração
                </Button>
                <Button
                  className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                  variant="outline"
                >
                  Saiba Mais
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Funcionalidades Principais</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  O File-Lab oferece um conjunto completo de ferramentas para otimizar o gerenciamento do seu laboratório.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <svg
                  className="mx-auto h-10 w-10 text-gray-900"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
                <h3 className="text-xl font-bold">Rastreamento Completo</h3>
                <p className="text-sm text-gray-500">
                  Acompanhe cada bloco e lâmina do início ao fim do processo, garantindo total controle e visibilidade.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <svg
                  className="mx-auto h-10 w-10 text-gray-900"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                  <path d="M10 9H8" />
                </svg>
                <h3 className="text-xl font-bold">Relatórios Detalhados</h3>
                <p className="text-sm text-gray-500">
                  Gere relatórios abrangentes e análises de dados para otimizar seus processos e tomar decisões informadas.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <svg
                  className="mx-auto h-10 w-10 text-gray-900"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <h3 className="text-xl font-bold">Segurança de Dados</h3>
                <p className="text-sm text-gray-500">
                  Garanta a proteção das informações e a conformidade com as normas de qualidade do setor.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Benefícios do File-Lab</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Descubra como o File-Lab pode transformar o dia a dia do seu laboratório:
                </p>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                <li className="flex items-center space-x-3">
                  <svg
                    className=" h-5 w-5 flex-shrink-0 text-green-500"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Redução de erros humanos</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className=" h-5 w-5 flex-shrink-0 text-green-500"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Aumento da eficiência nos processos</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className=" h-5 w-5 flex-shrink-0 text-green-500"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Maior controle sobre o fluxo de arquivo</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className=" h-5 w-5 flex-shrink-0 text-green-500"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Segurança e confiabilidade no armazenamento</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className=" h-5 w-5 flex-shrink-0 text-green-500"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Melhoria da comunicação entre equipes</span>
                </li>
              </ul>
              <div className="w-full max-w-sm space-y-2">
                <Button className="w-full">Saiba Mais</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-200">
        <p className="text-xs text-gray-500">© 2024 File-Lab - Todos os direitos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Termos de Serviço
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Política de Privacidade
          </Link>
        </nav>
      </footer>
    </div>
  )
}