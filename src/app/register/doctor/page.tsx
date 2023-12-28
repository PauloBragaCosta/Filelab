import { Separator } from "../../../components/ui/separator"
import { NotificationsForm } from "./doctor-form"

export default function SettingsNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Cadastro do médico solicitante</h3>
        <p className="text-sm text-muted-foreground">
        Insira as informações necessárias para a identificação do médico solicitante
        </p>
      </div>
      <Separator />
      <NotificationsForm />
    </div>
  )
}
