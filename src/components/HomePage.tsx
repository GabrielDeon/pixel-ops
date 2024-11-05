import ImageUploader from "./ImageUploader";
import ImageDownloader from "./ImageDownloader";
import ControlPanel from "./control-panel";
import { useState } from "react";
import { imageMatriceToURL } from "../imageUtils/transformations";
import {
  addImages,
  linearCombinationBlend,
  linearCombinationAverage,
  subtractImages,
  andOperation,
  notOperation,
  orOperation,
  xorOperation,
} from "@/imageUtils/composite";
import {
  flipMatrixHorizontally,
  flipMatrixVertically,
  matrixToGrayscale,
} from "@/imageUtils/filters";
import { HistogramChart } from "./HistogramChart";

export default function HomePage() {
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(
    null
  );
  const [pixelMatrix, setPixelMatrix] = useState<{
    matrixA: number[][][];
    matrixB: number[][][];
  }>({ matrixA: [], matrixB: [] });

  const [resultantMatrix, setResultantMatrix] = useState<number[][][]>([]);

  const [imageConfig, setImageConfig] = useState<{
    arithmeticOperation: string;
    conversionType: string;
    orientation: string;
    logicalOp: string;
  }>({
    arithmeticOperation: "none",
    orientation: "normal",
    conversionType: "none",
    logicalOp: "none",
  });

  const handleImageProcessed = (matrix: number[][][], mainImage: boolean) => {
    setPixelMatrix((prevMatrix) => ({
      ...prevMatrix,
      [mainImage ? "matrixA" : "matrixB"]: matrix,
    }));
  };

  enum ImageVariable {
    ARITHMETIC_OPERATION,
    CONVERSION_TYPE,
    ORIENTATION,
    LOGICAL_OPS,
  }

  const handleImageConfiguration = (
    value: string,
    configuration: ImageVariable
  ) => {
    switch (configuration) {
      case ImageVariable.ARITHMETIC_OPERATION:
        setImageConfig((prevConfig) => ({
          ...prevConfig,
          logicalOp: "none",
          arithmeticOperation: value,
        }));
        break;
      case ImageVariable.CONVERSION_TYPE:
        setImageConfig((prevConfig) => ({
          ...prevConfig,
          conversionType: value,
        }));
        break;
      case ImageVariable.ORIENTATION:
        setImageConfig((prevConfig) => ({
          ...prevConfig,
          orientation: value,
        }));
        break;
      case ImageVariable.LOGICAL_OPS:
        setImageConfig((prevConfig) => ({
          ...prevConfig,
          arithmeticOperation: "none",
          logicalOp: value,
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
        switch (imageConfig.logicalOp) {
          case "and":
            matrixResultant = andOperation(
              pixelMatrix.matrixA,
              pixelMatrix.matrixB
            );
            break;
          case "or":
            matrixResultant = orOperation(
              pixelMatrix.matrixA,
              pixelMatrix.matrixB
            );
            break;
          case "xor":
            matrixResultant = xorOperation(
              pixelMatrix.matrixA,
              pixelMatrix.matrixB
            );
            break;
        }

        switch (imageConfig.arithmeticOperation) {
          case "add":
            matrixResultant = addImages(
              pixelMatrix.matrixA,
              pixelMatrix.matrixB
            );
            break;
          case "subtract":
            matrixResultant = subtractImages(
              pixelMatrix.matrixA,
              pixelMatrix.matrixB
            );
            break;
          case "difference":
            matrixResultant = addImages(
              subtractImages(pixelMatrix.matrixA, pixelMatrix.matrixB),
              subtractImages(pixelMatrix.matrixB, pixelMatrix.matrixA)
            );
            break;
          case "blending":
            matrixResultant = linearCombinationBlend(
              pixelMatrix.matrixA,
              pixelMatrix.matrixB,
              0.3
            );
            break;
          case "linearCombination":
            matrixResultant = linearCombinationAverage(
              pixelMatrix.matrixA,
              pixelMatrix.matrixB
            );
            break;
        }
      }
      if (imageConfig.logicalOp === "not") {
        matrixResultant = notOperation(pixelMatrix.matrixA);
      }

      switch (imageConfig.conversionType) {
        case "grayscale":
          matrixResultant = matrixToGrayscale(matrixResultant);
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

      setResultantMatrix(matrixResultant);
      processedImageUrl = imageMatriceToURL(matrixResultant);
    }
    setProcessedImageUrl(processedImageUrl);
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
      <div id="bottomControl" className="flex flex-row justify-center gap-4 mt-5 ml-24 mr-24 ">
        <div className="w-96 h-80">
          <HistogramChart title="Input 1" matrix={pixelMatrix.matrixA} />
        </div>
        <div className="w-96 h-80">
          <HistogramChart title="Input 2" matrix={pixelMatrix.matrixB} />
        </div>
        <div className="w-96 h-80">
          <HistogramChart title="Result" matrix={resultantMatrix} />
        </div>
      </div>
    </main>
  );
}
