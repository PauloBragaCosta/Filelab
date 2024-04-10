import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
 
 
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

const MODEL_NAME = "gemini-1.0-pro-vision-latest";
const API_KEY = "AIzaSyBvGWJzAclOcsblHJao10zsBl4Et1vowL0";

 
export default async function runIA(base64String: string) {
  // Extract the `prompt` from the body of the request

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.4,
    topK: 32,
    topP: 1,
    maxOutputTokens: 4096,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const parts = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64String
      }
    },
    {text: "Por favor, extraia os campos da imagem manuscrita e os converta em um formato JSON. Além disso, reestruture o texto fornecido em um JSON que inclua as seguintes categorias: paciente, espécie, sexo, idade e telefone."},
  ];

  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
    safetySettings,
  });

  const response = result.response;
  console.log(response.text());

  return response
}



