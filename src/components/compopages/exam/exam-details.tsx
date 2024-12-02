"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Exam } from "@/types/exam"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ExamDetailsProps {
  exam: Exam
}

export function ExamDetails({ exam }: ExamDetailsProps) {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Detalhes do Exame</h1>
          {exam.urgency && (
            <Badge variant="destructive">Urgente</Badge>
          )}
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">ID do Exame</dt>
                  <dd className="text-sm font-semibold">{exam.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Tipo de Exame</dt>
                  <dd className="text-sm font-semibold capitalize">{exam.examType}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Data do Exame</dt>
                  <dd className="text-sm font-semibold">
                    {format(new Date(exam.examDate), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Criado Por</dt>
                  <dd className="text-sm font-semibold">{exam.criadoPor}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paciente e Responsáveis</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Paciente</dt>
                  <dd className="text-sm font-semibold">{exam.patient.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Tutor</dt>
                  <dd className="text-sm font-semibold">{exam.patient.tutor.nameTutor}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Médico</dt>
                  <dd className="text-sm font-semibold">{exam.doctor.name}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {exam.description && (
            <Card>
              <CardHeader>
                <CardTitle>Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{exam.description}</p>
              </CardContent>
            </Card>
          )}

          {exam.result && (
            <Card>
              <CardHeader>
                <CardTitle>Resultado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{exam.result}</p>
              </CardContent>
            </Card>
          )}

          {exam.fileUrls.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Arquivos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {exam.fileUrls.map((url, index) => (
                    <li key={index}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Arquivo {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}