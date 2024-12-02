"use client"

import * as React from "react"
import { Exam } from "@/types/exam"
import { Badge } from "@/components/ui/badge"

interface SearchResultsProps {
  results: Exam[]
  filterValue: string
  selectedIndex: number
  onSelect: (exam: Exam) => void
}

export function SearchResults({ 
  results, 
  filterValue, // mantido, mas não usado diretamente neste componente. Pode ser útil para lógica futura.
  selectedIndex,
  onSelect
}: SearchResultsProps) {
  if (!results || results.length === 0) return null // Verificação adicional para evitar erros se results for null ou undefined

  return (
    <div className="absolute top-full left-0 right-0 mt-1 z-50">
      <ul className="max-h-60 overflow-auto rounded-md border bg-popover p-0 text-popover-foreground shadow-md">
        {results.map((exam, index) => (
          <li
            key={exam.id}
            onClick={() => onSelect(exam)}
            className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${
              index === selectedIndex ? 'bg-accent text-accent-foreground' : ''
            }`}
          >
            <div className="flex flex-col w-full gap-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">
                {exam.id} - {exam.patient?.name || "Nome do Paciente Indisponível"}
                </span>
                {exam.urgency && (
                  <Badge variant="destructive" className="ml-2">
                    Urgente
                  </Badge>
                )}
              </div>
              <div className="flex justify-between text-muted-foreground text-xs">
                <div className="flex gap-2">
                  <span>Tutor: {exam.patient?.tutor?.nameTutor || "Nome Indisponível"}</span> {/*  */}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}