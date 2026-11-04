import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import AchievementForm from "../components/AchievementForm";

const badgeIcons = ["🏆", "🥇", "⭐", "🔥", "💎", "🚀", "🎯", "👑"];

function Achievements() {
    const USER_ID = 1;

    const [achievements, setAchievements] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchAchievements = async () => {
        try {
            setLoading(true);

            const response = await api.get(`/achievements/${USER_ID}`);

            setAchievements(response.data.data || []);
        } catch (error) {
            console.error("Achievement loading error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to load achievements."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAchievements();
    }, []);

    const handleAdd = async (formData) => {
        try {
            await api.post("/achievements", {
                user_id: USER_ID,
                ...formData
            });

            alert("Achievement added successfully!");

            setShowForm(false);
            fetchAchievements();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to add achievement."
            );
        }
    };

    const handleDelete = async (achievementId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this achievement?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/achievement/${achievementId}`);

            alert("Achievement deleted successfully!");

            fetchAchievements();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to delete achievement."
            );
        }
    };

    const filteredAchievements = useMemo(() => {
        return achievements.filter((achievement) =>
            achievement.achievement_name
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [achievements, search]);

    const latestAchievement = achievements.length
        ? achievements[0].achievement_name
        : "None yet";

    const thisMonth = new Date().toISOString().slice(0, 7);

    const monthlyAchievements = achievements.filter((item) =>
        String(item.achieved_date).slice(0, 7) === thisMonth
    ).length;

    if (loading) {
        return <div className="loading-message">Loading achievements...</div>;
    }

    return (
        <div className="achievements-page">

            <div className="page-header">
                <div>
                    <h1>My Achievements 🏆</h1>
                    <p>
                        Celebrate your milestones and coding accomplishments.
                    </p>
                </div>

                <button
                    className="primary-btn"
                    onClick={() => setShowForm(!showForm)}
                >
                    + Add Achievement
                </button>
            </div>

            {/* Achievement Statistics */}
            <div className="achievement-stats">

                <div className="achievement-stat-card">
                    <span>Total Achievements</span>
                    <h2>{achievements.length}</h2>
                </div>

                <div className="achievement-stat-card">
                    <span>Achievements This Month</span>
                    <h2>{monthlyAchievements}</h2>
                </div>

                <div className="achievement-stat-card">
                    <span>Latest Achievement</span>
                    <h2 className="latest-achievement">
                        {latestAchievement}
                    </h2>
                </div>

            </div>

            {/* Add Achievement Form */}
            {showForm && (
                <div className="achievement-form-card">
                    <h2>Add New Achievement</h2>

                    <AchievementForm
                        onSubmit={handleAdd}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}

            {/* Search */}
            <div className="achievement-toolbar">
                <h2>Achievement Collection</h2>

                <input
                    type="text"
                    placeholder="Search achievements..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Achievement Cards */}
            <div className="achievement-grid">

                {filteredAchievements.length > 0 ? (
                    filteredAchievements.map((achievement, index) => (
                        <div
                            className="achievement-card"
                            key={achievement.achievement_id}
                        >
                            <div className="achievement-icon">
                                {badgeIcons[index % badgeIcons.length]}
                            </div>

                            <div className="achievement-content">
                                <h3>{achievement.achievement_name}</h3>

                                <p>
                                    {achievement.description ||
                                        "Achievement unlocked!"}
                                </p>

                                <span className="achievement-date">
                                    Earned:{" "}
                                    {String(achievement.achieved_date).slice(0, 10)}
                                </span>
                            </div>

                            <button
                                className="achievement-delete-btn"
                                onClick={() =>
                                    handleDelete(achievement.achievement_id)
                                }
                                title="Delete achievement"
                            >
                                🗑️
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="achievement-empty">
                        <h3>No achievements found</h3>
                        <p>
                            Start recording your coding milestones!
                        </p>
                    </div>
                )}

            </div>

        </div>
    );
}

export default Achievements;