import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await register(name, email, password);
            navigate("/login", {
                replace: true,
                state: { message: "Registration successful! Please log in." }
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.card}>
                <h1 style={styles.logo}>CodeQuest</h1>
                <h2>Create Account</h2>
                <p style={styles.subtitle}>Start tracking your coding progress.</p>

                {error && <p style={styles.error}>{error}</p>}

                <label>Full Name</label>
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={styles.input}
                />

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
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                />

                <label>Confirm Password</label>
                <input
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={styles.input}
                />

                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? "Creating account..." : "Create Account"}
                </button>

                <p style={styles.footer}>
                    Already registered? <Link to="/login">Login</Link>
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
        textAlign: "center"
    },
    subtitle: {
        color: "#6b7280",
        marginTop: "-8px",
        marginBottom: "12px"
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

export default Register;