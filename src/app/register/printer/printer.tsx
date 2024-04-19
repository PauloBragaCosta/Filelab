"use client"

import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import React, { useEffect } from 'react';
import Cookies from 'js-cookie'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateImageWithText } from "./CreateImageWithText"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import html2canvas from "html2canvas";
import QRCode from 'qrcode'

export function PrinterForm() {
  const PacienteName = Cookies.get('PacienteName')

  const TutoreName = Cookies.get('Tutor')

  const idExame = Cookies.get('idExame')

  const DateTimeColeta = Cookies.get('DateTimeColeta')

  const EspecieValue = Cookies.get('especie')

  const IsUrgent = Cookies.get('IsUrgent')




  const [image, setImage] = React.useState("");
  const [base64Image, setBase64Image] = React.useState("");




  async function imageCreater() {

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

    //  const examNumber = `${idExame}`; // Substitua pelo número do exame
    //  QRCode.toDataURL(examNumber, function (err: any, url: string) {
    //   const qrCode = document.getElementById('qrDiv');
    //   qrCode.innerHTML = svgString;
    //   qrDiv.appendChild(qrDiv);
    // });

    
    // Crie uma div para as informações
    const infoDiv = document.createElement('div');
    infoDiv.style.flex = '2';
    infoDiv.style.display = 'flex';
    infoDiv.style.flexDirection = 'column';
    infoDiv.style.alignItems = "center";
    infoDiv.style.marginTop = "-24px"
    div.appendChild(infoDiv);

    const patientName = document.createElement('p');
    patientName.textContent = `${PacienteName}`; // Substitua pelo nome do paciente
    patientName.style.fontWeight = 'bold'; // Adicione esta linha
    patientName.style.fontSize = '30px'; // Adicione esta linha
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
    tutorDiv.style.padding = '1px';

    const especieValue = document.createElement('p');
    especieValue.textContent = `Especie: ${EspecieValue}`; // Substitua pelo nome do tutor
    especieValue.style.marginBottom = '0px'; // Adicione esta linha
    infoDiv.appendChild(especieValue);

    const tutorName = document.createElement('p');
    tutorName.textContent = `Tutor: ${TutoreName}`; // Substitua pelo nome do tutor
    tutorName.style.marginBottom = '0px'; // Adicione esta linha
    infoDiv.appendChild(tutorName);

    const collectionDate = document.createElement('p');
    collectionDate.textContent = `Data da coleta: ${DateTimeColeta}`; // Substitua pela data da coleta
    collectionDate.style.marginBottom = '10px'; // Adicione esta linha
    infoDiv.appendChild(collectionDate);

    if(IsUrgent === "true") {
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
    }

    

    // Adicione o div ao corpo do documento
    document.body.appendChild(div);

    // Gere a imagem a partir do div
    const canvas = await html2canvas(div);
    const dataUrl = canvas.toDataURL();


    // Remova o div do corpo do documento
    document.body.removeChild(div);



    const base64Image = dataUrl.replace(/^data:image\/\w+;base64,/, "");
    setBase64Image(base64Image);
    setImage(dataUrl)


  }

  useEffect(() => {
    imageCreater();
  }, [])


  async function print() {
    await fetch(`http://127.0.0.1:5000`, {
      method: 'POST',
      body: JSON.stringify(base64Image),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }


  return (
    <div>
      <Tabs defaultValue="grande" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grande">Etiqueta grande</TabsTrigger>
          <TabsTrigger value="pequenas">Etiqueta pequenas</TabsTrigger>
          <TabsTrigger value="formulario">Formulario impresso</TabsTrigger>
        </TabsList>
        <TabsContent value="grande">
          <Card>
            <CardHeader>
              <CardTitle>Etiqueta grande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <img src={image} alt="Image" className="aspect-ratio-16/9 rounded-md object-cover" />
            </CardContent>
            <CardFooter>
              <Button onClick={print}>Imprimir</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>

    
  )
}


