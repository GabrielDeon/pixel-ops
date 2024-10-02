import { useRef, useEffect } from "react";
import { Operation, checkApplyOperation } from '@/imageUtils/transformations'



interface CanvasCOmponentProps {
  matrice: number[][][] | null;
  operation: Operation | null;
}

const CanvasComponent: React.FC<CanvasCOmponentProps> = ({
  matrice,
  operation,
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

            const [r, g, b, a] = matrice[y][x];

            if (operation) {                
              imageData.data[pixelIndex] = checkApplyOperation(operation, r);     // Red
              imageData.data[pixelIndex + 1] = checkApplyOperation(operation, g); // Green
              imageData.data[pixelIndex + 2] = checkApplyOperation(operation, b); // Blue
              imageData.data[pixelIndex + 3] = checkApplyOperation(operation, a); // Alpha (fully opaque)
            } else {
              imageData.data[pixelIndex] =  r;     // Red
              imageData.data[pixelIndex + 1] = g; // Green
              imageData.data[pixelIndex + 2] = b; // Blue
              imageData.data[pixelIndex + 3] = a; // Alpha (fully opaque)
            }

            //console.log(`Pixel at (${x}, ${y}): Red: ${r}, Green: ${g}, Blue: ${b}, Alpha: ${a}`);
          }
        }

        ctx.putImageData(imageData, 0, 0);
      }
    }
  }, [operation]);

  return (
    <canvas
      ref={drawerCanvasRef}
      id="drawerCanvas"
      className="w-1/2 h-64 rounded-md border-solid border-2"
    />
  );
};

export default CanvasComponent;