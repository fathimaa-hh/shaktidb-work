import { useEffect, useState } from "react";
import api from "../services/api";
import ProblemForm from "../components/ProblemForm";
import { useAuth } from "../context/AuthContext";

function Problems() {
    const { user } = useAuth();
    const userId = user?.user_id;

    const [problems, setProblems] = useState([]);
    const [availableProblems, setAvailableProblems] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [search, setSearch] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    const [showForm, setShowForm] = useState(false);
    const [editingProblem, setEditingProblem] = useState(null);

    // Fetch user's problem history
    const fetchProblems = async () => {
        const response = await api.get(`/problems/${userId}`);

        if (response.data.success) {
            setProblems(response.data.data || []);
        } else {
            throw new Error(response.data.message || "Unable to load problems.");
        }
    };

    // Fetch available problem definitions
    const fetchAvailableProblems = async () => {
        const response = await api.get("/available-problems");

        if (response.data.success) {
            setAvailableProblems(response.data.data || []);
        } else {
            throw new Error(response.data.message || "Unable to load available problems.");
        }
    };

    // Load both datasets
    const loadPageData = async () => {
        if (!userId) return;

        try {
            setLoading(true);
            setError("");

            await Promise.all([
                fetchProblems(),
                fetchAvailableProblems()
            ]);

        } catch (error) {
            console.error("Problems API Error:", error);
            setError(error.message || "Failed to fetch problems.");
        } finally {
            setLoading(false);
        }
    };

    // Load data when logged-in user becomes available
    useEffect(() => {
        if (userId) {
            loadPageData();
        }
    }, [userId]);

    // Add Problem
    const handleAddProblem = async (formData) => {
        try {
            const response = await api.post("/problems", formData);

            if (response.data.success) {
                setShowForm(false);
                setMessage("Problem added successfully!");
                setError("");

                await fetchProblems();
            }

        } catch (error) {
            console.error("Add Problem Error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to add problem."
            );
        }
    };

    // Edit Problem
    const handleEditProblem = async (formData) => {
        try {
            const response = await api.put(
                `/problem/${editingProblem.history_id}`,
                {
                    status: formData.status,
                    attempts: formData.attempts,
                    time_taken: formData.time_taken,
                    language: formData.language,
                    notes: formData.notes
                }
            );

            if (response.data.success) {
                setEditingProblem(null);
                setMessage("Problem updated successfully!");
                setError("");

                await fetchProblems();
            }

        } catch (error) {
            console.error("Update Problem Error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to update problem."
            );
        }
    };

    // Delete Problem
    const handleDeleteProblem = async (historyId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this problem record?"
        );

        if (!confirmed) return;

        try {
            const response = await api.delete(`/problem/${historyId}`);

            if (response.data.success) {
                setMessage("Problem deleted successfully!");
                setError("");

                await fetchProblems();
            }

        } catch (error) {
            console.error("Delete Problem Error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to delete problem."
            );
        }
    };

    // Search and filter
    const filteredProblems = problems.filter((problem) => {
        const matchesSearch = problem.title
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesDifficulty =
            difficultyFilter === "All" ||
            problem.difficulty === difficultyFilter;

        const matchesStatus =
            statusFilter === "All" ||
            problem.status === statusFilter;

        return matchesSearch && matchesDifficulty && matchesStatus;
    });

    if (loading) {
        return <p className="loading-message">Loading problems...</p>;
    }

    if (error && problems.length === 0) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="problems-page">

            <div className="page-heading">
                <h1>Problems</h1>
                <p>Track and manage your coding practice.</p>
            </div>

            {/* Summary Cards */}
            <div className="problem-summary">

                <div className="stat-card">
                    <h3>Total Records</h3>
                    <h1>{problems.length}</h1>
                </div>

                <div className="stat-card">
                    <h3>Solved</h3>
                    <h1>
                        {problems.filter(p => p.status === "Solved").length}
                    </h1>
                </div>

                <div className="stat-card">
                    <h3>Attempted</h3>
                    <h1>
                        {problems.filter(p => p.status === "Attempted").length}
                    </h1>
                </div>

                <div className="stat-card">
                    <h3>Easy Problems</h3>
                    <h1>
                        {problems.filter(p => p.difficulty === "Easy").length}
                    </h1>
                </div>

            </div>

            {/* Actions */}
            <div className="problem-actions">

                <button
                    className="add-problem-btn"
                    onClick={() => {
                        setEditingProblem(null);
                        setShowForm(true);
                        setMessage("");
                        setError("");
                    }}
                >
                    + Add Problem
                </button>

            </div>

            {message && (
                <p className="success-message">{message}</p>
            )}

            {error && (
                <p className="error-message">{error}</p>
            )}

            {/* Search and Filters */}
            <div className="problem-toolbar">

                <input
                    type="text"
                    placeholder="Search problems..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                >
                    <option value="All">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Statuses</option>
                    <option value="Solved">Solved</option>
                    <option value="Attempted">Attempted</option>
                </select>

            </div>

            {/* Problems Table */}
            <div className="problem-table-container">

                <table className="problem-table">

                    <thead>
                        <tr>
                            <th>Problem</th>
                            <th>Platform</th>
                            <th>Topic</th>
                            <th>Difficulty</th>
                            <th>Status</th>
                            <th>Attempts</th>
                            <th>Time (min)</th>
                            <th>Language</th>
                            <th>Solved Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {filteredProblems.length > 0 ? (

                            filteredProblems.map((problem) => (

                                <tr key={problem.history_id}>

                                    <td>{problem.title}</td>
                                    <td>{problem.platform_name}</td>
                                    <td>{problem.topic_name}</td>

                                    <td>
                                        <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
                                            {problem.difficulty}
                                        </span>
                                    </td>

                                    <td>
                                        <span className={`status-badge ${problem.status.toLowerCase()}`}>
                                            {problem.status}
                                        </span>
                                    </td>

                                    <td>{problem.attempts}</td>
                                    <td>{problem.time_taken}</td>
                                    <td>{problem.language}</td>

                                    <td>
                                        {problem.solved_date
                                            ? new Date(problem.solved_date).toLocaleDateString()
                                            : "-"}
                                    </td>

                                    <td>
                                        <div className="table-actions">

                                            <button
                                                className="edit-btn"
                                                onClick={() => {
                                                    setEditingProblem(problem);
                                                    setShowForm(false);
                                                    setMessage("");
                                                    setError("");
                                                }}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDeleteProblem(problem.history_id)
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
                                <td colSpan="10" className="empty-message">
                                    No problems found.
                                </td>
                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

            {/* Add Form */}
            {showForm && (
                <ProblemForm
                    availableProblems={availableProblems}
                    onSubmit={handleAddProblem}
                    onClose={() => setShowForm(false)}
                />
            )}

            {/* Edit Form */}
            {editingProblem && (
                <ProblemForm
                    availableProblems={availableProblems}
                    initialData={editingProblem}
                    onSubmit={handleEditProblem}
                    onClose={() => setEditingProblem(null)}
                />
            )}

        </div>
    );
}

export default Problems;