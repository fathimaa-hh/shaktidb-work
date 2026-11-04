import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check whether a valid session already exists
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get("/me");
                setUser(response.data.data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        const response = await api.post("/login", {
            email,
            password
        });

        setUser(response.data.data);
        return response.data;
    };

    const register = async (name, email, password) => {
        const response = await api.post("/register", {
            name,
            email,
            password
        });

        return response.data;
    };

    const logout = async () => {
        try {
            await api.post("/logout");
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: Boolean(user)
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}