'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Image as ImageIcon } from "lucide-react"

interface ImageDownloaderProps {
  imageUrl: string | null
  altText: string
}

export default function ImageDownloader({ imageUrl, altText }: ImageDownloaderProps) {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  useEffect(() => {
    if (imageUrl) {
      fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob)
          setDownloadUrl(url)
        })
        .catch(error => console.error('Error creating download URL:', error))
    }
  }, [imageUrl])

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = 'processed-image.png' // You can customize the filename here
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <Card className="w-72 h-96 flex flex-col">
      <div className="flex-grow p-4">
        <div className="w-full h-full flex items-center justify-center bg-muted rounded-md overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={altText}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center text-muted-foreground">
              <ImageIcon className="mx-auto h-12 w-12 mb-2" />
              <p>No processed image yet</p>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 border-t">
        <Button 
          onClick={handleDownload} 
          className="w-full"
          disabled={!downloadUrl}
        >
          <Download className="mr-2 h-4 w-4" /> Download Image
        </Button>
      </div>
    </Card>
  )
}