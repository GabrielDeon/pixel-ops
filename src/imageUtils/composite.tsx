export function addImages(imageMatrixA: number[][][], imageMatrixB: number[][][]): number[][][] {
    const minWidth = Math.min(imageMatrixA[0].length, imageMatrixB[0].length);
    const minHeight = Math.min(imageMatrixA.length, imageMatrixB.length);
    
    const resultMatrix: number[][][] = [];
  
    for (let y = 0; y < minHeight; y++) {
      const row: number[][] = [];
      for (let x = 0; x < minWidth; x++) {
        const pixelA = imageMatrixA[y][x];
        const pixelB = imageMatrixB[y][x];
  
        // Add corresponding pixels (ensure no overflow)
        const resultPixel = [
          Math.min(pixelA[0] + pixelB[0], 255), // Red
          Math.min(pixelA[1] + pixelB[1], 255), // Green
          Math.min(pixelA[2] + pixelB[2], 255), // Blue
          Math.min(pixelA[3] + pixelB[3], 255), // Alpha
        ];
        row.push(resultPixel);
      }
      resultMatrix.push(row);
    }
  
    return resultMatrix;
}


  