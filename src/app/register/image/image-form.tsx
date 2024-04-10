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
import React, { useEffect, useRef, useState } from 'react';
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// import ILovePDFApi from '@ilovepdf/ilovepdf-nodejs';
// import PdfJpgTask from '@ilovepdf/ilovepdf-js-core/tasks/PdfJpgTask';

// const instance = new ILovePDFApi('project_public_d78c0a408f56b417b91dadc2f60cce57_CQCdK0657ad59b03105b8b0f9214de9f05b6c', 'secret_key_301f21baddc431ce1a5c3582eac78424_0eDqT460431c8e220e86e86474f1d81c02d0d');
// const task = instance.newTask('pdfjpg') as PdfJpgTask;

import { LucideSparkles } from "lucide-react";
import runIA from "./geminiIA.";
import { ButtonIcon } from "@radix-ui/react-icons";
require('dotenv').config();


// Carregue a API_KEY do ambiente


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


  async function onPush() {
    // Redirecione para a página do tutor
    router.push('/register/patient');
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConversionProgress(10)
    const file = event.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension === 'jpeg' || fileExtension === 'jpg') {
        // O arquivo é um JPEG, precisa converter
        const reader = new FileReader();
        reader.onloadend = function () {
          const base64String = reader.result?.toString().split(',')[1] || "";
          const response = runIA(base64String)
          console.log(response);

        }
        reader.readAsDataURL(file);
      } else {
        // O arquivo não é um JPEG, não precisa converter
        console.log('O arquivo selecionado não é um JPEG.');
      }
    }
  };

  return (
    <div>
      <div className="grid w-full max-w-sm items-center gap-1.5" >
        <Label htmlFor="picture" >Arquivo ou imagem</Label>
        <Input id="picture" type="file" onChange={handleFileSelect} />
      </div>

      <Progress value={conversionProgress} />
      <div className="flex items-center justify-content-end gap-1 text-sm text-gray-600 animate-pulse">
        <LucideSparkles className="animate-[pulsecolortext_30s_ease-in-out_infinite]" />
        {progressDescription}
      </div>

      <Button type="submit" onClick={onPush} className="mt-4">
        Proximo
      </Button>
    </div>

  )
}




