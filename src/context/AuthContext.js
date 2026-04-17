import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user khi refresh trang
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            const token = localStorage.getItem("accessToken");

            if (storedUser && storedUser !== "undefined" && token) {
                setUser(JSON.parse(storedUser));
            } else {
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
            }
        } catch (err) {
            console.error("Auth parse error", err);
            localStorage.clear();
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (userData, token) => {
        if (!userData || !token) return;

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("accessToken", token);
        setUser(userData); // ⭐ trigger render
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
