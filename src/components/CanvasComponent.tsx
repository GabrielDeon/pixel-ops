import { useRef, useEffect } from "react";

interface CanvasCOmponentProps {
  matrice: number[][][] | null;      
}

const CanvasComponent: React.FC<CanvasCOmponentProps> = ({
  matrice
}) => {
  const drawerCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = drawerCanvasRef.current;

    if (canvas && matrice) {
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const width = matrice[0].length;
        const height = matrice.length;

        canvas.width = width;
        canvas.height = height;

        const imageData = ctx.createImageData(width, height);

        // Fill ImageData with pixel data from matrice
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const pixelIndex = (y * width + x) * 4; // 4 values per pixel (r, g, b, a)

            
            const [r, g, b] = matrice[y][x];
            
            imageData.data[pixelIndex]     = r; // Red
            imageData.data[pixelIndex + 1] = g; // Green
            imageData.data[pixelIndex + 2] = b; // Blue
            imageData.data[pixelIndex + 3] = 255; // Alpha (fully opaque)           

            //console.log(`Pixel at (${x}, ${y}): Red: ${r}, Green: ${g}, Blue: ${b}`);
          }
        }

        ctx.putImageData(imageData, 0, 0);        
      }
    }
  }, [matrice]);

  return (
    <canvas
      ref={drawerCanvasRef}
      id="drawerCanvas"
      className="w-1/2 h-64 rounded-md border-solid border-2"
    />
  );
};

export default CanvasComponent;
