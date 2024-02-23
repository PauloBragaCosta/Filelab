import { Separator } from "../../../components/ui/separator"
import { ImageForm } from "../image/image-form"

export default function SettingsAccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Cadastro do paciente</h3>
        <p className="text-sm text-muted-foreground">
          Atualize as configurações da conta do paciente
        </p>
      </div>
      <Separator />
      <ImageForm />
    </div>
  )
}
