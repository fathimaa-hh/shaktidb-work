import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
    Legend,
    Filler
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
    Legend,
    Filler
);

const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: "bottom"
        }
    }
};

// Contest rank trend. Lower rank numbers indicate better performance.
export function ContestRankChart({ data }) {
    const chartData = {
        labels: data.map((item) =>
            `${item.contest_name} (${String(item.contest_date).slice(0, 10)})`
        ),
        datasets: [
            {
                label: "Contest Rank",
                data: data.map((item) => Number(item.rank)),
                borderColor: "#6366f1",
                backgroundColor: "rgba(99, 102, 241, 0.12)",
                fill: true,
                tension: 0.3
            }
        ]
    };

    const options = {
        ...commonOptions,
        scales: {
            y: {
                reverse: true,
                beginAtZero: false,
                title: {
                    display: true,
                    text: "Rank (lower is better)"
                }
            }
        }
    };

    return <Line data={chartData} options={options} />;
}

// Contest score trend
export function ContestScoreChart({ data }) {
    const chartData = {
        labels: data.map((item) =>
            `${item.contest_name} (${String(item.contest_date).slice(0, 10)})`
        ),
        datasets: [
            {
                label: "Contest Score",
                data: data.map((item) => Number(item.score)),
                borderColor: "#10b981",
                backgroundColor: "rgba(16, 185, 129, 0.12)",
                fill: true,
                tension: 0.3
            }
        ]
    };

    const options = {
        ...commonOptions,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return <Line data={chartData} options={options} />;
}

// Daily coding time
export function DailyCodingChart({ data }) {
    const chartData = {
        labels: data.map((item) =>
            String(item.practice_date).slice(0, 10)
        ),
        datasets: [
            {
                label: "Coding Minutes",
                data: data.map((item) => Number(item.coding_minutes)),
                backgroundColor: "#6366f1",
                borderRadius: 6
            }
        ]
    };

    const options = {
        ...commonOptions,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Minutes"
                }
            }
        }
    };

    return <Bar data={chartData} options={options} />;
}

// Daily problems solved
export function DailyProblemsChart({ data }) {
    const chartData = {
        labels: data.map((item) =>
            String(item.practice_date).slice(0, 10)
        ),
        datasets: [
            {
                label: "Problems Solved",
                data: data.map((item) => Number(item.problems_solved)),
                backgroundColor: "#10b981",
                borderRadius: 6
            }
        ]
    };

    const options = {
        ...commonOptions,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                }
            }
        }
    };

    return <Bar data={chartData} options={options} />;
}