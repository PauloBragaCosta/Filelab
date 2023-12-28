import { Separator } from "../../components/ui/separator"
import { ProfileForm } from "../register/account-form"

export default function SettingsProfilePage() {
  return (    
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Usuario</h3>
        <p className="text-sm text-muted-foreground">
          É assim que outras pessoas verão você no site.
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  )
}
