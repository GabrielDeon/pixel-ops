import ImageUploader from "./ImageUploader";
import ImageDownloader from "./ImageDownloader";
import { useState } from "react";

export default function HomePage() {  
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(
    null
  );
  
  const [pixelMatrix1, setPixelMatrix1] = useState<number[][][] | null>(null);  

  const handleImageProcessed = (matrix: number[][][]) => {
    setPixelMatrix1(matrix);        
    setProcessedImageUrl(null);
    console.log(pixelMatrix1);
    // After processing, you would set the processed image URL
    // setProcessedImageUrl(processedImageDataUrl)
  };

  return (
    <>
      <main className="flex flex-col flex-1">
        <div className="flex flex-row gap-4 mt-5 ml-10 justify-start">
          <ImageUploader onImageProcessed={handleImageProcessed} />
          <ImageUploader onImageProcessed={handleImageProcessed} />

          <ImageDownloader
            imageUrl={processedImageUrl}
            altText="Processed image"
          />          
        </div>
      </main>
    </>
  );
}
