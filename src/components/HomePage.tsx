import ImageUploader from "./ImageUploader";
import ImageDownloader from "./ImageDownloader";
import ControlPanel from "./control-panel";
import { useState } from "react";
import { imageMatriceToURL } from "../imageUtils/transformations";
import { addImages, subtractImages } from "@/imageUtils/composite";
import { flipMatrixHorizontally, flipMatrixVertically, matrixToGrayscale } from "@/imageUtils/filters";

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
    switch (configuration) {
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
    let processedImageUrl: string | null = null;
    if (pixelMatrix.matrixA.length) {
      let matrixResultant: number[][][] = pixelMatrix.matrixA;

      //Check if has two inputs
      if (pixelMatrix.matrixB.length) {
        switch (imageConfig.arithmeticOperation) {
          case "add":
            matrixResultant = addImages(pixelMatrix.matrixA, pixelMatrix.matrixB);
            break;
          case "subtract":
            matrixResultant = subtractImages(pixelMatrix.matrixA, pixelMatrix.matrixB);
            break;
          case "difference":
            matrixResultant = addImages(subtractImages(pixelMatrix.matrixA, pixelMatrix.matrixB), subtractImages(pixelMatrix.matrixB, pixelMatrix.matrixA));
            break;
        }
      }

      switch (imageConfig.conversionType) {
        case "grayscale":
          matrixResultant = matrixToGrayscale(matrixResultant)
          break;
      }
      switch (imageConfig.orientation) {
        case "flip-horizontal":
          matrixResultant = flipMatrixHorizontally(matrixResultant);
          break;
        case "flip-vertical":
          matrixResultant = flipMatrixVertically(matrixResultant);
          break;
      }

      processedImageUrl = imageMatriceToURL(matrixResultant);
    }
    setProcessedImageUrl(processedImageUrl);
  }


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
    </main>
  );
}