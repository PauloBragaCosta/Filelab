"use client"

import { useEffect, useState } from "react";
import { Separator } from "../../../components/ui/separator"
import { PrinterForm } from "./printer"
import { Suspense } from 'react'

export default function SettingsAccountPage() {

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Agora é seguro usar sessionStorage
      setData(sessionStorage.getItem('key'));
    }
  }, []);

  function SearchBarFallback() {
    return <>placeholder</>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Impreção</h3>
        <p className="text-sm text-muted-foreground">
        Impreção de etiquetas e formularios
        </p>
      </div>
      <Separator />

      <Suspense fallback={<SearchBarFallback />}>
        <PrinterForm />
      </Suspense>
    </div>
  )
}