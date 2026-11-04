import { useEffect, useState } from "react";

function ProblemForm({
    onSubmit,
    onClose,
    availableProblems,
    initialData = null,
}) {
    const isEditing = Boolean(initialData);

    const [formData, setFormData] = useState({
        problem_id: "",
        status: "Solved",
        attempts: 1,
        time_taken: "",
        language: "Python",
        notes: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                problem_id: initialData.problem_id,
                status: initialData.status || "Solved",
                attempts: initialData.attempts,
                time_taken: initialData.time_taken,
                language: initialData.language,
                notes: initialData.notes || "",
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit({
            ...formData,
            problem_id: Number(formData.problem_id),
            attempts: Number(formData.attempts),
            time_taken: Number(formData.time_taken),
        });
    };

    return (
        <div className="form-overlay" onMouseDown={onClose}>
            <div
                className="problem-form"
                onMouseDown={(e) => e.stopPropagation()}
            >

                <div className="form-header">
                    <h2>{isEditing ? "Edit Problem" : "Add Coding Problem"}</h2>

                    <button type="button" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    <label>Problem</label>

                    <select
                        name="problem_id"
                        value={formData.problem_id}
                        onChange={handleChange}
                        disabled={isEditing}
                        required
                    >
                        <option value="">Select Problem</option>

                        {availableProblems.map((problem) => (
                            <option
                                key={problem.problem_id}
                                value={problem.problem_id}
                            >
                                {problem.title} ({problem.platform_name})
                            </option>
                        ))}
                    </select>

                    {isEditing && (
                        <small>
                            The selected problem cannot be changed while editing.
                        </small>
                    )}

                    <label>Status</label>

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="Solved">Solved</option>
                        <option value="Attempted">Attempted</option>
                    </select>

                    <label>Number of Attempts</label>

                    <input
                        type="number"
                        name="attempts"
                        min="1"
                        value={formData.attempts}
                        onChange={handleChange}
                        required
                    />

                    <label>Time Taken (minutes)</label>

                    <input
                        type="number"
                        name="time_taken"
                        min="0"
                        value={formData.time_taken}
                        onChange={handleChange}
                        required
                    />

                    <label>Programming Language</label>

                    <select
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        required
                    >
                        <option>Python</option>
                        <option>Java</option>
                        <option>C</option>
                        <option>C++</option>
                        <option>JavaScript</option>
                    </select>

                    <label>Notes</label>

                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Describe your approach..."
                    />

                    <div className="form-actions">

                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>

                        <button type="submit">
                            {isEditing ? "Update Problem" : "Save Problem"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}

export default ProblemForm;