"use client";

import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { set } from "mongoose";
import { Console } from "console";
// Define UserContext
interface UserContextType {
  user: { id: string; username: string; points: number } | null;
  setUser: (user: { id: string; username: string; points: number } | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; username: string; points: number } | null>(null);
  const router = useRouter();

  const logout = () => {
    setUser(null);
    Cookies.remove("token");
    router.push("/login");
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const exp = (decoded.exp * 1000);

        if (Date.now() < exp) {
          setUser({ id: decoded.id, username: decoded.username, points: decoded.points });
        } else {
          logout();
        }
      } catch(error) {
        console.log(error);
        logout();
      }

    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
