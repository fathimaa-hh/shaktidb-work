import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";

function AppLayout() {
    return (
        <div className="app-container">

            <Sidebar />

            <main className="main-content">

                <Navbar />

                <div className="page-content">
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />

                        <Route
                            path="/"
                            element={<Navigate to="/dashboard" replace />}
                        />

                    </Routes>
                </div>

            </main>

        </div>
    );
}

function App() {
    return (
        <Routes>
            <Route path="/*" element={<AppLayout />} />
        </Routes>
    );
}

export default App;