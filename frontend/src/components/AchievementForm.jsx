import { useState } from "react";

function AchievementForm({ onSubmit, onCancel }) {
    const [form, setForm] = useState({
        achievement_name: "",
        description: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.achievement_name.trim()) {
            alert("Please enter an achievement name.");
            return;
        }

        onSubmit({
            achievement_name: form.achievement_name.trim(),
            description: form.description.trim()
        });
    };

    return (
        <form className="achievement-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Achievement Name</label>

                <input
                    type="text"
                    name="achievement_name"
                    placeholder="e.g. 100 Problems Solved"
                    maxLength="100"
                    value={form.achievement_name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Description</label>

                <textarea
                    name="description"
                    placeholder="Describe what you achieved..."
                    rows="4"
                    value={form.description}
                    onChange={handleChange}
                />
            </div>

            <div className="form-actions">
                <button type="submit" className="primary-btn">
                    Save Achievement
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

export default AchievementForm;