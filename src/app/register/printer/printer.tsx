"use client"

import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import React from 'react';
import Cookies from 'js-cookie'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateImageWithText } from "./CreateImageWithText"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"


export function PrinterForm() {
  const PacienteName = Cookies.get('PacienteName')
  const TutoreName = Cookies.get('TutoreName')
  const idExame = Cookies.get('idExame')

  const [image, setImage] = React.useState("");


  const result = String(CreateImageWithText(idExame, PacienteName, TutoreName))

  setImage(result);

  const base64Image = result.replace(/^data:image\/\w+;base64,/, "");
  console.log(base64Image);

  async function print() {
    await fetch(`http://localhost:5000/`, {
      method: 'POST',
      body: JSON.stringify(base64Image),
      headers: {
        'Content-Type': 'application/json'
      }
    })

  }

  return (
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

  )
}


