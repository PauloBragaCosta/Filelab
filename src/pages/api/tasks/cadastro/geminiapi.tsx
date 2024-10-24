import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY não está definida no ambiente.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

async function uploadToGemini(filePath: string, mimeType: string) {
  const uploadResult = await fileManager.uploadFile(filePath, {
    mimeType,
    displayName: path.basename(filePath), // Nome do arquivo a ser exibido
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

async function downloadImage(url: string, localPath: string) {
  const response = await fetch(url);
  const buffer = await response.buffer();
  fs.writeFileSync(localPath, buffer);
}

async function run(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

const { downloadURL } = req.body; 
console.log(downloadURL)

  if (!downloadURL) {
    return res.status(400).json({ message: 'Link da imagem é obrigatório' });
  }

  if (!downloadURL) {
    return res.status(400).json({ message: 'Link da imagem é obrigatório' });
  }

  // Baixa a imagem para o servidor temporariamente
  const localFilePath = path.resolve('./public/temporarioimage.jpg'); // Defina um caminho local
  const mimeType = 'image/jpeg'; // Ajuste o tipo conforme necessário

  await downloadImage(downloadURL, localFilePath); // Baixa a imagem da URL

  // Fazendo o upload do arquivo local
  const files = [
    await uploadToGemini(localFilePath, mimeType),
  ];

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "Analise a imagem fornecida e determine qual espécie animal está selecionada nas caixas de seleção. A imagem mostra duas caixas de seleção, uma rotulada como \"CANINO\" e a outra como \"FELINO\". Uma das caixas está marcada responta em JSON: \n{\n \"text\": \"campo selecionado\"\n}",
  });

  const chatSession = model.startChat({
    generationConfig: {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    },
    history: [
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[0].mimeType,
              fileUri: files[0].uri,
            },
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("o que tem escrito nessa imagem?");
  console.log(result.response.text());

  return res.status(200).json(result.response.text());
}

export default run;
