'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Package2, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import SessionMenu from '@/components/compopages/SessionMenu'
import { Input } from '@/components/ui/input'
import useFirebaseAuth from '@/hooks/useFirebaseAuth'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [autoTheme, setAutoTheme] = useState(false)
  const [file, setFile] = useState<File | null>(null);

  const { user, loading, auth } = useFirebaseAuth();

  useEffect(() => {
    setMounted(true)
    setAutoTheme(theme === 'system')
  }, [theme])

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!user) {
    return null; // This will prevent any content from rendering while redirecting
  }

  if (!mounted) {
    return null
  }

  const handleThemeChange = (value: string) => {
    setTheme(value)
    setAutoTheme(value === 'system')
  }

  const handleAutoThemeToggle = (checked: boolean) => {
    setAutoTheme(checked)
    setTheme(checked ? 'system' : 'light')
  }

  const handleDownload = async () => {
    const response = await fetch('/api/backup/download');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
  
    // Obtém a data e hora atuais
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19).replace(/:/g, '-'); // Formata a data e hora como "2024-09-06T15-18-37"
  
    // Nomeia o arquivo com a data e hora
    const filename = `backup-${formattedDate}.json`;
  
    // Cria um link temporário para fazer o download do arquivo
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename); // Nome do arquivo com a data e hora
    document.body.appendChild(link);
    link.click();
  
    // Remove o link temporário após o download
    link.parentNode?.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const data = reader.result;
      const res = await fetch('/api/backup/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data as string,
      });

      const result = await res.json();
      console.log(result.message || result.error);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col p-4 sm:p-6 md:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Package2 className="h-6 w-6" />
          <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        </Link>

        <SessionMenu userName={user.name} userPhoto={user.photo} auth={auth} />
      </header>

      <main className="flex-1 space-y-4 p-4 md:p-6">
      
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav className="grid gap-4 text-sm text-muted-foreground">
            <Link href="#" className="font-semibold text-primary">
              General
            </Link>
            <Link href="#">Security</Link>
            <Link href="#">Integrations</Link>
            <Link href="#">Support</Link>
            <Link href="#">Organizations</Link>
            <Link href="#">Advanced</Link>
          </nav>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>Customize the appearance of your application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-theme">Automatic theme</Label>
                  <Switch
                    id="auto-theme"
                    checked={autoTheme}
                    onCheckedChange={handleAutoThemeToggle}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="theme-select">Select theme</Label>
                  <Select
                    value={theme}
                    onValueChange={handleThemeChange}
                    disabled={autoTheme}
                  >
                    <SelectTrigger id="theme-select">
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Dark
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Backup Download</CardTitle>
                <CardDescription>Download a complete backup of the database</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleDownload}>Download Backup</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Backup Upload</CardTitle>
                <CardDescription>Upload a complete backup of the database</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="picture">File</Label>
                  <Input id="picture" type="file" onChange={handleFileChange} />
                </div>
                <Button onClick={handleUpload}>Upload Backup</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}