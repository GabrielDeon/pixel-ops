import ImageUploader from "./ImageUploader";
import ImageDownloader from "./ImageDownloader";
import { useState } from "react";
import { imageMatriceToURL } from "../imageUtils/transformations";
import ControlPanel from "./control-panel";
import { addImages } from "@/imageUtils/composite";

export default function HomePage() {
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [pixelMatrix, setPixelMatrix] = useState<{
    matrixA: number[][][];
    matrixB: number[][][];
  }>({ matrixA: [], matrixB: [] });
  const [imageConfig, setImageConfig] = useState<{
    arithmeticOperation: string;
    orientation: string;
  }>({ arithmeticOperation: "add", orientation: "normal" });

  const handleImageProcessed = (matrix: number[][][], mainImage: boolean) => {
    setPixelMatrix(prevMatrix => ({
      ...prevMatrix,
      [mainImage ? 'matrixA' : 'matrixB']: matrix
    }));
  };

  const handleImageConfiguration = (
    arithmeticOperation: string,
    orientation: string
  ) => {
    setImageConfig({
      arithmeticOperation,
      orientation,
    });
  };

  const handleApply = () => {
    if (pixelMatrix.matrixA.length && pixelMatrix.matrixB.length) {
      const matrixResultant = addImages(pixelMatrix.matrixA, pixelMatrix.matrixB);
      const processedImageUrl = imageMatriceToURL(matrixResultant);
      setProcessedImageUrl(processedImageUrl);
    }
  };

  return (
    <main className="flex flex-col flex-1">
      <div className="flex flex-row gap-4 mt-5 ml-24 mr-24 justify-start">
        <ImageUploader
          onImageProcessed={handleImageProcessed}
          mainImage={true}
        />
        <ImageUploader
          onImageProcessed={handleImageProcessed}
          mainImage={false}
        />
        <ControlPanel
          onImageConfiguration={handleImageConfiguration}
          arithmeticOperation={imageConfig.arithmeticOperation}
          orientation={imageConfig.orientation}
          onApply={handleApply}
        />
        <ImageDownloader
          imageUrl={processedImageUrl}
          altText="Processed Image"
        />        
      </div>
    </main>
  );
}