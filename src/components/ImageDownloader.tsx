"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Image as ImageIcon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";

interface ImageDownloaderProps {
  imageUrl: string | null;
  altText: string;
}

export default function ImageDownloader({
  imageUrl,
  altText,
}: ImageDownloaderProps) {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [objectFit, setObjectFit] = useState<
    "contain" | "cover" | "fill" | "none"
  >("contain");

  useEffect(() => {
    if (imageUrl) {
      fetch(imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          setDownloadUrl(url);
        })
        .catch((error) => console.error("Error creating download URL:", error));
    }
  }, [imageUrl]);

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "processed-image.png"; // You can customize the filename here
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
        <div
          className="flex justify-center items-center bg-muted rounded-md overflow-hidden relative"
          style={{ width: "100%", height: "250px" }}
        >
          {downloadUrl && (
            <Badge              
              variant="outline"
              className="absolute top-2 right-2 z-10 text-black border-black bg-gray-100 bg-blend-color-dodge bg-opacity-25"
            >
              To-Do
            </Badge>
          )}          
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={altText}
              className={`w-full h-full`}
              style={{ objectFit: objectFit }}
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
  );
}
