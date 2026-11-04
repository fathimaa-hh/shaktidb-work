import { useEffect, useState } from "react";

function ActivityForm({ initialData, onSubmit, onCancel }) {
    const [form, setForm] = useState({
        practice_date: "",
        coding_minutes: "",
        problems_solved: ""
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                practice_date: String(initialData.practice_date).slice(0, 10),
                coding_minutes: initialData.coding_minutes ?? "",
                problems_solved: initialData.problems_solved ?? ""
            });
        } else {
            setForm({
                practice_date: new Date().toISOString().slice(0, 10),
                coding_minutes: "",
                problems_solved: ""
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.practice_date) {
            alert("Please select a practice date.");
            return;
        }

        onSubmit({
            practice_date: form.practice_date,
            coding_minutes: Number(form.coding_minutes),
            problems_solved: Number(form.problems_solved)
        });
    };

    return (
        <form className="activity-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Practice Date</label>
                <input
                    type="date"
                    name="practice_date"
                    value={form.practice_date}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Coding Time (minutes)</label>
                    <input
                        type="number"
                        name="coding_minutes"
                        min="0"
                        placeholder="e.g. 120"
                        value={form.coding_minutes}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Problems Solved</label>
                    <input
                        type="number"
                        name="problems_solved"
                        min="0"
                        placeholder="e.g. 5"
                        value={form.problems_solved}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="primary-btn">
                    {initialData ? "Update Activity" : "Save Activity"}
                </button>

                <button
                    type="button"
                    className="secondary-btn"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default ActivityForm;