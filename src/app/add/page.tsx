'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function AddMassLogs() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleAddLogs = async () => {
    setIsLoading(true)
    setResult(null)
    try {
      const response = await fetch('/api/tasks/add-mass-logs-api', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setResult(`Logs adicionados com sucesso: ${data.addedLogs} logs`)
    } catch (error) {
      setResult('Erro ao adicionar logs')
      console.error('Erro:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Adicionar Logs em Massa</h1>
      <Button 
        onClick={handleAddLogs} 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Processando...</span>
          </>
        ) : (
          'Adicionar Logs para Itens sem Log'
        )}
      </Button>
      {result && <p className="mt-4" role="status" aria-live="polite">{result}</p>}
    </div>
  )
}