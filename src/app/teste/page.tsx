'use client'

import { useState, useRef, useCallback } from 'react'
import { Camera } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Scanner() {
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')
  const [scanning, setScanning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startScan = useCallback(async () => {
    setScanning(true)
    setError('')
    setImageUrl('')

    let stream: MediaStream | null = null

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Seu navegador não suporta acesso à câmera/scanner')
      }

      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      
      if (videoRef.current && canvasRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()

        // Wait for video to be ready
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve
          }
        })

        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight

        // Wait for camera to initialize
        await new Promise(resolve => setTimeout(resolve, 2000))

        const context = canvasRef.current.getContext('2d')
        if (context) {
          context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
          const imageData = canvasRef.current.toDataURL('image/jpeg')
          setImageUrl(imageData)
        }
      }
    } catch (err) {
      setError(`Erro ao acessar o scanner: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      setScanning(false)
    }
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="flex flex-col items-center gap-4 p-6">
        <Button 
          onClick={startScan} 
          disabled={scanning}
          aria-busy={scanning}
        >
          <Camera className="mr-2 h-4 w-4" />
          {scanning ? 'Escaneando...' : 'Iniciar Scanner'}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {imageUrl && (
          <div className="w-full">
            <img 
              src={imageUrl} 
              alt="Documento escaneado"
              className="w-full h-auto border rounded"
            />
          </div>
        )}

        <video ref={videoRef} className="hidden" />
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  )
}