import ImageUploader from "./ImageUploader";
import ImageDownloader from "./ImageDownloader";
import { useState, useEffect } from "react";

export default function HomePage() {  
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(
    null
  );  
  
  const [pixelMatrix, setPixelMatrix] = useState<{matrixA: number[][][], matrixB: number[][][]} | null>(null);  

  const matrixToImageUrl = (matrix: number[][][]): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');

    canvas.width = matrix[0].length;
    canvas.height = matrix.length;

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    let index = 0;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const pixel = matrix[y][x];
        imageData.data[index++] = pixel[0]; // R
        imageData.data[index++] = pixel[1]; // G
        imageData.data[index++] = pixel[2]; // B
        imageData.data[index++] = pixel[3]; // A - 255 (fully opaque)
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png');
  };

  const handleImageProcessed = (matrix: number[][][], mainImage: boolean) => {
    if (mainImage) {
      setPixelMatrix((prevMatrix)=>({matrixA: matrix, matrixB: prevMatrix?.matrixB || []}));        
    } else {
      setPixelMatrix((prevMatrix)=>({matrixA: prevMatrix?.matrixA || [], matrixB: matrix}));        
    }     

    setProcessedImageUrl(null);        
  };  

  useEffect(() => {
    if (pixelMatrix?.matrixA.length) {
      const processedImageUrl = matrixToImageUrl(pixelMatrix.matrixA);
      setProcessedImageUrl(processedImageUrl);
    }
  }, [pixelMatrix]);

  return (
    <>
      <main className="flex flex-col flex-1">
        <div className="flex flex-row gap-4 mt-5 ml-10 justify-start">
          <ImageUploader onImageProcessed={handleImageProcessed} mainImage={true}/>
          <ImageUploader onImageProcessed={handleImageProcessed} mainImage={false}/>

          <ImageDownloader
            imageUrl={processedImageUrl}
            altText="Processed Image"
          />               
        </div>
      </main>
    </>
  );
}
