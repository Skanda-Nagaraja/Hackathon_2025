"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

// Define UserContext
interface UserContextType {
  user: { id: string; username: string } | null;
  setUser: (user: { id: string; username: string } | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Create Provider
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const router = useRouter();

  const logout = () => {
    setUser(null);
    router.push("/login");
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use UserContext
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
