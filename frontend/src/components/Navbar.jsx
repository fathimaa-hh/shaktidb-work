import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header className="navbar">
            <div className="navbar-title">
                <h2>Welcome, {user?.name} 👋</h2>
                <p>Track your coding journey and improve every day.</p>
            </div>

            <div className="navbar-profile">
                <div className="profile-avatar">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>

                <div>
                    <h4>{user?.name}</h4>
                    <span>{user?.email}</span>
                </div>

                <button onClick={handleLogout} style={styles.button}>
                    Logout
                </button>
            </div>
        </header>
    );
}

const styles = {
    button: {
        marginLeft: "20px",
        padding: "9px 15px",
        background: "#ef4444",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    }
};

export default Navbar;