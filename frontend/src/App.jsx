import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Problems from "./pages/Problems";
import Contests from "./pages/Contests";
import Activity from "./pages/Activity";
import Analytics from "./pages/Analytics";
import Achievements from "./pages/Achievements";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function AppLayout() {
    return (
        <div className="app-container">
            <Sidebar />

            <main className="main-content">
                <Navbar />

                <div className="page-content">
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/problems" element={<Problems />} />
                        <Route path="/contests" element={<Contests />} />
                        <Route path="/activity" element={<Activity />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/achievements" element={<Achievements />} />
                        <Route path="/profile" element={<Profile />} />

                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;