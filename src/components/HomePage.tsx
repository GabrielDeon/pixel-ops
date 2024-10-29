import ImageUploader from "./ImageUploader";
import ImageDownloader from "./ImageDownloader";
import ControlPanel from "./control-panel";
import { useState } from "react";
import { imageMatriceToURL } from "../imageUtils/transformations";
import { addImages, subtractImages } from "@/imageUtils/composite";

export default function HomePage() {
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [pixelMatrix, setPixelMatrix] = useState<{
    matrixA: number[][][];
    matrixB: number[][][];
  }>({ matrixA: [], matrixB: [] });
  
  const [imageConfig, setImageConfig] = useState<{
    arithmeticOperation: string;
    conversionType: string;
    orientation: string;
  }>({ arithmeticOperation: "none", orientation: "normal", conversionType: "none" });

  const handleImageProcessed = (matrix: number[][][], mainImage: boolean) => {
    setPixelMatrix(prevMatrix => ({
      ...prevMatrix,
      [mainImage ? 'matrixA' : 'matrixB']: matrix
    }));
  };

  enum ImageVariable {
    ARITHMETIC_OPERATION,
    CONVERSION_TYPE,
    ORIENTATION
  }

  const handleImageConfiguration = (
    value: string,
    configuration: ImageVariable
  ) => {
    switch(configuration){
      case ImageVariable.ARITHMETIC_OPERATION:
        setImageConfig(prevConfig => ({
          ...prevConfig,
          arithmeticOperation: value
        }));
        break;
      case ImageVariable.CONVERSION_TYPE:
        setImageConfig(prevConfig => ({
          ...prevConfig,
          conversionType: value
        }));
        break;
      case ImageVariable.ORIENTATION:
        setImageConfig(prevConfig => ({
          ...prevConfig,
          orientation: value
        }));
        break;
    }
  };

  const handleApply = () => {
    if (pixelMatrix.matrixA.length && pixelMatrix.matrixB.length) {
      let processedImageUrl: string | null = null;
      let matrixResultant: number[][][];
      switch (true) {
        case (imageConfig.arithmeticOperation === "Add"):
          matrixResultant = addImages(pixelMatrix.matrixA, pixelMatrix.matrixB);
          processedImageUrl = imageMatriceToURL(matrixResultant);
          break;
        case (imageConfig.arithmeticOperation === "Subtract"):
          matrixResultant = subtractImages(pixelMatrix.matrixA, pixelMatrix.matrixB);
          processedImageUrl = imageMatriceToURL(matrixResultant);
          break;
      }
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
          imageConfig={imageConfig}
          onImageConfiguration={handleImageConfiguration}
          onApply={handleApply}
        />
        <ImageDownloader
          imageUrl={processedImageUrl}
          altText="Processed Image"
        />
      </div>
      <button onClick={() => alert(`Arithmetic Operation: ${imageConfig.arithmeticOperation} \n Conversion Type: ${imageConfig.conversionType} \n Image Orientation: ${imageConfig.orientation}`)}>INFO</button>
    </main>
  );
}