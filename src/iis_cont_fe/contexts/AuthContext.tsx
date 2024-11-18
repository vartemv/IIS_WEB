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
        if (!user) {
            const getFromCookie = async () => {
                const existingUser = await getCookie("user");

                if (existingUser) {
                    try {
                        setUser(JSON.parse(existingUser));
                    } catch (e) {
                        console.log(e);
                    }
                }
            };
            getFromCookie();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};