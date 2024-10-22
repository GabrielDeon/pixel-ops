import ImageUploader from "./ImageUploader";
import ImageDownloader from "./ImageDownloader";
import { useState, useEffect } from "react";
import { imageMatriceToURL } from "../imageUtils/transformations";
<<<<<<< HEAD
import ControlPanel from "./control-panel";
=======
import ControlerOne from "./controlerOne";

>>>>>>> 14270154113f9e796b6c27c9bf208b7577a77c68

export default function HomePage() {  
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);    
  const [pixelMatrix, setPixelMatrix] = useState<{matrixA: number[][][], matrixB: number[][][]} | null>(null); 
  //const [resultMatrix, setResultMatrix] = useState<number[][][] | null> (null);

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
      const processedImageUrl = imageMatriceToURL(pixelMatrix.matrixA);
      setProcessedImageUrl(processedImageUrl);
    }
  }, [pixelMatrix]);

  return (
    <>
<<<<<<< HEAD
      <main className="flex flex-col flex-1">
        <div className="flex flex-row gap-4 mt-5 ml-24 mr-24 justify-start">
          <ImageUploader onImageProcessed={handleImageProcessed} mainImage={true}/>
          <ImageUploader onImageProcessed={handleImageProcessed} mainImage={false}/>
          <ControlPanel/>
=======
      <main className="flex flex-col flex-1">      
        <div className="flex flex-row gap-4 mt-5 ml-24 mr-24 justify-start">
          <ImageUploader onImageProcessed={handleImageProcessed} mainImage={true}/>
          <ImageUploader onImageProcessed={handleImageProcessed} mainImage={false}/>
          <ControlerOne />
>>>>>>> 14270154113f9e796b6c27c9bf208b7577a77c68
          <ImageDownloader
            imageUrl={processedImageUrl}
            altText="Processed Image"
          />               
        </div>        
      </main>
    </>
  );
}
