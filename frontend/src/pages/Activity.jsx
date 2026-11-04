import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import ActivityForm from "../components/ActivityForm";

function Activity() {
    const USER_ID = 1;

    const [activities, setActivities] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [searchDate, setSearchDate] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchActivities = async () => {
        try {
            setLoading(true);

            const response = await api.get(`/activities/${USER_ID}`);
            setActivities(response.data.data || []);
        } catch (error) {
            console.error("Error fetching activities:", error);
            alert(
                error.response?.data?.message ||
                "Unable to load activities. Check the backend."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const handleAdd = async (formData) => {
        try {
            await api.post("/activities", {
                user_id: USER_ID,
                ...formData
            });

            alert("Activity added successfully!");
            setShowForm(false);
            fetchActivities();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to add activity.");
        }
    };

    const handleUpdate = async (formData) => {
        try {
            await api.put(
                `/activity/${editingActivity.activity_id}`,
                formData
            );

            alert("Activity updated successfully!");
            setEditingActivity(null);
            setShowForm(false);
            fetchActivities();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update activity.");
        }
    };

    const handleDelete = async (activityId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this activity?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/activity/${activityId}`);

            alert("Activity deleted successfully!");
            fetchActivities();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete activity.");
        }
    };

    const openAddForm = () => {
        setEditingActivity(null);
        setShowForm(true);
    };

    const openEditForm = (activity) => {
        setEditingActivity(activity);
        setShowForm(true);
    };

    const filteredActivities = useMemo(() => {
        if (!searchDate) return activities;

        return activities.filter(
            (activity) =>
                String(activity.practice_date).slice(0, 10) === searchDate
        );
    }, [activities, searchDate]);

    const totalMinutes = activities.reduce(
        (sum, activity) => sum + Number(activity.coding_minutes || 0),
        0
    );

    const totalProblems = activities.reduce(
        (sum, activity) => sum + Number(activity.problems_solved || 0),
        0
    );

    const activeDays = new Set(
        activities.map((activity) =>
            String(activity.practice_date).slice(0, 10)
        )
    ).size;

    const averageMinutes = activeDays
        ? Math.round(totalMinutes / activeDays)
        : 0;

    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours === 0) return `${remainingMinutes} min`;
        if (remainingMinutes === 0) return `${hours} hr`;

        return `${hours} hr ${remainingMinutes} min`;
    };

    if (loading) {
        return <div className="activity-page">Loading activities...</div>;
    }

    return (
        <div className="activity-page">
            <div className="page-header">
                <div>
                    <h1>Daily Activity</h1>
                    <p>Track your coding consistency and daily progress.</p>
                </div>

                <button className="primary-btn" onClick={openAddForm}>
                    + Add Activity
                </button>
            </div>

            <div className="activity-stats">
                <div className="activity-stat-card">
                    <h3>Total Coding Time</h3>
                    <p>{formatTime(totalMinutes)}</p>
                </div>

                <div className="activity-stat-card">
                    <h3>Total Problems Solved</h3>
                    <p>{totalProblems}</p>
                </div>

                <div className="activity-stat-card">
                    <h3>Active Days</h3>
                    <p>{activeDays}</p>
                </div>

                <div className="activity-stat-card">
                    <h3>Average Daily Time</h3>
                    <p>{formatTime(averageMinutes)}</p>
                </div>
            </div>

            {showForm && (
                <div className="activity-form-card">
                    <h2>
                        {editingActivity ? "Edit Activity" : "Add Daily Activity"}
                    </h2>

                    <ActivityForm
                        initialData={editingActivity}
                        onSubmit={editingActivity ? handleUpdate : handleAdd}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingActivity(null);
                        }}
                    />
                </div>
            )}

            <div className="activity-toolbar">
                <div>
                    <h2>Activity History</h2>
                    <p>Your recorded daily coding activities.</p>
                </div>

                <div className="activity-filter">
                    <label>Filter by date:</label>
                    <input
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                    />

                    {searchDate && (
                        <button
                            className="secondary-btn"
                            onClick={() => setSearchDate("")}
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            <div className="activity-table-container">
                <table className="activity-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Coding Time</th>
                            <th>Problems Solved</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredActivities.length > 0 ? (
                            filteredActivities.map((activity) => (
                                <tr key={activity.activity_id}>
                                    <td>
                                        {String(activity.practice_date).slice(0, 10)}
                                    </td>

                                    <td>
                                        {formatTime(Number(activity.coding_minutes))}
                                    </td>

                                    <td>{activity.problems_solved}</td>

                                    <td>
                                        <div className="activity-actions">
                                            <button
                                                className="edit-btn"
                                                onClick={() => openEditForm(activity)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(activity.activity_id)
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
                                <td colSpan="4" className="empty-state">
                                    No activities found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Activity;