function Dashboard() {
    return (
        <div className="dashboard-page">

            <div className="page-heading">
                <h1>Dashboard</h1>
                <p>Here's an overview of your coding progress.</p>
            </div>

            <div className="stats-grid">

                <div className="stat-card">
                    <h3>Total Problems Solved</h3>
                    <h1>0</h1>
                </div>

                <div className="stat-card">
                    <h3>Contests Participated</h3>
                    <h1>0</h1>
                </div>

                <div className="stat-card">
                    <h3>Coding Hours</h3>
                    <h1>0</h1>
                </div>

                <div className="stat-card">
                    <h3>Achievements</h3>
                    <h1>0</h1>
                </div>

            </div>

        </div>
    );
}

export default Dashboard;