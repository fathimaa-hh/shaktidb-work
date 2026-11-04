import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import ContestForm from "../components/ContestForm";
import { useAuth } from "../context/AuthContext";

function Contests() {
    const { user } = useAuth();
    const USER_ID = user?.user_id;

    const [contests, setContests] = useState([]);
    const [platforms, setPlatforms] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingContest, setEditingContest] = useState(null);

    const [search, setSearch] = useState("");
    const [platformFilter, setPlatformFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    // Fetch contests and platforms
    const fetchData = async () => {
        if (!USER_ID) return;

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

    // Load data when logged-in user becomes available
    useEffect(() => {
        if (USER_ID) {
            fetchData();
        }
    }, [USER_ID]);

    // Add Contest
    const handleAdd = async (formData) => {
        try {
            const response = await api.post("/contests", formData);

            if (response.data.success) {
                alert("Contest added successfully!");
                setShowForm(false);
                await fetchData();
            }

        } catch (error) {
            console.error("Add Contest Error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to add contest."
            );
        }
    };

    // Update Contest
    const handleUpdate = async (formData) => {
        try {
            const response = await api.put(
                `/contest/${editingContest.contest_id}`,
                formData
            );

            if (response.data.success) {
                alert("Contest updated successfully!");
                setEditingContest(null);
                setShowForm(false);
                await fetchData();
            }

        } catch (error) {
            console.error("Update Contest Error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to update contest."
            );
        }
    };

    // Delete Contest
    const handleDelete = async (contestId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this contest?"
        );

        if (!confirmed) return;

        try {
            const response = await api.delete(`/contest/${contestId}`);

            if (response.data.success) {
                alert("Contest deleted successfully!");
                await fetchData();
            }

        } catch (error) {
            console.error("Delete Contest Error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to delete contest."
            );
        }
    };

    // Open Add Form
    const openAddForm = () => {
        setEditingContest(null);
        setShowForm(true);
    };

    // Open Edit Form
    const openEditForm = (contest) => {
        setEditingContest(contest);
        setShowForm(true);
    };

    // Search and Filter
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

    // Contest Statistics
    const totalContests = contests.length;

    const bestRank = contests.length
        ? Math.min(...contests.map((c) => Number(c.rank)))
        : "-";

    const averageScore = contests.length
        ? (
            contests.reduce((sum, c) => sum + Number(c.score || 0), 0) /
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
                    onClick={openAddForm}
                >
                    + Add Contest
                </button>
            </div>

            {/* Contest Statistics */}
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

            {/* Add/Edit Contest Form */}
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

            {/* Search and Filter */}
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

            {/* Contests Table */}
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