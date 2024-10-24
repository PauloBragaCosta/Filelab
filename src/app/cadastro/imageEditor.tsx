'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React, { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface BoundingBox {
  id: string
  x: number
  y: number
  width: number
  height: number
  label?: string
  text?: string
  hidden?: boolean // Novo campo para controlar a visibilidade
}

interface ImageEditorProps {
  image: HTMLImageElement | null
  boundingBoxes: BoundingBox[]
  onBoundingBoxesChange: (newBoxes: BoundingBox[]) => void
}


const ImageEditor: React.FC<ImageEditorProps> = ({ image, boundingBoxes, onBoundingBoxesChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedBox, setSelectedBox] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [cursorStyle, setCursorStyle] = useState('default')

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current
      canvas.width = image.width
      canvas.height = image.height
      drawImageAndBoxes()
    }
  }, [image, boundingBoxes])

  const drawImageAndBoxes = () => {
    if (!canvasRef.current || !image) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.drawImage(image, 0, 0)

    boundingBoxes.forEach((box) => {
      if (box.hidden) return // Pula o desenho do quadrado se ele estiver oculto

      const x = box.x * image.width / 100
      const y = box.y * image.height / 100
      const width = box.width * image.width / 100
      const height = box.height * image.height / 100

      let boxColor = 'blue'
      if (box.id === selectedBox) {
        boxColor = 'green'
      } else if (box.label === 'Handwriting') {
        boxColor = 'red'
      }

      // Desenha o quadrado
      ctx.strokeStyle = boxColor
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, width, height)

      // Draw black corner details first (background)
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 5
      const cornerSizeback = 16 // Size of the corner details (background)

      // Top-left corner
      ctx.beginPath()
      ctx.moveTo(x, y + cornerSizeback)
      ctx.lineTo(x, y)
      ctx.lineTo(x + cornerSizeback, y)
      ctx.stroke()

      // Top-right corner
      ctx.beginPath()
      ctx.moveTo(x + width - cornerSizeback, y)
      ctx.lineTo(x + width, y)
      ctx.lineTo(x + width, y + cornerSizeback)
      ctx.stroke()

      // Bottom-right corner
      ctx.beginPath()
      ctx.moveTo(x + width, y + height - cornerSizeback)
      ctx.lineTo(x + width, y + height)
      ctx.lineTo(x + width - cornerSizeback, y + height)
      ctx.stroke()

      // Bottom-left corner
      ctx.beginPath()
      ctx.moveTo(x + cornerSizeback, y + height)
      ctx.lineTo(x, y + height)
      ctx.lineTo(x, y + height - cornerSizeback)
      ctx.stroke()

      // Draw white corner details on top
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 3
      const cornerSize = 15 // Size of the corner details (foreground)

      // Top-left corner
      ctx.beginPath()
      ctx.moveTo(x, y + cornerSize)
      ctx.lineTo(x, y)
      ctx.lineTo(x + cornerSize, y)
      ctx.stroke()

      // Top-right corner
      ctx.beginPath()
      ctx.moveTo(x + width - cornerSize, y)
      ctx.lineTo(x + width, y)
      ctx.lineTo(x + width, y + cornerSize)
      ctx.stroke()

      // Bottom-right corner
      ctx.beginPath()
      ctx.moveTo(x + width, y + height - cornerSize)
      ctx.lineTo(x + width, y + height)
      ctx.lineTo(x + width - cornerSize, y + height)
      ctx.stroke()

      // Bottom-left corner
      ctx.beginPath()
      ctx.moveTo(x + cornerSize, y + height)
      ctx.lineTo(x, y + height)
      ctx.lineTo(x, y + height - cornerSize)
      ctx.stroke()

      // Display the box ID with the same color as the box
      ctx.font = '12px Arial'
      ctx.fillStyle = boxColor
      ctx.fillText(box.id, x + 5, y + 15)
    })
  }


  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !image) return { x: 0, y: 0 }
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) / (rect.width / image.width),
      y: (e.clientY - rect.top) / (rect.height / image.height)
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !image) return
    const { x, y } = getMousePos(e)

    const clickedBox = boundingBoxes.find(box => {
      const bx = box.x * image.width / 100
      const by = box.y * image.height / 100
      const bw = box.width * image.width / 100
      const bh = box.height * image.height / 100
      return x >= bx && x <= bx + bw && y >= by && y <= by + bh
    })

    if (clickedBox) {
      setSelectedBox(clickedBox.id)
      const handle = getResizeHandle(clickedBox, { x, y })
      if (handle) {
        setIsResizing(true)
        setResizeHandle(handle)
      } else {
        setIsDragging(true)
      }
      setStartPos({ x, y })
    } else {
      setSelectedBox(null)
    }
  }

  const getResizeHandle = (box: BoundingBox, pos: { x: number, y: number }) => {
    if (!image) return null
    const handleSize = 10
    const { x, y } = pos
    const bx = box.x * image.width / 100
    const by = box.y * image.height / 100
    const bw = box.width * image.width / 100
    const bh = box.height * image.height / 100

    if (Math.abs(x - bx) <= handleSize && Math.abs(y - by) <= handleSize) return 'nw'
    if (Math.abs(x - (bx + bw)) <= handleSize && Math.abs(y - by) <= handleSize) return 'ne'
    if (Math.abs(x - (bx + bw)) <= handleSize && Math.abs(y - (by + bh)) <= handleSize) return 'se'
    if (Math.abs(x - bx) <= handleSize && Math.abs(y - (by + bh)) <= handleSize) return 'sw'
    return null
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !image) return
    const { x, y } = getMousePos(e)

    // Update cursor style based on mouse position
    const hoveredBox = boundingBoxes.find(box => {
      const bx = box.x * image.width / 100
      const by = box.y * image.height / 100
      const bw = box.width * image.width / 100
      const bh = box.height * image.height / 100
      return x >= bx && x <= bx + bw && y >= by && y <= by + bh
    })

    if (hoveredBox) {
      const handle = getResizeHandle(hoveredBox, { x, y })
      if (handle) {
        setCursorStyle(handle === 'nw' || handle === 'se' ? 'nwse-resize' : 'nesw-resize')
      } else {
        setCursorStyle('move')
      }
    } else {
      setCursorStyle('default')
    }

    if (!isDragging && !isResizing || !selectedBox) return

    if (isDragging) {
      const dx = (x - startPos.x) / image.width * 100
      const dy = (y - startPos.y) / image.height * 100

      const newBoxes = boundingBoxes.map(box => {
        if (box.id === selectedBox) {
          return {
            ...box,
            x: Math.max(0, Math.min(100 - box.width, box.x + dx)),
            y: Math.max(0, Math.min(100 - box.height, box.y + dy))
          }
        }
        return box
      })

      onBoundingBoxesChange(newBoxes)
    } else if (isResizing && resizeHandle) {
      const selectedBoxIndex = boundingBoxes.findIndex(box => box.id === selectedBox)
      const box = boundingBoxes[selectedBoxIndex]
      const newBox = { ...box }

      const dx = (x - startPos.x) / image.width * 100
      const dy = (y - startPos.y) / image.height * 100

      switch (resizeHandle) {
        case 'nw':
          newBox.x = Math.min(newBox.x + dx, newBox.x + newBox.width - 1)
          newBox.y = Math.min(newBox.y + dy, newBox.y + newBox.height - 1)
          newBox.width = Math.max(1, newBox.width - dx)
          newBox.height = Math.max(1, newBox.height - dy)
          break
        case 'ne':
          newBox.y = Math.min(newBox.y + dy, newBox.y + newBox.height - 1)
          newBox.width = Math.max(1, newBox.width + dx)
          newBox.height = Math.max(1, newBox.height - dy)
          break
        case 'se':
          newBox.width = Math.max(1, newBox.width + dx)
          newBox.height = Math.max(1, newBox.height + dy)
          break
        case 'sw':
          newBox.x = Math.min(newBox.x + dx, newBox.x + newBox.width - 1)
          newBox.width = Math.max(1, newBox.width - dx)
          newBox.height = Math.max(1, newBox.height + dy)
          break
      }

      const newBoxes = [...boundingBoxes]
      newBoxes[selectedBoxIndex] = newBox

      onBoundingBoxesChange(newBoxes)
    }

    setStartPos({ x, y })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeHandle(null)
  }

  const handleToggleVisibility = (boxId: string) => {
    const updatedBoxes = boundingBoxes.map(box => {
      if (box.id === boxId) {
        return { ...box, hidden: !box.hidden } // Inverte o estado de ocultar/mostrar
      }
      return box
    })
    onBoundingBoxesChange(updatedBoxes)
  }

  const toggleAllBoxes = (checked: boolean) => {
    const updatedBoxes = boundingBoxes.map(box => ({ ...box, hidden: !checked }))
    onBoundingBoxesChange(updatedBoxes)
  }

  const allBoxesVisible = boundingBoxes.every(box => !box.hidden)

  return (
    <div className="space-y-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Toggle Bounding Boxes</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Bounding Boxes</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <div className="flex items-center space-x-2 w-full">
              <Checkbox
                id="select-all"
                checked={allBoxesVisible}
                onCheckedChange={toggleAllBoxes}
              />
              <label htmlFor="select-all" className="flex-grow cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Select All
              </label>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {boundingBoxes.map(box => (
              <DropdownMenuItem key={box.id} onSelect={(e) => e.preventDefault()}>
                <Checkbox
                  id={`box-${box.id}`}
                  checked={!box.hidden}
                  onCheckedChange={() => handleToggleVisibility(box.id)}
                  className="mr-2"
                />
                <label htmlFor={`box-${box.id}`} className="flex-grow cursor-pointer">
                  {`Show Box ${box.id}`}
                </label>
                {box.hidden ? (
                  <EyeOff className="ml-2 h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="ml-2 h-4 w-4 text-muted-foreground" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: '1px solid black', cursor: cursorStyle }}
      />
    </div>
  )
}


export default ImageEditor