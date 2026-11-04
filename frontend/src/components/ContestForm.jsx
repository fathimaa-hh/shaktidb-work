import { useEffect, useState } from "react";

function ContestForm({ platforms, initialData, onSubmit, onCancel }) {
    const [form, setForm] = useState({
        contest_name: "",
        platform_id: "",
        rank: "",
        score: "",
        contest_date: ""
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                contest_name: initialData.contest_name || "",
                platform_id: initialData.platform_id || "",
                rank: initialData.rank ?? "",
                score: initialData.score ?? "",
                contest_date: initialData.contest_date
                    ? String(initialData.contest_date).slice(0, 10)
                    : ""
            });
        } else {
            setForm({
                contest_name: "",
                platform_id: "",
                rank: "",
                score: "",
                contest_date: ""
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

        if (!form.contest_name.trim()) {
            alert("Please enter the contest name.");
            return;
        }

        if (!form.platform_id || !form.contest_date) {
            alert("Please select a platform and contest date.");
            return;
        }

        onSubmit({
            contest_name: form.contest_name.trim(),
            platform_id: Number(form.platform_id),
            rank: Number(form.rank),
            score: Number(form.score),
            contest_date: form.contest_date
        });
    };

    return (
        <form className="contest-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Contest Name</label>
                <input
                    type="text"
                    name="contest_name"
                    placeholder="e.g. Weekly Contest 451"
                    value={form.contest_name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Platform</label>
                <select
                    name="platform_id"
                    value={form.platform_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Platform</option>

                    {platforms.map((platform) => (
                        <option
                            key={platform.platform_id}
                            value={platform.platform_id}
                        >
                            {platform.platform_name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Rank</label>
                    <input
                        type="number"
                        name="rank"
                        min="1"
                        placeholder="e.g. 1450"
                        value={form.rank}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Score</label>
                    <input
                        type="number"
                        name="score"
                        min="0"
                        step="0.01"
                        placeholder="e.g. 3"
                        value={form.score}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Contest Date</label>
                <input
                    type="date"
                    name="contest_date"
                    value={form.contest_date}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-actions">
                <button type="submit" className="primary-btn">
                    {initialData ? "Update Contest" : "Add Contest"}
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

export default ContestForm;