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

export function flipMatrixHorizontally(matrix: number[][][]): number[][][]{
    return matrix.map(row=>row.reverse());
}

export function flipMatrixVertically(matrix: number[][][]): number[][][]{
    return matrix.reverse();
}