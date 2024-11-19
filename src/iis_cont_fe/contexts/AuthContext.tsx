"use client";
import { ReactNode, createContext, useEffect, useState } from "react";
import { AuthUser } from "@/utils/types/auth";
import useCookie from "@/hooks/useCookie";

interface TAuthContext {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
}

export const AuthContext = createContext<TAuthContext>({
    user: null,
    setUser: () => { },
});

interface Props {
    children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const { getCookie } = useCookie();

    useEffect(() => {
        const loadUserFromCookie = async () => {
            const response = await fetch("/api/auth/refresh", { credentials: "include" });
            const data = await response.json();
    
            if (data.success) {
              setUser(data.data);
            } else {
              setUser(null);
            }
        };
        loadUserFromCookie();
      }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};