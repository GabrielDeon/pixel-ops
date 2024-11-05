import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getGrayscaleHistogram } from '@/imageUtils/transformations';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface HistogramChartProps {
    matrix: number[][][]; // your image matrix data
    title: string;
}

export function HistogramChart({ matrix, title }: HistogramChartProps) {
    //const histogram = getHistogram(matrix);
    const histogram = getGrayscaleHistogram(matrix);

    // Prepare the data in Chart.js format
    const data = {
        labels: Array.from({ length: 256 }, (_, i) => i), // Intensities 0-255
        datasets: [
            {
                label: 'Ocurrences',    
                data: histogram,
                borderColor: 'rgb(55, 40, 40)',
                backgroundColor: 'rgba(55, 40, 40, 0.2)',
            }
        ],
    };

    const options = {
        responsive: true,
        animation: {
            duration: 0
        },
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
            title: {
                display: true,
                text: title ? title : "Title",
            },
        },

        interaction: { mode: 'nearest' as const, axis: 'x' as const, intersect: false },
    };


    return <Line data={data} options={options} />;
}

