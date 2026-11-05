import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import AchievementForm from "../components/AchievementForm";
import { useAuth } from "../context/AuthContext";

const badgeIcons = ["🏆", "🥇", "⭐", "🔥", "💎", "🚀", "🎯", "👑"];

// Convert database date into a comparable YYYY-MM-DD string
const getDateString = (dateValue) => {
    if (!dateValue) return "";

    // Handle JavaScript Date objects
    if (dateValue instanceof Date) {
        if (isNaN(dateValue.getTime())) return "";

        return [
            dateValue.getFullYear(),
            String(dateValue.getMonth() + 1).padStart(2, "0"),
            String(dateValue.getDate()).padStart(2, "0")
        ].join("-");
    }

    const value = String(dateValue).trim();

    // Handle ISO date strings: YYYY-MM-DD
    const isoMatch = value.match(/^(\d{4}-\d{2}-\d{2})/);

    if (isoMatch) {
        return isoMatch[1];
    }

    // Handle Flask date strings: Thu, 05 Nov 2026 00:00:00 GMT
    const parsedDate = new Date(value);

    if (isNaN(parsedDate.getTime())) return "";

    return [
        parsedDate.getUTCFullYear(),
        String(parsedDate.getUTCMonth() + 1).padStart(2, "0"),
        String(parsedDate.getUTCDate()).padStart(2, "0")
    ].join("-");
};

// Convert a date into a local year and month
const getYearMonth = (dateValue) => {
    const dateString = getDateString(dateValue);

    if (!dateString) return null;

    const match = dateString.match(/^(\d{4})-(\d{2})/);

    if (!match) return null;

    return {
        year: Number(match[1]),
        month: Number(match[2])
    };
};

const formatAchievementDate = (dateValue) => {
    const dateString = getDateString(dateValue);

    if (!dateString) return "Date unavailable";

    const [year, month, day] = dateString.split("-").map(Number);

    const date = new Date(Date.UTC(year, month - 1, day));

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC"
    });
};
function Achievements() {
    const { user } = useAuth();
    const USER_ID = user?.user_id;

    const [achievements, setAchievements] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // Fetch user's achievements
    const fetchAchievements = async () => {
        if (!USER_ID) return;

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

    // Load achievements when logged-in user becomes available
    useEffect(() => {
        if (USER_ID) {
            fetchAchievements();
        }
    }, [USER_ID]);

    // Add Achievement
    const handleAdd = async (formData) => {
        try {
            const response = await api.post("/achievements", formData);

            if (response.data.success) {
                alert("Achievement added successfully!");

                setShowForm(false);
                await fetchAchievements();
            }

        } catch (error) {
            console.error("Add Achievement Error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to add achievement."
            );
        }
    };

    // Delete Achievement
    const handleDelete = async (achievementId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this achievement?"
        );

        if (!confirmed) return;

        try {
            const response = await api.delete(
                `/achievement/${achievementId}`
            );

            if (response.data.success) {
                alert("Achievement deleted successfully!");

                await fetchAchievements();
            }

        } catch (error) {
            console.error("Delete Achievement Error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to delete achievement."
            );
        }
    };

    // Search Achievements
    const filteredAchievements = useMemo(() => {
        return achievements.filter((achievement) =>
            achievement.achievement_name
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [achievements, search]);

    // Sort achievements by date, newest first
    const sortedAchievements = useMemo(() => {
        return [...achievements].sort((a, b) => {
            return getDateString(b.achieved_date)
                .localeCompare(getDateString(a.achieved_date));
        });
    }, [achievements]);

    // Get current local year and month
    const now = new Date();

    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // Count achievements earned in the current month
    const monthlyAchievements = achievements.filter((item) => {
        const achieved = getYearMonth(item.achieved_date);

        return (
            achieved &&
            achieved.year === currentYear &&
            achieved.month === currentMonth
        );
    }).length;

    // Latest achievement
    const latestAchievement = sortedAchievements.length
        ? sortedAchievements[0].achievement_name
        : "None yet";

    if (loading) {
        return (
            <div className="loading-message">
                Loading achievements...
            </div>
        );
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

                    filteredAchievements.map((achievement) => (

                        <div
                            className="achievement-card"
                            key={achievement.achievement_id}
                        >

                            <div className="achievement-icon">
                                {badgeIcons[
                                    sortedAchievements.findIndex(
                                        (item) =>
                                            item.achievement_id ===
                                            achievement.achievement_id
                                    ) % badgeIcons.length
                                ]}
                            </div>

                            <div className="achievement-content">

                                <h3>{achievement.achievement_name}</h3>

                                <p>
                                    {achievement.description ||
                                        "Achievement unlocked!"}
                                </p>

                                <span className="achievement-date">
                                    Earned: {formatAchievementDate(achievement.achieved_date)}
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