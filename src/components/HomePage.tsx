import ImageUploader from "./ImageUploader";
import ImageDownloader from "./ImageDownloader";
import ControlPanel from "./control-panel";
import { useState } from "react";
import {
  equalizeGrayscaleHistogram,
  imageMatriceToURL,
  matrixToBinary,
} from "../imageUtils/transformations";
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
  conservativeSmoothingFilter,
  flipMatrixHorizontally,
  flipMatrixVertically,
  gaussianFilter,
  laplacianFilter,
  matrixToGrayscale,
  maxFilter,
  meanFilter,
  medianFilter,
  minFilter,
  orderFilter,
  prewittFilter,
  sobelFilter,
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
    logicalOperation: string;
    morphologicOperation: string;
    orientation: string;
    lowPassFilter: string;
    highPassFilter: string;
    toBinary: boolean;
    toGrayScale: boolean;
    histogramEqualization: boolean;
  }>({
    arithmeticOperation: "none",
    logicalOperation: "none",
    morphologicOperation: "none",
    orientation: "normal",
    lowPassFilter: "none",
    highPassFilter: "none",
    toBinary: false,
    toGrayScale: false,
    histogramEqualization: false,
  });

  const handleImageProcessed = (matrix: number[][][], mainImage: boolean) => {
    setPixelMatrix((prevMatrix) => ({
      ...prevMatrix,
      [mainImage ? "matrixA" : "matrixB"]: matrix,
    }));
  };

  enum ImageVariable {
    ARITHMETIC_OPERATION,
    LOGIC_OPERATION,
    MORPHOLOGIC_OPERATION,
    ORIENTATION,
    LOWPASS_FILTER,
    HIGHPASS_FILTER,
    TO_BINARY,
    TO_GRAYSCALE,
    HISTOGRAM_EQUALIZATION,
  }

  const handleImageConfiguration = (
    value: string | boolean,
    configuration: ImageVariable
  ) => {
    switch (configuration) {
      case ImageVariable.ARITHMETIC_OPERATION:
        setImageConfig((prevConfig) => ({
          ...prevConfig,
          logicalOperation: "none",
          arithmeticOperation: String(value),
        }));
        break;
      case ImageVariable.LOGIC_OPERATION:
        setImageConfig((prevConfig) => ({
          ...prevConfig,
          logicalOperation: String(value),
          arithmeticOperation: "none",
        }));
        break;
      case ImageVariable.MORPHOLOGIC_OPERATION:
        setImageConfig((prevConfig) => ({
          ...prevConfig,
          morphologicOperation: String(value),
        }));
        break;
      case ImageVariable.ORIENTATION:
        setImageConfig((prevConfig) => ({
          ...prevConfig,
          orientation: String(value),
        }));
        break;
      case ImageVariable.LOWPASS_FILTER:
        setImageConfig((prevConfig) => ({
          ...prevConfig,
          lowPassFilter: String(value),
        }));
        break;
      case ImageVariable.HIGHPASS_FILTER:
        setImageConfig((prevConfig) => ({
          ...prevConfig,
          highPassFilter: String(value),
        }));
        break;
      case ImageVariable.HISTOGRAM_EQUALIZATION:
        setImageConfig((prevConfig) => ({
          ...prevConfig,
          histogramEqualization: Boolean(value),
        }));
        break;
      case ImageVariable.TO_BINARY:
        setImageConfig((prevConfig) => ({
          ...prevConfig,
          toBinary: Boolean(value),
          toGrayScale: false,
        }));
        break;
      case ImageVariable.TO_GRAYSCALE:
        setImageConfig((prevConfig) => ({
          ...prevConfig,
          toBinary: false,
          toGrayScale: Boolean(value),
        }));
        break;
    }
  };

  const handleApply = () => {
    let processedImageUrl: string | null = null;
    if (pixelMatrix.matrixA.length) {
      let matrixResultant: number[][][] = pixelMatrix.matrixA;

      // Handle two-image operations first
      if (pixelMatrix.matrixB.length) {
        // Logical operations
        switch (imageConfig.logicalOperation) {
          case "and":
            matrixResultant = andOperation(pixelMatrix.matrixA, pixelMatrix.matrixB);
            break;
          case "or":
            matrixResultant = orOperation(pixelMatrix.matrixA, pixelMatrix.matrixB);
            break;
          case "xor":
            matrixResultant = xorOperation(pixelMatrix.matrixA, pixelMatrix.matrixB);
            break;
        }

        // Arithmetic operations
        switch (imageConfig.arithmeticOperation) {
          case "add":
            matrixResultant = addImages(pixelMatrix.matrixA, pixelMatrix.matrixB);
            break;
          case "subtract":
            matrixResultant = subtractImages(pixelMatrix.matrixA, pixelMatrix.matrixB);
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

      // Single image operations
      if (imageConfig.logicalOperation === "not") {
        matrixResultant = notOperation(matrixResultant);
      }

      // Apply transformations in order
      if (imageConfig.toGrayScale) {
        matrixResultant = matrixToGrayscale(matrixResultant);
      }

      if (imageConfig.toBinary) {
        matrixResultant = matrixToBinary(matrixResultant);
      }

      if (imageConfig.histogramEqualization) {
        matrixResultant = equalizeGrayscaleHistogram(matrixResultant);
      }

      // Apply filters
      switch (imageConfig.lowPassFilter) {
        case "min":
          matrixResultant = minFilter(matrixResultant);
          break;
        case "max":
          matrixResultant = maxFilter(matrixResultant);
          break;
        case "mean":
          matrixResultant = meanFilter(matrixResultant);
          break;
        case "median":
          matrixResultant = medianFilter(matrixResultant);
          break;
        case "order":
          matrixResultant = orderFilter(matrixResultant);
          break;
        case "conservative-smoothing":
          matrixResultant = conservativeSmoothingFilter(matrixResultant);
          break;
        case "gaussian":
          matrixResultant = gaussianFilter(matrixResultant);
          break;
      }

      switch (imageConfig.highPassFilter) {
        case "prewitt":
          matrixResultant = prewittFilter(matrixResultant);
          break;
        case "sobel":
          matrixResultant = sobelFilter(matrixResultant);
          break;
        case "laplacian":
          matrixResultant = laplacianFilter(matrixResultant);
          break;
      }

      // Apply orientation changes last
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
      <div
        id="bottomControl"
        className="flex flex-row justify-center gap-4 mt-5 ml-24 mr-24 "
      >
        <div className="w-96 ">
          <HistogramChart title="Input 1" matrix={pixelMatrix.matrixA} />
        </div>
        <div className="w-96 ">
          <HistogramChart title="Input 2" matrix={pixelMatrix.matrixB} />
        </div>
        <div className="w-96 ">
          <HistogramChart title="Result" matrix={resultantMatrix} />
        </div>
      </div>
    </main>
  );
}
