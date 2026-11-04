import { useAuth } from "../context/AuthContext";

function Profile() {
    const { user } = useAuth();

    return (
        <div>
            <h1>My Profile</h1>
            <p>Manage and view your account information.</p>

            <div style={styles.card}>
                <div style={styles.avatar}>
                    {user?.name?.charAt(0).toUpperCase()}
                </div>

                <h2>{user?.name}</h2>
                <p style={styles.email}>{user?.email}</p>

                <hr style={styles.divider} />

                <div style={styles.details}>
                    <p><strong>User ID:</strong> {user?.user_id}</p>
                    <p><strong>Account:</strong> Active</p>
                    <p><strong>Platform:</strong> CodeQuest</p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    card: {
        maxWidth: "500px",
        marginTop: "25px",
        padding: "30px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
        textAlign: "center"
    },
    avatar: {
        width: "85px",
        height: "85px",
        margin: "0 auto 15px",
        borderRadius: "50%",
        background: "#4f46e5",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "35px",
        fontWeight: "bold"
    },
    email: {
        color: "#6b7280"
    },
    divider: {
        border: "none",
        borderTop: "1px solid #e5e7eb",
        margin: "25px 0"
    },
    details: {
        textAlign: "left",
        lineHeight: "2"
    }
};

export default Profile;