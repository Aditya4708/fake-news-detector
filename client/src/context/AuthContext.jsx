import { createContext, useState, useEffect } from "react";
import api from "../utils/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const signup = async (name, email, password) => {
        const { data } = await api.post("/auth/signup", { name, email, password });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
        setUser({ _id: data._id, name: data.name, email: data.email });
        return data;
    };

    const login = async (email, password) => {
        const { data } = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
        setUser({ _id: data._id, name: data.name, email: data.email });
        return data;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}