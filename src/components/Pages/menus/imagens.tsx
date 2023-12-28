import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import fotografia from "../../../../public/photo-1530497610245-94d3c16cda28.webp"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"


export default function Imagens() {
    return (
        <Card className="gap-3 space-y-3 p-3">

            <div className="flex gap-3">
                <div className=" flex-none w-[380px]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Imagens da requisição</CardTitle>
                        </CardHeader>


                        <CardContent>
                            <p>Documentos</p>
                            <p>Solitação médica</p>
                        </CardContent>

                        <CardFooter>
                            <div className="max-w-x2">
                                <label
                                    className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                                    <span className="flex items-center space-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <span className="font-medium text-gray-600">
                                            Envie uma nova imagem

                                        </span>
                                    </span>
                                    <Input type="file" name="file_upload" className="hidden" />
                                </label>
                            </div>


                        </CardFooter>
                    </Card>
                </div>

                <div className="flex-1 items-center justify-center h-[100px]">
                    <AspectRatio ratio={16 / 9}>
                        <Image src={fotografia} alt="Image" className=" rounded-md object-contain max-h-80" />
                    </AspectRatio>
                </div>

            </div>

            <Card>
                <CardHeader>
                    <CardTitle>dados clinicos</CardTitle>
                </CardHeader>

                <CardContent>
                    <Textarea />
                    <CardDescription>Descreva aqui os dados clinicos solicitado pelo médico.</CardDescription>
                </CardContent>

            </Card>





        </Card >

    )
}