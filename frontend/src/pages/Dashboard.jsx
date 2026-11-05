import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import {
    PlatformChart,
    DifficultyChart,
    TopicChart,
    MonthlyChart,
} from "../components/Charts";

function Dashboard() {
    const { user } = useAuth();

    const [dashboard, setDashboard] = useState(null);
    const [platforms, setPlatforms] = useState([]);
    const [difficulty, setDifficulty] = useState([]);
    const [topics, setTopics] = useState([]);
    const [monthly, setMonthly] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const userId = user?.user_id;

        if (!userId) return;

        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    dashboardRes,
                    platformsRes,
                    difficultyRes,
                    topicsRes,
                    monthlyRes,
                ] = await Promise.all([
                    api.get(`/dashboard/${userId}`),
                    api.get(`/dashboard/platforms/${userId}`),
                    api.get(`/dashboard/difficulty/${userId}`),
                    api.get(`/dashboard/topics/${userId}`),
                    api.get(`/dashboard/monthly/${userId}`),
                ]);

                setDashboard(dashboardRes.data.data || null);

                setPlatforms(platformsRes.data.data || []);
                setDifficulty(difficultyRes.data.data || []);
                setTopics(topicsRes.data.data || []);
                setMonthly(monthlyRes.data.data || []);

            } catch (err) {
                console.error("Dashboard API Error:", err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load dashboard data."
                );

            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();

    }, [user?.user_id]);

    // Format coding time
    const formatCodingTime = (minutes = 0) => {
        const totalMinutes = Number(minutes || 0);

        const hours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;

        return `${hours}h ${remainingMinutes}m`;
    };

    if (loading) {
        return (
            <div className="loading-message">
                Loading dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-message">
                {error}
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="empty-message">
                Dashboard data unavailable.
            </div>
        );
    }

    const completionRate = Number(
        dashboard.completion_rate || 0
    ).toFixed(1);

    return (
        <div className="dashboard-page">

            {/* Dashboard Heading */}
            <div className="page-heading">
                <h1>Dashboard</h1>
                <p>
                    Here's an overview of your coding progress.
                </p>
            </div>

            {/* Overall Statistics */}
            <section className="dashboard-stats-section">

                <div className="stats-grid">

                    <div className="stat-card">
                        <h3>Total Problems Solved</h3>
                        <h1>{dashboard.total_problems || 0}</h1>
                    </div>

                    <div className="stat-card">
                        <h3>Problems Attempted</h3>
                        <h1>{dashboard.total_attempted || 0}</h1>
                    </div>

                    <div className="stat-card">
                        <h3>Contests Participated</h3>
                        <h1>{dashboard.total_contests || 0}</h1>
                    </div>

                    <div className="stat-card">
                        <h3>Total Coding Time</h3>
                        <h1>
                            {formatCodingTime(
                                dashboard.total_coding_minutes
                            )}
                        </h1>
                    </div>

                    <div className="stat-card">
                        <h3>Practice Days</h3>
                        <h1>{dashboard.total_practice_days || 0}</h1>
                    </div>

                    <div className="stat-card">
                        <h3>Completion Rate</h3>
                        <h1>{completionRate}%</h1>
                    </div>

                </div>

            </section>

            {/* Coding Progress Charts */}
            <section className="dashboard-charts-section">

                <div className="charts-grid">

                    {/* Platform Chart */}
                    <div className="chart-card">

                        <h3>Platform-wise Problems</h3>

                        {platforms.length > 0 ? (

                            <div className="chart-container">
                                <PlatformChart data={platforms} />
                            </div>

                        ) : (

                            <p className="empty-message">
                                No platform data available.
                            </p>

                        )}

                    </div>

                    {/* Difficulty Chart */}
                    <div className="chart-card">

                        <h3>Problem Difficulty</h3>

                        {difficulty.length > 0 ? (

                            <div className="chart-container">
                                <DifficultyChart data={difficulty} />
                            </div>

                        ) : (

                            <p className="empty-message">
                                No difficulty data available.
                            </p>

                        )}

                    </div>

                    {/* Topic Chart */}
                    <div className="chart-card">

                        <h3>Topic-wise Progress</h3>

                        {topics.length > 0 ? (

                            <div className="chart-container">
                                <TopicChart data={topics} />
                            </div>

                        ) : (

                            <p className="empty-message">
                                No topic data available.
                            </p>

                        )}

                    </div>

                    {/* Monthly Chart */}
                    <div className="chart-card monthly-chart-card">

                        <h3>Monthly Coding Activity</h3>

                        {monthly.length > 0 ? (

                            <div className="chart-container">
                                <MonthlyChart data={monthly} />
                            </div>

                        ) : (

                            <p className="empty-message">
                                No monthly data available.
                            </p>

                        )}

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Dashboard;