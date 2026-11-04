import { useEffect, useState } from "react";
import api from "../services/api";

import {
    PlatformChart,
    DifficultyChart,
    TopicChart,
    MonthlyChart
} from "../components/Charts";

import {
    ContestRankChart,
    ContestScoreChart,
    DailyCodingChart,
    DailyProblemsChart
} from "../components/AnalyticsCharts";

function Analytics() {
    const USER_ID = 1;

    const [dashboard, setDashboard] = useState(null);
    const [platforms, setPlatforms] = useState([]);
    const [difficulty, setDifficulty] = useState([]);
    const [topics, setTopics] = useState([]);
    const [monthly, setMonthly] = useState([]);
    const [contests, setContests] = useState([]);
    const [activities, setActivities] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                setError("");

                const responses = await Promise.all([
                    api.get(`/dashboard/${USER_ID}`),
                    api.get(`/dashboard/platforms/${USER_ID}`),
                    api.get(`/dashboard/difficulty/${USER_ID}`),
                    api.get(`/dashboard/topics/${USER_ID}`),
                    api.get(`/dashboard/monthly/${USER_ID}`),
                    api.get(`/dashboard/contests/${USER_ID}`),
                    api.get(`/dashboard/activity/${USER_ID}`)
                ]);

                setDashboard(responses[0].data.data);
                setPlatforms(responses[1].data.data || []);
                setDifficulty(responses[2].data.data || []);
                setTopics(responses[3].data.data || []);
                setMonthly(responses[4].data.data || []);
                setContests(responses[5].data.data || []);
                setActivities(responses[6].data.data || []);

            } catch (err) {
                console.error("Analytics error:", err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load analytics. Please check the backend."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remaining = minutes % 60;

        return `${hours}h ${remaining}m`;
    };

    const bestRank = contests.length
        ? Math.min(...contests.map((c) => Number(c.rank)))
        : "-";

    const averageScore = contests.length
        ? (
            contests.reduce((sum, c) => sum + Number(c.score), 0) /
            contests.length
        ).toFixed(2)
        : "0.00";

    const totalActivityProblems = activities.reduce(
        (sum, item) => sum + Number(item.problems_solved || 0),
        0
    );

    const activeDays = activities.length;

    const strongestTopic = topics.length
        ? topics.reduce((best, current) =>
            Number(current.solved) > Number(best.solved) ? current : best
        ).topic_name
        : "No data";

    const topPlatform = platforms.length
        ? platforms[0].platform_name
        : "No data";

    if (loading) {
        return <div className="loading-message">Loading analytics...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="analytics-page">

            <div className="analytics-heading">
                <div>
                    <h1>Analytics & Insights</h1>
                    <p>
                        Understand your coding performance and track your
                        learning progress.
                    </p>
                </div>
            </div>

            {/* Overall Statistics */}
            <section className="analytics-section">
                <h2>Overall Performance</h2>

                <div className="analytics-stats-grid">

                    <div className="analytics-stat-card">
                        <span>Total Problems Solved</span>
                        <h2>{dashboard.total_problems}</h2>
                    </div>

                    <div className="analytics-stat-card">
                        <span>Contests Participated</span>
                        <h2>{dashboard.total_contests}</h2>
                    </div>

                    <div className="analytics-stat-card">
                        <span>Total Coding Time</span>
                        <h2>{formatTime(Number(dashboard.total_coding_minutes))}</h2>
                    </div>

                    <div className="analytics-stat-card">
                        <span>Active Practice Days</span>
                        <h2>{dashboard.total_practice_days}</h2>
                    </div>

                    <div className="analytics-stat-card">
                        <span>Best Contest Rank</span>
                        <h2>{bestRank}</h2>
                    </div>

                    <div className="analytics-stat-card">
                        <span>Average Contest Score</span>
                        <h2>{averageScore}</h2>
                    </div>

                </div>
            </section>

            {/* Problem Analytics */}
            <section className="analytics-section">
                <h2>Problem Solving Analysis</h2>

                <div className="analytics-charts-grid">

                    <div className="analytics-chart-card">
                        <h3>Platform-wise Performance</h3>
                        {platforms.length ? (
                            <div className="analytics-chart-container">
                                <PlatformChart data={platforms} />
                            </div>
                        ) : <p className="empty-message">No platform data available.</p>}
                    </div>

                    <div className="analytics-chart-card">
                        <h3>Difficulty Distribution</h3>
                        {difficulty.length ? (
                            <div className="analytics-chart-container">
                                <DifficultyChart data={difficulty} />
                            </div>
                        ) : <p className="empty-message">No difficulty data available.</p>}
                    </div>

                    <div className="analytics-chart-card">
                        <h3>Topic-wise Progress</h3>
                        {topics.length ? (
                            <div className="analytics-chart-container">
                                <TopicChart data={topics} />
                            </div>
                        ) : <p className="empty-message">No topic data available.</p>}
                    </div>

                    <div className="analytics-chart-card">
                        <h3>Monthly Coding Progress</h3>
                        {monthly.length ? (
                            <div className="analytics-chart-container">
                                <MonthlyChart data={monthly} />
                            </div>
                        ) : <p className="empty-message">No monthly data available.</p>}
                    </div>

                </div>
            </section>

            {/* Contest Analytics */}
            <section className="analytics-section">
                <h2>Contest Performance</h2>

                <div className="analytics-charts-grid">

                    <div className="analytics-chart-card">
                        <h3>Contest Rank Trend</h3>
                        {contests.length ? (
                            <div className="analytics-chart-container">
                                <ContestRankChart data={contests} />
                            </div>
                        ) : <p className="empty-message">No contest data available.</p>}
                    </div>

                    <div className="analytics-chart-card">
                        <h3>Contest Score Trend</h3>
                        {contests.length ? (
                            <div className="analytics-chart-container">
                                <ContestScoreChart data={contests} />
                            </div>
                        ) : <p className="empty-message">No contest data available.</p>}
                    </div>

                </div>
            </section>

            {/* Daily Activity Analytics */}
            <section className="analytics-section">
                <h2>Practice Consistency</h2>

                <div className="analytics-insights">
                    <div className="insight-card">
                        <span>Most Practiced Platform</span>
                        <h3>{topPlatform}</h3>
                    </div>

                    <div className="insight-card">
                        <span>Strongest DSA Topic</span>
                        <h3>{strongestTopic}</h3>
                    </div>

                    <div className="insight-card">
                        <span>Problems Logged in Daily Activity</span>
                        <h3>{totalActivityProblems}</h3>
                    </div>

                    <div className="insight-card">
                        <span>Days with Recorded Activity</span>
                        <h3>{activeDays}</h3>
                    </div>
                </div>

                <div className="analytics-charts-grid">

                    <div className="analytics-chart-card">
                        <h3>Daily Coding Time</h3>
                        {activities.length ? (
                            <div className="analytics-chart-container">
                                <DailyCodingChart data={activities} />
                            </div>
                        ) : <p className="empty-message">No activity data available.</p>}
                    </div>

                    <div className="analytics-chart-card">
                        <h3>Daily Problems Solved</h3>
                        {activities.length ? (
                            <div className="analytics-chart-container">
                                <DailyProblemsChart data={activities} />
                            </div>
                        ) : <p className="empty-message">No activity data available.</p>}
                    </div>

                </div>
            </section>

        </div>
    );
}

export default Analytics;