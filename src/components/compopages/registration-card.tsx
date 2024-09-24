import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function RegistrationCard() {
  return (
    <Card >
      <CardHeader>
        <CardTitle>Clique no botão abaixo para iniciar o cadastro</CardTitle>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/register">
            <PlusCircle className="mr-2 h-4 w-4" />
            Fazer arquivamento
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}