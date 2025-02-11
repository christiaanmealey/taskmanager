import React, { useContext, createContext, useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const login = async(credentials) => {
        const response = await fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(credentials)
        });

        const result = await response.json();
        
        if(result.token) {
            setIsAuthenticated(true);
            setUser({email: result.email, role: result.role});
            setToken(result.token);
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout}}>{children}</AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}