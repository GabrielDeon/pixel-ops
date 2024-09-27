"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ImageUploaderProps {
  onImageProcessed: (pixelMatrix: number[][][], mainImage: boolean) => void;
  mainImage: boolean;
}

export default function ImageUploader({
  onImageProcessed,
  mainImage,
}: ImageUploaderProps) {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resolution, setResolution] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [objectFit, setObjectFit] = useState<
    "contain" | "cover" | "fill" | "none"
  >("contain");
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
            imageData.data[i],
            imageData.data[i + 1],
            imageData.data[i + 2],
            imageData.data[i + 3],
          ]);
        }
        pixelMatrix.push(row);
      }

      onImageProcessed(pixelMatrix, mainImage);
    },
    [onImageProcessed, mainImage]
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
    <Card className="w-72 h-max flex flex-col">
      <div className="p-2 border-b">
        <ToggleGroup
          type="single"
          value={objectFit}
          onValueChange={(value) =>
            setObjectFit(value as "contain" | "cover" | "fill" | "none")
          }
          className="justify-center space-x-1"
        >
          <ToggleGroupItem
            value="contain"
            aria-label="Set object-fit to contain"
            className="text-xs px-2 py-1"
          >
            Contain
          </ToggleGroupItem>
          <ToggleGroupItem
            value="cover"
            aria-label="Set object-fit to cover"
            className="text-xs px-2 py-1"
          >
            Cover
          </ToggleGroupItem>
          <ToggleGroupItem
            value="fill"
            aria-label="Set object-fit to fill"
            className="text-xs px-2 py-1"
          >
            Fill
          </ToggleGroupItem>
          <ToggleGroupItem
            value="none"
            aria-label="Set object-fit to none"
            className="text-xs px-2 py-1"
          >
            None
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="p-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div
          className="flex justify-center items-center bg-muted rounded-md overflow-hidden relative"
          style={{ width: "100%", height: "250px" }}
        >
          {image ? (
            <Badge              
            variant="outline"
            className="absolute top-2 right-2 z-10 text-black border-black bg-gray-100 bg-blend-color-dodge bg-opacity-25"
          >
            {resolution?.width} x {resolution?.height}
          </Badge>            
          ) : null}

          {image ? (
            <>
              <img
                src={image}
                alt="Uploaded preview"
                className={`w-full h-full`}
                style={{ objectFit: objectFit }}
              />
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full text-center text-muted-foreground">
              <div>
                <Upload className="mx-auto h-12 w-12 mb-2" />
                <p>No image uploaded</p>
              </div>
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
