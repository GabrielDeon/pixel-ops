"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface ImageUploaderProps {
  onImageProcessed: (pixelMatrix: number[][][]) => void;
}

export default function ImageUploader({
  onImageProcessed,
}: ImageUploaderProps) {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resolution, setResolution] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getPixelMatrix = useCallback(
    (img: HTMLImageElement) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = img.width;
      canvas.height = img.height;
      setResolution({ width: img.width, height: img.height });
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, img.width, img.height);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const pixelMatrix: number[][][] = [];

      for (let y = 0; y < img.height; y++) {
        const row: number[][] = [];
        for (let x = 0; x < img.width; x++) {
          const i = (y * img.width + x) * 4;
          row.push([
            imageData.data[i], // Red
            imageData.data[i + 1], // Green
            imageData.data[i + 2], // Blue
            imageData.data[i + 3], // Alpha
          ]);
        }
        pixelMatrix.push(row);
      }

      onImageProcessed(pixelMatrix);
    },
    [onImageProcessed]
  );

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            setImage(e.target?.result as string);
            getPixelMatrix(img);
          };
          img.src = e.target?.result as string;
          setError(null);
        };
        reader.readAsDataURL(file);
      } else {
        setError("Please upload a valid image file.");
        setImage(null);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-72 h-96 flex flex-col">
      <div className="flex-grow p-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="relative w-full h-full flex items-center justify-center bg-muted rounded-md overflow-hidden">
          {image ? (
            <>
              <Badge className="absolute top-0 right-0 m-2 text-white" variant="outline">
                {resolution?.width} x {resolution?.height}
              </Badge>
              <img
                src={image}
                alt="Uploaded preview"
                className="w-full h-full object-fill"
              />
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              <Upload className="mx-auto h-12 w-12 mb-2" />
              <p>No image uploaded</p>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 border-t">
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          ref={fileInputRef}
        />
        <Button onClick={handleButtonClick} className="w-full">
          Upload Image
        </Button>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </Card>
  );
}
