import { useEffect, useState } from "react";
import api from "../services/api";
import ProblemForm from "../components/ProblemForm";

function Problems() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState("All");
    const [showForm, setShowForm] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const userId = 1;

    const fetchProblems = async () => {
        try {
            setLoading(true);

            const response = await api.get(`/problems/${userId}`);

            if (response.data.success) {
                setProblems(response.data.data || []);
            } else {
                setError(response.data.message || "Unable to load problems.");
            }

        } catch (error) {
            console.error("Problems API Error:", error);
            setError("Failed to fetch problems.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProblems();
    }, []);

    const filteredProblems = problems.filter((problem) => {
        const matchesSearch = problem.title
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesDifficulty =
            difficultyFilter === "All" ||
            problem.difficulty === difficultyFilter;

        return matchesSearch && matchesDifficulty;
    });
    const handleAddProblem = async (formData) => {
        try {

            const response = await api.post("/problems", {
                user_id: userId,
                ...formData,
            });

            if (response.data.success) {
                setSuccessMessage("Problem added successfully!");
                setShowForm(false);

                await fetchProblems();
            }

        } catch (error) {
            console.error("Add Problem Error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to add problem."
            );
        }
    };

    if (loading) {
        return <p>Loading problems...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="problems-page">

            <div className="page-heading">
                <h1>Problems</h1>
                <p>Track and manage your coding practice.</p>
            </div>
            <div className="problem-actions">

                <button
                    className="add-problem-btn"
                    onClick={() => setShowForm(true)}
                >
                    + Add Problem
                </button>

            </div>

            {successMessage && (
                <p className="success-message">{successMessage}</p>
            )}

            {showForm && (
                <ProblemForm
                    onSubmit={handleAddProblem}
                    onClose={() => setShowForm(false)}
                />
            )}

            <div className="problem-summary">
                <div className="stat-card">
                    <h3>Total Problems</h3>
                    <h1>{problems.length}</h1>
                </div>

                <div className="stat-card">
                    <h3>Easy</h3>
                    <h1>
                        {problems.filter(p => p.difficulty === "Easy").length}
                    </h1>
                </div>

                <div className="stat-card">
                    <h3>Medium</h3>
                    <h1>
                        {problems.filter(p => p.difficulty === "Medium").length}
                    </h1>
                </div>

                <div className="stat-card">
                    <h3>Hard</h3>
                    <h1>
                        {problems.filter(p => p.difficulty === "Hard").length}
                    </h1>
                </div>
            </div>

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

            </div>

            <div className="problem-table-container">

                <table className="problem-table">

                    <thead>
                        <tr>
                            <th>Problem</th>
                            <th>Platform</th>
                            <th>Topic</th>
                            <th>Difficulty</th>
                            <th>Attempts</th>
                            <th>Status</th>
                            <th>Language</th>
                            <th>Solved Date</th>
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

                                    <td>{problem.attempts}</td>
                                    <td>{problem.status}</td> 
                                    <td>{problem.language}</td>
                                    <td>
                                        {problem.solved_date
                                            ? new Date(problem.solved_date).toLocaleDateString()
                                            : "-"}
                                    </td>
                                </tr>

                            ))

                        ) : (

                            <tr>
                                <td colSpan="8" className="empty-message">
                                    No problems found.
                                </td>
                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default Problems;
