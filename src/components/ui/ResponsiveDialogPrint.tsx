import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import { useMediaQuery } from "@react-hook/media-query"
import html2canvas from "html2canvas"
import QRCode from 'qrcode'
import router from "next/router"


export function PrinterDialog({
  PacienteName,
  tutorNamfont,
  idExame,
  form,
  onSubmit,
}: {
  PacienteName: string | null | undefined
  tutorNamfont: string | null | undefined
  idExame: string|null
  form: any
  onSubmit: any
} ) {


  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [image, setImage] = React.useState("");
  const [base64Image, setbase64Image] = React.useState("");

  async function CreateImageWithText() {
    // Crie um elemento div
    const div = document.createElement('div');
    div.style.width = '384px';
    div.style.height = '152px';
    div.style.background = '#FFFFFF';
    div.style.marginTop = '3px';
    div.style.color = '#000';
    div.style.fontSize = '20px';
    div.style.display = 'flex';
    div.style.padding = '1px';

    // Crie uma div para o QRCode
    const qrDiv = document.createElement('div');
    qrDiv.style.flex = '1';
    qrDiv.style.display = 'flex'; // Adicione esta linha
    qrDiv.style.justifyContent = 'center'; // Adicione esta linha
    qrDiv.style.width = '150px';
    qrDiv.style.flexDirection = 'column';
    qrDiv.style.alignItems = 'center'; // Adicione esta linha
    qrDiv.style.gap = "2px";
    qrDiv.style.marginLeft = '5px'
    div.appendChild(qrDiv);

    // Adicione as informações solicitadas
    const exameID = document.createElement('p');
    exameID.textContent = `${idExame}`;
    exameID.style.fontWeight = 'bold'; // Adicione esta linha
    exameID.style.marginBottom = '0'; // Adicione esta linha
    qrDiv.appendChild(exameID);

    // Gere o QRCode
    const examNumber = `${idExame}`; // Substitua pelo número do exame
    QRCode.toDataURL(examNumber, function (err: any, url: string) {
      const qrCode = document.createElement('img');
      qrCode.src = url;
      qrCode.style.width = '120px';
      qrCode.style.height = '120px';
      qrDiv.appendChild(qrCode);
    });

    // Crie uma div para as informações
    const infoDiv = document.createElement('div');
    infoDiv.style.flex = '2';
    infoDiv.style.display = 'flex';
    infoDiv.style.flexDirection = 'column';
    infoDiv.style.alignItems = "center";
    div.appendChild(infoDiv);

    const patientName = document.createElement('p');
    patientName.textContent = `${PacienteName}`; // Substitua pelo nome do paciente
    patientName.style.fontWeight = 'bold'; // Adicione esta linha
    patientName.style.marginBottom = '0'; // Adicione esta linha
    infoDiv.appendChild(patientName);

    const tutorDiv = document.createElement('div');
    tutorDiv.style.display = 'flex';
    tutorDiv.style.justifyContent = 'center';
    tutorDiv.style.alignItems = 'center';
    tutorDiv.style.border = '2px solid #000';
    tutorDiv.style.height = "30px";
    tutorDiv.style.backgroundColor = '#000';
    tutorDiv.style.borderRadius = '5px';
    tutorDiv.style.padding = '2px';

    const tutorName = document.createElement('p');
    tutorName.textContent = `Tutor: ${tutorNamfont}`; // Substitua pelo nome do tutor
    tutorName.style.marginBottom = '0px'; // Adicione esta linha
    infoDiv.appendChild(tutorName);

    const collectionDate = document.createElement('p');
    collectionDate.textContent = 'Data da coleta: 30/03/2024'; // Substitua pela data da coleta
    collectionDate.style.marginBottom = '10px'; // Adicione esta linha
    infoDiv.appendChild(collectionDate);

    const urgencyDiv = document.createElement('div');
    urgencyDiv.style.display = 'flex';
    urgencyDiv.style.justifyContent = 'center';
    urgencyDiv.style.alignItems = 'center';
    urgencyDiv.style.border = '2px solid #000';
    urgencyDiv.style.height = "30px";
    urgencyDiv.style.backgroundColor = '#000';
    urgencyDiv.style.borderRadius = '5px';
    urgencyDiv.style.padding = '2px';

    const urgency = document.createElement('p');
    urgency.textContent = 'Urgente';
    urgency.style.marginBottom = '20px';
    urgency.style.fontWeight = 'bold';
    urgency.style.color = '#FFFFFF';

    urgencyDiv.appendChild(urgency);
    infoDiv.appendChild(urgencyDiv);

    // Adicione o div ao corpo do documento
    document.body.appendChild(div);

    // Gere a imagem a partir do div
    const canvas = await html2canvas(div);
    const dataUrl = canvas.toDataURL();
    const base64Image = dataUrl.replace(/^data:image\/\w+;base64,/, "");

    // Remova o div do corpo do documento
    document.body.removeChild(div);


    // Atualize o estado da imagem
    setImage(dataUrl);
    setbase64Image(base64Image);


  }



  async function print() {
    await fetch(`http://localhost:5000/`, {
      method: 'POST',
      body: JSON.stringify(base64Image),
      headers: {
        'Content-Type': 'application/json'
      }
    })

  }

    

  async function routerpush() {
    router.push(`/dashboard?PacientId=${idExame}`);

  }



  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => {form.handleSubmit(onSubmit); CreateImageWithText}} variant="outline" type="submit" >Imprimir</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Área de impreção</DialogTitle>
          </DialogHeader>
          <ProfileForm className={""} image={image} print={print} idExame={idExame} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button onClick={() => {form.handleSubmit(onSubmit); CreateImageWithText}} variant="outline" type="submit">Imprimir</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Área de impreção</DrawerTitle>
        </DrawerHeader>
        <ProfileForm className="px-4" image={image} print={print} idExame={idExame}/>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function ProfileForm({ className, image, print, idExame }: {
  className: string | React.ComponentProps<"form">
  image: any
  print: any
  idExame:string | null
}) {

  async function routerpush() {
    router.push(`/dashboard?PacientId=${idExame}`);
  }
  
  return (
    <form className={cn("grid items-start gap-20", className)}>
      <div className="grid gap-2">
        <Label htmlFor="email">Etiqueta grande para rotulos</Label>
        <img src={image} alt="Image" className="aspect-ratio-16/9 rounded-md object-cover" />
        <Button onClick={print} variant={'ghost'}>Imprimir</Button>
      </div>

      <Button onClick={routerpush}>Concluir</Button>
      <Button >Cadastrar outro exame</Button>
    </form>
  )
}
