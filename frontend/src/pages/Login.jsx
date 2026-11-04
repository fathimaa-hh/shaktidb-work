import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(email, password);
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(
                err.response?.data?.message || "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.card}>
                <h1 style={styles.logo}>CodeQuest</h1>
                <h2>Welcome Back!</h2>
                <p style={styles.subtitle}>Continue your coding journey.</p>

                {error && <p style={styles.error}>{error}</p>}

                <label>Email Address</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                />

                <label>Password</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                />

                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p style={styles.footer}>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </form>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f4f6",
        padding: "20px"
    },
    card: {
        width: "100%",
        maxWidth: "420px",
        background: "#fff",
        padding: "35px",
        borderRadius: "14px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    },
    logo: {
        color: "#4f46e5",
        textAlign: "center",
        marginBottom: "5px"
    },
    subtitle: {
        color: "#6b7280",
        marginTop: "-8px",
        marginBottom: "15px"
    },
    input: {
        padding: "12px",
        border: "1px solid #d1d5db",
        borderRadius: "7px",
        fontSize: "15px"
    },
    button: {
        padding: "13px",
        background: "#4f46e5",
        color: "white",
        border: "none",
        borderRadius: "7px",
        cursor: "pointer",
        fontSize: "16px",
        marginTop: "10px"
    },
    error: {
        color: "#dc2626",
        background: "#fee2e2",
        padding: "10px",
        borderRadius: "6px"
    },
    footer: {
        textAlign: "center",
        marginTop: "10px"
    }
};

export default Login;