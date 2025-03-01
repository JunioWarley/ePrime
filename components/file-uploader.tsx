import type React from "react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"

interface FileUploaderProps {
  onFileSelect: (file: File) => void
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <div>
      <input type="file" ref={fileInputRef} onChange={handleFileInput} style={{ display: "none" }} accept="image/*" />
      <Button onClick={() => fileInputRef.current?.click()}>Selecionar Imagem</Button>
    </div>
  )
}

