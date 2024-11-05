export interface Operation {
  type: "Add" | "Subtract" | "Multiply" | "Divide"; // Supported operations
  value: number; // The value to be used in the operation
}

export function checkApplyOperation (operation: Operation, value: number) {
  switch(operation.type) {
    case "Add":
      return Math.min(Math.max((value + operation.value), 0), 255);
    case "Subtract":
      return Math.min(Math.max((value - operation.value), 0), 255);
    case "Multiply":
      return Math.min(Math.max((value * operation.value), 0), 255);
    case "Divide":
      return Math.min(Math.max((value / operation.value), 0), 255);
    default:
      return value;
  }
}

export function imageMatriceToURL(matrix: number[][][]): string {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2D context");

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
  return canvas.toDataURL("image/png");
}

export function getImageMatrice(
  img: HTMLImageElement
): number[][][] | undefined {
  const canvas = document.createElement("canvas");
  if (!canvas) return;

  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;

  ctx.drawImage(img, 0, 0, img.width, img.height);
  const imageData = ctx.getImageData(0, 0, img.width, img.height);
  const pixelMatrix: number[][][] = [];

  for (let y = 0; y < img.height; y++) {
    const row: number[][] = [];
    for (let x = 0; x < img.width; x++) {
      const i = (y * img.width + x) * 4;
      row.push([
        imageData.data[i],
        imageData.data[i + 1],
        imageData.data[i + 2],
        imageData.data[i + 3],
      ]);
    }
    pixelMatrix.push(row);
  }
  return pixelMatrix;
}

export function getGrayscaleHistogram(matrix: number[][][]): number[] {
  const histogram = Array(256).fill(0);

  for (const row of matrix) {
    for (const pixel of row) {
      const [r, g, b] = pixel;
      const intensity = Math.round((r + g + b) / 3);
      histogram[intensity]++;
    }
  }

  return histogram;
}

export function equalizeGrayscaleHistogram(matrix: number[][][]): number[][][] {
  // Step 1: Get the grayscale histogram
  const histogram = getGrayscaleHistogram(matrix);

  // Step 2: Calculate the cumulative distribution function (CDF)
  const cdf = Array(256).fill(0);
  cdf[0] = histogram[0];
  for (let i = 1; i < 256; i++) {
    cdf[i] = cdf[i - 1] + histogram[i];
  }

  // Step 3: Normalize the CDF to map intensities
  const numPixels = matrix.length * matrix[0].length;
  const cdfMin = cdf.find((value) => value > 0);
  const equalizationMap = Array(256).fill(0);
  
  for (let i = 0; i < 256; i++) {
    equalizationMap[i] = Math.round(((cdf[i] - cdfMin) / (numPixels - cdfMin)) * 255);
  }

  // Step 4: Apply equalization to each pixel in the matrix
  const equalizedMatrix = matrix.map(row =>
    row.map(pixel => {
      const [r, g, b, a = 255] = pixel;
      const intensity = Math.round((r + g + b) / 3);
      const newIntensity = equalizationMap[intensity];
      return [newIntensity, newIntensity, newIntensity, a]; 
    })
  );

  return equalizedMatrix;
}
