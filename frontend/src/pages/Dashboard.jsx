import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Temporary user ID for development
    const userId = 1;

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);

                const response = await api.get(`/dashboard/${userId}`);

                if (response.data.success) {
                    setDashboard(response.data.data);
                } else {
                    setError("Unable to fetch dashboard data.");
                }

            } catch (error) {
                console.error("Dashboard API Error:", error);
                setError("Failed to connect to the backend.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    // Convert minutes into hours and minutes
    const formatCodingTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        return `${hours}h ${remainingMinutes}m`;
    };

    if (loading) {
        return <h2>Loading dashboard...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div className="dashboard-page">

            <div className="page-heading">
                <h1>Dashboard</h1>
                <p>Here's an overview of your coding progress.</p>
            </div>

            <div className="stats-grid">

                <div className="stat-card">
                    <h3>Total Problems Solved</h3>
                    <h1>{dashboard.total_problems}</h1>
                </div>

                <div className="stat-card">
                    <h3>Contests Participated</h3>
                    <h1>{dashboard.total_contests}</h1>
                </div>

                <div className="stat-card">
                    <h3>Total Coding Time</h3>
                    <h1>{formatCodingTime(dashboard.total_coding_minutes)}</h1>
                </div>

                <div className="stat-card">
                    <h3>Practice Days</h3>
                    <h1>{dashboard.total_practice_days}</h1>
                </div>

            </div>

        </div>
    );
}

export default Dashboard;