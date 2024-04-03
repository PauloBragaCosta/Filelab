"use client"

import { useEffect, useState } from "react";
import { Separator } from "../../../components/ui/separator"
import { SampleForm } from "./sample-form"

export default function SettingsAccountPage() {

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Agora é seguro usar sessionStorage
      setData(sessionStorage.getItem('key'));
    }
  }, []);

  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Cadastro da amostra</h3>
        <p className="text-sm text-muted-foreground">
          Atualize as configurações da amostra
        </p>
      </div>
      <Separator />
      <SampleForm />
    </div>
  )
}
