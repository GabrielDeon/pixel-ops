"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MatrixOperationsCard from "./matrix-operations-card";
import { getImageMatrice, imageMatriceToURL } from "@/imageUtils/transformations";
import CanvasComponent from "@/components/CanvasComponent";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { Operation } from "@/imageUtils/transformations";
import { checkApplyOperation } from "@/imageUtils/transformations";

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
  const [matrice, setMatrice] = useState<number[][][] | null>(null);
  const [operation, setOperation] = useState<Operation | null>({
    type: "Add",
    value: 0,
  });

  const [objectFit, setObjectFit] = useState<
    "contain" | "cover" | "fill" | "none"
  >("contain");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);  

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = img.width;
        canvas.height = img.height;

        const newMatrice = getImageMatrice(img);
        setMatrice(newMatrice || null);

        if (newMatrice) {
          onImageProcessed(newMatrice, mainImage);
        }
      };
      img.src = image;
    }
  }, [image, mainImage, onImageProcessed]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImage(e.target?.result as string);        
          setError(null);
        };
        reader.readAsDataURL(file);
      } else {
        setError("Please upload a valid image file.");
        setImage(null);        
      }
    }
  };

  const handleApply = () => {
    if (matrice && operation) {
      const updatedMatrice = matrice.map(row =>
        row.map(pixel => {
          return pixel.map((value) => {
            return checkApplyOperation(operation, value);
          });
        })
      );
      setMatrice(updatedMatrice);
    }
  };

  const handleReset = () => {
    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        setMatrice(getImageMatrice(img) || null);
      };
    }
  };

  const handleDrawerClose = () => {
    handleReset();
    setOperation({ type: "Add", value: 0 });
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = () => {
    if (matrice) {
      const downloadURL = imageMatriceToURL(matrice);
      const link = document.createElement("a");
      link.href = downloadURL;
      link.download = "processed-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  return (
    <Card className="w-72 h-max flex flex-col">
      <div className="p-2 border-b relative">
        {image ? (
          <Drawer>
            <DrawerTrigger className="absolute top-0 right-1 text-blue-950 hover:text-blue-900">
              <FontAwesomeIcon icon={faGear} />
            </DrawerTrigger>
            <DrawerContent className="flex flex-col items-center justify-center p-6">
              <div className="w-full max-w-4xl">
                <DrawerHeader className="text-center">
                  <DrawerTitle></DrawerTitle>
                </DrawerHeader>
                <div className="flex flex-row space-x-4 justify-center items-stretch">
                  <CanvasComponent
                    matrice={matrice}
                  />
                  <MatrixOperationsCard
                    operation={operation}
                    setOperation={setOperation}
                  />
                </div>
                <DrawerFooter className="flex flex-col items-center mt-6">
                  <div className="flex space-x-4 w-full justify-between">
                    <Button className="flex-1" onClick={handleReset}>
                      Reset
                    </Button>
                    <Button className="flex-1" onClick={handleDownload}>Download</Button>
                    <Button className="flex-1" onClick={handleApply}>
                      Apply
                    </Button>
                    <DrawerClose asChild>
                      <Button
                        onClick={handleDrawerClose}
                        variant="outline"
                        className="flex-1"
                      >
                        Close
                      </Button>
                    </DrawerClose>
                  </div>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        ) : null}
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
              {matrice ? matrice[0].length : null} x{" "}
              {matrice ? matrice.length : null}
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