import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import ContestForm from "../components/ContestForm";

function Contests() {
    const USER_ID = 1;

    const [contests, setContests] = useState([]);
    const [platforms, setPlatforms] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingContest, setEditingContest] = useState(null);

    const [search, setSearch] = useState("");
    const [platformFilter, setPlatformFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);

            const [contestResponse, platformResponse] = await Promise.all([
                api.get(`/contests/${USER_ID}`),
                api.get("/platforms")
            ]);

            setContests(contestResponse.data.data || []);
            setPlatforms(platformResponse.data.data || []);
        } catch (error) {
            console.error("Error loading contests:", error);
            alert(
                error.response?.data?.message ||
                "Unable to load contests. Check whether the backend is running."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = async (formData) => {
        try {
            await api.post("/contests", {
                user_id: USER_ID,
                ...formData
            });

            alert("Contest added successfully!");
            setShowForm(false);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to add contest.");
        }
    };

    const handleUpdate = async (formData) => {
        try {
            await api.put(`/contest/${editingContest.contest_id}`, formData);

            alert("Contest updated successfully!");
            setEditingContest(null);
            setShowForm(false);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update contest.");
        }
    };

    const handleDelete = async (contestId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this contest?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/contest/${contestId}`);
            alert("Contest deleted successfully!");
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete contest.");
        }
    };

    const openAddForm = () => {
        setEditingContest(null);
        setShowForm(true);
    };

    const openEditForm = (contest) => {
        setEditingContest(contest);
        setShowForm(true);
    };

    const filteredContests = useMemo(() => {
        return contests.filter((contest) => {
            const matchesSearch = contest.contest_name
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesPlatform =
                platformFilter === "All" ||
                contest.platform_name === platformFilter;

            return matchesSearch && matchesPlatform;
        });
    }, [contests, search, platformFilter]);

    const totalContests = contests.length;

    const bestRank = contests.length
        ? Math.min(...contests.map((c) => Number(c.rank)))
        : "-";

    const averageScore = contests.length
        ? (
            contests.reduce((sum, c) => sum + Number(c.score), 0) /
            contests.length
        ).toFixed(2)
        : "0.00";

    if (loading) {
        return <div className="contests-page">Loading contests...</div>;
    }

    return (
        <div className="contests-page">
            <div className="page-header">
                <div>
                    <h1>Contest Management</h1>
                    <p>Track your competitive programming performance.</p>
                </div>

                <button
                    type="button"
                    className="primary-btn"
                    onClick={() => {
                        setEditingContest(null);
                        setShowForm(true);
                    }}
                >
                    + Add Contest
                </button>
            </div>

            <div className="contest-stats">
                <div className="contest-stat-card">
                    <h3>Total Contests</h3>
                    <p>{totalContests}</p>
                </div>

                <div className="contest-stat-card">
                    <h3>Best Rank</h3>
                    <p>{bestRank}</p>
                </div>

                <div className="contest-stat-card">
                    <h3>Average Score</h3>
                    <p>{averageScore}</p>
                </div>
            </div>

            {showForm && (
                <div className="contest-form-card">
                    <h2>
                        {editingContest ? "Edit Contest" : "Add New Contest"}
                    </h2>

                    <ContestForm
                        platforms={platforms}
                        initialData={editingContest}
                        onSubmit={editingContest ? handleUpdate : handleAdd}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingContest(null);
                        }}
                    />
                </div>
            )}

            <div className="contest-toolbar">
                <input
                    type="text"
                    placeholder="Search contests..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value)}
                >
                    <option value="All">All Platforms</option>

                    {platforms.map((platform) => (
                        <option
                            key={platform.platform_id}
                            value={platform.platform_name}
                        >
                            {platform.platform_name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="contest-table-container">
                <table className="contest-table">
                    <thead>
                        <tr>
                            <th>Contest</th>
                            <th>Platform</th>
                            <th>Rank</th>
                            <th>Score</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredContests.length > 0 ? (
                            filteredContests.map((contest) => (
                                <tr key={contest.contest_id}>
                                    <td>{contest.contest_name}</td>
                                    <td>
                                        <span className="platform-badge">
                                            {contest.platform_name}
                                        </span>
                                    </td>
                                    <td>#{contest.rank}</td>
                                    <td>{contest.score}</td>
                                    <td>
                                        {String(contest.contest_date).slice(0, 10)}
                                    </td>
                                    <td>
                                        <div className="contest-actions">
                                            <button
                                                className="edit-btn"
                                                onClick={() => openEditForm(contest)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(contest.contest_id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="empty-state">
                                    No contests found. Add your first contest!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Contests;