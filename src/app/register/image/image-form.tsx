"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from 'next/navigation';

import { Button } from "../../../components/ui/button"
import {
  Form,
  FormField,
} from "../../../components/ui/form"

import { Input } from "../../../components/ui/input"

import { toast } from "../../../components/ui/use-toast"
import React, { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

// import ILovePDFApi from '@ilovepdf/ilovepdf-nodejs';
// import PdfJpgTask from '@ilovepdf/ilovepdf-js-core/tasks/PdfJpgTask';

// const instance = new ILovePDFApi('project_public_d78c0a408f56b417b91dadc2f60cce57_CQCdK0657ad59b03105b8b0f9214de9f05b6c', 'secret_key_301f21baddc431ce1a5c3582eac78424_0eDqT460431c8e220e86e86474f1d81c02d0d');
// const task = instance.newTask('pdfjpg') as PdfJpgTask;

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { LucideSparkles } from "lucide-react";

const MODEL_NAME = "gemini-pro-vision";

// Carregue a API_KEY do ambiente

const API_KEY = "AIzaSyCyC-TpLRiP8V2MVMc9lUVLwKuHdXW3JGk";

const accountFormSchema = z.object({
  nomeCompleto: z.string({
    required_error: "Please select a observation.",
  }),
  dataNascimento: z.date({
    required_error: "A date of birth is required.",
  }),
  raca: z.string({
    required_error: "Please select a breed.",
  }),
  especie: z.string({
    required_error: "Please select a species.",
  }),
  sexo: z.string({
    required_error: "Please select a species.",
  }),
  tutorId: z.string({
    required_error: "Please select a species.",
  }),
  medico: z.string({
    required_error: "Please select a species.",
  }),
})

type AccountFormValues = z.infer<typeof accountFormSchema>


// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
}

type ResponsePayload = {
  text(): any;
  paciente: string;
  espécie: string;
  sexo: string;
  raça: string;
  idade: string;
  tutor: string;
  telefone: string;
  data_da_coleta: string;
  medico: string;
  CRMV: string;
  clinica: string;
  exames: string[];
  Outros: string;
};





export function ImageForm() {



  // Adicione um estado para armazenar o progresso da conversão
  const [conversionProgress, setConversionProgress] = useState(0);
  const [progressDescription, setProgressDescription] = useState("");

  useEffect(() => {
    // Atualize o estado `conversionProgress` no efeito
    setConversionProgress(progress => {
      const newDescription = {
        10: "Processando...",
        20: "Arquivo convertido para JPEG (se necessário)",
        80: "Dados extraídos da imagem",
        // Add more descriptions for other progress values as needed
      }[progress];
      setProgressDescription(newDescription || "Selecione o arquivo");
      return progress;
    });
  }, [conversionProgress]);








  const router = useRouter();

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });


  async function onSubmit(data: AccountFormValues) {
    // Redirecione para a página do tutor
    router.push('/register/patient');


    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })



  }

  function delay(ms: number | undefined) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function run(imageData: string) {
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
      { text: "Por favor, extraia os campos da imagem manuscrita e os converta em um formato JSON. Além disso, reestruture o texto fornecido em um JSON que inclua as seguintes categorias: paciente, espécie, sexo, idade e telefone." },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData
        }
      },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });

    const response = result.response;
    let text = response.text();

    // Remove "`", "```json", and "json" from the text
    text = text.replace(/`/g, '').replace(/```json/g, '').replace(/json/g, '');

    try {
      const obj = JSON.parse(text);

      const body = {
        paciente: obj.paciente || "",
        especie: obj.especie || "",
        sexo: obj.sexo || "",
        idade: obj.idade || "",
        telefone: obj.telefone || ""
      };

      const ia = true;

      sessionStorage.setItem('PacienteSON', JSON.stringify(body.paciente));
      sessionStorage.setItem('SexoSON', JSON.stringify(body.sexo));
      sessionStorage.setItem('EspecieSON', JSON.stringify(body.especie));
      sessionStorage.setItem('IdadeSON', JSON.stringify(body.idade));
      sessionStorage.setItem('TelefoneSON', JSON.stringify(body.telefone));
      sessionStorage.setItem('IAJSON', JSON.stringify(ia));


      setConversionProgress(100);
      router.push('/register/patient');



      console.log(body);
    } catch (error) {
      console.error("Erro ao analisar o texto como JSON: ", error);
    }






}



const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    // Atualize o progresso para indicar que um arquivo foi selecionado
    setConversionProgress(10);

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension === 'jpeg' || fileExtension === 'jpg') {
      // O arquivo já é um JPEG, não precisa converter
      console.log('O arquivo selecionado já é um JPEG.');
      const reader = new FileReader();
      reader.onload = async function (e) {
        if (e.target) {
          const imageData = e.target.result;
          if (typeof imageData === 'string') {
            run(imageData.split(',')[1]);

            await delay(2000);
            setConversionProgress(15);

            await delay(2000);
            setConversionProgress(20);

            await delay(2000);
            setConversionProgress(30);

            await delay(2000);
            setConversionProgress(40);

            await delay(2000);
            setConversionProgress(55);

            await delay(2000);
            setConversionProgress(70);
          }
        }
      };
      reader.readAsDataURL(file);
    } else if (fileExtension === 'pdf') {
      // O arquivo é um PDF, precisa converter para JPEG
      setConversionProgress(1);
      console.log('O arquivo selecionado é um PDF, convertendo para JPEG...');
      const reader = new FileReader();
      reader.onload = async function (e) {
        if (e.target) {
          // const filePDF = e.target.result as string;
          // task.start()
          //   .then(() => {
          //     return task.addFile(filePDF);
          //   })
          //   .then(() => {
          //     return task.addFile(filePDF);
          //   })
          //   .then(() => {
          //     return task.process({ pdfjpg_mode: 'pages' });
          //   })
          //   .then(() => {
          //     return task.download();
          //   })
          //   .then((data) => {
          //     // Converta 'data' para uma string codificada em base64
          //     let uint8Array = new Uint8Array(data);
          //     let decoder = new TextDecoder();
          //     let imageData = `data:image/jpeg;base64,${btoa(decoder.decode(uint8Array))}`;
          //     run(imageData.split(',')[1]);
          //   });

        }
      }
      reader.readAsDataURL(file);
    };


    // const filePDF = e.target.result as string;
    //       // Faça uma solicitação HTTP para o seu servidor web aqui
    //       fetch('http://seu-servidor-web.com/convert', {
    //           method: 'POST',
    //           body: JSON.stringify({ file: filePDF }),
    //           headers: { 'Content-Type': 'application/json' }
    //       })
    //       .then(response => response.json())
    //       .then(data => {
    //           // 'data' deve ser a imagem JPEG codificada em base64
    //           let imageData = `data:image/jpeg;base64,${data}`;
    //           run(imageData.split(',')[1]);
    //       });

  } else {
    // O arquivo não é um JPEG nem um PDF
    console.log('O arquivo selecionado não é um JPEG nem um PDF.');
  }
}







return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <FormField
        control={form.control}
        name="nomeCompleto"
        render={({ field }) => (
          <div className="grid w-full max-w-sm items-center gap-1.5" >
            <Label htmlFor="picture" >Arquivo ou imagem</Label>
            <Input id="picture" type="file" onChange={handleFileSelect} />
          </div>

        )}
      />

      <Progress value={conversionProgress} />
      <div className="flex items-center justify-content-end gap-1 text-sm text-gray-600 animate-pulse">
        <LucideSparkles className="animate-[pulsecolortext_30s_ease-in-out_infinite]" />
        {progressDescription}
      </div>







      <Button type="submit" className="mt-4">
        Proximo
      </Button>
    </form>
  </Form>
)
}



