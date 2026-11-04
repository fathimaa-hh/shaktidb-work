import { useState } from "react";

function ProblemForm({ onSubmit, onClose }) {

    const [formData, setFormData] = useState({
        problem_id: "",
        status: "Solved",
        attempts: 1,
        time_taken: "",
        language: "Python",
        notes: "",
    });

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
        <div className="form-overlay">

            <div className="problem-form">

                <div className="form-header">
                    <h2>Add Coding Problem</h2>
                    <button type="button" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>

                    <label>Problem</label>

                    <select
                        name="problem_id"
                        value={formData.problem_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Problem</option>
                        <option value="1">Two Sum</option>
                        <option value="2">Reverse Linked List</option>
                        <option value="3">Longest Substring Without Repeating Characters</option>
                        <option value="4">Number of Islands</option>
                    </select>


                    <label>Status</label>

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
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
                            Save Problem
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default ProblemForm;