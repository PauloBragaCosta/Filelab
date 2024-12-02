import { Metadata } from "next"
import { simulatedDatabase } from "@/search/database"
import { notFound } from "next/navigation"
import { ExamDetails } from "@/components/compopages/exam/exam-details"
import { Params } from "next/dist/server/request/params"

export default function ExamPage({ 
  params 
}: { 
  params: Params
}) {
  const exam = simulatedDatabase.find(item => item.id.toString() === params.id)

  if (!exam) {
    notFound()
  }

  return <ExamDetails exam={exam} />
}

export async function generateMetadata({ 
  params 
}: { 
  params: Params
}): Promise<Metadata> {
  const exam = simulatedDatabase.find(item => item.id.toString() === params.id)
  
  if (!exam) {
    return {
      title: 'Exame não encontrado',
      description: 'Página de exame não encontrado',
    }
  }

  return {
    title: `Exame ${exam.examType} - ${exam.patient.name}`,
    description: `Detalhes do exame ${exam.examType} do paciente ${exam.patient.name}`,
  }
}

export async function generateStaticParams() {
  return simulatedDatabase.map(exam => ({
    id: exam.id.toString(),
  }))
}

