export function matrixToGrayscale(matrix: number[][][]): number[][][] {
    const grayScaleMatrix: number[][][] = [];

    for (let y = 0; y < matrix.length; y++) {
        const row: number[][] = [];
        for (let x = 0; x < matrix[0].length; x++) {
            const [r, g, b, a] = matrix[y][x];

            const intensity = Math.floor((r + g + b) / 3);

            row.push([intensity, intensity, intensity, a]);
        }
        grayScaleMatrix.push(row);
    }

    return grayScaleMatrix;
}

export function flipMatrixHorizontally(matrix: number[][][]): number[][][] {
    return matrix.map(row => row.reverse());
}

export function flipMatrixVertically(matrix: number[][][]): number[][][] {
    return matrix.reverse();
}

export function getNeighborhood(matrix: number[][][], x: number, y: number, size = 3): number[][][] {
    const half = Math.floor(size / 2);
    const neighbors: number[][][] = [];
    const row: number[][] = [];

    for (let i = -half; i <= half; i++) {
        for (let j = -half; j <= half; j++) {
            const nx = x + j;
            const ny = y + i;
            if (nx >= 0 && nx < matrix[0].length && ny >= 0 && ny < matrix.length) {
                row.push(matrix[ny][nx]);
            }
        }
    }
    neighbors.push(row);
    return neighbors;
}

export function minFilter(matrix: number[][][]): number[][][] {
    const output = matrix.map(row => row.map(pixel => [...pixel])); // Copy matrix

    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[0].length; x++) {
            const neighborhood = getNeighborhood(matrix, x, y);
            const minPixel = [0, 0, 0, 255].map((_, channel) =>
                Math.min(...neighborhood.flat().map(pixel => pixel[channel]))
            );
            output[y][x] = minPixel;
        }
    }
    return output;
}

export function maxFilter(matrix: number[][][]): number[][][] {
    const output = matrix.map(row => row.map(pixel => [...pixel])); // Copy matrix

    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[0].length; x++) {
            const neighborhood = getNeighborhood(matrix, x, y);
            const maxPixel = [0, 0, 0, 255].map((_, channel) =>
                Math.max(...neighborhood.flat().map(pixel => pixel[channel]))
            );
            output[y][x] = maxPixel;
        }
    }
    return output;
}

export function meanFilter(matrix: number[][][]): number[][][] {
    const output = matrix.map(row => row.map(pixel => [...pixel])); // Copy matrix

    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[0].length; x++) {
            const neighborhood = getNeighborhood(matrix, x, y);
            const meanPixel = [0, 0, 0, 255].map((_, channel) =>
                Math.round(
                    neighborhood.flat().reduce((sum, pixel) => sum + pixel[channel], 0) /
                    neighborhood.flat().length
                )
            );
            output[y][x] = meanPixel;
        }
    }
    return output;
}

export function medianFilter(matrix: number[][][]): number[][][] {
    const height = matrix.length;
    const width = matrix[0].length;
    const outputMatrix = JSON.parse(JSON.stringify(matrix)); // Deep copy to avoid modifying the original matrix

    // Define a helper function to calculate the median of an array
    const median = (values: number[]): number => {
        values.sort((a, b) => a - b);
        const middle = Math.floor(values.length / 2);
        return values.length % 2 !== 0 ? values[middle] : (values[middle - 1] + values[middle]) / 2;
    };

    // Apply median filter
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const neighborhoodR: number[] = [];
            const neighborhoodG: number[] = [];
            const neighborhoodB: number[] = [];

            // Collect neighboring pixels for each channel
            for (let j = -1; j <= 1; j++) {
                for (let i = -1; i <= 1; i++) {
                    const [r, g, b] = matrix[y + j][x + i];
                    neighborhoodR.push(r);
                    neighborhoodG.push(g);
                    neighborhoodB.push(b);
                }
            }

            // Assign the median of the neighborhood to the current pixel
            outputMatrix[y][x][0] = median(neighborhoodR);
            outputMatrix[y][x][1] = median(neighborhoodG);
            outputMatrix[y][x][2] = median(neighborhoodB);
            outputMatrix[y][x][3] = matrix[y][x][3]; // Keep original alpha channel
        }
    }

    return outputMatrix;
}

export function orderFilter(
    matrix: number[][][],
    rank: number = 50,
    neighborhoodSize: number = 3
): number[][][] {
    const filteredMatrix: number[][][] = [];
    const halfSize = Math.floor(neighborhoodSize / 2);

    for (let y = 0; y < matrix.length; y++) {
        const row: number[][] = [];
        for (let x = 0; x < matrix[0].length; x++) {
            const neighbors: number[][] = [[], [], []]; // For R, G, B channels
            for (let j = -halfSize; j <= halfSize; j++) {
                for (let i = -halfSize; i <= halfSize; i++) {
                    const ny = y + j;
                    const nx = x + i;

                    // Ensure the neighborhood pixels are within bounds
                    if (ny >= 0 && ny < matrix.length && nx >= 0 && nx < matrix[0].length) {
                        const [r, g, b] = matrix[ny][nx];
                        neighbors[0].push(r);
                        neighbors[1].push(g);
                        neighbors[2].push(b);
                    }
                }
            }

            // Sort the neighbors and select the ranked value for each color channel
            const newPixel = neighbors.map(channel => {
                channel.sort((a, b) => a - b);
                return channel[Math.min(rank, channel.length - 1)];
            });

            row.push([...newPixel, matrix[y][x][3]]); // Add the alpha channel unchanged
        }
        filteredMatrix.push(row);
    }

    return filteredMatrix;
}

export function conservativeSmoothingFilter(matrix: number[][][]): number[][][] {
    const height = matrix.length;
    const width = matrix[0].length;
    const resultMatrix: number[][][] = JSON.parse(JSON.stringify(matrix)); // Clone the original matrix

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const [r, g, b, a] = matrix[y][x];
            const neighbors: number[][] = [];

            // Collect the neighborhood pixels (3x3 window)
            for (let j = -1; j <= 1; j++) {
                for (let i = -1; i <= 1; i++) {
                    if (j !== 0 || i !== 0) { // Exclude the center pixel
                        neighbors.push(matrix[y + j][x + i]);
                    }
                }
            }

            // Find min and max values for each channel
            const minRed = Math.min(...neighbors.map(pixel => pixel[0]));
            const maxRed = Math.max(...neighbors.map(pixel => pixel[0]));
            const minGreen = Math.min(...neighbors.map(pixel => pixel[1]));
            const maxGreen = Math.max(...neighbors.map(pixel => pixel[1]));
            const minBlue = Math.min(...neighbors.map(pixel => pixel[2]));
            const maxBlue = Math.max(...neighbors.map(pixel => pixel[2]));

            // Adjust each channel conservatively
            resultMatrix[y][x][0] = Math.max(minRed, Math.min(r, maxRed));
            resultMatrix[y][x][1] = Math.max(minGreen, Math.min(g, maxGreen));
            resultMatrix[y][x][2] = Math.max(minBlue, Math.min(b, maxBlue));
            resultMatrix[y][x][3] = a; // Keep the alpha channel unchanged
        }
    }

    return resultMatrix;
}

export function gaussianFilter(matrix: number[][][]): number[][][] {
    const height = matrix.length;
    const width = matrix[0].length;
    const resultMatrix: number[][][] = JSON.parse(JSON.stringify(matrix)); // Clone the original matrix

    // Define a 5x5 Gaussian kernel with sigma = 1.0
    const kernel = [
        [1 / 273, 4 / 273, 6 / 273, 4 / 273, 1 / 273],
        [4 / 273, 16 / 273, 24 / 273, 16 / 273, 4 / 273],
        [6 / 273, 24 / 273, 36 / 273, 24 / 273, 6 / 273],
        [4 / 273, 16 / 273, 24 / 273, 16 / 273, 4 / 273],
        [1 / 273, 4 / 273, 6 / 273, 4 / 273, 1 / 273]
    ];

    const kernelSize = 5;
    const edge = Math.floor(kernelSize / 2); // Padding for edges

    for (let y = edge; y < height - edge; y++) {
        for (let x = edge; x < width - edge; x++) {
            let rSum = 0, gSum = 0, bSum = 0, aSum = 0;

            // Apply the kernel to each pixel in the neighborhood
            for (let j = -edge; j <= edge; j++) {
                for (let i = -edge; i <= edge; i++) {
                    const weight = kernel[j + edge][i + edge];
                    const [r, g, b, a] = matrix[y + j][x + i];

                    rSum += r * weight;
                    gSum += g * weight;
                    bSum += b * weight;
                    aSum += a * weight;
                }
            }

            // Set the blurred values in the result matrix, clamping between 0-255
            resultMatrix[y][x][0] = Math.min(Math.max(Math.round(rSum), 0), 255);
            resultMatrix[y][x][1] = Math.min(Math.max(Math.round(gSum), 0), 255);
            resultMatrix[y][x][2] = Math.min(Math.max(Math.round(bSum), 0), 255);
            resultMatrix[y][x][3] = Math.min(Math.max(Math.round(aSum), 0), 255);
        }
    }

    return resultMatrix;
}

export function prewittFilter(matrix: number[][][]): number[][][] {
    const height = matrix.length;
    const width = matrix[0].length;
    const resultMatrix: number[][][] = JSON.parse(JSON.stringify(matrix)); // Copia da matriz original

    const kernelX = [
        [-1, 0, 1],
        [-1, 0, 1],
        [-1, 0, 1]
    ];

    const kernelY = [
        [-1, -1, -1],
        [0, 0, 0],
        [1, 1, 1]
    ];

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let gx = 0, gy = 0;

            for (let j = -1; j <= 1; j++) {
                for (let i = -1; i <= 1; i++) {
                    const intensity = matrix[y + j][x + i][0]; // Usando apenas o canal grayscale
                    gx += intensity * kernelX[j + 1][i + 1];
                    gy += intensity * kernelY[j + 1][i + 1];
                }
            }

            // Cálculo da magnitude da borda
            const edgeMagnitude = Math.sqrt(gx * gx + gy * gy);
            const clampedValue = Math.min(Math.max(Math.round(edgeMagnitude), 0), 255);
            resultMatrix[y][x] = [clampedValue, clampedValue, clampedValue, 255];
        }
    }

    return resultMatrix;
}

export function sobelFilter(matrix: number[][][]): number[][][] {
    const height = matrix.length;
    const width = matrix[0].length;
    const resultMatrix: number[][][] = JSON.parse(JSON.stringify(matrix));

    const kernelX = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ];

    const kernelY = [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1]
    ];

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let gx = 0, gy = 0;

            for (let j = -1; j <= 1; j++) {
                for (let i = -1; i <= 1; i++) {
                    const intensity = matrix[y + j][x + i][0];
                    gx += intensity * kernelX[j + 1][i + 1];
                    gy += intensity * kernelY[j + 1][i + 1];
                }
            }

            const edgeMagnitude = Math.sqrt(gx * gx + gy * gy);
            const clampedValue = Math.min(Math.max(Math.round(edgeMagnitude), 0), 255);
            resultMatrix[y][x] = [clampedValue, clampedValue, clampedValue, 255];
        }
    }

    return resultMatrix;
}

export function laplacianFilter(matrix: number[][][]): number[][][] {
    const height = matrix.length;
    const width = matrix[0].length;
    const resultMatrix: number[][][] = JSON.parse(JSON.stringify(matrix));

    const kernel = [
        [0, -1, 0],
        [-1, 4, -1],
        [0, -1, 0]
    ];

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let laplacianSum = 0;

            for (let j = -1; j <= 1; j++) {
                for (let i = -1; i <= 1; i++) {
                    const intensity = matrix[y + j][x + i][0];
                    laplacianSum += intensity * kernel[j + 1][i + 1];
                }
            }

            const clampedValue = Math.min(Math.max(Math.round(laplacianSum), 0), 255);
            resultMatrix[y][x] = [clampedValue, clampedValue, clampedValue, 255];
        }
    }

    return resultMatrix;
}







