import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Filler,
} from "chart.js";

import { Doughnut, Bar, Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Filler
);


// Common chart options
const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: "bottom",
        },
    },
};


// 1. Platform-wise Doughnut Chart
export function PlatformChart({ data }) {
    const chartData = {
        labels: data.map((item) => item.platform_name),
        datasets: [
            {
                label: "Problems Solved",
                data: data.map((item) => item.solved),
                backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
                borderWidth: 0,
            },
        ],
    };

    return <Doughnut data={chartData} options={commonOptions} />;
}


// 2. Difficulty Doughnut Chart
export function DifficultyChart({ data }) {
    const chartData = {
        labels: data.map((item) => item.difficulty),
        datasets: [
            {
                label: "Problems Solved",
                data: data.map((item) => item.solved),
                backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
                borderWidth: 0,
            },
        ],
    };

    return <Doughnut data={chartData} options={commonOptions} />;
}


// 3. Topic-wise Bar Chart
export function TopicChart({ data }) {
    const chartData = {
        labels: data.map((item) => item.topic_name),
        datasets: [
            {
                label: "Problems Solved",
                data: data.map((item) => item.solved),
                backgroundColor: "#3b82f6",
                borderRadius: 6,
            },
        ],
    };

    const options = {
        ...commonOptions,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
    };

    return <Bar data={chartData} options={options} />;
}


// 4. Monthly Activity Line Chart
export function MonthlyChart({ data }) {
    const chartData = {
        labels: data.map((item) => item.month),
        datasets: [
            {
                label: "Coding Minutes",
                data: data.map((item) => item.total_minutes),
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59, 130, 246, 0.12)",
                fill: true,
                tension: 0.3,
                yAxisID: "y",
            },
            {
                label: "Problems Solved",
                data: data.map((item) => item.total_problems),
                borderColor: "#10b981",
                backgroundColor: "#10b981",
                tension: 0.3,
                yAxisID: "y1",
            },
        ],
    };

    const options = {
        ...commonOptions,
        scales: {
            y: {
                type: "linear",
                position: "left",
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Coding Minutes",
                },
            },
            y1: {
                type: "linear",
                position: "right",
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Problems Solved",
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    return <Line data={chartData} options={options} />;
}