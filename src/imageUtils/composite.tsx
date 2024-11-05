export function addImages(
  imageMatrixA: number[][][],
  imageMatrixB: number[][][]
): number[][][] {
  //commum area
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

export function subtractImages(
  imageMatrixA: number[][][],
  imageMatrixB: number[][][]
): number[][][] {
  //commum area
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
        Math.min(Math.max(pixelA[0] - pixelB[0], 0), 255), // Red
        Math.min(Math.max(pixelA[1] - pixelB[1], 0), 255), // Green
        Math.min(Math.max(pixelA[2] - pixelB[2], 0), 255), // Blue
        Math.min(Math.max(pixelA[3] + pixelB[3], 0), 255), // Alpha
      ];
      row.push(resultPixel);
    }
    resultMatrix.push(row);
  }

  return resultMatrix;
}

export function linearCombinationBlend(
  matrixA: number[][][],
  matrixB: number[][][],
  alpha: number
): number[][][] {
  const height = Math.min(matrixA.length, matrixB.length);
  const width = Math.min(matrixA[0].length, matrixB[0].length);
  const blendedMatrix = [];

  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      const pixelA = matrixA[y][x];
      const pixelB = matrixB[y][x];
      const blendedPixel = [
        (1 - alpha) * pixelA[0] + alpha * pixelB[0], // Red
        (1 - alpha) * pixelA[1] + alpha * pixelB[1], // Green
        (1 - alpha) * pixelA[2] + alpha * pixelB[2], // Blue
        (1 - alpha) * pixelA[3] + alpha * pixelB[3], // Alpha
      ];
      row.push(blendedPixel.map((value) => Math.round(value))); // Round to get valid pixel values
    }
    blendedMatrix.push(row);
  }

  return blendedMatrix;
}

export function linearCombinationAverage(
  matrixA: number[][][],
  matrixB: number[][][]
): number[][][] {
  const height = Math.min(matrixA.length, matrixB.length);
  const width = Math.min(matrixA[0].length, matrixB[0].length);
  const resultant: number[][][] = [];

  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      const pixelA = matrixA[y][x];
      const pixelB = matrixB[y][x];
      const averagedPixel = [
        Math.min(Math.max((pixelA[0] + pixelB[0]) / 2, 0), 255), // Red
        Math.min(Math.max((pixelA[1] + pixelB[1]) / 2, 0), 255), // Green
        Math.min(Math.max((pixelA[2] + pixelB[2]) / 2, 0), 255), // Blue
        Math.min(Math.max((pixelA[3] + pixelB[3]) / 2, 0), 255)  // Alpha
      ];
      row.push(averagedPixel);
    }
    resultant.push(row);
  }

  return resultant;
}

export function andOperation(matrixA: number[][][], matrixB: number[][][]): number[][][] {
  return matrixA.map((row, y) =>
    row.map((pixel, x) => pixel.map((value, i) => value & matrixB[y][x][i]))
  );
}

export function orOperation(matrixA: number[][][], matrixB: number[][][]): number[][][] {
  return matrixA.map((row, y) =>
    row.map((pixel, x) => pixel.map((value, i) => value | matrixB[y][x][i]))
  );
}

export function xorOperation(matrix1: number[][][], matrix2: number[][][]): number[][][] {
  const finalMatrix: number[][][] = [];

  for (let y = 0; y < matrix1.length; y++) {
    const row: number[][] = [];
    for (let x = 0; x < matrix1[0].length; x++) {
      const [r1, g1, b1, a1] = matrix1[y][x];
      const [r2, g2, b2, a2] = matrix2[y][x];

      // Perform XOR on each RGB channel
      row.push([r1 ^ r2, g1 ^ g2, b1 ^ b2, Math.min(a1, a2)]);  
    }
    finalMatrix.push(row);
  }

  return finalMatrix;
}

export function notOperation(matrix: number[][][]): number[][][] {
  const finalMatrix: number[][][] = [];
  for (let y = 0; y < matrix.length; y++) {
    const row: number[][] = [];
    for (let x = 0; x < matrix[0].length; x++) {
      const [r, g, b, a] = matrix[y][x];
      row.push([255 - r, 255 - g, 255 - b, a]);  
    }
    finalMatrix.push(row);
  }

  return finalMatrix;
}
