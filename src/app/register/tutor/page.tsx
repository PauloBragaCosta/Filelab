import { Separator } from "../../../components/ui/separator"
import { TutorForm } from "./tutor-form"

export default function SettingsNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Cadastro do tutor</h3>
        <p className="text-sm text-muted-foreground">
        Insira as informações necessárias para a identificação do responsável
        </p>
      </div>
      <Separator />
      <TutorForm />
    </div>
  )
}
