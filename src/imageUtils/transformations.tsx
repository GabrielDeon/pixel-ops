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
