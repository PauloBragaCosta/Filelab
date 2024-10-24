'use client'

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import useFirebaseAuth from '@/hooks/useFirebaseAuth'
import Image from "next/image"
import {
  ChevronLeft,
  Upload,
  Printer,
  X,
  ChevronRight,
  Info,
  Search,
  ScanEye,
  Link,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import Header from '@/components/compopages/header'
import ImageEditor from './imageEditor'
import { AddTutor } from './componentes/tutorAfdd'
import { AddDoctor } from './componentes/doctorAfdd'
import { Combobox } from './Combobox'
import { AddPaciente } from './componentes/PacienteAdd'

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { HfInference } from "@huggingface/inference";
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { firebaseConfig } from '@/types/item'; // Certifique-se de ajustar o caminho para o seu firebaseConfig
import { initializeApp } from 'firebase/app'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useMediaQuery } from '@react-hook/media-query'
import { toast } from '@/components/ui/use-toast'
import { LabelPrintingMenu } from './componentes/submit'
import LoadingPage from '@/components/compopages/loading-page'
import { AddClinic } from './componentes/clinicAdd'

type BoundingBox = {
  id: string
  x: number
  y: number
  width: number
  height: number
  label?: string
  text?: string
}

export default function Home() {
  const { user, loading, auth } = useFirebaseAuth()

  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [croppedImages, setCroppedImages] = useState<string[]>([]);
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([
    { id: "name", x: 15.24086444780434, y: 14.117626439951197, width: 38.945718166351945, height: 3.602153779828738, label: "Handwriting", text: "Meg" },
    { id: "Raça", x: 32.41428749961578, y: 17.266122496354384, width: 21.632779779124075, height: 2.5773563010778724, label: "Handwriting", text: "Golden" },
    { id: "Idade", x: 55.775516902577536, y: 17.181174273267015, width: 38.948300177829374, height: 2.7707482203615807, label: "Handwriting", text: "Idade 9 anos 0 meses" },
    { id: "Tutor", x: 14.923076923076922, y: 20.467032967032967, width: 45.94736842105262, height: 3.5714285714285734, label: "Handwriting", text: "Josimar Gomes" },
    { id: "FbElLLw98t", x: 14.308171306308088, y: 25.274725274725125, width: 50.32406075848458, height: 3.0219780219780206, label: "Handwriting", text: "MedPet" },
    { id: "Data", x: 65.97570850202429, y: 25.274725274725274, width: 27.68623481781377, height: 3.1593406593406606, label: "Handwriting", text: "data 28/12/21" },
    { id: "Medico", x: 12.159955893972505, y: 22.950405042497803, width: 52.31575725867703, height: 2.591815771661121, label: "Handwriting", text: "laiala" },
    { id: "CRMV", x: 70.63403353306343, y: 23.07329654338877, width: 23.175217849649925, height: 1.9031963176138866, label: "Handwriting", text: "CRMV" },
    { id: "Especie", x: 55.11671375547176, y: 14.826112500395277, width: 20.75693424794732, height: 2.608083842656063, label: "Text", text: "espécie" },
    { id: "Genero", x: 4.735805386667591, y: 16.940775075521817, width: 20.656172431209704, height: 2.8900388526729337, label: "Text", text: "sexo" },
    { id: "telefone", x: 70.53327171632581, y: 21.24058897827911, width: 23.477503299862732, height: 1.6917300601012284, label: "Handwriting", text: "Telefone" }
  ]);

  const tutorBox = boundingBoxes.find(box => box.id === "Tutor");
  const [tutorCroppedImage, setTutorCroppedImage] = useState<string | null>(null);
  const [tutor, setTutor] = useState(null)

  const nameBox = boundingBoxes.find(box => box.id === "name");
  const [nameCroppedImage, setNameCroppedImage] = useState<string | null>(null);
  const [name, setName] = useState<string>("nome")

  const especieBox = boundingBoxes.find(box => box.id === "Especie");
  const [especieCroppedImage, setEspecieCroppedImage] = useState<string | null>(null);
  const [especie, setEspecie] = useState<string | null>()

  const generoBox = boundingBoxes.find(box => box.id === "Genero");
  const [generoCroppedImage, setGeneroCroppedImage] = useState<string | null>(null);
  const [genero, setGenero] = useState<string | null>()

  const doctorBox = boundingBoxes.find(box => box.id === "Medico");
  const [doctorCroppedImage, setDoctorCroppedImage] = useState<string | null>(null);
  const [doctor, setDoctor] = useState(null)

  const dataBox = boundingBoxes.find(box => box.id === "Data");
  const [dataCroppedImage, setDataCroppedImage] = useState<string | null>(null);
  const [data, setData] = useState(null)
  const [openData, setOpenData] = useState(false)


  const raçaBox = boundingBoxes.find(box => box.id === "Raça");
  const [raçaCroppedImage, setRaçaCroppedImage] = useState<string | null>(null);
  const [raça, setRaça] = useState(null)

  const idadeBox = boundingBoxes.find(box => box.id === "Idade");
  const [idadeCroppedImage, setIdadeCroppedImage] = useState<string | null>(null);
  const [idade, setIdade] = useState(null)

  async function recognizeHandwrittenText(imageData: string | null) {
    // Verifica se imageData é null ou uma string vazia
    if (!imageData) {
      console.log("Nenhuma imagem fornecida. A função não fará nada.");
      return; // Não faz nada se imageData for null ou vazio
    }

    const base64Image = imageData.replace(/^data:image\/\w+;base64,/, "");
    const binaryImage = Buffer.from(base64Image, "base64");

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/microsoft/trocr-small-printed",
        {
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/octet-stream",
          },
          method: "POST",
          body: binaryImage,
        }
      );

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }

      const result = await response.json();

      // Verifica se o resultado contém o texto gerado
      if (result && result[0] && result[0].generated_text) {
        console.log(result[0].generated_text);
      } else {
        console.log("Texto não encontrado.");
      }

      return result;

    } catch (error) {
      console.error("Erro ao reconhecer o texto manuscrito:", error);
    }
  }

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);

  const handleEspecie = async (image: File): Promise<string | null> => {
    try {
      const storageRef = ref(storage, `temporarioimageespecie/${image.name}`);

      // Upload do arquivo com uploadBytes
      const snapshot = await uploadBytes(storageRef, image);

      // Obtém o URL da imagem armazenada
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Envia o URL da imagem para a API
      const response = await fetch('/api/tasks/cadastro/geminiapi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ downloadURL }), // Envia o URL como JSON
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Pega a resposta da API
      const logs = await response.json();

      return logs || "Não foi possivel identificar"; // Se houver um campo "text" no JSON de resposta
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      return null;
    }
  };

  const handleGenero = async (image: File): Promise<string | null> => {
    try {
      const storageRef = ref(storage, `temporarioimagegenero/${image.name}`);

      // Upload do arquivo com uploadBytes
      const snapshot = await uploadBytes(storageRef, image);

      // Obtém o URL da imagem armazenada
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Envia o URL da imagem para a API
      const response = await fetch('/api/tasks/cadastro/geminigeneroapi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ downloadURL }), // Envia o URL como JSON
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Pega a resposta da API
      const logs = response.json();
      console.log(logs);

      return logs || "Não foi possivel identificar"; // Se houver um campo "text" no JSON de resposta
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      return null;
    }
  };

  useEffect(() => {
    // Função para converter base64 para Blob e depois para File
    const convertBase64ToFile = (base64: string, filename: string): File => {
      // Remove o prefixo data:image/...;base64, da string base64
      const base64Image = base64.replace(/^data:image\/\w+;base64,/, '');

      // Decodifica a string base64 para binário usando atob (que funciona no navegador)
      const binaryImage = atob(base64Image);

      // Cria um array de bytes (Uint8Array) a partir da string binária
      const len = binaryImage.length;
      const u8arr = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        u8arr[i] = binaryImage.charCodeAt(i);
      }

      // Extrai o MIME type da base64
      const mimeType = base64.match(/^data:(.*?);base64/)?.[1] || 'image/jpeg';

      // Cria o arquivo (File) a partir do array de bytes
      return new File([u8arr], filename, { type: mimeType });
    };

    if (especieBox && croppedImages.length > 0 && especieCroppedImage) {
      let isMounted = true;

      // Converte a imagem base64 para um File e envia para handleUploadProfilePicture
      const file = convertBase64ToFile(especieCroppedImage, "especie_image.jpg");
      handleEspecie(file)
        .then((text) => {
          let stringText;

          // Tenta parsear a resposta como JSON
          try {
            const parsedText = JSON.parse(text as string);

            // Verifica se parsedText é um objeto e contém a chave 'text'
            stringText = parsedText?.text ? parsedText.text : String(text);
          } catch (error) {
            // Se não conseguir parsear como JSON, assume que é uma string simples
            stringText = String(text);
          }

          console.log('Texto extraído da IA:', stringText);
          setEspecie(stringText); // Define o estado com a string correta
        })
        .catch((error) => {
          console.error('Erro ao reconhecer o texto:', error);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [especieBox, croppedImages, especieCroppedImage]);

  useEffect(() => {
    // Função para converter base64 para Blob e depois para File
    const convertBase64ToFile = (base64: string, filename: string): File => {
      // Remove o prefixo data:image/...;base64, da string base64
      const base64Image = base64.replace(/^data:image\/\w+;base64,/, '');

      // Decodifica a string base64 para binário usando atob (que funciona no navegador)
      const binaryImage = atob(base64Image);

      // Cria um array de bytes (Uint8Array) a partir da string binária
      const len = binaryImage.length;
      const u8arr = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        u8arr[i] = binaryImage.charCodeAt(i);
      }

      // Extrai o MIME type da base64
      const mimeType = base64.match(/^data:(.*?);base64/)?.[1] || 'image/jpeg';

      // Cria o arquivo (File) a partir do array de bytes
      return new File([u8arr], filename, { type: mimeType });
    };

    if (generoBox && croppedImages.length > 0 && generoCroppedImage) {
      let isMounted = true;

      // Converte a imagem base64 para um File e envia para handleUploadProfilePicture
      const file = convertBase64ToFile(generoCroppedImage, "especie_image.jpg");
      handleGenero(file)
        .then((text) => {
          let stringText;

          // Tenta parsear a resposta como JSON
          try {
            const parsedText = JSON.parse(text as string);

            // Verifica se parsedText é um objeto e contém a chave 'text'
            stringText = parsedText?.text ? parsedText.text : String(text);
          } catch (error) {
            // Se não conseguir parsear como JSON, assume que é uma string simples
            stringText = String(text);
          }

          console.log('Texto extraído da IA:', stringText);
          setGenero(stringText); // Define o estado com a string correta
        })
        .catch((error) => {
          console.error('Erro ao reconhecer o texto:', error);
        });
      return () => {
        isMounted = false;
      };
    }
  }, [generoBox, croppedImages, generoCroppedImage]);

  useEffect(() => {
    if (nameBox && croppedImages.length > 0) {

      recognizeHandwrittenText(nameCroppedImage)
        .then((text) => {
          // Se text for um array, pega o primeiro item e extrai a chave 'generated_text'
          const stringText = Array.isArray(text) && text[0]?.generated_text
            ? text[0].generated_text
            : String(text);

          console.log('Texto extraído:', stringText);
          setName(stringText); // Define o estado com a string correta
        })
        .catch((error) => {
          console.error('Erro ao reconhecer o texto:', error);
        });
    }
  }, [nameBox, croppedImages]);

  useEffect(() => {
    if (tutorBox && croppedImages.length > 0) {
      recognizeHandwrittenText(tutorCroppedImage)
        .then((text) => {
          // Se text for um array, pega o primeiro item e extrai a chave 'generated_text'
          const stringText = Array.isArray(text) && text[0]?.generated_text
            ? text[0].generated_text
            : String(text);

          console.log('Texto extraído:', stringText);
          setTutor(stringText); // Define o estado com a string correta
        })
        .catch((error) => {
          console.error('Erro ao reconhecer o texto:', error);
        });
    }
  }, [tutorBox, croppedImages]);

  useEffect(() => {
    if (doctorBox && croppedImages.length > 0) {
      recognizeHandwrittenText(doctorCroppedImage)
        .then((text) => {
          // Se text for um array, pega o primeiro item e extrai a chave 'generated_text'
          const stringText = Array.isArray(text) && text[0]?.generated_text
            ? text[0].generated_text
            : String(text);

          console.log('Texto extraído:', stringText);
          setDoctor(stringText); // Define o estado com a string correta
        })
        .catch((error) => {
          console.error('Erro ao reconhecer o texto:', error);
        });
    }
  }, [doctorBox, croppedImages]);

  useEffect(() => {
    if (dataBox && croppedImages.length > 0) {
      recognizeHandwrittenText(dataCroppedImage)
        .then((text) => {
          // Se text for um array, pega o primeiro item e extrai a chave 'generated_text'
          const stringText = Array.isArray(text) && text[0]?.generated_text
            ? text[0].generated_text
            : String(text);

          console.log('Texto extraído:', stringText);
          setData(stringText); // Define o estado com a string correta
        })
        .catch((error) => {
          console.error('Erro ao reconhecer o texto:', error);
        });
    }
  }, [dataBox, croppedImages]);

  useEffect(() => {
    if (raçaBox && croppedImages.length > 0) {
      recognizeHandwrittenText(raçaCroppedImage)
        .then((text) => {
          // Se text for um array, pega o primeiro item e extrai a chave 'generated_text'
          const stringText = Array.isArray(text) && text[0]?.generated_text
            ? text[0].generated_text
            : String(text);

          console.log('Texto extraído:', stringText);
          setRaça(stringText); // Define o estado com a string correta
        })
        .catch((error) => {
          console.error('Erro ao reconhecer o texto:', error);
        });
    }
  }, [raçaBox, croppedImages]);

  useEffect(() => {
    if (idadeBox && croppedImages.length > 0) {
      recognizeHandwrittenText(idadeCroppedImage)
        .then((text) => {
          // Se text for um array, pega o primeiro item e extrai a chave 'generated_text'
          const stringText = Array.isArray(text) && text[0]?.generated_text
            ? text[0].generated_text
            : String(text);

          console.log('Texto extraído:', stringText);
          setIdade(stringText); // Define o estado com a string correta
        })
        .catch((error) => {
          console.error('Erro ao reconhecer o texto:', error);
        });
    }
  }, [idadeBox, croppedImages]);

  // Função 'ia' que retorna JSX
  const IA = ({ specialBox, specialCroppedImage, name }: { specialBox: any, specialCroppedImage: any, name: any }) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full"
            disabled={!specialCroppedImage || !specialBox} // Desativa o botão se não houver imagem ou box
          >
            <ScanEye className="h-4 w-4" />
            <span className="sr-only">Imagem</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          {specialCroppedImage ? (
            <div className="space-y-2">
              <img src={specialCroppedImage} alt="Nome do Animal" className="max-w-full h-auto rounded" />
              {specialBox && (
                <div className="text-sm">
                  <p>Label: {specialBox.label}</p>
                  <h1>IA identificou como: {name}</h1>
                </div>
              )}
            </div>
          ) : (
            <p>Nenhuma imagem disponível</p>
          )}
        </PopoverContent>
      </Popover>
    );
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles])
  }, [])

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    onDrop(droppedFiles)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      onDrop(selectedFiles)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const clearFiles = () => {
    setFiles([])
  }

  const handleDeleteFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleImageClick = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new window.Image()
      img.src = e.target?.result as string
      img.onload = () => {
        setSelectedImage(img)
        setIsDialogOpen(true)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleBoundingBoxesChange = (newBoxes: BoundingBox[]) => {
    setBoundingBoxes(newBoxes)
  }

  const cropImage = () => {
    if (!selectedImage) return

    const canvas = document.createElement('canvas')
    const croppedData: string[] = []
    let nameImage: string | null = null
    let tutorImage: string | null = null
    let doctorImage: string | null = null
    let dataImage: string | null = null
    let especieImage: string | null = null
    let generoImage: string | null = null
    let raçaImage: string | null = null
    let idadeImage: string | null = null

    boundingBoxes.forEach((box) => {
      const pixelX = (box.x / 100) * selectedImage.width
      const pixelY = (box.y / 100) * selectedImage.height
      const pixelWidth = (box.width / 100) * selectedImage.width
      const pixelHeight = (box.height / 100) * selectedImage.height

      canvas.width = pixelWidth
      canvas.height = pixelHeight
      const ctx = canvas.getContext('2d')

      if (ctx) {
        ctx.drawImage(
          selectedImage,
          pixelX,
          pixelY,
          pixelWidth,
          pixelHeight,
          0,
          0,
          pixelWidth,
          pixelHeight
        )

        const croppedImage = canvas.toDataURL('image/png')

        if (box.id === "name") {
          nameImage = croppedImage
        } if (box.id === "Tutor") {
          tutorImage = croppedImage
        } if (box.id === "Medico") {
          doctorImage = croppedImage
        } if (box.id === "Data") {
          dataImage = croppedImage
        } if (box.id === "Especie") {
          especieImage = croppedImage
        } if (box.id === "Genero") {
          generoImage = croppedImage
        } if (box.id === "Raça") {
          raçaImage = croppedImage
        } if (box.id === "Idade") {
          idadeImage = croppedImage
        } else {
          croppedData.push(croppedImage)
        }
      }
    })

    setCroppedImages(croppedData)
    setNameCroppedImage(nameImage)
    setTutorCroppedImage(tutorImage)
    setDoctorCroppedImage(doctorImage)
    setDataCroppedImage(dataImage)
    setEspecieCroppedImage(especieImage)
    setGeneroCroppedImage(generoImage)
    setRaçaCroppedImage(raçaImage)
    setIdadeCroppedImage(idadeImage)

    setIsDialogOpen(false)
  }

  const [date, setDate] = useState<Date | undefined>(undefined)

  const [refreshTutors, setRefreshTutors] = useState(0)
  const [refreshPatients, setRefreshPatients] = useState(0)
  const [refreshDoctors, setRefreshDoctors] = useState(0)
  const [refreshClinic, setRefreshClinic] = useState(0)

  const [newTutorId, setNewTutorId] = useState<string | undefined>()
  const [newPatientId, setNewPatientId] = useState<string | undefined>()
  const [newDoctorId, setNewDoctorId] = useState<string | undefined>("medico")
  const [newClinicId, setNewClinicId] = useState<string | undefined>("medico")


  const fetchTutors = async () => {
    const response = await fetch('/api/tasks/cadastro/fetch-tutor-api')
    if (!response.ok) throw new Error('Failed to fetch tutors')
    return response.json()
  }

  const fetchPatients = async () => {
    const response = await fetch('/api/tasks/cadastro/fetch-patient-api')
    if (!response.ok) throw new Error('Failed to fetch patients')
    return response.json()
  }

  const fetchDoctors = async () => {
    const response = await fetch('/api/tasks/cadastro/fetch-doctor-api')
    if (!response.ok) throw new Error('Failed to fetch doctors')
    return response.json()
  }

  const fetchClinic = async () => {
    const response = await fetch('/api/tasks/cadastro/fetch-clinic-api')
    if (!response.ok) throw new Error('Failed to fetch doctors')
    return response.json()
  }



  type ExamesBioquimicos = {
    [categoria: string]: string[]
  }

  const examesBioquimicos: ExamesBioquimicos = {
    hemograma: ["Hemograma"],
    bioquimico: ["Ureia", "Creatinina", "ALT", "AST", "GGT", "FA", "Proteína"],
    anatomia_patologica: ["Biópsia"],
    citologia: ["Citologia de ouvido", "Citologia de pele"],
  }

  const [examesSelecionados, setExamesSelecionados] = React.useState<string[]>([])


  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // const toggleExame = (exame: string) => {
  //   setExamesSelecionados((prev) =>
  //     prev.includes(exame)
  //       ? prev.filter((e) => e !== exame)
  //       : [...prev, exame]
  //   )
  // }

  // const toggleTodosExames = () => {
  //   const todosExames = Object.values(examesBioquimicos).flat()
  //   setExamesSelecionados((prev) =>
  //     prev.length === todosExames.length ? [] : todosExames
  //   )
  // }

  const toggleExame = (exame: string) => {
    setExamesSelecionados(prev =>
      prev.includes(exame) ? prev.filter(e => e !== exame) : [...prev, exame]
    )
  }

  const toggleTodosExames = () => {
    const todosExames = Object.values(examesBioquimicos).flat()
    setExamesSelecionados(prev =>
      prev.length === todosExames.length ? [] : todosExames
    )
  }

  const filteredExames = useMemo(() => {
    return Object.entries(examesBioquimicos).reduce<ExamesBioquimicos>((acc, [categoria, exames]) => {
      const filteredExames = exames.filter(exame =>
        exame.toLowerCase().includes(searchTerm.toLowerCase())
      )
      if (filteredExames.length > 0) {
        acc[categoria] = filteredExames
      }
      return acc
    }, {})
  }, [searchTerm])

  const removerExame = (exame: string) => {
    setExamesSelecionados((prev) => prev.filter((e) => e !== exame))
  }

  const getBadgeColor = (exame: string) => {
    if (examesBioquimicos.hemograma?.includes(exame)) {
      return "bg-orange-500 hover:bg-orange-600"
    } else if (examesBioquimicos.bioquimico?.includes(exame)) {
      return "bg-green-500 hover:bg-green-600"
    } else if (examesBioquimicos.anatomia_patologica?.includes(exame)) {
      return "bg-blue-500 hover:bg-blue-600"
    } else if (examesBioquimicos.citologia?.includes(exame)) {
      return "bg-purple-500 hover:bg-purple-600"
    }
    return "bg-gray-500 hover:bg-gray-600" // Cor padrão caso o exame não seja encontrado ex disponivel:bg-yellow-500 hover:bg-yellow-600
  }


  const formSchema = z.object({
    urgency: z.boolean().default(false),
    examDate: z.date({
      required_error: "É necessária uma data de entrada",
    }),
    examType: z.array(z.string()).min(1, { message: "Pelo menos um tipo de exame deve ser selecionado" }).optional(),
    description: z.string().optional(),
    patientId: z.string().uuid({ message: "Selecione o paciente" }),
    tutorID: z.string().uuid({ message: "Selecione o tutor" }),
    doctorId: z.string().uuid({ message: "Selecione o médico" }),
    clinicId: z.string().uuid({ message: "Selecione a clinica" }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      urgency: false,
      examType: [],
      description: "",
      patientId: "",
      tutorID: "",
      doctorId: "",
      clinicId: "",
    },
  });

  React.useEffect(() => {
    console.log("examesSelecionados:", examesSelecionados);
    form.setValue("examType", examesSelecionados); // Atualize examType sempre que examesSelecionados mudar
  }, [examesSelecionados, form]);



  const [dialogsetopen, setdialogsetopen] = React.useState(false)

  const [idExame, setIdExame] = React.useState("")
  const [nomeTutor, setNomeTutor] = React.useState("")
  const [nomePatient, setNomePatient] = React.useState("")
  const [nomeDoctor, setNomeDoctor] = React.useState("")
  const [nomeClinic, setNomeClinic] = React.useState("")

  const [urgenteStatos, setUrgenteStatos] = React.useState(false)





  async function onSubmit(values: any) {
    try {
      // Array para armazenar as URLs dos arquivos uploadados
      const fileUrls: string[] = [];
      // Upload de cada arquivo
      for (const file of files) {
        const fileName = `${Date.now()}-${file.name}`; // Nome único para cada arquivo
        const storageRef = ref(storage, `registros/${fileName}`);

        // Upload do arquivo
        const snapshot = await uploadBytes(storageRef, file);

        // Obter URL do arquivo
        const downloadUrl = await getDownloadURL(snapshot.ref);
        fileUrls.push(downloadUrl);
      }

      const examReferences: {
        hemogramaId?: string
        bioquimicoId?: string
        anatomiaPatologicaId?: string
        citologiaId?: string
        fileUrls?: string
      } = {}

      const examPromises = []

      // Create specific exam records based on selected exam types
      for (const examType of values.examType) {
        if (examesBioquimicos.hemograma.includes(examType)) {
          const promise = fetch('/api/tasks/cadastro/submit/hemograma', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hemacias: null, plaquetas: null, rdw: null }),
          }).then(async (response) => {
            if (!response.ok) throw new Error('Erro ao criar hemograma')
            const data = await response.json()
            examReferences.hemogramaId = data.id
          })
          examPromises.push(promise)
        }

        if (examesBioquimicos.bioquimico.includes(examType)) {
          const bioquimicoValues = {
            ureia: values.examType.includes('Ureia') ? 0 : null,
            creatinina: values.examType.includes('Creatinina') ? 0 : null,
            alt: values.examType.includes('ALT') ? 0 : null,
            ast: values.examType.includes('AST') ? 0 : null,
            ggt: values.examType.includes('GGT') ? 0 : null,
            fa: values.examType.includes('FA') ? 0 : null,
            proteina: values.examType.includes('Proteína') ? 0 : null,
          }

          const promise = fetch('/api/tasks/cadastro/submit/bioquimico', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bioquimicoValues),
          }).then(async (response) => {
            if (!response.ok) throw new Error('Erro ao criar bioquímico')
            const data = await response.json()
            examReferences.bioquimicoId = data.id
          })
          examPromises.push(promise)
        }

        if (examesBioquimicos.anatomia_patologica.includes(examType)) {
          const promise = fetch('/api/tasks/cadastro/submit/anatomia-patologica', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ biopsia: null }),
          }).then(async (response) => {
            if (!response.ok) throw new Error('Erro ao criar anatomia patológica')
            const data = await response.json()
            examReferences.anatomiaPatologicaId = data.id
          })
          examPromises.push(promise)
        }

        if (examesBioquimicos.citologia.includes(examType)) {
          const promise = fetch('/api/tasks/cadastro/submit/citologia', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ citologiaOuvido: null, citologiaPele: null }),
          }).then(async (response) => {
            if (!response.ok) throw new Error('Erro ao criar citologia')
            const data = await response.json()
            examReferences.citologiaId = data.id
          })
          examPromises.push(promise)
        }
      }

      // Wait for all specific exam creations to finish
      await Promise.all(examPromises)

      // Now create the main exam with all references
      const examResponse = await fetch('/api/tasks/cadastro/submit/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urgency: values.urgency,
          examDate: values.examDate,
          examType: values.examType.join(','),
          description: values.description,
          patientId: values.patientId,
          tutorID: values.tutorID,
          doctorId: values.doctorId,
          clinicId: values.clinicId,
          fileUrls: fileUrls,
          ...examReferences,
        }),
      })

      if (!examResponse.ok) {
        throw new Error('Erro ao criar exame principal')
      }

      const examData = await examResponse.json()

      console.log('Exame criado com sucesso!')
      console.log(examData)
      setIdExame(examData.id)
      setUrgenteStatos(examData.urgency)
      setdialogsetopen(true)

      // Reset form and redirect
      // form.reset() // Uncomment this if you're using a form library
      // router.push('/exams')
    } catch (error) {
      console.error('Erro ao submeter o formulário:', error)
      console.log('Erro ao criar exame. Por favor, tente novamente.')
      // Here you can add logic to revert creations in case of error
    } finally {
      // setIsSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingPage />
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-col space-y-4 p-4 sm:space-y-6 sm:p-6 md:space-y-8 md:p-8">
        <Header user={user} auth={auth} text="Admissão" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" className="h-7 w-7">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Voltar</span>
                  </Button>
                  <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    Admissão
                  </h1>

                  <FormField
                    control={form.control}
                    name="urgency"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="modo-urgente"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className={`${field.value
                              ? "bg-red-500 hover:bg-red-600 data-[state=checked]:bg-red-500"
                              : ""
                              }`}
                          />
                          <FormLabel
                            htmlFor="modo-urgente"
                            className={`${field.value ? "text-red-500 font-semibold" : ""
                              } cursor-pointer select-none`}
                          >
                            Urgente
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />


                  <div className="hidden items-center gap-2 md:ml-auto md:flex">
                    <LabelPrintingMenu
                      idExame={idExame}
                      nomeTutor={nomeTutor}
                      nomePatient={nomePatient}
                      urgenteStatos={urgenteStatos}
                      date={date}
                      dialogsetopen={dialogsetopen} />
                    <Button type="button" variant="outline" size="sm">
                      Cancelar
                    </Button>
                    <Button type="submit" size="sm">Salvar Cadastro</Button>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                  <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Imagens e Anexos</CardTitle>
                        <CardDescription>
                          Adicione imagens ou anexos relacionados ao paciente
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ContextMenu>
                          <ContextMenuTrigger>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full h-auto p-0 hover:bg-accent hover:text-accent-foreground"
                              onClick={handleButtonClick}
                            >
                              <div
                                className="flex flex-col items-center justify-center w-full h-24 px-4 border-2 border-dashed rounded-lg cursor-pointer bg-background"
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                              >
                                <div className="flex flex-col items-center justify-center py-3">
                                  <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
                                  <p className="mb-1 text-xs text-muted-foreground">
                                    <span className="font-semibold">Clique para enviar</span> ou arraste e solte
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    PDF, PNG ou JPG (MÁX. 800x400px)
                                  </p>
                                </div>
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={handleFileInput}
                                  multiple
                                  ref={fileInputRef}
                                  accept="image/*,application/pdf"
                                />
                              </div>
                            </Button>
                          </ContextMenuTrigger>
                          <ContextMenuContent className="w-48">
                            <ContextMenuItem onClick={clearFiles}>Limpar Todos os Arquivos</ContextMenuItem>
                          </ContextMenuContent>
                        </ContextMenu>

                        {files.length > 0 && (
                          <Carousel
                            opts={{
                              align: "start",
                            }}
                            className="w-full mt-4 max-w-60 sm:max-md md:max-w-md lg:max-w-2xl mx-auto"
                          >
                            <CarouselContent className="-ml-1">
                              {files.map((file, index) => (
                                <CarouselItem key={index} className="pl-1 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6">
                                  <div className="p-1">
                                    <Card>
                                      <CardContent className="flex aspect-square items-center justify-center p-1 relative h-16 sm:h-20">
                                        <Button
                                          type="button"
                                          size="icon"
                                          className="absolute top-0 right-0 z-10 h-4 w-4 p-0"
                                          onClick={() => handleDeleteFile(index)}
                                        >
                                          <X className="h-4 w-4" />
                                          <span className="sr-only">Excluir arquivo</span>
                                        </Button>
                                        {file.type.startsWith('image/') ? (
                                          <Image
                                            src={URL.createObjectURL(file)}
                                            alt={`Arquivo enviado ${index + 1}`}
                                            fill
                                            className="rounded-md object-cover cursor-pointer"
                                            onClick={() => handleImageClick(file)}
                                          />
                                        ) : (
                                          <div className="flex items-center justify-center w-full h-full bg-muted rounded-md">
                                            <span className="text-[8px] sm:text-[10px] text-muted-foreground">{file.name}</span>
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </div>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <div className="flex justify-center mt-4 mb-0">
                              <CarouselPrevious className="relative left-0 right-auto -translate-y-1/2 -translate-x-1/2">
                                <ChevronLeft className="h-4 w-4" />
                              </CarouselPrevious>
                              <CarouselNext className="relative right-0 left-auto -translate-y-1/2 translate-x-1/2">
                                <ChevronRight className="h-4 w-4" />
                              </CarouselNext>
                            </div>
                          </Carousel>
                        )}

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogContent className="max-w-[90vw] w-full h-[90vh]">
                            <DialogHeader>
                              <DialogTitle>Editar Caixas Delimitadoras</DialogTitle>
                              <DialogDescription>
                                Arraste para mover as caixas, redimensione pelos cantos.
                              </DialogDescription>
                            </DialogHeader>
                            {selectedImage && (
                              <div className="flex-1 overflow-auto">
                                <ImageEditor
                                  image={selectedImage}
                                  boundingBoxes={boundingBoxes}
                                  onBoundingBoxesChange={handleBoundingBoxesChange}
                                />
                              </div>
                            )}
                            <DialogFooter>
                              <Button type="button" onClick={cropImage}>Recortar Imagem</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Dados do Tutor</CardTitle>
                        <CardDescription>
                          Informações de contato do responsável
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6">
                          <div className="grid gap-3">
                            <div className="flex items-center space-x-1">

                              <Label htmlFor="nome">Nome do Tutor</Label>
                              <IA specialBox={tutorBox} specialCroppedImage={tutorCroppedImage} name={tutor} />
                            </div>

                            <div className="flex items-start space-x-4">
                              <div className="flex-shrink-0 pt-1">
                                <AddTutor
                                  tag="Tutor"
                                  disabledfield={false}
                                  onStatusChange={(id) => {
                                    console.log(id)
                                    setNewTutorId(id)
                                    setRefreshTutors(prev => prev + 1)
                                  }}
                                />
                              </div>
                              <div className="flex-grow">
                                <FormField
                                  control={form.control}
                                  name="tutorID"
                                  render={({ field }) => (
                                    <FormItem className="w-full">
                                      <FormControl>
                                        <Combobox
                                          tag="tutores"
                                          disabledfield={false}
                                          onStatusChange={(status: any) => {
                                            setNewTutorId(status)
                                            field.onChange(status)
                                          }}
                                          nomePrint={setNomeTutor}
                                          fetchItems={fetchTutors}
                                          refreshTrigger={refreshTutors}
                                          newItemId={newTutorId}

                                        />
                                      </FormControl>
                                      <div className="h-1 mt-1">
                                        <FormMessage />
                                      </div>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>

                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Dados do Paciente</CardTitle>
                        <CardDescription>
                          Informações básicas do animal
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6">
                          <div className="grid gap-3">

                            <div className="flex items-center space-x-1">
                              <Label htmlFor="nome">Nome do Animal</Label>
                              <IA specialBox={nameBox} specialCroppedImage={nameCroppedImage} name={name} />
                            </div>

                            <div className="flex items-start space-x-4">
                              <div className="flex-shrink-0 pt-1">
                                <AddPaciente
                                  tag="Animal"
                                  disabledfield={false}
                                  tutorId={newTutorId}

                                  nameBox={nameBox}
                                  nameCroppedImage={nameCroppedImage}
                                  name={name}

                                  especieBox={especieBox}
                                  especieCroppedImage={especieCroppedImage}
                                  especie={especie}

                                  generoBox={generoBox}
                                  generoCroppedImage={generoCroppedImage}
                                  genero={genero}

                                  raçaBox={raçaBox}
                                  raçaCroppedImage={raçaCroppedImage}
                                  raça={raça}

                                  idadeBox={idadeBox}
                                  idadeCroppedImage={idadeCroppedImage}
                                  idade={idade}

                                  onStatusChange={(id) => {
                                    console.log(id)
                                    setNewPatientId(id)
                                    setRefreshPatients(prev => prev + 1)
                                  }}
                                />
                              </div>
                              <div className="flex-grow">
                                <FormField
                                  control={form.control}
                                  name="patientId"
                                  render={({ field }) => (
                                    <FormItem className="w-full">
                                      <FormControl>

                                        <Combobox
                                          tag="animal"
                                          disabledfield={false}
                                          onStatusChange={(status: any) => {
                                            setNewPatientId(undefined)
                                            field.onChange(status)
                                          }}
                                          nomePrint={setNomePatient}
                                          fetchItems={fetchPatients}
                                          refreshTrigger={refreshPatients}
                                          newItemId={newPatientId}
                                          {...field}
                                        />

                                      </FormControl>
                                      <div className="h-1 mt-1">
                                        <FormMessage />
                                      </div>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>

                            <div className='flex items-center'>


                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                    <Card className="w-full max-w-sm">
                      <CardHeader>
                        <div className="flex items-center space-x-1">

                          <CardTitle>Data de Entrada</CardTitle>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-full"
                                disabled={!dataCroppedImage || !dataBox} // Desativa o botão se não houver imagem ou box
                              >
                                <ScanEye className="h-4 w-4" />
                                <span className="sr-only">Imagem do nome do animal</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              {dataCroppedImage ? (
                                <div className="space-y-2">
                                  <img src={dataCroppedImage} alt="Nome do Animal" className="max-w-full h-auto rounded" />
                                  {dataBox && (
                                    <div className="text-sm">
                                      <p>Label: {dataBox.label}</p>
                                      <p>Text: {dataBox.text}</p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <p>Nenhuma imagem disponível</p>
                              )}
                            </PopoverContent>
                          </Popover>
                        </div>
                        <CardDescription>Insira a data de entrada do cadastro</CardDescription>
                      </CardHeader>
                      <CardContent>

                        <FormField
                          control={form.control}
                          name="examDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Exam Date</FormLabel>
                              <Popover open={openData} onOpenChange={setOpenData}>
                                <PopoverTrigger asChild>
                                  <Button
                                    type="button"
                                    variant={"outline"}
                                    className={cn(
                                      "w-[280px] justify-start text-left font-normal",
                                      !date && "text-muted-foreground"
                                    )}
                                    onClick={() => setOpenData(true)}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Data de Entrada</span>}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(select) => {
                                      field.onChange(select)
                                      console.log(select)
                                      setDate(select)
                                      setOpenData(false)
                                    }}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormDescription>
                                Select the date for the exam.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Dados do Exame</CardTitle>
                        <CardDescription>
                          Informações sobre o exame a ser realizado
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6">
                          <div className="grid gap-3">
                            <div className="flex items-center justify-between space-x-1">
                              <div className="flex items-center space-x-1">
                                <Label htmlFor="nome">Clinica solicitante</Label>
                                <IA specialBox={doctorBox} specialCroppedImage={doctorCroppedImage} name={doctor} />
                              </div>

                              <AddClinic
                                tag="Clinica"
                                disabledfield={false}
                                onStatusChange={(id) => {
                                  console.log(id)
                                  setNewClinicId(id)
                                  setRefreshClinic(prev => prev + 1)
                                }}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="clinicId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Combobox
                                      tag="clinica"
                                      disabledfield={false}
                                      onStatusChange={(status: any) => {
                                        setNewClinicId(undefined)
                                        field.onChange(status)
                                      }}
                                      nomePrint={setNomeClinic}
                                      fetchItems={fetchClinic}
                                      refreshTrigger={refreshClinic}
                                      newItemId={newClinicId}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                          </div>

                          <div className="grid gap-3">
                            <div className="flex items-center justify-between space-x-1">
                              <div className="flex items-center space-x-1">
                                <Label htmlFor="nome">Médico Veterinário</Label>
                                <IA specialBox={doctorBox} specialCroppedImage={doctorCroppedImage} name={doctor} />
                              </div>

                              <AddDoctor
                                tag="Médico"
                                disabledfield={false}
                                onStatusChange={(id) => {
                                  console.log(id)
                                  setNewDoctorId(id)
                                  setRefreshDoctors(prev => prev + 1)
                                }}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="doctorId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Combobox
                                      tag="medico"
                                      disabledfield={false}
                                      onStatusChange={(status: any) => {
                                        setNewDoctorId(undefined)
                                        field.onChange(status)
                                      }}
                                      nomePrint={setNomeDoctor}
                                      fetchItems={fetchDoctors}
                                      refreshTrigger={refreshDoctors}
                                      newItemId={newDoctorId}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                          </div>

                          <div className="grid gap-3">
                            <Label htmlFor="tipo-exame">Tipo de Exame</Label>
                            <FormField
                              control={form.control}
                              name="examType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Select open={open} onOpenChange={setOpen}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="+ Adicionar Exame" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <div className="p-2">
                                          <div className="flex items-center space-x-2 mb-2">
                                            <Search className="w-4 h-4 text-gray-500" />
                                            <Input
                                              type="text"
                                              placeholder="Buscar exames..."
                                              value={searchTerm}
                                              onChange={(e) => setSearchTerm(e.target.value)}
                                              className="h-8"
                                            />
                                          </div>
                                          <div className="flex items-center space-x-2 mb-2">
                                            <Checkbox
                                              id="select-all"
                                              checked={examesSelecionados.length === Object.values(examesBioquimicos).flat().length}
                                              onCheckedChange={toggleTodosExames}
                                            />
                                            <label htmlFor="select-all" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                              Selecionar Todos
                                            </label>
                                          </div>
                                          {Object.entries(filteredExames).map(([categoria, exames]) => (
                                            <SelectGroup key={categoria}>
                                              <SelectLabel>{categoria.charAt(0).toUpperCase() + categoria.slice(1).replace('_', ' ')}</SelectLabel>
                                              {exames.map((exame) => (
                                                <div key={exame} className="flex items-center space-x-2 mb-2 ml-2">
                                                  <Checkbox
                                                    id={exame}
                                                    checked={examesSelecionados.includes(exame)}
                                                    onCheckedChange={() => toggleExame(exame)}
                                                  />
                                                  <label htmlFor={exame} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    {exame}
                                                  </label>
                                                </div>
                                              ))}
                                            </SelectGroup>
                                          ))}
                                        </div>
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="flex flex-col items-start space-y-4">
                              <div className="flex flex-wrap gap-2">
                                {examesSelecionados.map((exame) => (
                                  <Badge
                                    key={exame}
                                    className={`text-sm text-white ${getBadgeColor(exame)}`}
                                  >
                                    {exame}
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="ml-1 h-auto p-0 text-white hover:text-gray-200"
                                      onClick={() => {
                                        const updatedExames = examesSelecionados.filter((item) => item !== exame);
                                        setExamesSelecionados(updatedExames);
                                      }}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="flex flex-col gap-4">
                        <div className="grid gap-3">
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Observações</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Informações adicionais sobre o exame ou o paciente"
                                    className="min-h-18"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 md:hidden">
                  <Button type="button" variant="outline" size="sm">
                    Cancelar
                  </Button>
                  <Button type="submit" size="sm">Salvar Cadastro</Button>
                </div>
              </div>
            </main>
          </form>
        </Form>
      </div>
    </div >
  )
}
