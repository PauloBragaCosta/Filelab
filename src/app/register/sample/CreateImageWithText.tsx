"use client"

import html2canvas from "html2canvas";
import QRCode from 'qrcode'

export async function CreateImageWithText(id: String, PacienteName: string | undefined, TutoreName: string | undefined) {
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
    exameID.textContent = `${id}`;
    exameID.style.fontWeight = 'bold'; // Adicione esta linha
    exameID.style.marginBottom = '0'; // Adicione esta linha
    qrDiv.appendChild(exameID);

    // Gere o QRCode
    const examNumber = `${id}`; // Substitua pelo número do exame
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
    tutorName.textContent = `Tutor: ${TutoreName}`; // Substitua pelo nome do tutor
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
    

    // Remova o div do corpo do documento
    document.body.removeChild(div);

    // Retorne dataUrl e base64Image
    return dataUrl;
}